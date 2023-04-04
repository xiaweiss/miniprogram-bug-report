const app = getApp()

/**
 * 程序停止一段时间
 * @param ms 停止的毫秒数
 * @returns
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Page({
  data: {
    _refreshStartTime: 0,
    refreshing: false,
    list: new Array(100).fill(0).map((_, index) => index),
  },
  async onPullDownRefresh () {
    console.log('onPullDownRefresh')
    this.data._refreshStartTime = Date.now()
    this.setData({
      refreshing: true
    })
    await sleep(100)
    this.stopPullDownRefresh()
  },
  onReachBottom () {
    console.log('onReachBottom')
  },
  async stopPullDownRefresh () {
    if (Date.now() - this.data._refreshStartTime < 500) {
      await sleep(200)
      await this.stopPullDownRefresh()
    } else {
      console.log('refreshing false')
      this.setData({
        refreshing: false,
      })
    }
  },
})
