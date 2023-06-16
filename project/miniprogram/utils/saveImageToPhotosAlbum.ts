import { authWritePhotosAlbum } from './authWritePhotosAlbum'
import { wxToPromise } from './wxToPromise'
import { isPC } from './isPC'

interface SaveImageToPhotosAlbumParam {
  /** 文件本地路径（优先级高） */
  filePath?: string
  /** 文件 url */
  url?: string
}

/**
 * 保存图片到相册
 */
export const saveImageToPhotosAlbum = async (param : SaveImageToPhotosAlbumParam) => {
  let filePath= ''

  // 保存图片到相册授权
  await authWritePhotosAlbum()

  if (param.filePath && typeof param.filePath === 'string') {
    filePath = param.filePath

  } else if (param.url) {
    const [res] = await wxToPromise(wx.downloadFile, {url: param.url})
    if (res) filePath = res.tempFilePath
  }

  if (filePath) {
    if (isPC() && false) {
      wx.saveFileToDisk({
        filePath,
        success: () => {
          wx.showToast({
            icon: 'success',
            title: '已保存'
          })
        }
      })
    } else {
      wx.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          wx.showToast({
            icon: 'success',
            title: '已保存111'
          })
        },
        fail: async (res) => {
          // 报错授权失败时，重新授权
          if (res.errMsg.match('auth deny')) {
            const app = getApp<AppData>()
            app.globalData.authWritePhotosAlbum = false
            wx.setStorageSync<Storage.authWritePhotosAlbum>('authWritePhotosAlbum', {auth: false})

            await authWritePhotosAlbum()
          } else if (res.errMsg.match('fail cancel')) {
            wx.showToast({
              icon: 'none',
              title: '已取消'
            })
          } else {
            wx.showToast({
              icon: 'error',
              title: '保存失败'
            })
          }
        }
      })
    }
  }
}

