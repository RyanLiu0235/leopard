var assert = require('assert')
var escape = require('../src/utils').escape
var leo = require('../src')

var basicData = {
  a: 'Leopard',
  b: 'leo',
  m: 1,
  n: 2
}

var conditionData = {
  isOk: false,
  nickname: 'leo',
  realname: 'leopard'
}

describe('leopard', function() {
  it('inits with simplest config', function() {
    var template = leo('<p>This is <% a %>!</p>', basicData)
    assert.strictEqual(template, escape('<p>This is Leopard!</p>'))
  })

  it('handles multiple expressions', function() {
    var template = leo('<p>This is <% a %>, AKA <% b %>!</p>', basicData)
    assert.strictEqual(template, escape('<p>This is Leopard, AKA leo!</p>'))
  })

  it('handles complex expressions', function() {
    var template = leo('<p>m + n = <% m + n %></p>', basicData)
    var template_2 = leo(
      '<p>I am Leopard<% \', AKA \' + (isOk ? nickname : realname) + \'!\' %></p>',
      conditionData
    )
    assert.strictEqual(template, escape('<p>m + n = 3</p>'))
    assert.strictEqual(template_2, escape('<p>I am Leopard, AKA leopard!</p>'))
  })

  it('handles conditions', function() {
    var conditions = '<% if (isOk) { %>' +
      '<span class=\"nickname\"><% nickname %></span>' +
      '<% } else { %>' +
      '<span class=\"realname\"><% realname %></span>' +
      '<% } %>'

    var template = leo(conditions, conditionData)
    assert.strictEqual(template, escape('<span class=\"realname\">leopard</span>'))
  })

  it('handles loops', function() {
    var loops = 'Now I repeat: ' +
      '<ul>' +
      '<% for (var i = 0; i < 3; i++) { %>' +
      '<li>I am Leopard!</li>' +
      '<% } %>' +
      '</ul>'

    var template = leo(loops)
    assert.strictEqual(template, escape('Now I repeat: <ul><li>I am Leopard!</li><li>I am Leopard!</li><li>I am Leopard!</li></ul>'))
  })
})
