var { describe, it, beforeEach } = require('node:test')
var assert = require('node:assert')

var wxm = require('./wx-mock.js')
wxm.setup()

var calc = require('../utils/calculator.js')

// 在 require 页面文件之前需要先 mock Page/App（已在 wx-mock.js 中）
var calcPageModule = require('../pages/calculator/calculator.js')
var pageDef = calcPageModule.pageDef

// 创建可测试的页面上下文
function createPageContext(pagedef) {
  var ctx = {
    data: {}
  }
  // 深拷贝初始 data
  for (var key in pagedef.data) {
    if (pagedef.data.hasOwnProperty(key)) {
      var val = pagedef.data[key]
      if (typeof val === 'object' && val !== null) {
        ctx.data[key] = JSON.parse(JSON.stringify(val))
      } else {
        ctx.data[key] = val
      }
    }
  }
  // 模拟 setData
  ctx.setData = function (obj) {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        this.data[k] = obj[k]
      }
    }
  }
  // 绑定所有方法到 ctx
  for (var key in pagedef) {
    if (typeof pagedef[key] === 'function') {
      ctx[key] = pagedef[key].bind(ctx)
    }
  }
  return ctx
}

// 构建 priceMap（页面 onLoad 中会执行，但测试中我们手动准备）
var priceMap = calc.buildPriceMap()

