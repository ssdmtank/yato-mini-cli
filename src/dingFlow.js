import { formatNowDate, getGitBranchName, getGitPrevCommitMsg, getHostName } from './utils'
import * as spinner from './spinner'
import fetch from 'node-fetch'

const getGitInfo = () => {
  // 获取feat/fix/refactor 开头的5次提交
  const TIMES = 5
  const commitMsgs = getGitPrevCommitMsg(5)
  const branchName = getGitBranchName()
  return `\n当前分支: **${branchName}**  \n  最近${TIMES}次commit:  \n  ${commitMsgs}`
}

const buildTemplate = (options) => {
  const { weappQRImgUrl, isExperience } = options
  const uploadType = isExperience ? '体验版' : '预览版'
  const gitInfo = getGitInfo()
  const hostName = getHostName()
  const wechatPart =
    weappQRImgUrl &&
    `## 微信${uploadType}${isExperience ? '' : '(有效期半小时)'}：![](${weappQRImgUrl})
    `
  return (
    `# ${uploadType}小程序构建完成\n---\n构建时间: ${formatNowDate('MM-DD HH:mm')}\n` +
    `\n  构建机器：${hostName}  \n` +
    `${gitInfo}  \n---\n ${wechatPart || ''}`
  )
}

/**
 * 推送钉钉消息
 * @param {*} options
 */
const dingFlow = async (options) => {
  const template = buildTemplate(options)
  const { isExperience, dingTalkUrl } = options
  const postBody = {
    msgtype: 'markdown',
    markdown: {
      title: '小程序构建测试已完成',
      text: template,
    },
    at: {
      isAtAll: isExperience,
    },
  }
  spinner.loading('正在推送钉钉消息...\n')
  try {
    await fetch(dingTalkUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    })
    spinner.succeed('推送钉钉消息成功')
  } catch (error) {
    spinner.error(`推送钉钉消息error ${error}`)
  }
}

export default dingFlow
