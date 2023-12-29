import { isIOS, isPC, isWxwork, isMac } from '../../utils/index'

const app = getApp<AppData>()

Component({
  options: {
    virtualHost: true
  },
  properties: {
    position: { type: String, value: 'relative' },
    /** 标题 */
    title: { type: String, value: '墨问便签' },
    /** 背景颜色 */
    background: { type: String, value: 'transparent' },
    /** 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 */
    frontColor: { type: String, value: '#000000' },
    zIndex: { type: Number, value: 0 },
  },
  data: {
    /** 胶囊高度 */
    capsuleHeight: 26,
    /** 胶囊宽度 */
    capsuleWidth: 83,
    /** 是否桌面端 */
    isPC: isPC(),
    /** 是否企业微信 */
    isWxwork: isWxwork(),
    /** 是否 mac */
    isMac: isMac(),
    /** 是否显示后退按钮 */
    isBack: false,
    /** 是否首页 */
    isHome: false,
    /** 导航栏高度 */
    navbarHeight: 44,
    /** 导航栏上边距 */
    navbarPaddingTop: 0,
    /** 导航栏右侧小程序胶囊按钮宽度 */
    navbarPaddingRight: 95,
  },
  lifetimes: {
    attached() {
      const { frontColor, background } = this.properties
      if (!this.data.isPC && frontColor === '#ffffff') {
        wx.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: background})
      }

      this.calcStyle()
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const isHome = page.route === 'pages/home/index' ||
                     page.route === 'pages/wechatUpdate/index'

      if (isHome) wx.hideHomeButton()

      this.setData({
        isBack: pages.length > 1,
        isHome
      })
    },
  },
  methods: {
    /**
     * 计算样式
     */
    calcStyle () {
      // 场景值为1177（视频号直播间）和1175 （视频号profile页）时，小程序禁用了 wx.getMenuButtonBoundingClientRect
      let rect: WechatMiniprogram.ClientRect | null = null;
      if (wx.getMenuButtonBoundingClientRect) {
        rect = wx.getMenuButtonBoundingClientRect()
      }
      if (rect) {
        const {left, top, bottom, width: capsuleWidth, height: capsuleHeight} = rect!

        const systemInfo = app.globalData.systemInfo

        if (systemInfo) {
          const { windowWidth }  = systemInfo
          const navbarHeight = isIOS(app) ? 44 : 48;

          const navbarPaddingTop = (bottom + top) / 2 - navbarHeight / 2
          const navbarPaddingRight = windowWidth - left

          this.setData({
            capsuleHeight,
            capsuleWidth,
            navbarHeight,
            navbarPaddingRight,
            navbarPaddingTop,
          })
        }
      }
    },
    /**
     * 页面后退
     */
    back () {
      wx.navigateBack()
    },
    /**
     * 回到首页
     */
    home () {
      wx.reLaunch({url: '/pages/home/index'})
    }
  },
})
