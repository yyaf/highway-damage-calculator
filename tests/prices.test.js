// 数据完整性测试 — prices.js 无需 wx mock
var { describe, it } = require('node:test')
var assert = require('node:assert')

var prices = require('../data/prices.js')

describe('prices.js 数据完整性', function () {

  describe('结构验证', function () {
    it('categories 是非空数组', function () {
      assert.ok(Array.isArray(prices.categories), 'categories 应该是数组')
      assert.ok(prices.categories.length > 0, 'categories 不应为空')
    })

    it('standards 是非空数组', function () {
      assert.ok(Array.isArray(prices.standards), 'standards 应该是数组')
      assert.ok(prices.standards.length > 0, 'standards 不应为空')
    })

    it('每个 category 有 id, name, items', function () {
      prices.categories.forEach(function (cat, i) {
        assert.ok(typeof cat.id === 'string' && cat.id.length > 0,
          'categories[' + i + '] 缺少 id')
        assert.ok(typeof cat.name === 'string' && cat.name.length > 0,
          'categories[' + i + '] 缺少 name')
        assert.ok(Array.isArray(cat.items) && cat.items.length > 0,
          'categories[' + i + '] items 应为非空数组')
      })
    })

    it('每个 standard 有 id, name, docCode, categories', function () {
      prices.standards.forEach(function (s, i) {
        assert.ok(typeof s.id === 'string' && s.id.length > 0,
          'standards[' + i + '] 缺少 id')
        assert.ok(typeof s.name === 'string' && s.name.length > 0,
          'standards[' + i + '] 缺少 name')
        assert.ok(typeof s.docCode === 'string' && s.docCode.length > 0,
          'standards[' + i + '] 缺少 docCode')
        assert.ok(Array.isArray(s.categories) && s.categories.length > 0,
          'standards[' + i + '] categories 应为非空数组')
      })
    })
  })

  describe('Item ID 唯一性', function () {
    it('所有 categories 中 item id 均唯一', function () {
      var ids = []
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          ids.push(item.id)
        })
      })
      var idSet = new Set(ids)
      assert.strictEqual(ids.length, idSet.size,
        '存在重复 id，总数 ' + ids.length + '，唯一数 ' + idSet.size)
    })
  })

  describe('Item 必需字段', function () {
    it('每个 item 有 id, name, unit, price, source', function () {
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          assert.ok(typeof item.id === 'string' && item.id.length > 0,
            'item ' + JSON.stringify(item.name) + ' 缺少/无效 id')
          assert.ok(typeof item.name === 'string' && item.name.length > 0,
            'item id=' + item.id + ' 缺少/无效 name')
          assert.ok(typeof item.unit === 'string',
            'item id=' + item.id + ' 缺少 unit 字段')
          assert.ok(typeof item.price === 'number',
            'item id=' + item.id + ' price 应为 number')
          assert.ok(typeof item.source === 'string' && item.source.length > 0,
            'item id=' + item.id + ' 缺少/无效 source')
        })
      })
    })
  })

  describe('source 值合法性', function () {
    it('所有 source 值均为 1998/1999/2020/both', function () {
      var validSources = ['1998', '1999', '2020']
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          assert.ok(validSources.indexOf(item.source) !== -1,
            'item id=' + item.id + ' source="' + item.source + '" 不合法')
        })
      })
    })
  })

  describe('price 合理性', function () {
    it('所有 price >= 0', function () {
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          assert.ok(item.price >= 0,
            'item id=' + item.id + ' price=' + item.price + ' 不应为负数')
        })
      })
    })

    it('所有正数价格均为整数', function () {
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          if (item.price > 0) {
            assert.strictEqual(item.price % 1, 0,
              'item id=' + item.id + ' price=' + item.price + ' 应为整数')
          }
        })
      })
    })

    it('所有价格均不超过合理上限(400000)', function () {
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          assert.ok(item.price <= 400000,
            'item id=' + item.id + ' price=' + item.price + ' 超过合理上限')
        })
      })
    })
  })

  describe('unit 为空逻辑', function () {
    it('unit 为空字符串的 item 应为 price=0 的按实计算项目', function () {
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          if (item.unit === '') {
            assert.strictEqual(item.price, 0,
              'item id=' + item.id + ' name=' + item.name + ' unit 为空但 price=' + item.price + '（应为 0）')
          }
        })
      })
    })
  })

  describe('统计概览', function () {
    it('source 分布统计', function () {
      var counts = { '1998': 0, '1999': 0, '2020': 0 }
      prices.categories.forEach(function (cat) {
        cat.items.forEach(function (item) {
          counts[item.source] = (counts[item.source] || 0) + 1
        })
      })
      // 验证各 source 都有一定数量
      assert.ok(counts['1998'] > 0, '应有 1998 年的项目')
      assert.ok(counts['1999'] > 0, '应有 1999 年的项目')
      assert.ok(counts['2020'] > 0, '应有 2020 年的项目')
      console.log('source 分布:', JSON.stringify(counts))
    })

    it('categories 按分类的项目数量', function () {
      var total = 0
      prices.categories.forEach(function (cat) {
        console.log('  ' + cat.name + ': ' + cat.items.length + ' 项')
        total += cat.items.length
      })
      console.log('总项目数: ' + total)
      assert.ok(total > 150, '总项目数应 > 150')
    })
  })
})
