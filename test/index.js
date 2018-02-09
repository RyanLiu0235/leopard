var assert = require('assert')
var escape = require('../src/utils').escape
var Leo = require('../src')

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
    var leo = new Leo()
    var template = leo.compile('<p>This is <%= a %>!</p>', basicData)
    assert.strictEqual(template, '<p>This is Leopard!</p>')
  })

  it('handles multiple expressions', function() {
    var leo = new Leo()
    var template = leo.compile('<p>This is <%= a %>, AKA <%= b %>!</p>', basicData)
    assert.strictEqual(template, '<p>This is Leopard, AKA leo!</p>')
  })

  it('handles complex expressions', function() {
    var leo = new Leo()
    var template = leo.compile('<p>m + n = <%= m + n %></p>', basicData)
    var template_2 = leo.compile(
      '<p>I am Leopard<%= \', AKA \' + (isOk ? nickname : realname) + \'!\' %></p>',
      conditionData
    )
    assert.strictEqual(template, '<p>m + n = 3</p>')
    assert.strictEqual(template_2, '<p>I am Leopard, AKA leopard!</p>')
  })

  it('handles html interpolations and text interpolations', function() {
    var leo = new Leo()
    var string = '<p>html tags can be escaped and rendered as string: <%= html %>.' +
      ' Or can still rendered as html: <%- html %></p>'
    var data = {
      html: '<em>Leopard</em>'
    }
    var template = leo.compile(string, data)
    assert.strictEqual(template, '<p>html tags can be escaped and rendered as string: ' +
      escape(data.html) +
      '. Or can still rendered as html: ' +
      data.html +
      '</p>')
  })

  it('handles conditions', function() {
    var leo = new Leo()
    var conditions = '<% if (isOk) { %>' +
      '<span class=\"nickname\"><%= nickname %></span>' +
      '<% } else { %>' +
      '<span class=\"realname\"><%= realname %></span>' +
      '<% } %>'

    var template = leo.compile(conditions, conditionData)
    assert.strictEqual(template, '<span class=\"realname\">leopard</span>')
  })

  it('handles loops', function() {
    var leo = new Leo()
    var loops = 'Now I repeat: ' +
      '<ul>' +
      '<% for (var i = 0; i < 2; i++) { %>' +
      '<li><%= i %>: I am Leopard!</li>' +
      '<% } %>' +
      '</ul>'

    var template = leo.compile(loops)
    assert.strictEqual(template, 'Now I repeat: <ul><li>0: I am Leopard!</li><li>1: I am Leopard!</li></ul>')
  })

  it('handles filters in interpolations', function() {
    var leo = new Leo()
    var filters = '<p><%= \"leopard\" | capitalize | reverse %></p>'
    var template = leo.compile(filters)
    assert.strictEqual(template, '<p>drapoeL</p>')
  })
})
