import chalk from 'chalk'
import ora from 'ora'

const spinner = ora()

const loading = (msg) => {
  spinner.text = msg
  spinner.spinner = 'earth'
  spinner.start()
}

const info = (msg) => {
  spinner.stopAndPersist({
    symbol: '🎄 ',
    text: chalk.white(`${msg} [${new Date().toLocaleString()}]\n`),
  })
}

const succeed = (msg) => {
  spinner.stopAndPersist({
    symbol: '✅ ',
    text: chalk.green(`${msg} [${new Date().toLocaleString()}]\n`),
  })
}

const error = (msg) => {
  spinner.stopAndPersist({
    symbol: '❌ ',
    text: chalk.red(`${msg} [${new Date().toLocaleString()}]\n`),
  })
}

const warn = (msg) => {
  spinner.stopAndPersist({
    symbol: '⚠️ ',
    text: chalk.yellow(`${msg} [${new Date().toLocaleString()}]\n`),
  })
}

export { loading, succeed, error, warn, info }
