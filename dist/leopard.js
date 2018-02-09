/**
 * leopard v1.0.0
 * (c) 2018 Ryan Liu
 * @license WTFPL
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Leopard = factory());
}(this, (function () { 'use strict';

var escape = function(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
};

var utils = {
	escape: escape
};

var escape$1 = utils.escape;
var escapeQuotes = function(str) {
  return str.replace(/"/g, '\\"')
};

function Leopard() {}
var p = Leopard.prototype;

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
  var segments = line.split('|');
  return segments.reduce((accumulator, f) => f.trim() + '(' + accumulator.trim() + ')')
};

/**
 * parse the given `tpl` and return Function body string
 *
 * @param  {String} tpl
 * @param  {Object} data
 * @return {String}
 */
p.parse = function(tpl, data) {
  data = data || {};
  var delimeterRE = /<%(.+?)%>/g;
  var curMatched = null;
  var matched = null;
  var body = 'var lines = [];\n' +
    'var rst;\n' +
    'with(' + JSON.stringify(data) + ') {\n';

  /**
   * push a string into lines
   *
   * @param {String} str
   */
  function push(str) {
    body += 'lines.push(' + str + ');\n';
  }

  /**
   * generate Function body
   *
   * @param  {String} line
   */
  var generate = function(line) {
    if (line.length > 0) {
      var type = line.charAt(0);

      switch (type) {
        // for interpolations we should check filters
        case '=':
          push('escape(' + parseFilters(line.substr(1).trim()) + ')');
          break
        case '-':
          push(parseFilters(line.substr(1).trim()));
          break
        default:
          body += line + '\n';
      }
    }
  };

  while (curMatched = delimeterRE.exec(tpl)) {
    // This is raw HTML
    var html = tpl.substring(
      matched !== null ? matched.index + matched[0].length : 0,
      curMatched.index
    );
    html && push('\"' + escapeQuotes(html) + '\"');
    var js = curMatched[1].trim();
    js && generate(js);
    matched = curMatched;
  }
  var end = tpl.substr(matched.index + matched[0].length);
  end && push('\"' + escapeQuotes(end) + '\"');
  body += 'rst = lines.join(\"\");\n' +
    '}\n' +
    'return rst;';

  return body
};

/**
 * parse the given template and return HTML string
 *
 * @param  {String} tpl
 * @param  {Object} data
 * @return {String}
 */
p.compile = function(tpl, data) {
  var body = this.parse(tpl, data);
  // 注入过滤器
  var fun = new Function('escape', ...Object.keys(p), body);
  return fun.call(p, escape$1, ...Object.values(p))
};

var instance = Leopard;

/**
 * util for adding filters to Leopard,
 * return Leopard for chaining invoking
 *
 * @param  {String} name
 * @param  {Function} handler
 * @return {Leopard}
 */
function filter(name, handler) {
  /* istanbul ignore if */
  if (typeof handler !== 'function') {
    throw new TypeError(
      'Leopard: filter requires a function as handler, but got \"' +
      typeof handler + '\" in filter \"' + name + '\"'
    )
  }
  /* istanbul ignore if */
  if (name in this.prototype) {
    throw new Error('Leopard: filter \"' + name + '\" has been declared')
  }
  this.prototype[name] = handler;
  return this
}

var filter_1 = filter;

var capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
};

var reverse = function(string) {
  return string.split('').reverse().join('')
};

var presets = { capitalize, reverse };

// mount `filter` to Leopard as a util
instance.filter = filter_1;

// mount presets to Leopard.prototype so that every instance can use them
var presetFilters = Object.keys(presets);
for (var i = 0, l = presetFilters.length, name; i < l; i++) {
  name = presetFilters[i];
  instance.filter(name, presets[name]);
}

var src = instance;

return src;

})));
