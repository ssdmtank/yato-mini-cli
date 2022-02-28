import ora from 'ora'
import spawn from 'cross-spawn'
import os from 'os'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

/**
 * 日志工具
 */
export const Log = {
  // Log唯一的实例
  instance: ora(),
  loading(msg) {
    this.instance = ora(msg).start()
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
export const execCmd = ({ command, args, needResp, desc }) => {
  Log.loading(`正在${desc}\n`)
  const data = spawn.sync(command, args, {
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

/**
 * @returns git分支名称
 */
export const getGitBranchName = () => {
  const data = execCmd({
    command: 'git',
    args: ['rev-parse', '--abbrev-ref', 'HEAD'],
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
      '--pretty=format:"* %s (@%cn #DATE<%cd>)"',
    ],
    needResp: true,
    desc: '获取git提交记录',
  })
  const message = data.stdout.toString().trim()
  message.replace(/#DATE<([^>]+)>/gi, (_, p1) => {
    return new dayjs(p1).fromNow()
  })
  return message
}

export const getHostName = () => os.hostname()

export const formatNowDate = (dateFormat) => new dayjs().format(dateFormat)
