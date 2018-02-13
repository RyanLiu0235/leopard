var path = require('path')
var fs = require('fs')
var assert = require('assert')
var Leo = require('../src/index.server')

var conditionData = {
  isOk: false,
  nickname: 'leo',
  realname: 'leopard'
}

describe('leopard', function() {
  it('should render a template file into HTML string', function(done) {
    var leo = new Leo({ cache: true })
    var _html = fs.readFileSync(path.resolve(__dirname, './templates/intro.html'), 'utf-8')
    leo.compileFile(
      path.resolve(__dirname, './templates/intro.tpl'),
      conditionData,
      function(err, html) {
        assert.strictEqual(html, _html)
        done()
      })
  })

  it('should throw when an invalid dirname is passed to `compileFile`', function(done) {
    var leo = new Leo()
    leo.compileFile(
      path.resolve(__dirname, './templates/invalid.tpl'),
      conditionData,
      function(err, html) {
        assert.ok(err instanceof Error)
        done()
      })
  })
})