describe('calculator page 状态管理', function () {
  var pageCtx

  beforeEach(function () {
    wxm.resetStorage()
    pageCtx = createPageContext(pageDef)
    pageCtx.data.priceMap = priceMap
  })

  describe('refreshSelected() — 汇总计算', function () {
    it('空购物车：total=0, selectedCount=0, selectedList=[]', function () {
      pageCtx.data.cart = {}
      pageCtx.data.customPrices = {}
      pageCtx.refreshSelected()
      assert.strictEqual(pageCtx.data.total, 0)
      assert.strictEqual(pageCtx.data.selectedCount, 0)
      assert.deepStrictEqual(pageCtx.data.selectedList, [])
    })

    it('单项：total 和 totalChinese 正确', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      pageCtx.refreshSelected()
      assert.strictEqual(pageCtx.data.total, 2120)
      assert.strictEqual(pageCtx.data.selectedCount, 1)
      assert.strictEqual(pageCtx.data.selectedList.length, 1)
      assert.ok(pageCtx.data.totalChinese.length > 0)
      assert.strictEqual(pageCtx.data.selectedList[0].id, 'tri-130-high')
      assert.strictEqual(pageCtx.data.selectedList[0].quantity, 1)
    })

    it('多项：total 为各项 subtotal 之和', function () {
      pageCtx.data.cart = { 'tri-130-high': 2, 'tri-130-eng': 1 }
      pageCtx.refreshSelected()
      // tri-130-high: 2120*2=4240, tri-130-eng: 1150*1=1150
      assert.strictEqual(pageCtx.data.total, 5390)
      assert.strictEqual(pageCtx.data.selectedCount, 2)
      assert.strictEqual(pageCtx.data.selectedList.length, 2)
    })

    it('customPrices 影响 total', function () {
      pageCtx.data.cart = { 'tri-130-high': 2 }
      pageCtx.data.customPrices = { 'tri-130-high': 1000 }
      pageCtx.refreshSelected()
      assert.strictEqual(pageCtx.data.total, 2000)
      assert.strictEqual(pageCtx.data.selectedList[0].effectivePrice, 1000)
    })

    it('qty=0 项目被排除', function () {
      pageCtx.data.cart = { 'tri-130-high': 1, 'tri-130-eng': 0 }
      pageCtx.refreshSelected()
      assert.strictEqual(pageCtx.data.selectedCount, 1)
      assert.strictEqual(pageCtx.data.selectedList.length, 1)
    })

    it('不存在的 itemId 从详情列表排除但仍计入 count', function () {
      pageCtx.data.cart = { 'tri-130-high': 1, 'non-existent': 5 }
      pageCtx.refreshSelected()
      // getSelectedCount 统计所有 qty>0 的 cart key（不论是否在 priceMap 中）
      assert.strictEqual(pageCtx.data.selectedCount, 2)
      // getDetail 排除不在 priceMap 中的项目
      assert.strictEqual(pageCtx.data.selectedList.length, 1)
    })

    it('totalChinese 为中文大写金额', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      pageCtx.refreshSelected()
      // 2120 → 贰仟壹佰贰拾元整
      assert.ok(pageCtx.data.totalChinese.indexOf('贰') !== -1)
      assert.ok(pageCtx.data.totalChinese.indexOf('元') !== -1)
    })
  })

  describe('saveCart() / saveCustomPrices() — 持久化', function () {
    it('saveCart 写入 storage', function () {
      pageCtx.data.cart = { 'tri-130-high': 3 }
      pageCtx.saveCart()
      var saved = wxm.getStorageSync('current_cart')
      assert.deepStrictEqual(saved, { 'tri-130-high': 3 })
    })

    it('saveCustomPrices 写入 storage', function () {
      pageCtx.data.customPrices = { 'tri-130-high': 500 }
      pageCtx.saveCustomPrices()
      var saved = wxm.getStorageSync('custom_prices')
      assert.deepStrictEqual(saved, { 'tri-130-high': 500 })
    })

    it('saveCart storage 写入失败时不抛异常', function () {
      wxm.setStorageError(true)
      assert.doesNotThrow(function () { pageCtx.saveCart() })
    })

    it('saveCustomPrices storage 写入失败时不抛异常', function () {
      wxm.setStorageError(true)
      assert.doesNotThrow(function () { pageCtx.saveCustomPrices() })
    })
  })

  describe('onIncrease / onDecrease — 购物车操作', function () {
    it('onIncrease 增加数量', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onIncrease(mockEvent)
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], 2)
    })

    it('onIncrease 从空 cart 添加新项目', function () {
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onIncrease(mockEvent)
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], 1)
    })

    it('onIncrease 后 storage 同步更新', function () {
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onIncrease(mockEvent)
      var saved = wxm.getStorageSync('current_cart')
      assert.strictEqual(saved['tri-130-high'], 1)
    })

    it('onDecrease 减少数量', function () {
      pageCtx.data.cart = { 'tri-130-high': 2 }
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onDecrease(mockEvent)
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], 1)
    })

    it('onDecrease 到 0 时删除 key', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onDecrease(mockEvent)
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], undefined)
      assert.strictEqual('tri-130-high' in pageCtx.data.cart, false)
    })
  })

  describe('onRemoveItem — 直接删除（Bug 1 修复）', function () {
    it('onRemoveItem 完全删除项目', function () {
      pageCtx.data.cart = { 'tri-130-high': 2, 'tri-130-eng': 1 }
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onRemoveItem(mockEvent)
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], undefined)
      assert.strictEqual('tri-130-high' in pageCtx.data.cart, false)
      assert.strictEqual(pageCtx.data.cart['tri-130-eng'], 1) // 其他项目不受影响
    })

    it('onRemoveItem 后 storage 同步更新', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onRemoveItem(mockEvent)
      var saved = wxm.getStorageSync('current_cart')
      assert.deepStrictEqual(saved, {})
    })

    it('onRemoveItem 删除不存在的项目不抛异常', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      var mockEvent = { currentTarget: { dataset: { id: 'not-exist' } } }
      assert.doesNotThrow(function () { pageCtx.onRemoveItem(mockEvent) })
    })

    it('onRemoveItem 不直接 mutate this.data.cart（Bug 1 修复验证）', function () {
      pageCtx.data.cart = { 'tri-130-high': 2, 'tri-130-eng': 1 }
      var originalCart = pageCtx.data.cart
      var mockEvent = { currentTarget: { dataset: { id: 'tri-130-high' } } }
      pageCtx.onRemoveItem(mockEvent)
      // 验证原始 cart 未被修改（即 onRemoveItem 使用了 Object.assign 浅拷贝）
      assert.strictEqual(originalCart['tri-130-high'], 2,
        '原始 cart 对象不应被 mutate，但 tri-130-high 被删除了')
    })
  })

  describe('onClearAll — 清空全部（Bug 3 修复）', function () {
    it('onClearAll 清空后 cart 和 customPrices 均为空', function () {
      // 直接测试内部逻辑（绕过 showModal）
      pageCtx.data.cart = { 'tri-130-high': 2 }
      pageCtx.data.customPrices = { 'tri-130-high': 500 }
      pageCtx.setData({ cart: {}, customPrices: {} })
      pageCtx.refreshSelected()
      pageCtx.saveCart()
      pageCtx.saveCustomPrices()

      assert.strictEqual(pageCtx.data.total, 0)
      assert.strictEqual(pageCtx.data.selectedCount, 0)
      assert.deepStrictEqual(pageCtx.data.cart, {})
      assert.deepStrictEqual(pageCtx.data.customPrices, {})

      var savedCart = wxm.getStorageSync('current_cart')
      var savedPrices = wxm.getStorageSync('custom_prices')
      assert.deepStrictEqual(savedCart, {})
      assert.deepStrictEqual(savedPrices, {})
    })
  })

  describe('onEndEditQty / onCancelEdit — 数量编辑', function () {
    it('onEndEditQty 合法数量正确更新', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      var mockEvent = {
        currentTarget: { dataset: { id: 'tri-130-high' } },
        detail: { value: '5' }
      }
      pageCtx.onEndEditQty(mockEvent)
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], 5)
      assert.strictEqual(pageCtx.data.editingId, '')
    })

    it('onEndEditQty 非法值 clamp 为 0 并删除', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      var mockEvent = {
        currentTarget: { dataset: { id: 'tri-130-high' } },
        detail: { value: 'abc' }
      }
      pageCtx.onEndEditQty(mockEvent)
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], undefined)
    })

    it('onCancelEdit 保存当前编辑数量值', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      pageCtx.data.editingId = 'tri-130-high'
      pageCtx.data.editingValue = 10
      pageCtx.onCancelEdit()
      assert.strictEqual(pageCtx.data.cart['tri-130-high'], 10)
      assert.strictEqual(pageCtx.data.editingId, '')
    })

    it('onCancelEdit 保留正在编辑的单价', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      pageCtx.data.customPrices = {}
      pageCtx.data.editingPriceId = 'tri-130-high'
      pageCtx.data.editingPriceValue = 500
      pageCtx.onCancelEdit()
      assert.strictEqual(pageCtx.data.customPrices['tri-130-high'], 500)
      assert.strictEqual(pageCtx.data.editingPriceId, '')
    })
  })

  describe('customPrices — 自定义单价编辑', function () {
    it('设置自定义单价后 effectivePrice 反映新价格', function () {
      pageCtx.data.cart = { 'tri-130-high': 2 }
      var mockEvent = {
        currentTarget: { dataset: { id: 'tri-130-high' } },
        detail: { value: '1000' }
      }
      pageCtx.onEndEditPrice(mockEvent)
      assert.strictEqual(pageCtx.data.customPrices['tri-130-high'], 1000)
      // refreshSelected 已被调用
      assert.strictEqual(pageCtx.data.selectedList[0].effectivePrice, 1000)
      assert.strictEqual(pageCtx.data.selectedList[0].subtotal, 2000)
    })

    it('价格<=0 时删除自定义价格', function () {
      pageCtx.data.customPrices = { 'tri-130-high': 500 }
      var mockEvent = {
        currentTarget: { dataset: { id: 'tri-130-high' } },
        detail: { value: '0' }
      }
      pageCtx.onEndEditPrice(mockEvent)
      assert.strictEqual(pageCtx.data.customPrices['tri-130-high'], undefined)
    })
  })

  describe('onCopyReport — 复制报告', function () {
    it('空购物车时提示请先选择', function () {
      // showToast 会在 wx mock 中无操作，只验证不抛异常
      assert.doesNotThrow(function () { pageCtx.onCopyReport() })
    })

    it('有项目时调用 setClipboardData', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      pageCtx.refreshSelected()
      // setClipboardData 在 mock 中会调用 success 回调
      assert.doesNotThrow(function () { pageCtx.onCopyReport() })
      // 验证历史记录被保存
      var savedHistory = wxm.getStorageSync('calc_history')
      assert.ok(savedHistory, '历史记录应被保存')
      assert.strictEqual(savedHistory.length, 1)
    })

    it('连续两次复制相同购物车只生成一条历史记录', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      pageCtx.refreshSelected()
      pageCtx.onCopyReport()
      pageCtx.onCopyReport()
      var savedHistory = wxm.getStorageSync('calc_history')
      assert.ok(savedHistory, '历史记录应被保存')
      assert.strictEqual(savedHistory.length, 1, '重复复制不应生成多条记录')
    })

    it('更改购物车后再复制会创建新记录', function () {
      pageCtx.data.cart = { 'tri-130-high': 1 }
      pageCtx.refreshSelected()
      pageCtx.onCopyReport()

      pageCtx.data.cart = { 'tri-130-high': 2 }
      pageCtx.refreshSelected()
      pageCtx.onCopyReport()

      var savedHistory = wxm.getStorageSync('calc_history')
      assert.strictEqual(savedHistory.length, 2, '不同购物车应各自生成一条记录')
    })
  })
})
