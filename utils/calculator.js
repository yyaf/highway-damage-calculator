var prices = require('../data/prices.js')

// 构建 priceMap 方便快速查找: { itemId: { name, spec, unit, price } }
function buildPriceMap() {
  var map = {}
  prices.categories.forEach(function (cat) {
    cat.items.forEach(function (item) {
      map[item.id] = item
    })
  })
  return map
}

function addItem(cart, itemId) {
  cart = cart || {}
  cart[itemId] = (cart[itemId] || 0) + 1
  return cart
}

function removeItem(cart, itemId) {
  cart = cart || {}
  if (cart[itemId] && cart[itemId] > 0) {
    cart[itemId] = cart[itemId] - 1
    if (cart[itemId] === 0) {
      delete cart[itemId]
    }
  }
  return cart
}

function setQuantity(cart, itemId, n) {
  cart = cart || {}
  var qty = Math.max(0, parseInt(n) || 0)
  if (qty === 0) {
    delete cart[itemId]
  } else {
    cart[itemId] = qty
  }
  return cart
}

function getSubtotal(itemId, quantity, priceMap, customPrices) {
  var item = priceMap[itemId]
  if (!item) return 0
  var price = (customPrices && customPrices[itemId]) ? customPrices[itemId] : (item.price || 0)
  return price * (quantity || 0)
}

function getTotal(cart, priceMap, customPrices) {
  var total = 0
  for (var id in cart) {
    if (cart[id] > 0) {
      total += getSubtotal(id, cart[id], priceMap, customPrices)
    }
  }
  return total
}

function getDetail(cart, priceMap, customPrices) {
  var list = []
  for (var id in cart) {
    if (cart[id] > 0) {
      var item = priceMap[id]
      if (item) {
        var effPrice = (customPrices && customPrices[id]) ? customPrices[id] : (item.price || 0)
        list.push({
          id: id,
          name: item.name,
          spec: item.spec,
          unit: item.unit,
          price: item.price,
          source: item.source,
          effectivePrice: effPrice,
          quantity: cart[id],
          subtotal: effPrice * cart[id]
        })
      }
    }
  }
  return list
}

function getSelectedCount(cart) {
  var count = 0
  for (var id in cart) {
    if (cart[id] > 0) {
      count++
    }
  }
  return count
}

function sourceLabel(source) {
  if (source === '1998') return '38号'
  if (source === '2020') return '352号'
  if (source === 'both') return '38号/352号'
  return ''
}

function formatReport(cart, priceMap, customPrices) {
  var detail = getDetail(cart, priceMap, customPrices)
  if (detail.length === 0) return ''

  var items = detail.map(function (d) {
    var specStr = d.spec ? '(' + d.spec + ')' : ''
    var srcStr = '[' + sourceLabel(d.source) + '] '
    var customStr = (customPrices && customPrices[d.id]) ? '(单价¥' + formatMoney(customPrices[d.id]) + ')' : ''
    return d.name + specStr + srcStr + d.quantity + d.unit + customStr
  }).join('、')

  var total = 0
  detail.forEach(function (d) { total += d.subtotal })

  return '路产损坏清单：' + items + '。路损金额合计：¥' + formatMoney(total) + '元。'
}

function formatMoney(num) {
  var n = parseFloat(num)
  if (isNaN(n)) return '0'
  // 去掉末尾多余的零：1234.50 → 1234.5, 1234.00 → 1234
  return n.toFixed(10).replace(/\.?0+$/, '')
}

// 数字转中文大写金额
function numberToChinese(num) {
  if (num === 0) return '零元整'

  var digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var radices = ['', '拾', '佰', '仟']
  var bigRadices = ['', '万', '亿']

  var n = parseFloat(num)
  if (isNaN(n)) return ''

  // 分离整数和小数
  var intPart = Math.floor(n)
  var decPart = Math.round((n - intPart) * 100)

  var result = ''

  // 处理整数部分
  if (intPart === 0) {
    result = '零'
  } else {
    var zeroCount = 0
    var strInt = intPart.toString()
    var len = strInt.length

    for (var i = 0; i < len; i++) {
      var p = len - i - 1           // 从高位到低位的索引
      var d = parseInt(strInt[i])    // 当前数字
      var quotient = Math.floor(p / 4)  // 万/亿 层级
      var modulus = p % 4             // 个十百千

      if (d === 0) {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          result += '零'
          zeroCount = 0
        }
        result += digits[d] + radices[modulus]
      }

      // 每4位加万/亿单位
      if (modulus === 0 && zeroCount < 4) {
        result += bigRadices[quotient]
        zeroCount = 0
      }
    }
  }

  result += '元'

  // 处理小数部分
  if (decPart === 0) {
    result += '整'
  } else {
    var jiao = Math.floor(decPart / 10)
    var fen = decPart % 10
    if (jiao > 0) result += digits[jiao] + '角'
    if (fen > 0) result += digits[fen] + '分'
    if (jiao > 0 && fen === 0) result += '整'
  }

  return result
}

module.exports = {
  buildPriceMap: buildPriceMap,
  addItem: addItem,
  removeItem: removeItem,
  setQuantity: setQuantity,
  getSubtotal: getSubtotal,
  getTotal: getTotal,
  getDetail: getDetail,
  getSelectedCount: getSelectedCount,
  formatReport: formatReport,
  formatMoney: formatMoney,
  numberToChinese: numberToChinese
}
