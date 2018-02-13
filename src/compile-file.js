var fs = require('fs')

function _compileFile(Leopard) {
  // file cache
  var cache = {}
  var p = Leopard.prototype

  /**
   * clean cache
   */
  p.cleanCache = function() {
    cache = {}
  }

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
    var leo = this
    data = data || {}
    if (this.options.cache) {
      var hit = cache[dir]
      if (hit) {
        // eslint-disable-next-line no-new-func
        var fun = new Function('escape', 'data', ...Object.keys(p), hit)
        cb(null, fun.call(p, escape, data, ...Object.values(p)))
      } else {
        readFile(dir, data, cb, leo)
      }
    } else {
      readFile(dir, data, cb, leo)
    }
  }

  function readFile(dir, data, cb, leo) {
    fs.readFile(dir, 'utf-8', function(err, doc) {
      if (err) {
        cb(err)
        return
      }

      // cache Function body if needed
      if (leo.options.cache) {
        cache[dir] = leo.parse(doc)
      }
      var html = leo.compile(doc, data)
      cb(null, html)
    })
  }
}

module.exports = _compileFile
