// 计算器逻辑测试
var { describe, it } = require('node:test')
var assert = require('node:assert')

// wx mock 必须最先加载
var wxm = require('./wx-mock.js')
wxm.setup()

var calc = require('../utils/calculator.js')
var prices = require('../data/prices.js')

// 构建测试用的 priceMap
var priceMap = calc.buildPriceMap()

describe('calculator.js 计算逻辑', function () {

  // ── buildPriceMap ──
  describe('buildPriceMap()', function () {
    it('返回对象', function () {
      var map = calc.buildPriceMap()
      assert.strictEqual(typeof map, 'object')
    })

    it('包含所有 categories 中的项目', function () {
      var map = calc.buildPriceMap()
      var count = 0
      prices.categories.forEach(function (cat) {
        count += cat.items.length
      })
      var keyCount = Object.keys(map).length
      assert.strictEqual(keyCount, count,
        'map 应有 ' + count + ' 个 key，实际 ' + keyCount)
    })

    it('已知项目可正确查找', function () {
      var map = calc.buildPriceMap()
      // 三角形反光标志牌 边长130cm 高强级
      var item = map['tri-130-high']
      assert.ok(item, 'tri-130-high 应该存在')
      assert.strictEqual(item.price, 2120)
      assert.strictEqual(item.unit, '块')
    })

    it('不存在的 id 返回 undefined', function () {
      var map = calc.buildPriceMap()
      assert.strictEqual(map['non-existent-id'], undefined)
    })
  })

  // ── addItem ──
  describe('addItem(cart, itemId)', function () {
    it('新增项目：空 cart 添加后 qty=1', function () {
      var cart = calc.addItem({}, 'test-id')
      assert.strictEqual(cart['test-id'], 1)
    })

    it('递增已有项目', function () {
      var cart = calc.addItem({ 'a': 2 }, 'a')
      assert.strictEqual(cart['a'], 3)
    })

    it('处理 null cart', function () {
      var cart = calc.addItem(null, 'x')
      assert.strictEqual(cart['x'], 1)
    })

    it('处理 undefined cart', function () {
      var cart = calc.addItem(undefined, 'y')
      assert.strictEqual(cart['y'], 1)
    })
  })

  // ── removeItem ──
  describe('removeItem(cart, itemId)', function () {
    it('递减数量', function () {
      var cart = calc.removeItem({ 'a': 3 }, 'a')
      assert.strictEqual(cart['a'], 2)
    })

    it('数量减到 0 时删除 key', function () {
      var cart = calc.removeItem({ 'a': 1 }, 'a')
      assert.strictEqual(cart['a'], undefined)
      assert.strictEqual('a' in cart, false)
    })

    it('不存在的 item：无操作', function () {
      var cart = calc.removeItem({}, 'x')
      assert.deepStrictEqual(cart, {})
    })

    it('qty=0 的 item 不被递减', function () {
      var cart = calc.removeItem({ 'a': 0 }, 'a')
      assert.strictEqual(cart['a'], 0) // > 0 检查不通过，保持 0
    })

    it('处理 null cart', function () {
      var cart = calc.removeItem(null, 'x')
      assert.deepStrictEqual(cart, {})
    })
  })

  // ── setQuantity ──
  describe('setQuantity(cart, itemId, n)', function () {
    it('设置指定数量', function () {
      var cart = calc.setQuantity({}, 'a', 5)
      assert.strictEqual(cart['a'], 5)
    })

    it('设置为 0 时删除 key', function () {
      var cart = calc.setQuantity({ 'a': 3 }, 'a', 0)
      assert.strictEqual(cart['a'], undefined)
      assert.strictEqual('a' in cart, false)
    })

    it('负数 clamp 为 0 并删除 key', function () {
      var cart = calc.setQuantity({ 'a': 3 }, 'a', -5)
      assert.strictEqual(cart['a'], undefined)
      assert.strictEqual('a' in cart, false)
    })

    it('NaN 输入 clamp 为 0 并删除 key', function () {
      var cart = calc.setQuantity({ 'a': 3 }, 'a', 'abc')
      assert.strictEqual(cart['a'], undefined)
      assert.strictEqual('a' in cart, false)
    })

    it('浮点数截断为整数', function () {
      var cart = calc.setQuantity({}, 'a', 3.7)
      assert.strictEqual(cart['a'], 3)
    })

    it('字符串数字正常解析', function () {
      var cart = calc.setQuantity({}, 'a', '8')
      assert.strictEqual(cart['a'], 8)
    })

    it('处理 null cart', function () {
      var cart = calc.setQuantity(null, 'a', 3)
      assert.strictEqual(cart['a'], 3)
    })

    it('处理 undefined n', function () {
      var cart = calc.setQuantity({ 'a': 3 }, 'a', undefined)
      assert.strictEqual(cart['a'], undefined) // parseInt(undefined)=NaN→0→delete
    })
  })

  // ── getSubtotal ──
  describe('getSubtotal(itemId, quantity, priceMap, customPrices)', function () {
    it('基本计算：price * quantity', function () {
      var sub = calc.getSubtotal('tri-130-high', 2, priceMap)
      assert.strictEqual(sub, 4240) // 2120 * 2
    })

    it('不存在的 itemId 返回 0', function () {
      var sub = calc.getSubtotal('nonexistent', 5, priceMap)
      assert.strictEqual(sub, 0)
    })

    it('quantity 为 0 返回 0', function () {
      var sub = calc.getSubtotal('tri-130-high', 0, priceMap)
      assert.strictEqual(sub, 0)
    })

    it('quantity 为 null/undefined 返回 0', function () {
      assert.strictEqual(calc.getSubtotal('tri-130-high', null, priceMap), 0)
      assert.strictEqual(calc.getSubtotal('tri-130-high', undefined, priceMap), 0)
    })

    it('使用 customPrices 覆盖标准价格', function () {
      var cp = { 'tri-130-high': 3000 }
      var sub = calc.getSubtotal('tri-130-high', 2, priceMap, cp)
      assert.strictEqual(sub, 6000) // 3000 * 2
    })

    it('customPrices 中没有对应 key 时使用标准价格', function () {
      var cp = { 'other-item': 999 }
      var sub = calc.getSubtotal('tri-130-high', 2, priceMap, cp)
      assert.strictEqual(sub, 4240) // 2120 * 2, 不受 cp 影响
    })

    it('价格=0 的按实计算项目返回 0', function () {
      // post-gantry price = 0
      var sub = calc.getSubtotal('post-gantry', 3, priceMap)
      assert.strictEqual(sub, 0)
    })

    it('customPrices 为 null/undefined 不影响', function () {
      var sub = calc.getSubtotal('tri-130-high', 1, priceMap, null)
      assert.strictEqual(sub, 2120)
    })
  })

  // ── getTotal ──
  describe('getTotal(cart, priceMap, customPrices)', function () {
    it('空 cart 返回 0', function () {
      assert.strictEqual(calc.getTotal({}, priceMap), 0)
    })

    it('单项合计正确', function () {
      assert.strictEqual(calc.getTotal({ 'tri-130-high': 2 }, priceMap), 4240)
    })

    it('多项合计正确', function () {
      var cart = { 'tri-130-high': 1, 'tri-130-eng': 1 }
      // 2120 + 1150 = 3270
      assert.strictEqual(calc.getTotal(cart, priceMap), 3270)
    })

    it('qty=0 的项目被忽略', function () {
      var cart = { 'tri-130-high': 2, 'tri-130-eng': 0 }
      assert.strictEqual(calc.getTotal(cart, priceMap), 4240)
    })

    it('customPrices 影响 total', function () {
      var cart = { 'tri-130-high': 1 }
      var cp = { 'tri-130-high': 5000 }
      assert.strictEqual(calc.getTotal(cart, priceMap, cp), 5000)
    })

    it('不存在的 itemId 对 total 贡献为 0', function () {
      var cart = { 'nonexistent': 10 }
      assert.strictEqual(calc.getTotal(cart, priceMap), 0)
    })
  })

  // ── getDetail ──
  describe('getDetail(cart, priceMap, customPrices)', function () {
    it('空 cart 返回空数组', function () {
      var d = calc.getDetail({}, priceMap)
      assert.deepStrictEqual(d, [])
    })

    it('返回正确数量的条目', function () {
      var cart = { 'tri-130-high': 1, 'tri-130-eng': 2 }
      var d = calc.getDetail(cart, priceMap)
      assert.strictEqual(d.length, 2)
    })

    it('每个条目包含所有必需字段', function () {
      var cart = { 'tri-130-high': 1 }
      var d = calc.getDetail(cart, priceMap)
      var entry = d[0]
      assert.strictEqual(entry.id, 'tri-130-high')
      assert.ok(typeof entry.name === 'string')
      assert.ok(typeof entry.unit === 'string')
      assert.ok(typeof entry.price === 'number')
      assert.ok(typeof entry.source === 'string')
      assert.ok(typeof entry.effectivePrice === 'number')
      assert.strictEqual(entry.quantity, 1)
      assert.strictEqual(entry.subtotal, entry.effectivePrice * entry.quantity)
    })

    it('qty=0 的项目被排除', function () {
      var cart = { 'tri-130-high': 1, 'tri-130-eng': 0 }
      var d = calc.getDetail(cart, priceMap)
      assert.strictEqual(d.length, 1)
      assert.strictEqual(d[0].id, 'tri-130-high')
    })

    it('不在 priceMap 中的项目被排除', function () {
      var cart = { 'tri-130-high': 1, 'ghost-item': 5 }
      var d = calc.getDetail(cart, priceMap)
      assert.strictEqual(d.length, 1)
    })

    it('customPrices 反映在 effectivePrice 和 subtotal', function () {
      var cart = { 'tri-130-high': 2 }
      var cp = { 'tri-130-high': 3000 }
      var d = calc.getDetail(cart, priceMap, cp)
      assert.strictEqual(d[0].price, 2120)       // 原始价格不变
      assert.strictEqual(d[0].effectivePrice, 3000) // 有效价格使用自定义
      assert.strictEqual(d[0].subtotal, 6000)    // 3000 * 2
    })
  })

  // ── getSelectedCount ──
  describe('getSelectedCount(cart)', function () {
    it('空 cart 返回 0', function () {
      assert.strictEqual(calc.getSelectedCount({}), 0)
    })

    it('统计 qty>0 的项目数', function () {
      var cart = { 'a': 1, 'b': 2, 'c': 0 }
      assert.strictEqual(calc.getSelectedCount(cart), 2)
    })

    it('全部 qty=0 返回 0', function () {
      assert.strictEqual(calc.getSelectedCount({ 'a': 0, 'b': 0 }), 0)
    })
  })

  // ── sourceLabel ──
  describe('sourceLabel(source)', function () {
    it("1998 → '38号'", function () {
      assert.strictEqual(calc.sourceLabel('1998'), '38号')
    })
    it("1999 → '263号'", function () {
      assert.strictEqual(calc.sourceLabel('1999'), '263号')
    })
    it("2020 → '352号'", function () {
      assert.strictEqual(calc.sourceLabel('2020'), '352号')
    })
    it("both（已废弃）返回 ''", function () {
      assert.strictEqual(calc.sourceLabel('both'), '')
    })
    it("未知 source 返回 ''", function () {
      assert.strictEqual(calc.sourceLabel('unknown'), '')
    })
    it("空字符串返回 ''", function () {
      assert.strictEqual(calc.sourceLabel(''), '')
    })
  })

  // ── formatReport ──
  describe('formatReport(cart, priceMap, customPrices)', function () {
    it('空 cart 返回空字符串', function () {
      assert.strictEqual(calc.formatReport({}, priceMap), '')
    })

    it('全部 qty=0 返回空字符串', function () {
      assert.strictEqual(calc.formatReport({ 'tri-130-high': 0 }, priceMap), '')
    })

    it('包含正确的报告前缀和后缀', function () {
      var cart = { 'tri-130-high': 1 }
      var report = calc.formatReport(cart, priceMap)
      assert.ok(report.indexOf('路产损坏清单：') === 0, '应以路产损坏清单开头')
      assert.ok(report.indexOf('。路损金额合计：') !== -1, '应包含合计行')
      assert.ok(report.indexOf('元。') !== -1, '应以元。结尾')
    })

    it('多项用 、 分隔', function () {
      var cart = { 'tri-130-high': 1, 'tri-130-eng': 1 }
      var report = calc.formatReport(cart, priceMap)
      assert.ok(report.indexOf('、') !== -1, '多项应用顿号分隔')
    })

    it('包含规格信息', function () {
      var cart = { 'tri-130-high': 1 }
      var report = calc.formatReport(cart, priceMap)
      assert.ok(report.indexOf('(边长130cm 高强级)') !== -1, '应包含规格')
    })

    it('自定义价格显示 (单价¥X) 标记', function () {
      var cart = { 'tri-130-high': 1 }
      var cp = { 'tri-130-high': 5000 }
      var report = calc.formatReport(cart, priceMap, cp)
      assert.ok(report.indexOf('(单价¥5000)') !== -1, '应显示自定义单价')
    })

    it('包含来源标记 [38号]', function () {
      var cart = { 'tri-130-high': 1 }
      var report = calc.formatReport(cart, priceMap)
      assert.ok(report.indexOf('[38号]') !== -1, '应包含来源标记')
    })

    it('合计金额正确', function () {
      var cart = { 'tri-130-high': 2 }
      var report = calc.formatReport(cart, priceMap)
      assert.ok(report.indexOf('¥4240') !== -1, '合计金额应正确')
    })
  })

  // ── formatMoney ──
  describe('formatMoney(num)', function () {
    it('整数', function () { assert.strictEqual(calc.formatMoney(1234), '1234') })
    it('去掉末尾多余的零: 1234.50 → 1234.5', function () {
      assert.strictEqual(calc.formatMoney(1234.50), '1234.5')
    })
    it('去掉末尾多余的零: 1234.00 → 1234', function () {
      assert.strictEqual(calc.formatMoney(1234.00), '1234')
    })
    it('小数: 0.5', function () {
      assert.strictEqual(calc.formatMoney(0.5), '0.5')
    })
    it('零: 0', function () {
      assert.strictEqual(calc.formatMoney(0), '0')
    })
    it('NaN → "0"', function () {
      assert.strictEqual(calc.formatMoney('abc'), '0')
    })
    it('null → "0"', function () {
      assert.strictEqual(calc.formatMoney(null), '0')
    })
    it('undefined → "0"', function () {
      assert.strictEqual(calc.formatMoney(undefined), '0')
    })
    it('保留有效小数: 1.23', function () {
      assert.strictEqual(calc.formatMoney(1.23), '1.23')
    })
    it('大数不使用科学计数法', function () {
      var result = calc.formatMoney(296345)
      assert.strictEqual(result, '296345')
      assert.ok(result.indexOf('e') === -1 && result.indexOf('E') === -1)
    })
    it('浮点精度处理: 0.1+0.2', function () {
      // 0.1+0.2 = 0.30000000000000004 在 JS 中
      assert.strictEqual(calc.formatMoney(0.1 + 0.2), '0.3')
    })
  })

  // ── numberToChinese ──
  describe('numberToChinese(num)', function () {
    it('0 → 零元整', function () {
      assert.strictEqual(calc.numberToChinese(0), '零元整')
    })
    it('个位数: 5 → 伍元整', function () {
      assert.strictEqual(calc.numberToChinese(5), '伍元整')
    })
    it('拾: 10 → 壹拾元整', function () {
      assert.strictEqual(calc.numberToChinese(10), '壹拾元整')
    })
    it('佰: 100 → 壹佰元整', function () {
      assert.strictEqual(calc.numberToChinese(100), '壹佰元整')
    })
    it('101 → 壹佰零壹元整', function () {
      assert.strictEqual(calc.numberToChinese(101), '壹佰零壹元整')
    })
    it('110 → 壹佰壹拾元整', function () {
      assert.strictEqual(calc.numberToChinese(110), '壹佰壹拾元整')
    })
    it('仟: 1001 → 壹仟零壹元整', function () {
      assert.strictEqual(calc.numberToChinese(1001), '壹仟零壹元整')
    })
    it('万: 10000 → 壹万元整', function () {
      assert.strictEqual(calc.numberToChinese(10000), '壹万元整')
    })
    it('10001 → 壹万零壹元整', function () {
      assert.strictEqual(calc.numberToChinese(10001), '壹万零壹元整')
    })
    it('12345 → 壹万贰仟叁佰肆拾伍元整', function () {
      assert.strictEqual(calc.numberToChinese(12345), '壹万贰仟叁佰肆拾伍元整')
    })
    it('亿: 100000000 → 壹亿元整', function () {
      assert.strictEqual(calc.numberToChinese(100000000), '壹亿元整')
    })
    it('100000001 → 壹亿零壹元整', function () {
      assert.strictEqual(calc.numberToChinese(100000001), '壹亿零壹元整')
    })
    it('角: 1.5 → 壹元伍角整', function () {
      assert.strictEqual(calc.numberToChinese(1.5), '壹元伍角整')
    })
    it('角分: 1.55 → 壹元伍角伍分', function () {
      assert.strictEqual(calc.numberToChinese(1.55), '壹元伍角伍分')
    })
    it('分: 0.05 → 零元伍分', function () {
      // 标准中文大写金额：零元伍分（不需要"零伍分"）
      assert.strictEqual(calc.numberToChinese(0.05), '零元伍分')
    })
    it('NaN 返回空字符串', function () {
      assert.strictEqual(calc.numberToChinese(NaN), '')
    })
    it('大数: 123456789', function () {
      var result = calc.numberToChinese(123456789)
      // 壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元整
      assert.ok(result.indexOf('亿') !== -1)
      assert.ok(result.indexOf('万') !== -1)
      assert.ok(result.indexOf('元整') !== -1)
    })
    it('中间有多个零: 10001000', function () {
      var result = calc.numberToChinese(10001000)
      // 壹仟万壹仟元整 (中间连续的零不重复零)
      assert.ok(result.indexOf('万') !== -1)
      assert.ok(result.indexOf('壹仟') !== -1)
    })
  })
})
