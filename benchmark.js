var leo = require('./src')
var tpl = '<ul>' +
  '<% for (var i = 0; i < 1000; i++) { %>' +
  '<li>This is <% name %></li>' +
  '<% } %>' +
  '</ul>'

var target = 'render 1000 lis in a ul costs'
console.time(target)
var html = leo(tpl, {
  name: 'Leopard'
})
console.timeEnd(target)
