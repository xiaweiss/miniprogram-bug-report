import { isIOS, isPC } from '../../utils/index'

const app = getApp<AppData>()

Component({
  options: {
    virtualHost: true
  },
  properties: {
    position: { type: String, value: 'relative' },
    title: { type: String, value: '墨问便签' },
    background: { type: String, value: 'transparent' },
    zIndex: { type: Number, value: 0 },
  },
  data: {
    /** 胶囊高度 */
    capsuleHeight: 26,
    /** 胶囊宽度 */
    capsuleWidth: 83,
    /** 是否桌面端 */
    isPC: false,
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
      this.calcStyle()
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]

      this.setData({
        isBack: pages.length > 1,
        isHome: page.route === 'pages/home/index'
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

          if (!isPC()) {
            app.globalData.systemInfo!.windowHeight = systemInfo.screenHeight - navbarHeight - navbarPaddingTop
          }

          this.setData({
            avatar: app.globalData.avatar,
            capsuleHeight,
            capsuleWidth,
            isPC: isPC(),
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
