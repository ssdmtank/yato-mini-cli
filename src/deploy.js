import ora from 'ora'
import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { merge } from 'webpack-merge'
import { Log } from './utils'

const CONFIG_FILE_NAME = 'yatoci.config.js'
const UPLOAD_FILE_REQUEST_URL = 'https://bms.hanyuan.vip/hy-thirdpart/common/upload/file'

/**
 * 合并配置文件
 * @returns 合并后的配置
 */
const mergeConfig = () => {
  // 用户配置文件
  const targetPath = path.join(process.cwd(), CONFIG_FILE_NAME)
  // 校验用户配置是否存在
  const isExist = fs.existsSync(targetPath)

  if (!isExist) {
    Log.error('配置文件不存在，请在根目录创建配置文件yatoci.config.js')
    process.exit(1)
  }
  // 本地配置文件
  const localPath = path.resolve(path.join(__dirname, CONFIG_FILE_NAME))
  return merge(require(targetPath), require(localPath))
}

/**
 * 上传图片
 * 参考https://juejin.cn/post/6947700062461886477
 * @param {*} imagePath  图片地址
 * @returns 服务器图片路径
 */
const uploadImage = async (imagePath) => {
  const form = new FormData()
  form.append('contentType', 'image/jpeg')
  //   path.join(__dirname, 'qrcode.jpeg')
  form.append('file', fs.createReadStream(imagePath))
  const response = await fetch(UPLOAD_FILE_REQUEST_URL, {
    method: 'POST',
    body: form,
  })
  const res = await response.json()
  return res.code === 200 && res.data
}

/**
 * 打包判断
 * @param {*} cmdOpt
 */
const deploy = async (cmdOpt) => {
  // 读取配置文件
  const config = mergeConfig()
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

export default deploy
