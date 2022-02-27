#!/usr/bin/env node
'use strict'

var ora = require('ora')
var path = require('path')
var fs = require('fs')
var webpackMerge = require('webpack-merge')
var spawn = require('cross-spawn')
require('miniprogram-ci')
require('node-fetch')
require('form-data')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var ora__default = /*#__PURE__*/ _interopDefaultLegacy(ora)
var path__default = /*#__PURE__*/ _interopDefaultLegacy(path)
var fs__default = /*#__PURE__*/ _interopDefaultLegacy(fs)
var spawn__default = /*#__PURE__*/ _interopDefaultLegacy(spawn)

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
  'cross-spawn': '^7.0.3',
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
  // Log唯一的实例
  instance: ora__default['default'](),
  loading(msg) {
    this.instance = ora__default['default'](msg).start()
  },
  stop() {
    this.instance = this.instance.stop()
  },
  info(msg) {
    this.instance = this.instance.info(msg)
  },
  succeed(msg) {
    this.instance = this.instance.succeed(msg)
  },
  error(msg) {
    this.instance = this.instance.fail(msg)
  },
}

/**
 * 执行脚本
 * @param { string } opt.command 主指令
 * @param { Array} opt.args 参数数组
 * @param { Boolean } opt.needResp 是否需要在当前进程输出
 * @param { string } opt.desc 脚本简要
 */
const execCmd = ({ command, args, needResp, desc }) => {
  Log.loading(`正在${desc}\n`)
  const data = spawn__default['default'].sync(command, args, {
    // 是否需要在当前进程输出
    stdio: needResp ? 'pipe' : 'inherit',
    cwd: process.cwd(),
  })
  if (data.status !== 0) {
    Log.error(`执行命令${command}异常`)
    // eslint-disable-next-line no-console
    console.error(data.error)
    process.exit(1)
  }
  Log.succeed(`${desc}成功\n`)
  return data
}

const USER_CONFIG_NAME = 'yatoci.config.js'
const LOCAL_CONFIG_NAME = 'base.config.js'

/**
 * 合并配置文件
 * @returns 合并后的配置
 */
const mergeConfig = () => {
  // 用户配置文件
  const targetPath = path__default['default'].join(process.cwd(), USER_CONFIG_NAME)
  // 校验用户配置是否存在
  const isExist = fs__default['default'].existsSync(targetPath)

  if (!isExist) {
    Log.error(`配置文件不存在，请在根目录创建配置文件${USER_CONFIG_NAME}`)
    process.exit(1)
  }
  // 本地配置文件
  const localPath = path__default['default'].resolve(
    path__default['default'].join(__dirname, LOCAL_CONFIG_NAME)
  )
  return webpackMerge.merge(require(localPath), require(targetPath))
}

/**
 * 打包判断
 * @param {*} cmdOpt
 */
const deploy = async (cmdOpt) => {
  // step1 读取配置文件
  // TODO 合并命令行的配置
  const config = mergeConfig()
  // step2 安装依赖及编译
  if (config.preCommand && config.preCommand.length > 0) {
    for (const item of config.preCommand) {
      execCmd(item)
    }
  }
  // step3 上传微信并生成预览
  //   const qrImgUrl = wxFlow(config)
  // 推送钉钉提醒
  // 文件长传接口
}

const { Command } = require('commander')

const program = new Command()
program
  .version(packageJson.version, '-v, --version', '输出当前版本号')
  .helpOption('-h, --help', '查看帮助信息')

program
  .command('deploy')
  .option('--env [value]', '环境类型release/prod/pre')
  .option('--ver [value]', '发布版本号')
  .option('--desc [value]', '发布简介')
  .description('发布小程序')
  .action(function (cmdOpt) {
    deploy()
  })

program.parse(process.argv)
