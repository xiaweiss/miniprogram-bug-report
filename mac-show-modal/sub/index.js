const app = getApp()

Page({
  data: {

  },
  onLoad() {
    this.modal() 
  },
  onReady () {
    // this.modal()
  },
  modal () {
    wx.showModal({
      title: '提示',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goSub () {
    wx.navigateTo({url: '/sub/index'})
  }
})
