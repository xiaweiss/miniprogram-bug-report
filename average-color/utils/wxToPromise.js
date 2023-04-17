/**
 * 微信 api 转为 promise
 */
function wxToPromise (api, option) {
  // API 存在判断
  if (!api) {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
    return Promise.reject()
  }

  return new Promise((resolve) => {
    api({
      ...option,
      success (res) {
        resolve([res, undefined])
      },
      fail (err) {
        // wxErrTip(err) // 错误提示
        resolve([undefined, err])
      },
    })
  })
}

export {
  wxToPromise
}
