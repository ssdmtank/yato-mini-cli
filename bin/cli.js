#!/usr/bin/env node
'use strict'

var webpackMerge = require('webpack-merge')
var spawn = require('cross-spawn')
var os = require('os')
var fs = require('fs')
var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-cn')
var chalk = require('chalk')
var path = require('path')
var ora = require('ora')
var ci = require('miniprogram-ci')
var fetch = require('node-fetch')
var FormData = require('form-data')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var spawn__default = /*#__PURE__*/ _interopDefaultLegacy(spawn)
var os__default = /*#__PURE__*/ _interopDefaultLegacy(os)
var fs__default = /*#__PURE__*/ _interopDefaultLegacy(fs)
var dayjs__default = /*#__PURE__*/ _interopDefaultLegacy(dayjs)
var relativeTime__default = /*#__PURE__*/ _interopDefaultLegacy(relativeTime)
var chalk__default = /*#__PURE__*/ _interopDefaultLegacy(chalk)
var path__default = /*#__PURE__*/ _interopDefaultLegacy(path)
var ora__default = /*#__PURE__*/ _interopDefaultLegacy(ora)
var ci__default = /*#__PURE__*/ _interopDefaultLegacy(ci)
var fetch__default = /*#__PURE__*/ _interopDefaultLegacy(fetch)
var FormData__default = /*#__PURE__*/ _interopDefaultLegacy(FormData)

var name = 'yato-mini-cli'
var version = '0.0.3'
var description = 'taro min ci'
var main = 'src/index.js'
var bin = {
  'yato-mini-cli': './bin/cli.js',
}
var scripts = {
  dev: 'rollup -w -c',
  build: 'rollup -c',
  prepare: 'husky install',
  gitpush: 'branch_name=$(git symbolic-ref --short -q HEAD) &&  git push origin $branch_name',
  commit: 'git add . && git-cz && yarn gitpush',
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
  chalk: '^4.1.2',
  commander: '^9.0.0',
  'cross-spawn': '^7.0.3',
  dayjs: '^1.10.8',
  'form-data': '^4.0.0',
  'miniprogram-ci': '^1.8.0',
  'node-fetch': '2',
  ora: '^5.0.0',
  'webpack-merge': '^5.8.0',
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
  'rollup-plugin-node-resolve': '^5.2.0',
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

const spinner = ora__default['default']()

const loading = (msg) => {
  spinner.text = msg
  spinner.spinner = 'earth'
  spinner.start()
}

const succeed = (msg) => {
  spinner.stopAndPersist({
    symbol: '✅ ',
    text: chalk__default['default'].green(`${msg} [${new Date().toLocaleString()}]\n`),
  })
}

const error = (msg) => {
  spinner.stopAndPersist({
    symbol: '❌ ',
    text: chalk__default['default'].red(`${msg} [${new Date().toLocaleString()}]\n`),
  })
}

const warn = (msg) => {
  spinner.stopAndPersist({
    symbol: '⚠️ ',
    text: chalk__default['default'].yellow(`${msg} [${new Date().toLocaleString()}]\n`),
  })
}

dayjs__default['default'].locale('zh-cn')
dayjs__default['default'].extend(relativeTime__default['default'])

const USER_CONFIG_NAME = 'yatoci.config.js'
const LOCAL_CONFIG_NAME = 'base.config.js'
const LOCAL_CONFIG_PATH = path__default['default'].resolve(
  path__default['default'].join(__dirname, LOCAL_CONFIG_NAME)
)
const USER_CONFIG_PATH = path__default['default'].join(process.cwd(), USER_CONFIG_NAME)

const CONSOLE = console

const logger = {
  log: (msg) => CONSOLE.log(msg),
  info: (msg) => CONSOLE.log('ℹ️ ', chalk__default['default'].blue(msg)),
  error: (msg) =>
    CONSOLE.error('❌ ', chalk__default['default'].red(msg), `${new Date().toLocaleString()}\n`),
  warn: (msg) => CONSOLE.warn('⚠️ ', chalk__default['default'].yellow(msg)),
  succeed: (msg) =>
    CONSOLE.log('✅ ', chalk__default['default'].green(msg), `${new Date().toLocaleString()}\n`),
}

/** 校验文件是否存在 */
const checkFileExist = (path) => fs__default['default'].existsSync(path)

/**
 * 执行脚本
 * @param { string } opt.command 主指令
 * @param { Array} opt.args 参数数组
 * @param { Boolean } opt.needResp 是否需要在当前进程输出
 * @param { string } opt.desc 脚本简要
 */
const execCmd = ({ command, args, needResp, desc }) => {
  loading(`正在${desc}\n`)
  const data = spawn__default['default'].sync(command, args, {
    // 是否需要在当前进程输出
    stdio: needResp ? 'pipe' : 'inherit',
    cwd: process.cwd(),
  })

  if (data.status !== 0) {
    error(`执行命令${command}异常`)
    // eslint-disable-next-line no-console
    console.error(data.error)
    process.exit(1)
  }
  succeed(`${desc}成功`)
  return data
}

/**
 * @returns git分支名称
 */
const getGitBranchName = () => {
  const data = execCmd({
    command: 'git',
    args: ['symbolic-ref', '--short', 'HEAD'],
    // args: ['rev-parse', '--abbrev-ref', 'HEAD'],
    desc: '查询git分支名称',
    needResp: true,
  })
  return data.stdout.toString().trim()
}

/**
 * 获取feat/fix/refactor 开头的times次提交
 * @param {*} times 次数
 */
const getGitPrevCommitMsg = (times = 5) => {
  const data = execCmd({
    command: 'git',
    args: [
      'log',
      '--no-merges',
      '-n',
      `${times}`,
      '--grep',
      'feat\\|fix\\|refactor',
      '--pretty=format:* %s (@%cn #DATE<%cd>)',
    ],
    needResp: true,
    desc: '获取git提交记录',
  })
  const message = data.stdout.toString().trim()
  return message.replace(/#DATE<([^>]+)>/gi, (_, p1) => {
    return new dayjs__default['default'](p1).fromNow()
  })
}

