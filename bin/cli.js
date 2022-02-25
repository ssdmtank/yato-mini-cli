#!/usr/bin/env node
'use strict'

var ora = require('ora')
var path = require('path')
var fs = require('fs')
require('node-fetch')
require('form-data')
var webpackMerge = require('webpack-merge')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var ora__default = /*#__PURE__*/ _interopDefaultLegacy(ora)
var path__default = /*#__PURE__*/ _interopDefaultLegacy(path)
var fs__default = /*#__PURE__*/ _interopDefaultLegacy(fs)

var name = 'yato-mini-cli'
var version = '0.0.1'
var description = 'taro min ci'
var main = 'lib/index.js'
var bin = {
  'yato-mini-cli': './bin/cli.js',
}
var scripts = {
  dev: 'rollup -w -c',
  build: 'rollup -c',
  prepare: 'husky install',
  commit: 'git add . && git-cz',
  changelog: 'conventional-changelog -p -i CHANGELOG.md -s -r 0',
}
var engines = {
  node: '>=v12',
}
var repository = {
  type: 'git',
  url: 'git+https://github.com/ssdmtank/yato-mini-cli.git',
}
var author = 'King Win'
var license = 'MIT'
var bugs = {
  url: 'https://github.com/ssdmtank/yato-mini-cli/issues',
}
var homepage = 'https://github.com/ssdmtank/yato-mini-cli#readme'
var keywords = ['gitlab', 'wechat', 'miniprogram', 'taro', 'ci', 'deploy']
var dependencies = {
  commander: '^9.0.0',
  'form-data': '^4.0.0',
  'miniprogram-ci': '^1.8.0',
  'node-fetch': '2',
  ora: '^5.0.0',
}
var devDependencies = {
  '@commitlint/cli': '^16.2.1',
  '@commitlint/cz-commitlint': '^16.2.1',
  '@rollup/plugin-commonjs': '^21.0.2',
  '@rollup/plugin-json': '^4.1.0',
  commitizen: '^4.2.4',
  'conventional-changelog-cli': '^2.2.2',
  eslint: '^8.9.0',
  husky: '^7.0.4',
  'lint-staged': '^12.3.4',
  prettier: '^2.5.1',
  rollup: '^2.68.0',
  'rollup-plugin-copy': '^3.4.0',
  'webpack-merge': '^5.8.0',
}
var config = {
  commitizen: {
    path: '@commitlint/cz-commitlint',
  },
}
var packageJson = {
  name: name,
  version: version,
  description: description,
  main: main,
  bin: bin,
  scripts: scripts,
  engines: engines,
  repository: repository,
  author: author,
  license: license,
  bugs: bugs,
  homepage: homepage,
  keywords: keywords,
  dependencies: dependencies,
  devDependencies: devDependencies,
  config: config,
  'lint-staged': {
    '*.js': ['eslint --fix', 'prettier --write'],
  },
}

/**
 * 日志工具
 */
const Log = {
  info(msg) {
    ora__default['default']().info(msg)
  },
  warn(msg) {
    ora__default['default']().warn(msg)
  },
  error(msg) {
    ora__default['default']().fail(msg)
  },
}

const CONFIG_FILE_NAME = 'yatoci.config.js'

/**
 * 合并配置文件
 * @returns 合并后的配置
 */
const mergeConfig = () => {
  // 用户配置文件
  const targetPath = path__default['default'].join(process.cwd(), CONFIG_FILE_NAME)
  // 校验用户配置是否存在
  const isExist = fs__default['default'].existsSync(targetPath)

  if (!isExist) {
    Log.error('配置文件不存在，请在根目录创建配置文件yatoci.config.js')
    process.exit(1)
  }
  // 本地配置文件
  const localPath = path__default['default'].resolve(
    path__default['default'].join(__dirname, CONFIG_FILE_NAME)
  )
  return webpackMerge.merge(require(targetPath), require(localPath))
}

/**
 * 打包判断
 * @param {*} cmdOpt
 */
const deploy = async (cmdOpt) => {
  // 读取配置文件
  mergeConfig()
  // 安装依赖及编译

  // 上传微信并生成预览

  // 推送钉钉提醒

  // 文件长传接口
  // https://bms.hanyuan.vip/hy-thirdpart/common/upload/file?timeNow=1645806479693
  //
  //   const spinner = ora('Loading unicorns').start()

  //   setTimeout(() => {
  //     spinner.color = 'yellow'
  //     spinner.text = 'Loading rainbows'
  //   }, 1000)
  //   spinner.succeed()
  //   spinner.fail()
  //   spinner.warn()
  //   spinner.info()
}

const { Command } = require('commander')

const program = new Command()
program
  .version(packageJson.version, '-v, --version', '输出当前版本号')
  .helpOption('-h, --help', '查看帮助信息')

program
  .command('deploy')
  .option('--env [value]', '环境类型')
  .option('--ver [value]', '发布版本号')
  .option('--desc [value]', '发布简介')
  .description('发布小程序')
  .action(function (cmdOpt) {
    deploy()
  })

program.parse(process.argv)
