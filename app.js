App({
  onLaunch() {
    // 初始化使用频次和历史记录 Storage（首次运行时）
    const usage = wx.getStorageSync('usage_count')
    if (!usage) {
      wx.setStorageSync('usage_count', {})
    }
    const history = wx.getStorageSync('calc_history')
    if (!history) {
      wx.setStorageSync('calc_history', [])
    }
  }
})