const getHostName = () => os__default['default'].hostname()

const formatNowDate = (dateFormat) => new dayjs__default['default']().format(dateFormat)

/**
 * 校验密钥
 * @param {*} privateKeyPath
 */
const checkPrivateKey = (privateKeyPath) => {
  if (!fs__default['default'].existsSync(privateKeyPath)) {
    logger.error(`${privateKeyPath}密钥文件不存在`)
    process.exit(1)
  }
}

/**
 * 生成并校验版本号
 * @param {*} ver
 */
const generateVersion = (ver) => {
  // 假设分支是v + 版本号
  const version = ver || getGitBranchName().replace('v', '')
  console.log(version, 'version')
  // 校验版本号
  if (!/^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/.test(version)) {
    logger.error(`版本号 ${version} 不符合规范，请检查你的分支名或配置的版本号的格式`)
    process.exit(1)
  }
  return version
}

/**
 * 上传图片
 * 参考https://juejin.cn/post/6947700062461886477
 * @param {*} imagePath  图片地址
 * @returns 服务器图片路径
 */
const uploadImage = async ({ qrcodeOutputDest, uploadImagUrl }) => {
  let qrcodePath = ''
  if (!uploadImagUrl) {
    logger.error('上传图片地址uploadImagUrl未配置')
    return qrcodePath
  }
  loading('上传预览版二维码图片...')
  const form = new FormData__default['default']()
  form.append('contentType', 'image/jpeg')
  form.append(
    'file',
    fs__default['default'].createReadStream(
      path__default['default'].join(__dirname, qrcodeOutputDest)
    )
  )
  try {
    const response = await fetch__default['default'](uploadImagUrl, {
      method: 'POST',
      body: form,
    })
    const res = await response.json()
    qrcodePath = res.code === 200 && res.data
    succeed('上传图片成功')
  } catch (error$1) {
    error(`上传图片失败 :${error$1}`)
  }
  return qrcodePath
}

/**
 * 微信工作流
 */
