const inquirer = require('inquirer')
const path = require('path')
const targetFile = path.resolve(__dirname, '../package.json')

// 参考https://github1s.com/sindresorhus/np/
;(async () => {
  // 自动化部署 在commit之后执行
  // 选择并生成版本号
  // 发布npm
  // 生成tags
  // 推送tags
  // push 到origin
  // 1、读取version
  const packagejson = require(targetFile)
  const currentVersion = packagejson.version
  const versionArr = currentVersion.split('.')
  const [mainVersion, subVersion, phaseVersion] = versionArr
  console.log('targetFile', currentVersion)

  const prompts = [
    {
      type: 'list',
      name: 'version',
      message: '请选择semver增量或指定新版本',
    },
  ]

  const answers = await inquirer.prompt(prompts)
  console.log('answers', answers)
})().catch((error) => {
  console.error(`\n${error.message}`)
  process.exit(1)
})
