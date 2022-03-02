import chalk from 'chalk'
import ora from 'ora'

const spinner = ora()

const loading = (msg) => {
  spinner.text = msg
  spinner.start()
}

const succeed = (msg) => {
  spinner.succeed(chalk.green(`${msg} ${new Date().toLocaleString()}\n`))
}

const error = (msg) => {
  spinner.fail(chalk.red(`${msg} ${new Date().toLocaleString()}\n`))
}

const warn = (msg) => {
  spinner.warn(chalk.yellow(`${msg} ${new Date().toLocaleString()}\n`))
}

export { loading, succeed, error, warn }
