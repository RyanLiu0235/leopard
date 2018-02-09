var capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

var reverse = function(string) {
  return string.split('').reverse().join('')
}

module.exports = { capitalize, reverse }
