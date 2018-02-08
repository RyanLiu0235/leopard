# leopard [![Build Status](https://travis-ci.org/stop2stare/leopard.svg?branch=master)](https://travis-ci.org/stop2stare/leopard) [![codecov](https://codecov.io/gh/stop2stare/leopard/branch/master/graph/badge.svg)](https://codecov.io/gh/stop2stare/leopard)

A simple HTML template, currently a parser.

## Examples

``` js
var leo = require('leopard')
var tpl = '<p>I am <% name %>!</p>'
var data = {
  name: 'Leopard'
}

var html = leo(tpl, data) // '<p>I am Leopard!</p>'
```

## Usage

All the templates are supposed to be wrapped in open delimeter '<%' and close delimeter '%>'

### Plain Text

``` js
var data = {
  name: 'Leopard'
}
var text = '<p>I am <% name %>!</p>'
```

### Conditions

``` js
var data = {
  isOk: false,
  nickname: 'leo',
  realname: 'leopard'
}
var conditions_1 = '<p>I am Leopard<% \', AKA \' + (isOk ? nickname : realname) + \'!\' %></p>'
var conditions_2 = '<% if (isOk) { %>' +
  '<span class=\"nickname\"><% nickname %></span>' +
  '<% } else { %>' +
  '<span class=\"realname\"><% realname %></span>' +
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


