const path = require('path')
const json = require('@rollup/plugin-json')

module.exports = {
  input: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    file: path.resolve(__dirname, 'bin', 'cli.js'),
    format: 'cjs', // 输出为commonjs
    banner: '#!/usr/bin/env node', // 打包注入指定node
  },
  plugins: [
    json(), //配置插件 - 将json转换为ES6模块
  ],
}
