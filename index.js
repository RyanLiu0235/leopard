var leo = function(template, data) {
  var re = /<%(.+?)%>/g
  var parsed = ''
  var curMatched = null
  var matched = null

  while (curMatched = re.exec(template)) {
    parsed += template.substring(
      matched !== null ? matched.index + matched[0].length : 0,
      curMatched.index
    )
    matched = curMatched
    with(data) {
      parsed += eval(matched[1].trim())
    }
  }
  parsed += template.substr(matched.index + matched[0].length)
  return parsed
}

module.exports = leo
