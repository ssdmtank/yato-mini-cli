import ora from 'ora'
import path from 'path'
import fs from 'fs'
import { merge } from 'webpack-merge'
import { Log, execCmd } from './utils'
import wxFlow from './wxFlow'

const USER_CONFIG_NAME = 'yatoci.config.js'
const LOCAL_CONFIG_NAME = 'base.config.js'

/**
 * 合并配置文件
 * @returns 合并后的配置
 */
const mergeConfig = () => {
  // 用户配置文件
  const targetPath = path.join(process.cwd(), USER_CONFIG_NAME)
  // 校验用户配置是否存在
  const isExist = fs.existsSync(targetPath)

  if (!isExist) {
    Log.error(`配置文件不存在，请在根目录创建配置文件${USER_CONFIG_NAME}`)
    process.exit(1)
  }
  // 本地配置文件
  const localPath = path.resolve(path.join(__dirname, LOCAL_CONFIG_NAME))
  return merge(require(localPath), require(targetPath))
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

export default deploy
