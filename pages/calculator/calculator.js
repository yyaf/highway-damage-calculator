var prices = require('../../data/prices.js')
var calc = require('../../utils/calculator.js')
var usage = require('../../utils/usage-tracker.js')
var history = require('../../utils/history.js')

Page({
  data: {
    priceMap: {},
    cart: {},
    searchKeyword: '',
    showDropdown: false,
    dropdownItems: [],
    displayCount: 0,
    total: 0,
    totalChinese: '',
    selectedCount: 0,
    selectedList: [],
    editingId: '',       // 正在编辑数量的 itemId
    inputFocus: false
  },

  onLoad: function () {
    var priceMap = calc.buildPriceMap()
    this.setData({ priceMap: priceMap })

    try {
      var savedCart = wx.getStorageSync('current_cart')
      if (savedCart) {
        this.setData({ cart: savedCart })
        this.refreshSelected()
      }
    } catch (e) {}
  },

  // 聚焦搜索框 — 展开浮层
  onSearchFocus: function () {
    if (!this.data.showDropdown) {
      this.openDropdown()
    }
  },

  // 点击下拉箭头 — 切换浮层
  onToggleDropdown: function () {
    if (this.data.showDropdown) {
      this.closeDropdown()
    } else {
      this.openDropdown()
    }
  },

  // 关闭浮层
  onDropdownClose: function () {
    this.closeDropdown()
  },

  // 打开浮层（加载全部物品按常用排序）
  openDropdown: function () {
    var allItems = []
    prices.categories.forEach(function (cat) {
      cat.items.forEach(function (item) {
        allItems.push(item)
      })
    })
    var sorted = usage.sortByUsage(allItems)
    this.setData({
      showDropdown: true,
      dropdownItems: sorted,
      displayCount: sorted.length
    })
  },

  // 关闭浮层
  closeDropdown: function () {
    this.setData({
      showDropdown: false,
      searchKeyword: '',
      inputFocus: false
    })
  },

  // 搜索输入 — 实时过滤浮层内容
  onSearchInput: function (e) {
    var keyword = e.detail.value.trim()
    this.setData({ searchKeyword: keyword })

    if (keyword === '') {
      var allItems = []
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          allItems.push(item)
        })
      })
      var sorted = usage.sortByUsage(allItems)
      this.setData({
        dropdownItems: sorted,
        displayCount: sorted.length
      })
      return
    }

    var matched = []
    prices.categories.forEach(function (cat) {
      cat.items.forEach(function (item) {
        if (item.name.indexOf(keyword) !== -1 || (item.spec && item.spec.indexOf(keyword) !== -1)) {
          matched.push(item)
        }
      })
    })

    var sorted = usage.sortByUsage(matched)
    this.setData({
      dropdownItems: sorted,
      displayCount: sorted.length
    })
  },

  // 浮层内点击物品 — 直接 +1 并收起浮层
  onQuickAdd: function (e) {
    var itemId = e.currentTarget.dataset.id
    var cart = calc.addItem(this.data.cart, itemId)
    usage.recordUsage(itemId)
    this.setData({ cart: cart })
    this.refreshSelected()
    this.saveCart()
    this.closeDropdown()
  },

  // 已选清单中增加数量
  onIncrease: function (e) {
    var itemId = e.currentTarget.dataset.id
    var cart = calc.addItem(this.data.cart, itemId)
    usage.recordUsage(itemId)
    this.setData({ cart: cart })
    this.refreshSelected()
    this.saveCart()
  },

  // 已选清单中减少数量
  onDecrease: function (e) {
    var itemId = e.currentTarget.dataset.id
    var cart = calc.removeItem(this.data.cart, itemId)
    this.setData({ cart: cart })
    this.refreshSelected()
    this.saveCart()
  },

  // 直接删除该物品
  onRemoveItem: function (e) {
    var itemId = e.currentTarget.dataset.id
    var cart = this.data.cart
    delete cart[itemId]
    this.setData({ cart: cart })
    this.refreshSelected()
    this.saveCart()
  },

  // 开始手动编辑数量 — 点击数字切换为输入框
  onStartEditQty: function (e) {
    var itemId = e.currentTarget.dataset.id
    this.setData({ editingId: itemId })
  },

  // 点击空白区域取消编辑
  onCancelEdit: function () {
    if (this.data.editingId) {
      this.setData({ editingId: '' })
      this.refreshSelected()
    }
  },

  // 完成手动编辑数量
  onEndEditQty: function (e) {
    var itemId = e.currentTarget.dataset.id
    var val = parseInt(e.detail.value) || 0
    var cart = calc.setQuantity(this.data.cart, itemId, val)
    this.setData({ cart: cart, editingId: '' })
    this.refreshSelected()
    this.saveCart()
  },

  // 刷新已选清单和合计
  refreshSelected: function () {
    var priceMap = this.data.priceMap
    var cart = this.data.cart
    var total = calc.getTotal(cart, priceMap)
    var selectedCount = calc.getSelectedCount(cart)
    var selectedList = calc.getDetail(cart, priceMap)
    var totalChinese = calc.numberToChinese(total)

    this.setData({
      total: total,
      totalChinese: totalChinese,
      selectedCount: selectedCount,
      selectedList: selectedList
    })
  },

  saveCart: function () {
    try { wx.setStorageSync('current_cart', this.data.cart) } catch (e) {}
  },

  // 清空全部
  onClearAll: function () {
    var that = this
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有已选项目吗？',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('current_cart', {})
          that.setData({ cart: {} })
          that.refreshSelected()
        }
      }
    })
  },

  onCopyReport: function () {
    var cart = this.data.cart
    var priceMap = this.data.priceMap
    var report = calc.formatReport(cart, priceMap)
    if (!report) {
      wx.showToast({ title: '请先选择损坏项目', icon: 'none' })
      return
    }
    var total = calc.getTotal(cart, priceMap)
    wx.setClipboardData({
      data: report,
      success: function () {
        history.saveHistory(cart, total, report)
        wx.showToast({ title: '已复制到剪贴板' })
      },
      fail: function () {
        wx.showToast({ title: '复制失败', icon: 'error' })
      }
    })
  },

  // 阻止浮层遮罩下滚动穿透
  preventMove: function () {}
})
