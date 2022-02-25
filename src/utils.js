import ora from 'ora'

/**
 * 日志工具
 */
export const Log = {
  info(msg) {
    ora().info(msg)
  },
  warn(msg) {
    ora().warn(msg)
  },
  error(msg) {
    ora().fail(msg)
  },
}
