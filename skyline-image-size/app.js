/** 全局数据初始值 */
const globalData = {
  apiCategory: 'default',
  authRecord: false,
  authWritePhotosAlbum: false,
  avatarUrl: '',
  hasProfile: false,
  isWeakNet: false,
  keyboardHeight: 0,
  loginCode: '',
  nickName: '',
  safeAreaBottom: 0,
  scene: 0,
  shareTicket: '',
  systemInfo: undefined,
  uuid: '',
  versionTip: false,
  xMoAuthorization: '',
  xMoAuthorizationChecksum: '',
}

App({
  globalData,
  onLaunch() {
    this.getSyetemInfo()
  },

  /**
   * 获取系统信息
   */
  getSyetemInfo () {
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo

    // 修正 Mac 窗口高度，减去导航栏高度
    // if (isMac(this) && systemInfo.windowHeight === systemInfo.screenHeight) {
    //   this.globalData.systemInfo.windowHeight -= 44
    // }

    // mac 不能响应 resize 事件，所以这里先按始终展示滚动条时，最小尺寸设置
    // if (isMac(this)) {
    //   this.globalData.systemInfo.windowWidth = 1009
    //   this.globalData.systemInfo.screenWidth = 1009
    // }

    // 计算底部安全区高度，mac screenHeight 比实际显示的高，这里做个修正
    // windows 2.26.1 开始 screenHeight 和 windowHeight 不同了，需要用 systemInfo.windowHeight - systemInfo.safeArea.bottom
    // this.globalData.safeAreaBottom = isPC(this) ? 0 : systemInfo.screenHeight - systemInfo.safeArea.bottom

    console.log('systemInfo', this.globalData.systemInfo)
  },
})
