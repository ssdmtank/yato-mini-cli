import spawn from 'cross-spawn'
import os from 'os'
import fs from 'fs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import chalk from 'chalk'
import path from 'path'
import * as spinner from './spinner'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export const USER_CONFIG_NAME = 'yatoci.config.js'
export const LOCAL_CONFIG_NAME = 'base.config.js'
export const LOCAL_CONFIG_PATH = path.resolve(path.join(__dirname, LOCAL_CONFIG_NAME))
export const USER_CONFIG_PATH = path.join(process.cwd(), USER_CONFIG_NAME)

const CONSOLE = console

export const logger = {
  log: (msg) => CONSOLE.log(msg),
  info: (msg) => CONSOLE.log('ℹ️ ', chalk.blue(msg)),
  error: (msg) => CONSOLE.error('❌ ', chalk.red(msg), `${new Date().toLocaleString()}\n`),
  warn: (msg) => CONSOLE.warn('⚠️ ', chalk.yellow(msg)),
  succeed: (msg) => CONSOLE.log('✅ ', chalk.green(msg), `${new Date().toLocaleString()}\n`),
}

/** 本地的配置文件路径 */
export const localConfigPath = () => path.resolve(path.join(__dirname, LOCAL_CONFIG_NAME))

/** 用户的配置文件路径 */
export const userConfigPath = () => path.join(process.cwd(), USER_CONFIG_NAME)

/** 校验文件是否存在 */
export const checkFileExist = (path) => fs.existsSync(path)

/**
 * 执行脚本
 * @param { string } opt.command 主指令
 * @param { Array} opt.args 参数数组
 * @param { Boolean } opt.needResp 是否需要在当前进程输出
 * @param { string } opt.desc 脚本简要
 */
export const execCmd = ({ command, args, needResp, desc }) => {
  spinner.loading(`正在${desc}\n`)
  const data = spawn.sync(command, args, {
    // 是否需要在当前进程输出
    stdio: needResp ? 'pipe' : 'inherit',
    cwd: process.cwd(),
  })

  if (data.status !== 0) {
    spinner.error(`执行命令${command}异常`)
    // eslint-disable-next-line no-console
    console.error(data.error)
    process.exit(1)
  }
  spinner.succeed(`${desc}成功`)
  return data
}

/**
 * @returns git分支名称
 */
export const getGitBranchName = () => {
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
export const getGitPrevCommitMsg = (times = 5) => {
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
    return new dayjs(p1).fromNow()
  })
}

export const getHostName = () => os.hostname()

export const formatNowDate = (dateFormat) => new dayjs().format(dateFormat)
