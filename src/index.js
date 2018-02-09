var Leopard = require('./instance')
var filter = require('./filter')
var presets = require('./filter/presets')

// mount `filter` to Leopard as a util
Leopard.filter = filter

// mount presets to Leopard.prototype so that every instance can use them
var presetFilters = Object.keys(presets)
for (var i = 0, l = presetFilters.length, name; i < l; i++) {
  name = presetFilters[i]
  Leopard.filter(name, presets[name])
}

module.exports = Leopard
