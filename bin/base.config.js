module.exports = {
  /** 自定义的配置 */
  // 是否是体验版
  isExperience: true,
  // 微信体验版图片地址
  qrcodeImageUrl: 'https://xxxcdn.con/image/weapp-exp-qrcode.jpg',
  // 钉钉机器人 webhook url
  dingTalkUrl: 'https://oapi.dingtalk.com/robot/send?access_token=xxx',
  uploadImagUrl: '', // 上传二维码图片的url
  preCommand: [], // 预执行命令 [{ command, args, desc}, ...]
  /** 小程序的官方配置 */
  appid: '',
  projectPath: 'dist', // 小程序生成目录
  privateKeyPath: '', // 私钥路径
  type: 'miniProgram', // 项目的类型
  desc: 'auto-upload', // 小程序自定义备注
  // 编译设置
  setting: {
    // 对应于微信开发者工具的 "es6 转 es5"
    es6: true,
    // 对应于微信开发者工具的 "增强编译"
    es7: false,
    // 上传时压缩 JS 代码
    minifyJS: false,
    // 上传时压缩 WXML 代码
    minifyWXML: false,
    // 上传时压缩 WXSS 代码
    minifyWXSS: false,
    // 上传时压缩所有代码，对应于微信开发者工具的 "上传时压缩代码"
    minify: true,
    // 对应于微信开发者工具的 "上传时进行代码保护"
    codeProtect: false,
    // 对应于微信开发者工具的 "上传时样式自动补全"
    autoPrefixWXSS: false,
  },
  robot: 1, // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
  version: '', // 自定义版本号
  qrcodeFormat: 'image', // 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用
  qrcodeOutputDest: 'wechat-preview.jpg', // 二维码文件保存路径
}
