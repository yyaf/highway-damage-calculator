var STORAGE_KEY = 'usage_count'

function recordUsage(itemId) {
  try {
    var counts = wx.getStorageSync(STORAGE_KEY) || {}
    counts[itemId] = (counts[itemId] || 0) + 1
    wx.setStorageSync(STORAGE_KEY, counts)
  } catch (e) {
    // Storage 写入失败时静默忽略
  }
}

function getUsageCounts() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || {}
  } catch (e) {
    return {}
  }
}

function sortByUsage(items) {
  var counts = getUsageCounts()
  return items.slice().sort(function (a, b) {
    var countA = counts[a.id] || 0
    var countB = counts[b.id] || 0
    if (countB !== countA) return countB - countA
    return 0 // 频次相同时保持原顺序
  })
}

module.exports = {
  recordUsage: recordUsage,
  getUsageCounts: getUsageCounts,
  sortByUsage: sortByUsage
}
