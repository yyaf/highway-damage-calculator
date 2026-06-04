var prices = require('../../data/prices.js')

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

    this.setData({
      standardName: std.name,
      docCode: std.docCode,
      categories: std.categories,
      activeCategoryId: std.categories[0] ? std.categories[0].id : ''
    })
  },

  onCategoryTap: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.dataset.id,
      scrollTop: this.data.scrollTop === 0 ? 1 : 0
    })
  }
})
