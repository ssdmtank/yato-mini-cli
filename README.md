<div align="center">
  <h1>yato-mini-cli</h1>
  <p>微信小程序自动构建部署脚手架</p>
  <a href="https://github.com/ssdmtank/yato-mini-cli">
    <img src="https://img.shields.io/badge/node-%3E%3D12-brightgreen">
  </a>
  <a href="https://github.com/ssdmtank/yato-mini-cli">
    <img src="https://img.shields.io/badge/npm-v0.0.1-blue">
  </a>
  <a href="https://github.com/ssdmtank/yato-mini-cli">
    <img src="https://img.shields.io/badge/lincense-MIT-green">
  </a>
</div>

---

> YATO, 夜斗，八百万众神最末端的无名神

* yato-mini-cli是基于minprogram-ci集成的微信小程序一键部署脚手架
* 项目模板来自[commitlint-template](https://github.com/ssdmtank/commitlint-template)

- [X] rollup打包
- [X] eslint + prettier + lint-staged 项目规范化
- [X] commitlint + commitizen 提交校验
- [X] 打包上传微信，支持体验版/预览版
- [X] 支持发布钉钉提醒
- [X] 支持打包前自定义命令
- [X] 支持版本号自定义/同步分支版本号
- [ ] 脚手架命令配置
- [ ] 区分环境
- [ ] 支持esm


## cli工具安装
```bash
# 使用 npm 安装 CLI
$ npm install -g yato-mini-cli

# OR 使用 yarn 安装 CLI
$ yarn global add yato-mini-cli

```

## 项目初始化 TODO
## 环境配置 TODO

## 配置文件
yatoci.config.js
```js
module.exports = {
  // 是否是体验版
  isExperience: true,
  appid: '',
  // 私钥路径
  privateKeyPath: '',
  // 上传二维码图片的url
  uploadImagUrl: '',
  // 微信体验版图片地址
  qrcodeImageUrl: '',
  // 钉钉机器人 webhook url
  dingTalkUrl: '',
  // 预执行命令 [{ command, args, desc}, ...]
  preCommand: [],
}


```

## 使用
```bash
# 发布小程序项目
yato-mini-cli deploy
```


```bash
# 调试
yarn dev

```

其他参考[小程序实现ci - Taro微信小程序自动化部署](!https://juejin.cn/post/7069070842499432479)