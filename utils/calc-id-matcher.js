var prices = require('../data/prices.js')

// 模块级缓存：lookup structures 数据纯静态，全局只构建一次
var _cachedLookup = null

// ── 术语规范化 ──
function normalizeTerm(text) {
  return text
    .replace(/水泥钢筋砼/g, '钢筋混凝土')
    .replace(/水泥钢筋混凝土/g, '钢筋混凝土')
    .replace(/钢筋砼/g, '钢筋混凝土')
    .replace(/砼/g, '混凝土')
}

// ── 提取名称中括号内的规格 ──
function extractParenSpec(name) {
  var m = name.match(/[（(]([^）)]+)[）)]/)
  if (m) {
    return {
      cleanName: name.replace(/[（(][^）)]+[）)]/, '').trim(),
      extractedSpec: m[1].trim()
    }
  }
  return null
}

// ── 提取数字后缀规格（如 通信光缆48芯 → name=通信光缆, spec=48芯）──
function extractDigitSpec(name) {
  var m = name.match(/^(.+?)(\d+\D*)$/)
  if (m && m[1].length > 1) {
    return { cleanName: m[1], digitSpec: m[2] }
  }
  return null
}

// ── 中文 bigram 提取（用于模糊匹配）──
function extractBigrams(text) {
  var bigrams = []
  for (var i = 0; i < text.length - 1; i++) {
    var ch1 = text.charCodeAt(i)
    var ch2 = text.charCodeAt(i + 1)
    // 只保留中文字符的 bigram（Unicode 范围 0x4E00-0x9FFF）
    if (ch1 >= 0x4E00 && ch1 <= 0x9FFF && ch2 >= 0x4E00 && ch2 <= 0x9FFF) {
      bigrams.push(text.charAt(i) + text.charAt(i + 1))
    }
  }
  return bigrams
}

