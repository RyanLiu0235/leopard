var assert = require('assert')
var leo = require('../')

describe('leopard', function() {
  it('init with simplest config', function() {
    var template = leo('<p>This is <% a %>!</p>', {
      a: 'Leopard'
    })
    assert.strictEqual(template, '<p>This is Leopard!</p>')
  })

  it('handle multiple expressions', function() {
    var template = leo('<p>This is <% a %>, AKA <% b %>!</p>', {
      a: 'Leopard',
      b: 'leo'
    })
    assert.strictEqual(template, '<p>This is Leopard, AKA leo!</p>')
  })

  it('handle complex expressions', function() {
    var template = leo('<p>a + b = <% a + b %></p>', {
      a: 1,
      b: 2
    })
    assert.strictEqual(template, '<p>a + b = 3</p>')
  })
})
