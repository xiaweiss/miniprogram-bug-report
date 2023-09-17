
// @ts-ignore
import { wxToPromise, isPC, isIOS, emitter, isCustomNavigation } from './utils/index'
import { showModal } from './components/modal/showModal'

interface AppOption extends AppData {
  getSetting: () => void
  getSyetemInfo: () => void
  registerCommand: () => void
  setLaunchShowOption: (option: WechatMiniprogram.App.LaunchShowOption, type: string) => void
  setSetting: () => void
}

/** 全局数据初始值 */
const globalData : AppData['globalData'] = {
  apiCategory: 'default',
  authRecord: false,
  authWritePhotosAlbum: false,
  avatar: null,
  hasProfile: false,
  isWeakNet: false,
  keyboardHeight: 0,
  loginCode: '',
  navBarHeight: 0,
  nickName: '',
  safeAreaBottom: 0,
  scene: 0,
  shareTicket: '',
  systemInfo: undefined,
  uuid: '',
  versionTip: false,
  windowHeight: 0,
  xMoAuthorization: '',
  xMoAuthorizationChecksum: '',
}

/**
 * @see https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html
 */
App<AppOption>({
  globalData,
  async onLaunch() {
    /**
     * 限制频率的接口，必须在这里调用
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
     */
    this.getSyetemInfo()

    this.getSetting()
    this.setSetting()
  },

  /**
   * 注册全局的便利函数
   */
  registerCommand () {
    this.showModal = showModal.bind(this)
  },
  showModal () {},
  /**
   * 获取系统信息
   */
  getSyetemInfo () {
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo

    // 默认浅色主题，只有详情页才可能出现深色主题
    this.globalData.systemInfo.theme = 'light'

    // 计算底部安全区高度
    this.globalData.safeAreaBottom = isPC(this) ? 0 : (systemInfo.screenHeight - systemInfo.safeArea.bottom)

    // 计算导航栏高度（非自定义导航的页面需要通过 isCustomNavigation 自行处理）
    if (!isPC(this) && wx.getMenuButtonBoundingClientRect) {
      const rect = wx.getMenuButtonBoundingClientRect()
      if (rect) {
        const {top, bottom} = rect!
        const navbarHeight = isIOS(this) ? 44 : 48;
        const navbarPaddingTop = (bottom + top) / 2 - navbarHeight / 2
        this.globalData.navBarHeight = navbarHeight + navbarPaddingTop
      }
    }

    // 包含自定义导航栏的窗口高度
    const { navBarHeight } = this.globalData
    const { windowHeight } = systemInfo
    this.globalData.windowHeight = isCustomNavigation(systemInfo, this) ? windowHeight : (windowHeight + navBarHeight)

    console.log('systemInfo', this.globalData.systemInfo)
  },
  /**
   * 检查权限状态
   */
  async getSetting () {
    const [res] = await wxToPromise(wx.getSetting)
    if (res) {
      this.globalData.authRecord = res.authSetting['scope.record']!
      this.globalData.authWritePhotosAlbum = res.authSetting['scope.writePhotosAlbum']!
    }
  },
  /**
   * 设置小程序配置
   */
  async setSetting () {
    // 转发设置，重置分享参数
    wx.updateShareMenu({
      withShareTicket: false,
      isPrivateMessage: false
    })

    // 弱网状态
    wx.onNetworkWeakChange && wx.onNetworkWeakChange((res) => {
      this.globalData.isWeakNet = res.weakNet
    })

    // 需要用户同意隐私授权时
    if (wx.onNeedPrivacyAuthorization)
    wx.onNeedPrivacyAuthorization(async (resolve) => {
      const [res] = await wxToPromise(showModal, {
        title: '个人信息保护提示',
        privacy: true,
      })
      if (res?.confirm) {
        resolve({ buttonId: 'modal-confirm', event: 'agree' })
      } else if (res?.cancel) {
        resolve({ buttonId: 'modal-cancel', event: 'disagree' })
      }
    })

    // 键盘高度变化事件
    wx.onKeyboardHeightChange((res) => {
      this.globalData.keyboardHeight = res.height
      wx.showToast({
        title: `键盘高度变化：${res.height}`,
        icon: 'none'
      })
      emitter.emit('keyboardHeightChange', res)
    })

    // 窗口尺寸变化事件（微信 bug： mac 客户端 <= 3.7.0 版本不能触发）
    wx.onWindowResize((res) => {
      if (!res.size || !this.globalData.systemInfo) return

      const { windowHeight, windowWidth } = res.size
      const { navBarHeight } = this.globalData

      /**
       * 窗口尺寸没有变化，页面跳转、返回时 wx.onWindowResize 也会多触发
       * @see https://github.com/xiaweiss/miniprogram-bug-report/issues/28
       * @hack 数据相同时，不触发事件
       */
      if (
        this.globalData.systemInfo.windowHeight === windowHeight &&
        this.globalData.systemInfo.windowWidth === windowWidth
      ) return

      this.globalData.systemInfo.windowHeight = windowHeight
      this.globalData.systemInfo.windowWidth = windowWidth

      const { systemInfo } = this.globalData
      // 包含自定义导航栏的窗口高度
      this.globalData.windowHeight = isCustomNavigation(systemInfo, this) ?  windowHeight : (windowHeight + navBarHeight)

      // 事件触发器，去广播给页面
      emitter.emit('windowResize')
    })
  },
  /**
   * 设置启动参数
   */
  setLaunchShowOption (option, type) {
    console.log(type, 'option', option)

    // 重定向到首页
    if (option.query?.redirect === 'home') {
      wx.reLaunch({url: '/pages/home/index'})
    }

    this.globalData.scene = option.scene
    console.log(type, 'scene', option.scene)

    // @ts-ignore
    this.globalData.apiCategory = option.apiCategory

    this.globalData.shareTicket = option.shareTicket || ''
    console.log(type, 'shareTicket', option.shareTicket)

  }
})
