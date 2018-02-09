// http://eslint.org/docs/user-guide/configuring
module.exports = {
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // disallows any space followed by the ( of arguments
    'space-before-function-paren': ['error', 'never'],
    // requires linebreaks to be placed after the operator
    'operator-linebreak': ['error', 'after'],
    // brace style
    'brace-style': 0
  }
}
