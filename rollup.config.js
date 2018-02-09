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
  input: './src/index.js',
  output: {
    file: './dist/leopard.js',
    format: 'umd',
    name: 'Leopard',
    banner: banner
  },
  plugins: [cjs()]
}, {
  input: './src/index.js',
  output: {
    file: './dist/leopard.min.js',
    format: 'umd',
    name: 'Leopard',
    banner: banner
  },
  plugins: [cjs(), uglify()]
}]
