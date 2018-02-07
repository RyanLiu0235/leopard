var leo = function(template, data) {
  var re = /<%(.+?)%>/g

  var matched = re.exec(template)
  return template.substr(0, matched.index) +
    data[matched[1].trim()] +
    template.substr(matched.index + matched[0].length)
}

module.exports = leo