// ── 多策略查找计算器 ID ──
// masterList: [{ id, name, spec }]
// idMap: { 'name|spec' → id }  精确查找表
function findCalcId(itemName, itemSpec, idMap, masterList, source) {
  var key, paren, normName, normSpec, revName, ds, i, item

  // 1. 精确匹配
  // 1a. 如果提供了 source，优先 source-aware 精确匹配
  if (source) {
    key = itemName + '|' + itemSpec + '|' + source
    if (idMap[key]) return idMap[key]
  }
  // 1b. 尝试所有三个来源（1998, 1999, 2020）
  var sources = ['1998', '1999', '2020']
  for (var si = 0; si < sources.length; si++) {
    key = itemName + '|' + itemSpec + '|' + sources[si]
    if (idMap[key]) return idMap[key]
  }

  // 2. 括号规格提取 — 标准数据中名称含 (xxx) 或 （xxx）
  paren = extractParenSpec(itemName)
  if (paren) {
    // 用两种括号风格重建名称尝试匹配
    var fullParenName = paren.cleanName + '（' + paren.extractedSpec + '）'  // （）
    var halfParenName = paren.cleanName + '(' + paren.extractedSpec + ')'             // ()
    key = fullParenName + '|' + itemSpec
    if (idMap[key]) return idMap[key]
    key = halfParenName + '|' + itemSpec
    if (idMap[key]) return idMap[key]
    // 提取的规格作为 spec
    key = paren.cleanName + '|' + paren.extractedSpec
    if (idMap[key]) return idMap[key]
    key = paren.cleanName + '|' + itemSpec
    if (idMap[key]) return idMap[key]
  }

  // 3. 术语规范化（砼↔混凝土、钢筋砼↔钢筋混凝土、水泥钢筋砼→钢筋混凝土）
  normName = normalizeTerm(itemName)
  normSpec = normalizeTerm(itemSpec)
  if (normName !== itemName || normSpec !== itemSpec) {
    key = normName + '|' + normSpec
    if (idMap[key]) return idMap[key]
    key = normName + '|' + itemSpec
    if (idMap[key]) return idMap[key]
    key = itemName + '|' + normSpec
    if (idMap[key]) return idMap[key]
  }
  // 反向：混凝土 → 砼
  revName = normName.replace(/混凝土/g, '砼')
  if (revName !== normName) {
    key = revName + '|' + itemSpec
    if (idMap[key]) return idMap[key]
  }

  // 4. (桥) 后缀 — 计算器为桥护栏项目统一加了此后缀
  key = itemName + '(桥)|' + itemSpec
  if (idMap[key]) return idMap[key]

  // 5. 空格/数字分隔规格提取
  // 5a. 空格分隔
  var spaceIdx = itemName.lastIndexOf(' ')
  if (spaceIdx > 0 && spaceIdx < itemName.length - 1) {
    var baseName = itemName.substring(0, spaceIdx)
    var extraSpec = itemName.substring(spaceIdx + 1)
    key = baseName + '|' + extraSpec
    if (idMap[key]) return idMap[key]
    key = baseName + '|' + itemSpec
    if (idMap[key]) return idMap[key]
  }
  // 5b. 数字后缀提取
  ds = extractDigitSpec(itemName)
  if (ds) {
    key = ds.cleanName + '|' + ds.digitSpec
    if (idMap[key]) return idMap[key]
  }

  // 5c. 名称匹配 + 规格兼容（双向子串检查）
  // 处理标准数据规格与主数据规格存在包含关系的情况
  // 例：标准 spec=89mm 包含于主 spec=Ø89mm 3英寸
  if (itemSpec) {
    var specCandidates = []
    for (i = 0; i < masterList.length; i++) {
      item = masterList[i]
      if (item.name === itemName && item.spec) {
        if (item.spec.indexOf(itemSpec) !== -1 || itemSpec.indexOf(item.spec) !== -1) {
          if (source && item.source === source) return item.id
          specCandidates.push(item.id)
        }
      }
    }
    if (specCandidates.length > 0) return specCandidates[0]
  }

  // 6. 仅名称匹配（忽略规格差异，source 优先）
  var nameOnlyMatchId = ''
  for (i = 0; i < masterList.length; i++) {
    item = masterList[i]
    if (item.name === itemName) {
      if (source && item.source === source) return item.id
      if (!nameOnlyMatchId) nameOnlyMatchId = item.id
    }
  }
  if (nameOnlyMatchId) return nameOnlyMatchId
  // 6b. 规范化名称匹配（source 优先）
  if (normName !== itemName) {
    nameOnlyMatchId = ''
    for (i = 0; i < masterList.length; i++) {
      item = masterList[i]
      if (item.name === normName) {
        if (source && item.source === source) return item.id
        if (!nameOnlyMatchId) nameOnlyMatchId = item.id
      }
    }
    if (nameOnlyMatchId) return nameOnlyMatchId
  }

  // 7. Bigram 模糊匹配（最后兜底，阈值 ≥2 个公共 bigram）
  var stdBigrams = extractBigrams(normName + (itemSpec ? itemSpec : ''))
  if (stdBigrams.length > 0) {
    var bestMatch = { id: '', overlap: 1 } // 至少需要 2 个公共 bigram
    for (i = 0; i < masterList.length; i++) {
      item = masterList[i]
      var calcBigrams = extractBigrams(item.name + (item.spec || ''))
      var overlap = 0
      for (var j = 0; j < stdBigrams.length; j++) {
        if (calcBigrams.indexOf(stdBigrams[j]) !== -1) overlap++
      }
      if (overlap > bestMatch.overlap) {
        bestMatch = { id: item.id, overlap: overlap }
      }
    }
    if (bestMatch.id) return bestMatch.id
  }

  return ''
}

// ── 构建主查找表（idMap + masterList）──
function buildLookupStructures() {
  if (_cachedLookup) return _cachedLookup
  var idMap = {}
  var masterList = []
  prices.categories.forEach(function (cat) {
    cat.items.forEach(function (item) {
      masterList.push({
        id: item.id,
        name: item.name,
        spec: item.spec || '',
        source: item.source || ''
      })
      var key = item.name + '|' + (item.spec || '') + '|' + (item.source || '')
      idMap[key] = item.id
    })
  })
  _cachedLookup = { idMap: idMap, masterList: masterList }
  return _cachedLookup
}

module.exports = {
  normalizeTerm: normalizeTerm,
  extractParenSpec: extractParenSpec,
  extractDigitSpec: extractDigitSpec,
  extractBigrams: extractBigrams,
  findCalcId: findCalcId,
  buildLookupStructures: buildLookupStructures
}
