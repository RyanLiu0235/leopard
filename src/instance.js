var escape = require('./utils').escape

function escapeQuotes(str) {
  return str.replace(/"/g, '\\"')
}

function Leopard() {}
var p = Leopard.prototype

/**
 * check if there are filters in expressions
 * expect format:
 * - 'name | capitalize | reverse'
 * and this will be compiled into:
 * - 'reverse(capitalize(name))'
 *
 * @param  {String} line
 * @return {String}
 */
function parseFilters(line) {
  var segments = line.split('|')
  return segments.reduce((accumulator, f) => f.trim() + '(' + accumulator.trim() + ')')
}

/**
 * parse the given `tpl` and return Function body string
 *
 * @param  {String} tpl
 * @param  {Object} data
 * @return {String}
 */
p.parse = function(tpl, data) {
  data = data || {}
  var body = 'var lines = [];\n' +
    'var rst;\n' +
    'with(' + JSON.stringify(data) + ') {\n'

  /**
   * push a string into lines
   *
   * @param {String} str
   */
  function push(str) {
    body += 'lines.push(' + str + ');\n'
  }

  /**
   * add js code
   *
   * @param  {String} code
   */
  function addJs(code) {
    var type = code.charAt(0)
    if (['=', '-'].indexOf(type) > -1) {
      var expression = code.substr(1).trim()
      if (expression === '') return
      if (type === '=') {
        push('escape(' + parseFilters(expression) + ')')
      } else {
        push(parseFilters(expression))
      }
    } else {
      body += code + '\n'
    }
  }

  var nonEmptyRE = /\S/

  function isNonEmpty(str) {
    return nonEmptyRE.test(str)
  }

  // split tpl to lines
  var lines = tpl.split('\n')
  var delimeterRE = /<%(.+?)%>/g
  var tailSpaceRE = /\s*$/
  var line
  for (var i = 0, l = lines.length; i < l; i++) {
    var curMatched = null
    var matched = null
    var isLastLine = i === l - 1

    // trim spaces at the end of line
    line = lines[i].replace(tailSpaceRE, '')

    // if there is content
    if (isNonEmpty(line)) {
      curMatched = delimeterRE.exec(line)

      // if there is js
      if (curMatched !== null) {
        while (curMatched) {
          // This is raw HTML
          var html = line.substring(
            matched !== null ? matched.index + matched[0].length : 0,
            curMatched.index
          )
          if (isNonEmpty(html)) {
            push('"' + escapeQuotes(html) + '"')
          }
          var js = curMatched[1].trim()
          js && addJs(js)

          matched = curMatched
          curMatched = delimeterRE.exec(line)
        }

        var end = line.substr(matched.index + matched[0].length)
        if (isNonEmpty(end)) {
          push('"' + escapeQuotes(end) + (isLastLine ? '"' : '\\n"'))
        }
      } else {
        push('"' + escapeQuotes(line) + (isLastLine ? '"' : '\\n"'))
      }
    } else {
      body += '\n'
    }
  }

  body += 'rst = lines.join("");\n' +
    '}\n' +
    'return rst;'

  return body
}

/**
 * parse the given template and return HTML string
 *
 * @param  {String} tpl
 * @param  {Object} data
 * @return {String}
 */
p.compile = function(tpl, data) {
  var body = this.parse(tpl, data)
  // eslint-disable-next-line no-new-func
  var fun = new Function('escape', ...Object.keys(p), body)
  return fun.call(p, escape, ...Object.values(p))
}

module.exports = Leopard
