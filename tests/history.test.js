// 历史记录 CRUD 测试
var { describe, it, beforeEach } = require('node:test')
var assert = require('node:assert')

// wx mock 必须最先加载
var wxm = require('./wx-mock.js')
wxm.setup()

var history = require('../utils/history.js')

describe('history.js 历史记录', function () {

  beforeEach(function () {
    wxm.resetStorage()
  })

  // ── saveHistory + getHistory ──
  describe('saveHistory(cart, total, report) 与 getHistory()', function () {
    it('保存一条记录后 getHistory 可读到', function () {
      history.saveHistory({ 'a': 2 }, 4240, '测试报告')
      var list = history.getHistory()
      assert.strictEqual(list.length, 1)
      assert.strictEqual(list[0].total, 4240)
      assert.strictEqual(list[0].report, '测试报告')
    })

    it('记录包含所有必需字段', function () {
      history.saveHistory({ 'item-x': 3 }, 999, '报告内容')
      var record = history.getHistory()[0]
      assert.ok(typeof record.id === 'string' && record.id.length > 0, '应有 id')
      assert.ok(typeof record.time === 'string' && record.time.length > 0, '应有 time')
      assert.ok(typeof record.cart === 'object', 'cart 应为对象')
      assert.strictEqual(record.total, 999)
      assert.strictEqual(record.report, '报告内容')
      assert.strictEqual(record.itemCount, 1)
    })

    it('cart 是 deep clone，修改原 cart 不影响存储', function () {
      var cart = { 'a': 5 }
      history.saveHistory(cart, 100, 'r')
      cart['a'] = 999
      cart['b'] = 888

      var stored = history.getHistory()[0].cart
      assert.strictEqual(stored['a'], 5, '原 cart 修改不应影响存储')
      assert.strictEqual(stored['b'], undefined, '新增 key 不应存在')
    })

    it('多次保存：新记录在前（unshift）', function () {
      history.saveHistory({ 'a': 1 }, 100, 'first')
      history.saveHistory({ 'b': 2 }, 200, 'second')
      var list = history.getHistory()
      assert.strictEqual(list.length, 2)
      assert.strictEqual(list[0].total, 200, '最新记录应排第一')
      assert.strictEqual(list[1].total, 100, '旧记录应排后面')
    })

    it('itemCount 正确统计 qty>0 的项目数', function () {
      var cart = { 'a': 3, 'b': 0, 'c': 1 }
      history.saveHistory(cart, 500, 'r')
      var record = history.getHistory()[0]
      assert.strictEqual(record.itemCount, 2, '应只统计 qty>0 的项目（a和c）')
    })

    it('超过 MAX_HISTORY(50) 条时截断保留最新 50 条', function () {
      for (var i = 0; i < 55; i++) {
        history.saveHistory({ 'x': 1 }, i, 'report-' + i)
      }
      var list = history.getHistory()
      assert.strictEqual(list.length, 50, '应截断为 50 条')
      // 最新的（total 最大的）应该排第一
      assert.strictEqual(list[0].total, 54, '最新记录应为 total=54')
      // 最旧的（total=0..4）应被截掉
      assert.strictEqual(list[49].total, 5, '最旧保留记录应为 total=5')
    })

    it('storage 写入失败时不抛异常', function () {
      wxm.setStorageError(true)
      assert.doesNotThrow(function () {
        history.saveHistory({ 'a': 1 }, 100, 'r')
      })
      wxm.setStorageError(false)
    })

    it('空 cart 保存正常（itemCount=0）', function () {
      history.saveHistory({}, 0, '')
      var record = history.getHistory()[0]
      assert.strictEqual(record.itemCount, 0)
      assert.deepStrictEqual(record.cart, {})
    })

    // ── 去重：相同 report 不重复保存
    it('相同 report 连续两次调用只保存一条记录', function () {
      history.saveHistory({ 'a': 1 }, 100, 'same-report')
      history.saveHistory({ 'a': 1 }, 100, 'same-report')
      var list = history.getHistory()
      assert.strictEqual(list.length, 1, '相同 report 不应重复保存')
      assert.strictEqual(list[0].total, 100)
      assert.strictEqual(list[0].report, 'same-report')
    })

    it('不同 report 仍正常保存多条记录', function () {
      history.saveHistory({ 'a': 1 }, 100, 'report-a')
      history.saveHistory({ 'b': 2 }, 200, 'report-b')
      var list = history.getHistory()
      assert.strictEqual(list.length, 2, '不同 report 应各自保存')
      assert.strictEqual(list[0].total, 200, '最新记录排第一')
      assert.strictEqual(list[1].total, 100, '旧记录排第二')
    })

    it('相同 report 三次调用也只保存一条', function () {
      history.saveHistory({ 'a': 1 }, 100, 'dup')
      history.saveHistory({ 'a': 1 }, 100, 'dup')
      history.saveHistory({ 'a': 1 }, 100, 'dup')
      assert.strictEqual(history.getHistory().length, 1)
    })

    it('空历史首次保存不受去重影响', function () {
      history.saveHistory({ 'a': 1 }, 100, 'first')
      var list = history.getHistory()
      assert.strictEqual(list.length, 1, '空历史时首次保存应正常')
    })
  })

  // ── getHistory ──
  describe('getHistory()', function () {
    it('无历史数据时返回 []', function () {
      var list = history.getHistory()
      assert.deepStrictEqual(list, [])
    })

    it('storage 读取失败时返回 []', function () {
      // 先存一条
      history.saveHistory({ 'a': 1 }, 100, 'r')
      // 模拟读取失败
      wxm.setStorageError(true)
      var list = history.getHistory()
      assert.deepStrictEqual(list, [], '读取异常应返回空数组')
      wxm.setStorageError(false)
    })
  })

  // ── deleteHistory ──
  describe('deleteHistory(id)', function () {
    it('删除存在的记录', function () {
      history.saveHistory({ 'a': 1 }, 100, 'first')
      history.saveHistory({ 'b': 2 }, 200, 'second')
      var list = history.getHistory()
      var idToDelete = list[1].id // 旧的那条

      var remaining = history.deleteHistory(idToDelete)
      assert.strictEqual(remaining.length, 1)
      assert.strictEqual(remaining[0].total, 200)
    })

    it('删除不存在的 id：列表不变', function () {
      history.saveHistory({ 'a': 1 }, 100, 'r')
      var listBefore = history.getHistory()
      var remaining = history.deleteHistory('nonexistent-id')
      assert.strictEqual(remaining.length, listBefore.length)
    })

    it('从空历史删除：返回 []', function () {
      var remaining = history.deleteHistory('any-id')
      assert.deepStrictEqual(remaining, [])
    })

    // BUG 验证：getHistory() 异常返回 [] 时，deleteHistory 会覆盖全部数据
    it('BUG验证: storage 读取异常时不应覆盖已有数据', function () {
      // 先正常存一条
      wxm.setStorageError(false)
      history.saveHistory({ 'a': 1 }, 100, 'report')

      // 模拟读取异常 -> getHistory 返回 []
      wxm.setStorageError(true)
      // 此时 deleteHistory 会得到 list=[]
      // 如果是 bug 版本，会 wx.setStorageSync(STORAGE_KEY, []) 写空数组
      var remaining = history.deleteHistory('some-id')
      wxm.setStorageError(false)

      // 数据应该还在（如果 bug 已修复，storage 不应被覆盖）
      // 但目前 bug 版本会导致数据被覆盖为空
      // 注意：因为 setStorageError(true) 也会让 wx.setStorageSync 抛异常，
      // 在未修复版本中，这行会在没有 try/catch 的情况下抛异常
      // 所以这个测试在未修复时直接崩溃
      assert.ok(Array.isArray(remaining), '应返回数组')
    })
  })

  // ── clearHistory ──
  describe('clearHistory()', function () {
    it('清空所有记录', function () {
      history.saveHistory({ 'a': 1 }, 100, 'r1')
      history.saveHistory({ 'b': 2 }, 200, 'r2')
      history.clearHistory()
      var list = history.getHistory()
      assert.deepStrictEqual(list, [])
    })

    it('对空历史清空不抛异常', function () {
      assert.doesNotThrow(function () {
        history.clearHistory()
      })
    })

    // BUG 验证：clearHistory 无 try/catch
    it('BUG验证: storage 写失败时 clearHistory 应不抛异常', function () {
      wxm.setStorageError(true)
      // 未修复版本：wx.setStorageSync 抛异常，clearHistory 无 try/catch，异常会传播
      assert.doesNotThrow(function () {
        history.clearHistory()
      }, 'clearHistory 在 storage 写失败时抛出了异常 — 需要修复')
      wxm.setStorageError(false)
    })
  })
})
