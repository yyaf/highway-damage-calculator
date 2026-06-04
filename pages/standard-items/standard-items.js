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
    // 从计算器 tab 切回时刷新 cart 状态
    if (!this._idMap) return
    var cart = wx.getStorageSync(CART_KEY) || {}
    var categories = this._attachCalcInfo(this.data.categories, cart)
    this.setData({ categories: categories })
  },

  // 给分类项目附加计算器 ID 和购物车状态
  _attachCalcInfo: function (categories, cart) {
    var idMap = this._idMap || {}
    var masterList = this._masterList || []
    var self = this

    return categories.map(function (cat) {
      var items = cat.items.map(function (item) {
        var calcId = idMatcher.findCalcId(item.name, item.spec || '', idMap, masterList)
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
