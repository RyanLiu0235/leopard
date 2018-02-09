import { escape } from './utils'
var escapeQuotes = function(str) {
  return str.replace(/"/g, '\\"')
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
        case '=':
          push('escape(' + line.substr(1).trim() + ')')
          break
        case '-':
          push(line.substr(1).trim())
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
  var fun = new Function('escape', body)
  return fun.call(this, escape)
}

var leo = compiler

export default leo
