import { wxToPromise, getInstance } from '../../utils/index'

Page({
  data: {
    /** 触发下拉刷新 */
    refresherTriggered: false,
    url: ''
  },
  async onLoad () {
    // （使用本地路径，避免多次请求网络）
    const [res] = await wxToPromise(wx.getImageInfo, {src: 'https://xiaweiss.oss-cn-beijing.aliyuncs.com/backdrop_img.png'})

    if (res) {
      this.setData({
        url: res.path
      })
    }
  },
  uploadFile () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['mix'],
      success (res) {
        console.log('chooseMedia', res)
      }
    })
  },
  uploadWxFile () {
    wx.chooseMessageFile()
  }
})
