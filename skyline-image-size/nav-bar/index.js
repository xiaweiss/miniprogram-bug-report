const app = getApp()

Component({
  options: {
    virtualHost: true
  },
  properties: {
    position: { type: String, value: 'sticky' },
    title: { type: String, value: '墨问便签' },
    background: { type: String, value: '#f5f6f8' },
  },
  data: {
    /** 点击时间 */
    _time: 0,
    /** 页面滚动容器 */
    _pageScrollview: null,
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
    /** 用户头像 */
    avatarUrl: '',
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
      let rect = null;
      if (wx.getMenuButtonBoundingClientRect) {
        rect = wx.getMenuButtonBoundingClientRect()
      }
      if (rect) {
        const {left, top, bottom, width: capsuleWidth, height: capsuleHeight} = rect

        const systemInfo = app.globalData.systemInfo

        if (systemInfo) {
          const { windowWidth }  = systemInfo
          const navbarHeight = 48;

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
     * 点击头像去个人中心
     */
    onAvatarTap () {
      wx.navigateTo({url: '/pages/people/index'})
    },
    /**
     * 安卓双击返回顶部
     */
    pageScrollToTop () {
    },
    /**
     * 页面后退
     */
    back () {
      wx.navigateBack()
    }
  },
})
