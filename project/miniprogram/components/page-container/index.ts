import { isSkyline, isCustomNavigation } from '../../utils/index'

const app = getApp<AppData>()

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true
  },
  properties: {
    /** 是否显示容器组件 */
    show: Boolean,
    /** 动画时长，单位毫秒 */
    duration: { type: Number, value: 300 },
    /** z-index 层级 */
    zIndex: { type: Number, value: 1000 },
    /** 弹出位置，可选值为 bottom center */
    position: { type: String, value: 'bottom' },
    /** 是否显示遮罩层 */
    overlay: { type: Boolean, value: true },
    /** 点击遮罩层是否可以关闭 */
    overlayClose: { type: Boolean, value: true },
    /** 自定义遮罩层样式 */
    overlayStyle: { type: String, value: '' },
    /** 自定义弹出层样式 */
    customStyle: { type: String, value: '' },
    /** 系统主题 light、dark */
    theme: { type: String, value: 'light' },
    /** 是否使用最大高度 */
    useMaxHeight: Boolean
  },
  data: {
    _inited: false,
    isSkyline: false,
    navBarHeight: 0,
    /** 组件是否展示 */
    isShow: false,
    /** 进入 */
    enter: false,
    /** 离开 */
    leave: false,
    /** 正在展示 */
    showing: false,
  },
  observers: {
    'show' (show) {
      if (!this.data._inited) return
      if (show) {
        this.setData({ isShow: true })
      } else {
        this.close()
      }
    },
    'isShow' (isShow) {
      if (isShow) {
        wx.nextTick(() => {
          this.setData({ showing: true })
        })
      }
    }
  },
  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      this.setData({
        isSkyline: isSkyline(),
        navBarHeight: isCustomNavigation(systemInfo, app) ? app.globalData.navBarHeight : 0,
      })
    },
    ready () {
      // 小程序启动时，页面加载好之后再弹出，以便显示动画
      this.data._inited = true
      if (this.properties.show) {
        this.setData({ isShow: true })
      }
    }
  },
  methods: {
    noop () {},
    close () {
      this.setData({ showing: false })
    },
    onTransitionEnd () {
      if (this.data.isShow !== this.data.showing) {
        this.setData({
          isShow: this.data.showing
        })
        if (!this.data.isShow) {
          this.triggerEvent('afterleave')
        }
      }
    }
  }
})
