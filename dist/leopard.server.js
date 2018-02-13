/**
 * leopard v1.1.1
 * (c) 2018 Ryan Liu
 * @license WTFPL
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));

var escape$1 = function(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
};

var utils = {
	escape: escape$1
};

var escape$2 = utils.escape;

function escapeQuotes(str) {
  return str.replace(/"/g, '\\"')
}

function Leopard(options) {
  this.options = options || {};
}
var p = Leopard.prototype;

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
  var segments = line.split('|');
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
  data = data || {};
  var body = 'var lines = [];\n' +
    'var rst;\n' +
    'with(data) {\n';

  /**
   * push a string into lines
   *
   * @param {String} str
   */
  function push(str) {
    body += 'lines.push(' + str + ');\n';
  }

  /**
   * add js code
   *
   * @param  {String} code
   */
  function addJs(code) {
    var type = code.charAt(0);
    if (['=', '-'].indexOf(type) > -1) {
      var expression = code.substr(1).trim();
      if (expression === '') return
      if (type === '=') {
        push('escape(' + parseFilters(expression) + ')');
      } else {
        push(parseFilters(expression));
      }
    } else {
      body += code + '\n';
    }
  }

  var nonEmptyRE = /\S/;

  function isNonEmpty(str) {
    return nonEmptyRE.test(str)
  }

  // split tpl to lines
  var lines = tpl.split('\n');
  var delimeterRE = /<%(.+?)%>/g;
  var tailSpaceRE = /\s*$/;
  var line;
  for (var i = 0, l = lines.length; i < l; i++) {
    var curMatched = null;
    var matched = null;
    var isLastLine = i === l - 1;

    // trim spaces at the end of line
    line = lines[i].replace(tailSpaceRE, '');

    // if there is content
    if (isNonEmpty(line)) {
      curMatched = delimeterRE.exec(line);

      // if there is js
      if (curMatched !== null) {
        while (curMatched) {
          // This is raw HTML
          var html = line.substring(
            matched !== null ? matched.index + matched[0].length : 0,
            curMatched.index
          );
          if (isNonEmpty(html)) {
            push('"' + escapeQuotes(html) + '"');
          }
          var js = curMatched[1].trim();
          js && addJs(js);

          matched = curMatched;
          curMatched = delimeterRE.exec(line);
        }

        var end = line.substr(matched.index + matched[0].length);
        if (isNonEmpty(end)) {
          push('"' + escapeQuotes(end) + (isLastLine ? '"' : '\\n"'));
        }
      } else {
        push('"' + escapeQuotes(line) + (isLastLine ? '"' : '\\n"'));
      }
    } else {
      body += '\n';
    }
  }

  body += 'rst = lines.join("");\n' +
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
  data = data || {};
  var body = this.parse(tpl, data);

  // eslint-disable-next-line no-new-func
  var fun = new Function('escape', 'data', ...Object.keys(p), body);
  return fun.call(p, escape$2, data, ...Object.values(p))
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
      'Leopard: filter requires a function as handler, but got "' +
      typeof handler + '" in filter "' + name + '"'
    )
  }
  /* istanbul ignore if */
  if (name in this.prototype) {
    throw new Error('Leopard: filter "' + name + '" has been declared')
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

var index_browser = instance;

function _compileFile(Leopard) {
  // file cache
  var cache = {};
  var p = Leopard.prototype;

  /**
   * clean cache
   */
  p.cleanCache = function() {
    cache = {};
  };

  /**
   * compile a file into HTML string,
   * and pass it to `cb` as the first param
   *
   * @param  {String} file dir
   * @param  {Object|null} data
   * @param  {Function} cb
   * @return {String}
   */
  p.compileFile = function(dir, data, cb) {
    var leo = this;
    data = data || {};
    if (this.options.cache) {
      var hit = cache[dir];
      if (hit) {
        // eslint-disable-next-line no-new-func
        var fun = new Function('escape', 'data', ...Object.keys(p), hit);
        cb(null, fun.call(p, escape, data, ...Object.values(p)));
      } else {
        readFile(dir, data, cb, leo);
      }
    } else {
      readFile(dir, data, cb, leo);
    }
  };

  function readFile(dir, data, cb, leo) {
    fs.readFile(dir, 'utf-8', function(err, doc) {
      if (err) {
        cb(err);
        return
      }

      // cache Function body if needed
      if (leo.options.cache) {
        cache[dir] = leo.parse(doc);
      }
      var html = leo.compile(doc, data);
      cb(null, html);
    });
  }
}

var compileFile = _compileFile;

compileFile(index_browser);

var index_server = index_browser;

module.exports = index_server;
