var filters = require('./filters')
var escape = require('./utils').escape
var escapeQuotes = function(str) {
  return str.replace(/"/g, '\\"')
}

/**
 * check if there is filters in expressions
 * expect format:
 * - 'name | capitalize | reverse'
 * and this will be compile into:
 * - 'reverse(capitalize(name))'
 *
 * @param  {String} line
 * @return {String}
 */
var parseFilters = function(line) {
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
var parser = function(tpl, data) {
  data = data || {}
  var delimeterRE = /<%(.+?)%>/g
  var curMatched = null
  var matched = null
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
   * generate Function body
   *
   * @param  {String} line
   */
  var generate = function(line) {
    if (line.length > 0) {
      var type = line.charAt(0)

      switch (type) {
        // for interpolations we should check filters
        case '=':
          push('escape(' + parseFilters(line.substr(1).trim()) + ')')
          break
        case '-':
          push(parseFilters(line.substr(1).trim()))
          break
        default:
          body += line + '\n'
      }
    }
  }

  while (curMatched = delimeterRE.exec(tpl)) {
    // This is raw HTML
    var html = tpl.substring(
      matched !== null ? matched.index + matched[0].length : 0,
      curMatched.index
    )
    html && push('\"' + escapeQuotes(html) + '\"')
    var js = curMatched[1].trim()
    js && generate(js)
    matched = curMatched
  }
  var end = tpl.substr(matched.index + matched[0].length)
  end && push('\"' + escapeQuotes(end) + '\"')
  body += 'rst = lines.join(\"\");\n' +
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
var compiler = function(tpl, data) {
  var body = parser(tpl, data)

  // 注入过滤器
  var fun = new Function('escape', ...Object.keys(filters), body)
  return fun.call(this, escape, ...Object.values(filters))
}

var leo = compiler

module.exports = leo
