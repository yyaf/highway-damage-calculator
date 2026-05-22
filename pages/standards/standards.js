var prices = require('../../data/prices.js')

Page({
  data: {
    standards: prices.standards
  },

  onTapStandard: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/standard-items/standard-items?id=' + id
    })
  }
})
