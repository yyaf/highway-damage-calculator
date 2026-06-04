// 使用频次追踪测试
var { describe, it, beforeEach } = require('node:test')
var assert = require('node:assert')

// wx mock 必须最先加载
var wxm = require('./wx-mock.js')
wxm.setup()

var usage = require('../utils/usage-tracker.js')

describe('usage-tracker.js 使用频次追踪', function () {

  beforeEach(function () {
    wxm.resetStorage()
  })

  // ── recordUsage ──
  describe('recordUsage(itemId)', function () {
    it('首次记录：count 为 1', function () {
      usage.recordUsage('item-a')
      var counts = usage.getUsageCounts()
      assert.strictEqual(counts['item-a'], 1)
    })

    it('多次记录：count 递增', function () {
      usage.recordUsage('item-a')
      usage.recordUsage('item-a')
      usage.recordUsage('item-a')
      var counts = usage.getUsageCounts()
      assert.strictEqual(counts['item-a'], 3)
    })

    it('不同项目独立追踪', function () {
      usage.recordUsage('a')
      usage.recordUsage('b')
      usage.recordUsage('a')
      var counts = usage.getUsageCounts()
      assert.strictEqual(counts['a'], 2)
      assert.strictEqual(counts['b'], 1)
    })

    it('storage 写入失败时不抛异常', function () {
      wxm.setStorageError(true)
      // 不应抛异常（try/catch 在 recordUsage 内部）
      assert.doesNotThrow(function () {
        usage.recordUsage('safe-item')
      })
      wxm.setStorageError(false)
    })
  })

  // ── getUsageCounts ──
  describe('getUsageCounts()', function () {
    it('无数据时返回 {}', function () {
      var counts = usage.getUsageCounts()
      assert.deepStrictEqual(counts, {})
    })

    it('返回记录的数据', function () {
      usage.recordUsage('x')
      usage.recordUsage('y')
      usage.recordUsage('y')
      var counts = usage.getUsageCounts()
      assert.strictEqual(counts['x'], 1)
      assert.strictEqual(counts['y'], 2)
    })

    it('storage 读取失败时返回 {}', function () {
      // 直接通过 mock 模拟
      wxm.setStorageError(true)
      var counts = usage.getUsageCounts()
      assert.deepStrictEqual(counts, {})
      wxm.setStorageError(false)
    })
  })

  // ── sortByUsage ──
  describe('sortByUsage(items)', function () {
    it('按使用频次降序排列', function () {
      usage.recordUsage('b')
      usage.recordUsage('b')
      usage.recordUsage('b') // b: 3
      usage.recordUsage('a') // a: 1
      usage.recordUsage('c')
      usage.recordUsage('c') // c: 2

      var items = [
        { id: 'a', name: 'Alpha' },
        { id: 'b', name: 'Beta' },
        { id: 'c', name: 'Gamma' }
      ]
      var sorted = usage.sortByUsage(items)
      assert.strictEqual(sorted[0].id, 'b', 'b 频次最高应排第一')
      assert.strictEqual(sorted[1].id, 'c', 'c 频次第二')
      assert.strictEqual(sorted[2].id, 'a', 'a 频次最低应排最后')
    })

    it('相同频次保持原顺序（稳定排序）', function () {
      // 都没被记录过，频次都是 0
      var items = [
        { id: 'first', name: 'First' },
        { id: 'second', name: 'Second' },
        { id: 'third', name: 'Third' }
      ]
      var sorted = usage.sortByUsage(items)
      assert.strictEqual(sorted[0].id, 'first')
      assert.strictEqual(sorted[1].id, 'second')
      assert.strictEqual(sorted[2].id, 'third')
    })

    it('不在 usage counts 中的项目频次为 0，排到最后', function () {
      usage.recordUsage('known')
      usage.recordUsage('known')

      var items = [
        { id: 'unknown', name: 'Unknown' },
        { id: 'known', name: 'Known' }
      ]
      var sorted = usage.sortByUsage(items)
      assert.strictEqual(sorted[0].id, 'known')
      assert.strictEqual(sorted[1].id, 'unknown')
    })

    it('空数组返回空数组', function () {
      var sorted = usage.sortByUsage([])
      assert.deepStrictEqual(sorted, [])
    })

    it('单项数组返回单项数组', function () {
      var sorted = usage.sortByUsage([{ id: 'only', name: 'Only' }])
      assert.strictEqual(sorted.length, 1)
      assert.strictEqual(sorted[0].id, 'only')
    })

    it('返回新数组，不修改原始数组', function () {
      var items = [{ id: 'b' }, { id: 'a' }]
      var sorted = usage.sortByUsage(items)
      // 原始数组顺序不变
      assert.strictEqual(items[0].id, 'b')
      assert.strictEqual(items[1].id, 'a')
      // 返回的是不同引用
      assert.ok(sorted !== items)
    })

    // BUG 验证：sortByUsage(null) 当前会崩溃
    it('BUG验证: sortByUsage(null) 应不抛异常（目前会抛 TypeError）', function () {
      assert.doesNotThrow(function () {
        var result = usage.sortByUsage(null)
        // 如果走到这里说明已修复，验证返回值合理
        assert.ok(Array.isArray(result), '应返回数组')
      }, 'sortByUsage(null) 抛出了异常 — 需要修复')
    })

    it('BUG验证: sortByUsage(undefined) 应不抛异常', function () {
      assert.doesNotThrow(function () {
        var result = usage.sortByUsage(undefined)
        assert.ok(Array.isArray(result), '应返回数组')
      }, 'sortByUsage(undefined) 抛出了异常 — 需要修复')
    })
  })
})
