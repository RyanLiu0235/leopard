var assert = require('assert')
var leo = require('../')

describe('leopard', function() {
  it('init with simplest config', function() {
    var template = leo('<p>This is <% a %></p>', {
      a: 'Leopard!'
    })
    assert.strictEqual(template, '<p>This is Leopard!</p>')
  })
})
