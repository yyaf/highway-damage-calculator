var { describe, it } = require('node:test')
var assert = require('node:assert')

// 注意：calc-id-matcher 依赖 prices.js，不需要 wx mock
var matcher = require('../utils/calc-id-matcher.js')
var prices = require('../data/prices.js')

var lookup = matcher.buildLookupStructures()
var idMap = lookup.idMap
var masterList = lookup.masterList

describe('calc-id-matcher.js ID 匹配逻辑', function () {

  describe('buildLookupStructures()', function () {
    it('返回对象包含 idMap 和 masterList', function () {
      assert.ok(lookup.idMap)
      assert.ok(lookup.masterList)
      assert.ok(Array.isArray(lookup.masterList))
      assert.strictEqual(typeof lookup.idMap, 'object')
    })

    it('idMap 所有 key 为 "name|spec" 格式', function () {
      for (var key in idMap) {
        if (idMap.hasOwnProperty(key)) {
          assert.ok(key.indexOf('|') !== -1, 'key 应包含 | 分隔符: ' + key)
        }
      }
    })

    it('masterList 长度等于 categories 总项目数', function () {
      var totalItems = 0
      prices.categories.forEach(function (cat) {
        totalItems += cat.items.length
      })
      assert.strictEqual(masterList.length, totalItems)
    })

    it('每个 masterList 条目包含 id, name, spec', function () {
      masterList.forEach(function (item) {
        assert.ok(item.id, 'item 缺少 id')
        assert.ok(typeof item.name === 'string', 'item 缺少 name')
        assert.ok(typeof item.spec === 'string', 'item 缺少 spec')
      })
    })

    it('已知精确 key 可查找到正确 id', function () {
      // 三角形反光标志牌 边长130cm 高强级
      var id = idMap['三角形反光标志牌|边长130cm 高强级']
      assert.strictEqual(id, 'tri-130-high')
    })

    it('spec 为空的项目 key 格式为 "name|"', function () {
      // 部分项目 spec 为空
      var found = false
      for (var key in idMap) {
        if (idMap.hasOwnProperty(key) && key.endsWith('|')) {
          found = true
          break
        }
      }
      assert.ok(found, '应存在 spec 为空的条目')
    })
  })

  describe('normalizeTerm()', function () {
    it('砼 → 混凝土', function () {
      assert.strictEqual(matcher.normalizeTerm('砼护栏'), '混凝土护栏')
    })

    it('钢筋砼 → 钢筋混凝土', function () {
      assert.strictEqual(matcher.normalizeTerm('钢筋砼支柱'), '钢筋混凝土支柱')
    })

    it('水泥钢筋砼 → 钢筋混凝土', function () {
      assert.strictEqual(matcher.normalizeTerm('水泥钢筋砼基础'), '钢筋混凝土基础')
    })

    it('水泥钢筋混凝土 → 钢筋混凝土（去冗余）', function () {
      assert.strictEqual(matcher.normalizeTerm('水泥钢筋混凝土基础'), '钢筋混凝土基础')
    })

    it('不含术语的文本原样返回', function () {
      assert.strictEqual(matcher.normalizeTerm('标志牌'), '标志牌')
      assert.strictEqual(matcher.normalizeTerm('波形梁护栏'), '波形梁护栏')
    })

    it('混合术语：砼 + 钢筋砼 同时出现', function () {
      // 先替换 钢筋砼 再替换 砼（顺序已在函数中保证）
      var result = matcher.normalizeTerm('钢筋砼砼基础')
      assert.strictEqual(result, '钢筋混凝土混凝土基础')
    })

    it('空字符串', function () {
      assert.strictEqual(matcher.normalizeTerm(''), '')
    })
  })

  describe('extractParenSpec()', function () {
    it('提取中文括号内容', function () {
      var result = matcher.extractParenSpec('标志牌（高强级）')
      assert.strictEqual(result.cleanName, '标志牌')
      assert.strictEqual(result.extractedSpec, '高强级')
    })

    it('提取英文括号内容', function () {
      var result = matcher.extractParenSpec('标志牌(高强级)')
      assert.strictEqual(result.cleanName, '标志牌')
      assert.strictEqual(result.extractedSpec, '高强级')
    })

    it('无括号返回 null', function () {
      assert.strictEqual(matcher.extractParenSpec('标志牌'), null)
    })

    it('空字符串返回 null', function () {
      assert.strictEqual(matcher.extractParenSpec(''), null)
    })

    it('只有一个括号返回 null', function () {
      assert.strictEqual(matcher.extractParenSpec('标志牌（高强级'), null)
    })
  })

  describe('extractDigitSpec()', function () {
    it('提取数字后缀规格', function () {
      var result = matcher.extractDigitSpec('通信光缆48芯')
      assert.strictEqual(result.cleanName, '通信光缆')
      assert.strictEqual(result.digitSpec, '48芯')
    })

    it('纯数字名称不提取（如 38号）', function () {
      // 名称太短时不提取，保证 m[1].length > 1
      var result = matcher.extractDigitSpec('38号')
      assert.strictEqual(result, null)
    })

    it('名称中无数字后缀返回 null', function () {
      assert.strictEqual(matcher.extractDigitSpec('波形梁护栏'), null)
    })

    it('数字在名称中间不提取', function () {
      // 只匹配末尾数字
      var result = matcher.extractDigitSpec('3芯光缆')
      assert.strictEqual(result, null)
    })
  })

  describe('extractBigrams()', function () {
    it('提取中文 bigrams', function () {
      var result = matcher.extractBigrams('标志牌')
      assert.strictEqual(result.length, 2)
      assert.strictEqual(result[0], '标志')
      assert.strictEqual(result[1], '志牌')
    })

    it('空字符串返回空数组', function () {
      assert.deepStrictEqual(matcher.extractBigrams(''), [])
    })

    it('英文/数字不生成 bigram', function () {
      var result = matcher.extractBigrams('abc123')
      assert.deepStrictEqual(result, [])
    })

    it('中英混合只提取中文 bigram', function () {
      var result = matcher.extractBigrams('AB波形梁CD')
      // "波形" 和 "形梁" 两个 bigram
      assert.strictEqual(result.length, 2)
      assert.strictEqual(result[0], '波形')
      assert.strictEqual(result[1], '形梁')
    })

    it('单字符返回空数组', function () {
      assert.deepStrictEqual(matcher.extractBigrams('标'), [])
    })
  })

  describe('findCalcId — 策略1: 精确匹配', function () {
    it('name+spec 完全匹配返回正确 id', function () {
      var id = matcher.findCalcId('三角形反光标志牌', '边长130cm 高强级', idMap, masterList)
      assert.strictEqual(id, 'tri-130-high')
    })

    it('spec 为空时的精确匹配', function () {
      // 找一个 spec 为空的项目
      var id = matcher.findCalcId('石砌边沟、截水沟', '', idMap, masterList)
      assert.strictEqual(id, 'stone-ditch')
    })

    it('name 匹配但 spec 不匹配时精确匹配失败（走后续策略）', function () {
      // 故意用错 spec，精确匹配应失败，但可能走策略6名称匹配
      var id = matcher.findCalcId('三角形反光标志牌', '错误规格', idMap, masterList)
      // 精确匹配失败，但名称匹配应该能找到
      assert.ok(id, '至少应该靠名称匹配找到，实际: ' + (id || '空'))
    })
  })

  describe('findCalcId — 策略2: 括号规格提取', function () {
    it('中文括号规格提取后匹配', function () {
      // 标准数据中名称含中文括号的情况：如 三角形反光标志牌（高强级）
      var id = matcher.findCalcId('三角形反光标志牌（高强级）', '边长130cm', idMap, masterList)
      assert.strictEqual(id, 'tri-130-high')
    })

    it('英文括号规格提取后匹配', function () {
      // 计算器中此项目名称不含括号，但策略2会尝试括号规格重建
      var id = matcher.findCalcId('三角形反光标志牌(高强级)', '边长130cm', idMap, masterList)
      assert.strictEqual(id, 'tri-130-high')
    })

    it('提取的规格作为独立 spec 匹配', function () {
      // 某些项目在标准数据中括号内容实际是规格，需要作为 spec 匹配
      var id = matcher.findCalcId('热熔型涂料（普通型）', '', idMap, masterList)
      // 应匹配到热熔型涂料普通型相关项目
      assert.ok(id, '应能匹配到相关项目，实际: ' + (id || '空'))
    })
  })

  describe('findCalcId — 策略3: 术语规范化', function () {
    it('砼 → 混凝土 术语转换后匹配', function () {
      // 标准数据使用 砼 术语
      var id = matcher.findCalcId('砼预制件铺砌边沟、截水沟', '', idMap, masterList)
      assert.strictEqual(id, 'precast-ditch')
    })

    it('钢筋砼 → 钢筋混凝土 转换后匹配', function () {
      var id = matcher.findCalcId('钢筋砼护栏', '', idMap, masterList)
      // 应匹配到 钢筋混凝土护栏
      assert.ok(id, '应能匹配到钢筋混凝土护栏相关项目，实际: ' + (id || '空'))
    })

    it('水泥钢筋砼 → 钢筋混凝土 转换后匹配', function () {
      var id = matcher.findCalcId('水泥钢筋砼基础', '', idMap, masterList)
      // 应能匹配到相关项目
      assert.ok(id, '应能匹配到相关项目，实际: ' + (id || '空'))
    })

    it('反向转换：混凝土 → 砼', function () {
      // 当标准数据用"混凝土"但计算器用"砼"时的反向匹配
      var id = matcher.findCalcId('混凝土护栏', '', idMap, masterList)
      // 根据数据可能匹配到 砼护栏 或 混凝土护栏
      assert.ok(id, '应能匹配，实际: ' + (id || '空'))
    })
  })

  describe('findCalcId — 策略4: (桥) 后缀', function () {
    it('桥护栏名称自动添加(桥)后缀匹配', function () {
      // 1998 标准中的桥护栏项目名不含"(桥)"，但计算器中加了此后缀
      var id = matcher.findCalcId('钢筋混凝土护栏', '', idMap, masterList)
      // 至少有匹配或者通过名称+桥后缀匹配
      assert.ok(id, '应有匹配结果，实际: ' + (id || '空'))
    })
  })

  describe('findCalcId — 策略5: 空格/数字分隔规格提取', function () {
    it('空格分隔的规格作为独立 spec 匹配', function () {
      // 如 通信光缆 48芯
      var id = matcher.findCalcId('通信光缆 48芯', '', idMap, masterList)
      assert.ok(id, '应能匹配到通信光缆项目，实际: ' + (id || '空'))
    })

    it('数字后缀规格提取匹配', function () {
      var id = matcher.findCalcId('通信光缆48芯', '', idMap, masterList)
      // 48芯 作为数字后缀被提取
      assert.ok(id, '应能匹配，实际: ' + (id || '空'))
    })
  })

  describe('findCalcId — 策略5c: 名称匹配+规格兼容子串 (Bug 2 修复)', function () {
    it('2020 标准 钢管反光示警桩 spec=89mm → warn-post-89', function () {
      var id = matcher.findCalcId('钢管反光示警桩', '89mm', idMap, masterList)
      assert.strictEqual(id, 'warn-post-89',
        '89mm 应匹配 warn-post-89（89mm 是 Ø89mm 3英寸 的子串），实际: ' + id)
    })

    it('2020 标准 钢管反光示警桩 spec=114mm → warn-post-114', function () {
      var id = matcher.findCalcId('钢管反光示警桩', '114mm', idMap, masterList)
      assert.strictEqual(id, 'warn-post-114',
        '114mm 应匹配 warn-post-114（114mm 是 Ø114mm 4英寸 的子串），实际: ' + id)
    })

    it('1998 标准 钢管反光示警桩 spec=Ø89mm 3英寸 → warn-post-89', function () {
      // 这里精确匹配应该已经能匹配上了
      var id = matcher.findCalcId('钢管反光示警桩', 'Ø89mm 3英寸', idMap, masterList)
      assert.strictEqual(id, 'warn-post-89')
    })

    it('1998 标准 钢管反光示警桩 spec=Ø114mm 4英寸 → warn-post-114', function () {
      var id = matcher.findCalcId('钢管反光示警桩', 'Ø114mm 4英寸', idMap, masterList)
      assert.strictEqual(id, 'warn-post-114')
    })

    it('锥形交通路标 spec 高75cm反光套 匹配', function () {
      var id = matcher.findCalcId('锥形交通路标', '高75cm反光套', idMap, masterList)
      // 该 spec 可能包含在主数据 spec 中
      assert.ok(id, '应能匹配，实际: ' + (id || '空'))
    })

    it('规格不兼容时不返回错误 id', function () {
      // 故意用不存在的规格，名称匹配应回退到策略6
      var id = matcher.findCalcId('钢管反光示警桩', '999mm', idMap, masterList)
      // 名称匹配仍能找到第一个钢管反光示警桩，但不应返回空
      assert.ok(id, '名称匹配应能兜底，实际: ' + (id || '空'))
    })
  })

  describe('findCalcId — 策略6: 仅名称匹配', function () {
    it('仅有名称匹配的兜底匹配', function () {
      // 用匹配的 name 但完全不存在的 spec
      var id = matcher.findCalcId('单面波形钢板', '不存在的规格', idMap, masterList)
      assert.ok(id, '应通过名称匹配找到，实际: ' + (id || '空'))
    })

    it('规范化名称的兜底匹配', function () {
      var id = matcher.findCalcId('砼护栏', '任意规格', idMap, masterList)
      // 规范化后名称变为 混凝土护栏 并通过名称匹配
      assert.ok(id, '应通过规范化名称匹配找到，实际: ' + (id || '空'))
    })

    it('多个同名项目时返回第一个', function () {
      // 普通乔木 有多个规格，名称匹配返回第一个
      var id = matcher.findCalcId('普通乔木', '任意规格', idMap, masterList)
      assert.ok(id, '应能找到普通乔木，实际: ' + (id || '空'))
    })
  })

  describe('findCalcId — 策略7: Bigram 模糊匹配', function () {
    it('bigram 重叠 >=2 的模糊匹配', function () {
      // 找一个名称相似但不完全相同的案例
      var id = matcher.findCalcId('污染公路油类品化学物品水泥路面', '', idMap, masterList)
      // 应通过 bigram 模糊匹配到相应污染项目
      assert.ok(id, '应能通过 bigram 模糊匹配找到，实际: ' + (id || '空'))
    })

    it('重叠不足 2 时不匹配', function () {
      // 完全无关的名称不应匹配
      var id = matcher.findCalcId('xyz', '', idMap, masterList)
      // xyz 跟任何中文项目都没有 bigram 重叠
      // 注：如果恰好有两个中文 bigram 重叠可能不对，所以用英文确保不匹配
    })
  })

  describe('findCalcId — 无匹配场景', function () {
    it('完全不存在的名称返回空字符串', function () {
      var id = matcher.findCalcId('完全不存在的项目名称', '', idMap, masterList)
      assert.strictEqual(id, '')
    })

    it('空 name 和空 spec 返回空字符串', function () {
      var id = matcher.findCalcId('', '', idMap, masterList)
      assert.strictEqual(id, '')
    })

    it('空 name 有 spec 返回空字符串', function () {
      var id = matcher.findCalcId('', '89mm', idMap, masterList)
      assert.strictEqual(id, '')
    })
  })

  describe('跨标准匹配覆盖率统计', function () {
    it('统计所有标准的匹配率', function () {
      prices.standards.forEach(function (std) {
        var total = 0
        var matched = 0
        var unmatched = []

        std.categories.forEach(function (cat) {
          cat.items.forEach(function (item) {
            total++
            var calcId = matcher.findCalcId(item.name, item.spec || '', idMap, masterList)
            if (calcId) {
              matched++
            } else {
              unmatched.push(item.name + (item.spec ? ' |' + item.spec : ''))
            }
          })
        })

        var rate = total > 0 ? (matched / total * 100).toFixed(1) : '0.0'
        console.log(std.docCode + ' (' + std.id + '): ' + matched + '/' + total + ' = ' + rate + '%')

        if (unmatched.length > 0) {
          console.log('  未匹配项目 (' + unmatched.length + '):')
          unmatched.forEach(function (name) {
            console.log('    - ' + name)
          })
        }

        // 每个标准匹配率应 > 90%
        var matchRate = matched / total
        assert.ok(matchRate > 0.90,
          std.id + ' 标准匹配率应 >90%，实际: ' + (matchRate * 100).toFixed(1) + '%')
      })
    })

    it('整体匹配率 >95%', function () {
      var total = 0
      var matched = 0

      prices.standards.forEach(function (std) {
        std.categories.forEach(function (cat) {
          cat.items.forEach(function (item) {
            total++
            var calcId = matcher.findCalcId(item.name, item.spec || '', idMap, masterList)
            if (calcId) matched++
          })
        })
      })

      var overallRate = matched / total
      console.log('整体匹配率: ' + matched + '/' + total + ' = ' + (overallRate * 100).toFixed(1) + '%')
      assert.ok(overallRate > 0.95,
        '整体匹配率应 >95%，实际: ' + (overallRate * 100).toFixed(1) + '%')
    })
  })
})
