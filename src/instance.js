var escape = require('./utils').escape
var escapeQuotes = function(str) {
  return str.replace(/"/g, '\\"')
}

function Leopard() {}
var p = Leopard.prototype

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
p.parse = function(tpl, data) {
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
  curMatched = delimeterRE.exec(tpl)
  while (curMatched) {
    // This is raw HTML
    var html = tpl.substring(
      matched !== null ? matched.index + matched[0].length : 0,
      curMatched.index
    )
    html && push('"' + escapeQuotes(html) + '"')
    var js = curMatched[1].trim()
    js && generate(js)
    matched = curMatched
    curMatched = delimeterRE.exec(tpl)
  }
  var end = tpl.substr(matched.index + matched[0].length)
  end && push('"' + escapeQuotes(end) + '"')
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
  // 注入过滤器
  // eslint-disable-next-line no-new-func
  var fun = new Function('escape', ...Object.keys(p), body)
  return fun.call(p, escape, ...Object.values(p))
}

module.exports = Leopard
