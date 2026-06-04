var prices = require('../../data/prices.js')
var calculator = require('../../utils/calculator.js')
var usageTracker = require('../../utils/usage-tracker.js')
var idMatcher = require('../../utils/calc-id-matcher.js')

var CART_KEY = 'current_cart'

Page({
  data: {
    standardName: '',
    docCode: '',
    categories: [],
    activeCategoryId: '',
    scrollTop: 0
  },

  onLoad: function (options) {
    var id = options.id
    var std = null
    for (var i = 0; i < prices.standards.length; i++) {
      if (prices.standards[i].id === id) {
        std = prices.standards[i]
        break
      }
    }

    if (!std) {
      wx.showToast({ title: '标准未找到', icon: 'error' })
      wx.navigateBack()
      return
    }

    wx.setNavigationBarTitle({ title: std.docCode })

    // 存储来源 ID，供匹配时使用
    this._sourceId = std.id

    // 构建运行时查找结构
    var lookup = idMatcher.buildLookupStructures()
    this._idMap = lookup.idMap
    this._masterList = lookup.masterList

    // 加载购物车并关联计算器 ID
    var cart = wx.getStorageSync(CART_KEY) || {}
    var categories = this._attachCalcInfo(std.categories, cart)

    this.setData({
      standardName: std.name,
      docCode: std.docCode,
      categories: categories,
      activeCategoryId: categories[0] ? categories[0].id : ''
    })
  },

  onShow: function () {
    // 从计算器 tab 切回时仅刷新 _inCart 状态，避免重跑全量 findCalcId
    if (!this._idMap) return
    var cart = wx.getStorageSync(CART_KEY) || {}
    this._refreshCartStatus(this.data.categories, cart)
  },

  // 给分类项目附加计算器 ID 和购物车状态
  _attachCalcInfo: function (categories, cart) {
    var idMap = this._idMap || {}
    var masterList = this._masterList || []
    var self = this

    return categories.map(function (cat) {
      var items = cat.items.map(function (item) {
        // 复用已有 _calcId（onShow 回退场景），避免重复 7 策略匹配
        var calcId = item._calcId
        if (!calcId) {
          calcId = idMatcher.findCalcId(item.name, item.spec || '', idMap, masterList, self._sourceId)
        }
        return {
          name: item.name,
          spec: item.spec,
          unit: item.unit,
          price: item.price,
          _calcId: calcId,
          _inCart: !!(calcId && cart[calcId] > 0)
        }
      })
      return {
        id: cat.id,
        name: cat.name,
        items: items,
        count: items.length
      }
    })
  },

  // 轻量刷新：仅更新 _inCart 状态，不复跑 findCalcId
  _refreshCartStatus: function (categories, cart) {
    var data = {}
    for (var ci = 0; ci < categories.length; ci++) {
      var items = categories[ci].items
      for (var ii = 0; ii < items.length; ii++) {
        var item = items[ii]
        var inCart = !!(item._calcId && cart[item._calcId] > 0)
        if (item._inCart !== inCart) {
          data['categories[' + ci + '].items[' + ii + ']._inCart'] = inCart
        }
      }
    }
    if (Object.keys(data).length > 0) {
      this.setData(data)
    }
  },

  onCategoryTap: function (e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.activeCategoryId) return
    this.setData({
      activeCategoryId: id,
      scrollTop: this.data.scrollTop === 0 ? 1 : 0
    })
  },

  // 切换添加/移除项目
  onAddItem: function (e) {
    var calcId = e.currentTarget.dataset.calcId
    if (!calcId) return

    var cart = wx.getStorageSync(CART_KEY) || {}

    if (cart[calcId] && cart[calcId] > 0) {
      // 已在购物车中 → 移除
      delete cart[calcId]
      wx.setStorageSync(CART_KEY, cart)

      var categories = this._attachCalcInfo(this.data.categories, cart)
      this.setData({ categories: categories })

      wx.showToast({ title: '已从计算器移除', icon: 'success', duration: 1500 })
    } else {
      // 不在购物车中 → 添加
      cart = calculator.addItem(cart, calcId)
      wx.setStorageSync(CART_KEY, cart)

      usageTracker.recordUsage(calcId)

      var categories = this._attachCalcInfo(this.data.categories, cart)
      this.setData({ categories: categories })

      wx.showToast({ title: '已添加到计算器', icon: 'success', duration: 1500 })
    }
  }
})
