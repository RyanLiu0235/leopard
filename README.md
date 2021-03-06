# leopard-template [![Build Status](https://travis-ci.org/stop2stare/leopard.svg?branch=master)](https://travis-ci.org/stop2stare/leopard) [![codecov](https://codecov.io/gh/stop2stare/leopard/branch/master/graph/badge.svg)](https://codecov.io/gh/stop2stare/leopard) [![npm](https://img.shields.io/npm/v/leopard-template.svg)](https://www.npmjs.com/package/leopard-template)

A simple HTML template engine. Basically implements ejs syntax.

## Examples

You can simply run the [examples here](https://github.com/stop2stare/leopard/tree/master/examples) with

``` shell
$ npm run serve:examples
```

``` js
var Leopard = require('leopard-template')
var leo = new Leopard()
var tpl = '<p>I am <%= name %>!</p>'
var data = {
  name: 'Leopard'
}

var html = leo.compile(tpl, data) // '<p>I am Leopard!</p>'
```

Or just render a file:

``` js
var path = require('path')
var app = require('connect')()
var Leopard = require('leopard-template')
var leo = new Leopard()

app.use('/test', function(req, res) {
  leo.compileFile(
    path.resolve(__dirname, './test.tpl'),
    data,
    function(err, html) {
      req.write(html, 'utf-8')
      req.end()
    })
})
```

> Note: `compileFile` is only available at server side, so we build two versions, if you want to use Leopard directly in browsers, use `leopard.browser.js`, otherwise you'll have to use `leopard.server.js`.

## Usage

Install **leopard-template** via npm

``` shell
$ npm install leopard-template
```

Then import **leopard-template** in whatever way you want

``` js
// ES6 import
import Leopard from 'leopard-template'

// CommonJS require
var Leopard = require('leopard-template')

// and then you can start render your templates
// var leo = new Leopard()
```

Or load it with html `script` tag

``` html
<script src="./node_modules/leopard-template/dist/leopard.browser.min.js"></script>
```

## Configurations

``` js
var leo = new Leopard(config)
```

* **cache**: cache Function body

## Syntax

Leopard simply implements ejs syntax.

Wrap statements like `for` or `if` in `<% ... %>`, expressions in `<%= ... %>`, and raw HTML in `<%- ... %>`

### Plain Text

``` js
var data = {
  name: 'Leopard'
}
var text = '<p>I am <%= name %>!</p>'
```

### HTML

``` js
var data = {
  name: '<em>Leopard</em>'
}
var text = '<p>I am <%- name %>!</p>'
```

### Conditions

``` js
var data = {
  isOk: false,
  nickname: 'leo',
  realname: 'leopard'
}
var conditions_1 = '<p>I am Leopard<%= \', AKA \' + (isOk ? nickname : realname) + \'!\' %></p>'
var conditions_2 = '<% if (isOk) { %>' +
  '<span class=\"nickname\"><%= nickname %></span>' +
  '<% } else { %>' +
  '<span class=\"realname\"><%= realname %></span>' +
  '<% } %>'
```

### Loops

``` js
var loops = 'Now I repeat: ' +
  '<ul>' +
  '<% for (var i = 0; i < 3; i++) { %>' +
  '<li>I am Leopard!</li>' +
  '<% } %>' +
  '</ul>'
```

## Filters

Filters are now supported in Leopard, you can customize a filter with `Leopard.filter`:

``` js
var Leopard = require('leopard-template')
Leopard.filter('toUpperCase', function(string) {
  return string.toUpperCase()
})

var text = '<p><%= 'leopard' | toUpperCase %></p>' // <p>LEOPARD</p>
```

And also, filters can be chained:

``` js
// `reverse` is a preset filter
var text = '<p><%= 'leopard' | toUpperCase | reverse %></p>' // <p>DRAPOEL</p>
```

## Test

``` shell
$ npm run test
```


