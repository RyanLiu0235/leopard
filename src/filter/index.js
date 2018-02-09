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
  this.prototype[name] = handler
  return this
}

module.exports = filter
