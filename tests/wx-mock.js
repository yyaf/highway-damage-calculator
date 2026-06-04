// wx API Mock — 必须在 require 任何 utils 之前设置 global.wx

var store = {}
var storageShouldThrow = false

function setup() {
  if (global.wx) return // 幂等，避免重复设置

  global.wx = {
    getStorageSync: function (key) {
      if (storageShouldThrow) throw new Error('Mock storage read error')
      return store[key]
    },
    setStorageSync: function (key, value) {
      if (storageShouldThrow) throw new Error('Mock storage write error')
      store[key] = value
    },
    setClipboardData: function (opts) {
      if (opts.success) opts.success()
    },
    showToast: function () {},
    showModal: function () {},
    navigateTo: function () {},
    navigateBack: function () {},
    setNavigationBarTitle: function () {}
  }
}

function resetStorage() {
  store = {}
  storageShouldThrow = false
}

function setStorageError(shouldThrow) {
  storageShouldThrow = shouldThrow
}

// 预设 storage 值（模拟已有数据场景）
function setStorageSyncValue(key, value) {
  store[key] = value
}

module.exports = {
  setup: setup,
  resetStorage: resetStorage,
  setStorageError: setStorageError,
  setStorageSyncValue: setStorageSyncValue
}
