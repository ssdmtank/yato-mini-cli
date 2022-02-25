module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'warn',
    'space-before-function-paren': 'warn',
    semi: ['error', 'never'],
    quotes: ['warn', 'single'],
  },
}
