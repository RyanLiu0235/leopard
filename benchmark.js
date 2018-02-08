var leo = require('./src')

var times = 50000
var tpl = '<ul>' +
  '<% for (var i = 0; i < ' + times + '; i++) { %>' +
  '<li>This is <% name %></li>' +
  '<% } %>' +
  '</ul>'

var target = 'render ' + times + ' lis in a ul costs'

console.time(target)
var html = leo(tpl, {
  name: 'Leopard'
})
console.timeEnd(target)
