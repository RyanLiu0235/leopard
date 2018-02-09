var assert = require('assert')
var Leo = require('../../src')
var filter = require('../../src/filter')

var noop = function() {}

describe('filter util', function() {
  it('should throw when handler is not a function', function() {
    try {
      filter.call(Leo, 'test', 1)
    } catch (e) {
      assert.ok(e instanceof TypeError)
    }
  })

  it('should throw when name is Leo\'s reserved word', function() {
    try {
      filter.call(Leo, 'parse', noop)
    } catch (e) {
      assert.ok(e instanceof Error)
    }
  })

  it('should mount a filter to Leopard.prototype', function() {
    filter.call(Leo, 'test', noop)
    assert.ok('test' in Leo.prototype)
  })
})
