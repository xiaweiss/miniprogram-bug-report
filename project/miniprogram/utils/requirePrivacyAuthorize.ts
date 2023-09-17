import { wxToPromise } from './wxToPromise'

/**
 * 请求隐私授权
 * @return 是否已授权
 */
export const requirePrivacyAuthorize = async () => {
  if (typeof wx.requirePrivacyAuthorize === 'function') {
    const [res] = await wxToPromise(wx.requirePrivacyAuthorize)
    if (res) return true

  // < 2.33.2 基础库，无 api 默认已授权
  } else {
    return true
  }

  return false
}

