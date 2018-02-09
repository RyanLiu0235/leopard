var assert = require('assert')
var presets = require('../../src/filter/presets')

describe('filter presets', function() {
  it('capitalize', function() {
    assert.strictEqual(presets.capitalize('leopard'), 'Leopard')
  })

  it('reverse', function() {
    assert.strictEqual(presets.reverse('leopard'), 'drapoel')
  })
})