const wxFlow = async (options) => {
  const {
    isExperience,
    appid,
    type,
    projectPath,
    privateKeyPath,
    desc,
    robot,
    setting,
    qrcodeFormat,
    qrcodeOutputDest,
    uploadImagUrl,
    qrcodeImageUrl,
  } = options
  checkPrivateKey(privateKeyPath)
  // 设定提交的版本
  const version = generateVersion(options.version)
  logger.info(`正在上传${isExperience ? '体验版' : '预览版'}...`)
  try {
    const project = new ci__default['default'].Project({ appid, type, projectPath, privateKeyPath })
    if (isExperience) {
      await ci__default['default'].upload({ project, version, desc, robot, setting })
    } else {
      await ci__default['default'].preview({
        project,
        desc,
        robot,
        setting,
        qrcodeFormat,
        qrcodeOutputDest,
      })
    }
    logger.succeed('上传成功')
  } catch (error) {
    logger.error(`上传失败: ${error}`)
    process.exit(1)
  }
  // 设置二维码图片
  return isExperience ? qrcodeImageUrl : uploadImage({ qrcodeOutputDest, uploadImagUrl })
}

const getGitInfo = () => {
  // 获取feat/fix/refactor 开头的5次提交
  const TIMES = 5
  const commitMsgs = getGitPrevCommitMsg(5)
  const branchName = getGitBranchName()
  return `\n当前分支: **${branchName}**  \n  最近${TIMES}次commit:  \n  ${commitMsgs}`
}

const buildTemplate = (options) => {
  const { weappQRImgUrl, isExperience } = options
  const uploadType = isExperience ? '体验版' : '预览版'
  const gitInfo = getGitInfo()
  const hostName = getHostName()
  const wechatPart =
    weappQRImgUrl &&
    `## 微信${uploadType}${isExperience ? '' : '(有效期半小时)'}：![](${weappQRImgUrl})
    `
  return (
    `# ${uploadType}小程序构建完成\n---\n构建时间: ${formatNowDate('MM-DD HH:mm')}\n` +
    `\n  构建机器：${hostName}  \n` +
    `${gitInfo}  \n---\n ${wechatPart || ''}`
  )
}

/**
 * 推送钉钉消息
 * @param {*} options
 */
const dingFlow = async (options) => {
  const template = buildTemplate(options)
  const { isExperience, dingTalkUrl } = options
  const postBody = {
    msgtype: 'markdown',
    markdown: {
      title: '小程序构建测试已完成',
      text: template,
    },
    at: {
      isAtAll: isExperience,
    },
  }
  loading('正在推送钉钉消息...\n')
  try {
    await fetch__default['default'](dingTalkUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    })
    succeed('推送钉钉消息成功')
  } catch (error$1) {
    error(`推送钉钉消息error ${error$1}`)
  }
}

/**
 * 合并配置文件
 * @returns 合并后的配置
 */
const mergeConfig = () => {
  // 用户配置文件
  // 校验用户配置是否存在
  const isExist = checkFileExist(USER_CONFIG_PATH)
  if (!isExist) {
    logger.error(`配置文件不存在，请在根目录创建配置文件${USER_CONFIG_NAME}`)
    process.exit(1)
  }
  return webpackMerge.merge(require(LOCAL_CONFIG_PATH), require(USER_CONFIG_PATH))
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
  //   step3 上传微信并生成预览
  const weappQRImgUrl = await wxFlow(config)
  // step4 推送钉钉提醒
  Object.assign(config, { weappQRImgUrl })
  dingFlow(config)
}

/**
 * 复制配置文件到执行命令的根目录
 */
const cofyDeployCiFile = () => {
  loading('正在初始化....')

  // 先判断目标目录文件是否存在
  if (checkFileExist(USER_CONFIG_PATH)) {
    warn(`配置文件${USER_CONFIG_NAME}已存在，请按照文档配置！`)
    process.exit(1)
  }

  // 复制文件
  fs__default['default'].copyFile(LOCAL_CONFIG_PATH, USER_CONFIG_PATH, (error) => {
    setTimeout(() => {
      if (error) {
        error('初始化失败')
        process.exit(1)
      }
      succeed(`初始化成功，请检测配置文件${USER_CONFIG_NAME}，并按照文档配置`)
    }, 500)
  })
}

const init = () => {
  cofyDeployCiFile()
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
  .description('发布微信小程序')
  .action(deploy)

program.command('init').description('初始化ci配置文件').action(init)

program.parse(process.argv)
