/**
 * 授权保存到相册
 */
export const authWritePhotosAlbum = () => {
  const app = getApp<AppData>()

  return new Promise<void>((resolve, reject) => {
    // 当前运行时中获取
    if (app.globalData.authWritePhotosAlbum) {
      resolve()
      return
    }

    // 本地缓存中获取
    const writePhotosAlbum = wx.getStorageSync<Storage.authWritePhotosAlbum>('authWritePhotosAlbum')
    if (writePhotosAlbum) {
      if (writePhotosAlbum.auth) {
        app.globalData.authWritePhotosAlbum = true
        resolve()
        return
      }
    }

    // 请求授权
    // 请求授权 - 已经发起过授权
    if (
      app.globalData.authWritePhotosAlbum === false ||
      writePhotosAlbum?.auth === false
    ) {
      app.showModal({
        title: '请允许保存图片到你的相册',
        success (res) {
          if (res.confirm) {
            wx.openSetting({
              success: res => {
                const auth = res.authSetting['scope.writePhotosAlbum'] || false

                app.globalData.authWritePhotosAlbum = auth
                wx.setStorageSync<Storage.authWritePhotosAlbum>('authWritePhotosAlbum', {
                  auth,
                  time: Date.now()
                })

                if (auth) {
                  resolve()
                } else {
                  wx.showToast({
                    icon: 'error',
                    title: '存图片授权失败',
                  })
                  setTimeout(reject, 1500)
                }
              },
              fail () {
                reject()
              }
            })
          } else if (res.cancel) {
            reject()
          }
        }
      })
    // 请求授权 - 从未发起授权
    } else {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success () {
          const auth = true
          app.globalData.authWritePhotosAlbum = auth
          wx.setStorageSync<Storage.authWritePhotosAlbum>('authWritePhotosAlbum', {
            auth,
            time: Date.now()
          })
          resolve()
        },
        fail (res) {
          if (res.errMsg.match('auth deny')) {
            const auth = false
            app.globalData.authWritePhotosAlbum = auth
            wx.setStorageSync<Storage.authWritePhotosAlbum>('authWritePhotosAlbum', {
              auth,
              time: Date.now()
            })
          }

          wx.showToast({
            icon: 'error',
            title: '存图片授权失败',
          })
          setTimeout(reject, 1500)
        }
      })
    }
  })
}
