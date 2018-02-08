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
    var template = leo('<p>This is <%= a %>!</p>', basicData)
    assert.strictEqual(template, '<p>This is Leopard!</p>')
  })

  it('handles multiple expressions', function() {
    var template = leo('<p>This is <%= a %>, AKA <%= b %>!</p>', basicData)
    assert.strictEqual(template, '<p>This is Leopard, AKA leo!</p>')
  })

  it('handles complex expressions', function() {
    var template = leo('<p>m + n = <%= m + n %></p>', basicData)
    var template_2 = leo(
      '<p>I am Leopard<%= \', AKA \' + (isOk ? nickname : realname) + \'!\' %></p>',
      conditionData
    )
    assert.strictEqual(template, '<p>m + n = 3</p>')
    assert.strictEqual(template_2, '<p>I am Leopard, AKA leopard!</p>')
  })

  it('handles html-expected interpolations and text-expected interpolations', function() {
    var string = '<p>html tags can be escaped and rendered as string: <%= html %>.' +
      ' Or can still rendered as html: <%- html %></p>'
    var data = {
      html: '<em>Leopard</em>'
    }
    var template = leo(string, data)
    assert.strictEqual(template, '<p>html tags can be escaped and rendered as string: ' +
      escape(data.html) +
      '. Or can still rendered as html: ' +
      data.html +
      '</p>')
  })

  it('handles conditions', function() {
    var conditions = '<% if (isOk) { %>' +
      '<span class=\"nickname\"><%= nickname %></span>' +
      '<% } else { %>' +
      '<span class=\"realname\"><%= realname %></span>' +
      '<% } %>'

    var template = leo(conditions, conditionData)
    assert.strictEqual(template, '<span class=\"realname\">leopard</span>')
  })

  it('handles loops', function() {
    var loops = 'Now I repeat: ' +
      '<ul>' +
      '<% for (var i = 0; i < 2; i++) { %>' +
      '<li><%= i %>: I am Leopard!</li>' +
      '<% } %>' +
      '</ul>'

    var template = leo(loops)
    assert.strictEqual(template, 'Now I repeat: <ul><li>0: I am Leopard!</li><li>1: I am Leopard!</li></ul>')
  })
})
