var STORAGE_KEY = 'calc_history'
var MAX_HISTORY = 50

function saveHistory(cart, total, report, customPrices) {
  try {
    var list = wx.getStorageSync(STORAGE_KEY) || []
    var now = new Date()
    var timeStr = now.getFullYear() + '-' +
      pad(now.getMonth() + 1) + '-' +
      pad(now.getDate()) + ' ' +
      pad(now.getHours()) + ':' +
      pad(now.getMinutes())

    var itemCount = 0
    for (var id in cart) {
      if (cart[id] > 0) itemCount++
    }

    // 去重：最新记录 report 相同时跳过
    if (list.length > 0 && list[0].report === report) {
      return
    }

    list.unshift({
      id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8),
      time: timeStr,
      cart: JSON.parse(JSON.stringify(cart)),
      total: total,
      report: report,
      itemCount: itemCount,
      customPrices: JSON.parse(JSON.stringify(customPrices || {}))
    })

    if (list.length > MAX_HISTORY) {
      list = list.slice(0, MAX_HISTORY)
    }

    wx.setStorageSync(STORAGE_KEY, list)
  } catch (e) {
    // Storage 写入失败静默忽略
  }
}

function getHistory() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || []
  } catch (e) {
    return []
  }
}

function deleteHistory(id) {
  var list
  try {
    list = wx.getStorageSync(STORAGE_KEY) || []
  } catch (e) {
    // 读取失败时不应覆盖已有数据，直接返回空数组
    return []
  }
  list = list.filter(function (item) { return item.id !== id })
  try {
    wx.setStorageSync(STORAGE_KEY, list)
  } catch (e) {
    // Storage 写入失败静默忽略
  }
  return list
}

function clearHistory() {
  try {
    wx.setStorageSync(STORAGE_KEY, [])
  } catch (e) {
    // Storage 写入失败静默忽略
  }
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

module.exports = {
  saveHistory: saveHistory,
  getHistory: getHistory,
  deleteHistory: deleteHistory,
  clearHistory: clearHistory
}
