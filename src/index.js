const { Command } = require('commander')
import packageJson from '../package.json'
import deploy from './deploy'

const program = new Command()
program
  .version(packageJson.version, '-v, --version', '输出当前版本号')
  .helpOption('-h, --help', '查看帮助信息')

program
  .command('deploy')
  .option('--env [value]', '环境类型')
  .option('--ver [value]', '发布版本号')
  .option('--desc [value]', '发布简介')
  .description('发布小程序')
  .action(function (cmdOpt) {
    deploy(cmdOpt)
  })

program.parse(process.argv)
