var uglify = require('rollup-plugin-uglify')
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
    name: 'leopard',
    banner: banner
  }
}, {
  input: './src/index.js',
  output: {
    file: './dist/leopard.min.js',
    format: 'umd',
    name: 'leopard',
    banner: banner
  },
  plugins: [uglify()]
}]
