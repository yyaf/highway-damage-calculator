var prices = require('../../data/prices.js')

Page({
  data: {
    standards: prices.standards.map(function (s) {
      var count = 0
      s.categories.forEach(function (cat) {
        count += cat.items.length
      })
      return Object.assign({}, s, { itemCount: count })
    })
  },

  onTapStandard: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/standard-items/standard-items?id=' + id
    })
  }
})
