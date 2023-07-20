Page({
  data: {
    /** 触发下拉刷新 */
    refresherTriggered: false,
  },
  onTap () {
    console.log('onTap')
    wx.showToast({
      title: 'onTap',
    })
  },
  onLongPress () {
    console.log('onLongPress')
    wx.showToast({
      title: 'onLongPress',
    })
  }
})
