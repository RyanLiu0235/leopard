var path = require('path')
var Leopard = require('../src/index.server.js')
var leo = new Leopard({ cache: true })

var times = 500000
var target = 'render ' + times + ' lis in a ul costs'
var cached = 'and from cache'

var dir = path.resolve(__dirname, './loop.tpl')
console.time(target)
leo.compileFile(dir, {
  name: 'Leopard',
  times
}, function() {
  console.timeEnd(target)

  console.time(cached)
  leo.compileFile(dir, {
    name: 'Leopard',
    times
  }, function() {
    console.timeEnd(cached)
  })
})
