const { Command } = require('commander')
import packageJson from '../package.json'
import deploy from './deploy'
import init from './init'

const program = new Command()
program
  .version(packageJson.version, '-v, --version', '输出当前版本号')
  .helpOption('-h, --help', '查看帮助信息')

program
  .command('deploy')
  .option('--env [value]', '环境类型release/prod/pre')
  .option('--ver [value]', '发布版本号')
  .option('--desc [value]', '发布简介')
  .description('发布微信小程序')
  .action(deploy)

program.command('init').description('初始化ci配置文件').action(init)

program.parse(process.argv)
