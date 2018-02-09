# leopard-template [![Build Status](https://travis-ci.org/stop2stare/leopard.svg?branch=master)](https://travis-ci.org/stop2stare/leopard) [![codecov](https://codecov.io/gh/stop2stare/leopard/branch/master/graph/badge.svg)](https://codecov.io/gh/stop2stare/leopard) [![npm](https://img.shields.io/npm/v/leopard-template.svg)](https://www.npmjs.com/package/leopard-template)

A simple HTML template engine, currently a parser. Basically implements ejs syntax.

## Examples

You can simple run the [examples here](https://github.com/stop2stare/leopard/tree/master/examples).

``` js
var leo = require('leopard')
var tpl = '<p>I am <%= name %>!</p>'
var data = {
  name: 'Leopard'
}

var html = leo(tpl, data) // '<p>I am Leopard!</p>'
```

## Usage

You can install **leopard-template** via npm

``` shell
$ npm install leopard-template
```

Of course you can import **leopard-template** in whatever way you want
``` js
// ES6 import
import leo from 'leopard-template'

// CommonJS require
var leo = require('leopard-template')

// and then you can start render your templates
```

Or you can also load with html `script` tag

``` html
<script src="./node_modules/leopard-template/dist/leopard.min.js"></script>
```

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

## Test

``` shell
$ npm run test
```


