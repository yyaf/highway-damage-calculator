Component({
  properties: {
    selected: {
      type: Number,
      value: 0
    }
  },

  data: {
    list: [
      {
        pagePath: '/pages/calculator/calculator',
        text: '计算',
        iconPath: '/images/tab-calc.png',
        selectedIconPath: '/images/tab-calc-active.png'
      },
      {
        pagePath: '/pages/standards/standards',
        text: '标准',
        iconPath: '/images/tab-standards.png',
        selectedIconPath: '/images/tab-standards-active.png'
      },
      {
        pagePath: '/pages/profile/profile',
        text: '我的',
        iconPath: '/images/tab-profile.png',
        selectedIconPath: '/images/tab-profile-active.png'
      }
    ]
  },

  methods: {
    switchTab: function (e) {
      var index = e.currentTarget.dataset.index
      var path = this.data.list[index].pagePath
      wx.switchTab({ url: path })
    }
  }
})
