var uglify = require('rollup-plugin-uglify')
var cjs = require('rollup-plugin-commonjs')
var version = require('./package.json').version
var banner =
  `/**
 * leopard v${version}
 * (c) ${new Date().getFullYear()} Ryan Liu
 * @license WTFPL
 */`

export default [{
  input: './src/index.browser.js',
  output: {
    file: './dist/leopard.browser.js',
    format: 'umd',
    name: 'Leopard',
    banner
  },
  plugins: [cjs()]
}, {
  input: './src/index.browser.js',
  output: {
    file: './dist/leopard.browser.min.js',
    format: 'umd',
    name: 'Leopard',
    banner
  },
  plugins: [cjs(), uglify()]
}, {
  input: './src/index.server.js',
  output: {
    file: './dist/leopard.server.js',
    format: 'cjs',
    name: 'Leopard',
    banner
  },
  external: ['fs'],
  plugins: [cjs()]
}, {
  input: './src/index.server.js',
  output: {
    file: './dist/leopard.server.min.js',
    format: 'cjs',
    name: 'Leopard',
    banner
  },
  external: ['fs'],
  plugins: [cjs(), uglify()]
}]
