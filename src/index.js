var escape = require('./utils').escape

var leo = function(template, data) {
  data = data || {}
  var tplRe = /<%(.+?)%>/g
  var reservedRe = /(if|else|for|switch|case|break|default|while|continue|do|{|})/
  var parsed = 'var lines = [];\n' +
    'var rst;\n'
  var curMatched = null
  var matched = null

  parsed += 'with(' + JSON.stringify(data) + ') {\n'

  var generate = function(line, isJs) {
    if (line.length > 0) {
      if (isJs) {
        if (reservedRe.test(line)) {
          parsed += line + '\n'
        } else {
          parsed += 'lines.push(' + '\"(' + escape(line) + ')\"' + ');\n'
        }
      } else {
        parsed += 'lines.push(' + '\"\\\"' + escape(line) + '\\\"\"' + ');\n'
      }
    }
  }

  while (curMatched = tplRe.exec(template)) {
    var preStr = template.substring(
      matched !== null ? matched.index + matched[0].length : 0,
      curMatched.index
    )
    generate(preStr)
    generate(curMatched[1].trim(), true)
    matched = curMatched
  }
  var end = template.substr(matched.index + matched[0].length)
  generate(end)

  parsed += 'rst = eval(lines.join(\" + \"));\n' +
    '}\n' +
    'return rst'

  var fun = new Function(parsed)
  return fun()
}

module.exports = leo
