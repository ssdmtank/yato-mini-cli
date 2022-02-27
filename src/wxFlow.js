import fs from 'fs'
import path from 'path'
import ci from 'miniprogram-ci'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { getGitBranchName, Log } from './utils'

/**
 * 校验密钥
 * @param {*} privateKeyPath
 */
const checkPrivateKey = (privateKeyPath) => {
  if (fs.existsSync()) {
    Log.error(`${privateKeyPath}密钥文件不存在`)
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
  // 校验版本号
  if (!/^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/.test(version)) {
    Log.error(`版本号 ${version} 不符合规范，请检查你的分支名或配置的版本号的格式`)
    process.exit(1)
  }
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
    Log.error('上传图片地址uploadImagUrl未配置')
    return qrcodePath
  }
  Log.loading('上传预览版二维码图片...')
  const form = new FormData()
  form.append('contentType', 'image/jpeg')
  form.append('file', fs.createReadStream(path.join(__dirname, qrcodeOutputDest)))
  try {
    const response = await fetch(uploadImagUrl, {
      method: 'POST',
      body: form,
    })
    const res = await response.json()
    qrcodePath = res.code === 200 && res.data
    Log.succeed('上传图片成功')
  } catch (error) {
    Log.error(`上传图片失败 :${error}`)
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
  Log.loading(`正在上传${isExperience ? '体验版' : '预览版'}...`)
  try {
    const project = new ci.Project({ appid, type, projectPath, privateKeyPath })
    if (isExperience) {
      await ci.upload({ project, version, desc, robot, setting })
    } else {
      await ci.preview({ project, desc, robot, setting, qrcodeFormat, qrcodeOutputDest })
    }
    Log.succeed('上传成功')
  } catch (error) {
    Log.error(`上传失败: ${error}`)
    process.exit(1)
  }
  // 设置二维码图片
  return isExperience ? qrcodeImageUrl : uploadImage({ qrcodeOutputDest, uploadImagUrl })
}

export default wxFlow
