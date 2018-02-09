var assert = require('assert')
var escape = require('../src/utils').escape

describe('utils', function() {
  describe('escape', function() {
    it('should escape \", <, >', function() {
      var raw = '<a href="javascript:;">This is a link</a>'
      var escapeString = escape(raw)
      assert.strictEqual(
        escapeString,
        "&lt;a href=&quot;javascript:;&quot;&gt;This is a link&lt;/a&gt;"
      )
    })
  })
})
