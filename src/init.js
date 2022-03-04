import fs from 'fs'
import { loading, succeed, warn, error } from './spinner'
import { checkFileExist, USER_CONFIG_PATH, LOCAL_CONFIG_PATH, USER_CONFIG_NAME } from './utils'

/**
 * 复制配置文件到执行命令的根目录
 */
const cofyDeployCiFile = () => {
  loading('正在初始化....')

  // 先判断目标目录文件是否存在
  if (checkFileExist(USER_CONFIG_PATH)) {
    warn(`配置文件${USER_CONFIG_NAME}已存在，请按照文档配置！`)
    process.exit(1)
  }

  // 复制文件
  fs.copyFile(LOCAL_CONFIG_PATH, USER_CONFIG_PATH, (error) => {
    setTimeout(() => {
      if (error) {
        error('初始化失败')
        process.exit(1)
      }
      succeed(`初始化成功，请检测配置文件${USER_CONFIG_NAME}，并按照文档配置`)
    }, 500)
  })
}

const init = () => {
  cofyDeployCiFile()
}

export default init
