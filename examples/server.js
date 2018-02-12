var fs = require('fs')
var path = require('path')
var connect = require('connect')
var opn = require('opn')
var Leopard = require('../src/index.server')
var read = fs.readFileSync

var app = connect()
var leo = new Leopard()

var encoding = 'utf-8'

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

var indexTpl = read(resolve('./index.tpl'), encoding)
var examples = fs.readdirSync(resolve('./routes'))

// datas
var data = {}
var example
for (var i = 0; i < examples.length; i++) {
  example = examples[i]
  var dir = resolve('./routes/' + example + '/data.json')
  data[example] = JSON.parse(read(dir, encoding))
}

var port = 9888

app.use(function(req, res, next) {
  if (req.url === '/') {
    leo.compileFile(resolve('./index.tpl'), {
      examples
    }, function(err, html) {
      res.write(html, encoding)
      res.end()
      return
    })
  } else {
    next()
  }
})

app.use(function(req, res, next) {
  var url = req.url.substr(1)
  if (examples.indexOf(url) > -1) {
    leo.compileFile(
      resolve('./routes/' + url + '/index.tpl'),
      data[url],
      function(err, html) {
        res.write(html, encoding)
        res.end()
      })
  } else {
    next()
  }
})

app.use(function(req, res) {
  res.write('404')
  res.end()
})

app.listen(port, function() {
  console.log('🌏connect runs at http://localhost:' + port)
  opn('http://localhost:' + port)
})
