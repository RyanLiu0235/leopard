var fs = require('fs')

function _compileFile(Leopard) {
  /**
   * compile a file into HTML string,
   * and pass it to `cb` as the first param
   *
   * @param  {String} file dir
   * @param  {Object|null} data
   * @param  {Function} cb
   * @return {String}
   */
  Leopard.prototype.compileFile = function(dir, data, cb) {
    var leo = this
    fs.readFile(dir, 'utf-8', function(err, doc) {
      if (err) {
        cb(err)
        return
      }

      var html = leo.compile(doc, data)
      cb(null, html)
    })
  }
}

module.exports = _compileFile
