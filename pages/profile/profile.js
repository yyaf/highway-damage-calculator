var history = require('../../utils/history.js')

Page({
  data: {
    historyList: [],
    version: 'v1.0.3',
    author: '岳亚峰'
  },

  onShow: function () {
    this.loadHistory()
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

  // 查看历史记录详情
  onViewHistory: function (e) {
    var id = e.currentTarget.dataset.id
    var list = history.getHistory()
    var record = list.find(function (item) { return item.id === id })
    if (record && record.report) {
      wx.setClipboardData({
        data: record.report,
        success: function () {
          wx.showToast({ title: '清单已复制到剪贴板' })
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
