import ora from 'ora'

/**
 * 打包判断
 * @param {*} cmdOpt
 */
const deploy = (cmdOpt) => {
  console.log('de', cmdOpt)
  const spinner = ora('Loading unicorns').start()

  setTimeout(() => {
    spinner.color = 'yellow'
    spinner.text = 'Loading rainbows'
  }, 1000)
  spinner.succeed()
  spinner.fail()
  spinner.warn()
  spinner.info()
}

export default deploy
