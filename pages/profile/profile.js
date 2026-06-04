var history = require('../../utils/history.js')

Page({
  data: {
    historyList: [],
    version: 'v1.0.5',
    author: '岳亚峰'
  },

  onShow: function () {
    this.loadHistory()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  loadHistory: function () {
    var list = history.getHistory()
    // 格式化显示
    list = list.map(function (item) {
      return {
        id: item.id,
        time: item.time,
        total: item.total,
        itemCount: item.itemCount
      }
    })
    this.setData({ historyList: list })
  },

  // 查看历史记录详情 — 复制清单并跳转计算页恢复购物车
  onViewHistory: function (e) {
    var id = e.currentTarget.dataset.id
    var list = history.getHistory()
    var record = list.find(function (item) { return item.id === id })
    if (record && record.report) {
      var that = this
      wx.setClipboardData({
        data: record.report,
        success: function () {
          // 恢复购物车
          wx.setStorageSync('current_cart', record.cart)
          // 恢复或清空自定义单价
          if (record.customPrices) {
            wx.setStorageSync('custom_prices', record.customPrices)
          } else {
            wx.setStorageSync('custom_prices', {})
          }
          // 标记由计算页显示提示（避免跳转前 Toast 一闪而过）
          wx.setStorageSync('show_history_toast', true)
          wx.switchTab({ url: '/pages/calculator/calculator' })
        }
      })
    }
  },

  // 删除单条历史
  onDeleteHistory: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条记录吗？',
      success: function (res) {
        if (res.confirm) {
          history.deleteHistory(id)
          that.loadHistory()
        }
      }
    })
  },

  // 清空全部历史
  onClearHistory: function () {
    var that = this
    wx.showModal({
      title: '清空全部记录',
      content: '确定要清空所有计算历史记录吗？此操作不可恢复。',
      success: function (res) {
        if (res.confirm) {
          history.clearHistory()
          that.loadHistory()
          wx.showToast({ title: '已清空', icon: 'none' })
        }
      }
    })
  }
})
