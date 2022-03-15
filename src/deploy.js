import { merge } from 'webpack-merge'
import {
  checkFileExist,
  execCmd,
  logger,
  USER_CONFIG_PATH,
  LOCAL_CONFIG_PATH,
  USER_CONFIG_NAME,
} from './utils'
import wxFlow from './wxFlow'
import dingFlow from './dingFlow'

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
  return merge(require(LOCAL_CONFIG_PATH), require(USER_CONFIG_PATH))
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

export default deploy
