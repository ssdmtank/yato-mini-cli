const path = require('path')
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
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
    commonjs(),
    copy({
      targets: [
        {
          src: 'base.config.js',
          dest: 'bin/',
        },
      ],
    }),
  ],
}
