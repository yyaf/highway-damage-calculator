var STORAGE_KEY = 'calc_history'
var MAX_HISTORY = 50

function saveHistory(cart, total, report) {
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

    list.unshift({
      id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8),
      time: timeStr,
      cart: JSON.parse(JSON.stringify(cart)),
      total: total,
      report: report,
      itemCount: itemCount
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
  var list = getHistory()
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
