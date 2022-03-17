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

  // 处理版本号选项
  const generateVersion = () => {
    const versionArr = currentVersion.split('.')
    let [mainVersion, subVersion, phaseVersion] = versionArr
    let [patchVersion, releaseVersion] = phaseVersion.split('-')

    mainVersion = Number(mainVersion)
    subVersion = Number(subVersion)
    patchVersion = Number(patchVersion)
    releaseVersion = Number(releaseVersion)

    // - 如果没有预发布号：直接升级小号，去掉预发布号
    // - 如果有预发布号：去掉预发布号，其他不动
    const patchVer = `${mainVersion}.${subVersion}.${
      releaseVersion ? patchVersion : patchVersion + 1
    }`
    // - 如果没有预发布号，则升级一位中号，大号不动，小号置为空
    // - 如果有预发布号:
    // -- 如果小号为0，则不升级中号，将预发布号去掉
    // -- 如果小号不为0，同理没有预发布号
    const minorVersion = `${mainVersion}.${releaseVersion ? subVersion : subVersion + 1}.${
      releaseVersion ? patchVersion : 0
    }`
    // - 如果没有预发布号，则直接升级一位大号，其他位都置为0
    // - 如果有预发布号：
    // -- 中号和小号都为0，则不升级大号，而将预发布号删掉。即2.0.0-1变成2.0.0，这就是预发布的作用
    // -- 如果中号和小号有任意一个不是0，那边会升级一位大号，其他位都置为0，清空预发布号。即 2.0.1-0变成3.0.0
    const majorVersion = releaseVersion
      ? subVersion !== 0 && patchVersion !== 0
        ? `${mainVersion}.${subVersion}.${patchVersion}`
        : `${mainVersion + 1}.0.0`
      : `${mainVersion + 1}.0.0`
    // - 直接升级小号，增加预发布号为0
    const prepatchVersion = `${mainVersion}.${subVersion}.${patchVersion + 1}-0`
    // - 直接升级中号，小号置为0，增加预发布号为0
    const preminorVersion = `${mainVersion}.${subVersion + 1}.0-0`
    // - 直接升级大号，中号和小号置为0，增加预发布号为0
    const premajorVersion = `${mainVersion + 1}.0.0-0`
    // - 如果没有预发布号：增加小号，增加预发布号为0
    // - 如果有预发布号，则升级预发布号
    const prereleaseVersion = `${mainVersion}.${subVersion}.${
      releaseVersion ? patchVersion : patchVersion + 1
    }-${releaseVersion ? releaseVersion + 1 : 0}`
    return [
      { name: `patch        ${patchVer}`, value: patchVer },
      { name: `minor        ${minorVersion}`, value: minorVersion },
      { name: `major        ${majorVersion}`, value: majorVersion },
      { name: `prepatch     ${prepatchVersion}`, value: prepatchVersion },
      { name: `preminor     ${preminorVersion}`, value: preminorVersion },
      { name: `preminor     ${premajorVersion}`, value: premajorVersion },
      { name: `prerelease   ${prereleaseVersion}`, value: prereleaseVersion },
    ]
  }

  const versionChoice = generateVersion()

  const prompts = [
    {
      type: 'list',
      name: 'version',
      message: '请选择semver增量或指定新版本',
      pageSize: versionChoice.length + 2,
      choices: versionChoice.concat([
        new inquirer.Separator(),
        {
          name: '其他（自定义）',
          value: '',
        },
      ]),
    },
  ]

  const answers = await inquirer.prompt(prompts)
  console.log('answers', answers)
})().catch((error) => {
  console.error(`\n${error.message}`)
  process.exit(1)
})
