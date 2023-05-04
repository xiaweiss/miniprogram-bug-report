import { emitter, getPage, isSkyline, sleep } from '../../utils/index'

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
    multipleSlots: true
  },
  properties: {
    background: { type: String, value: '#fff' },
    loaded: { type: Boolean, value: true },
    lowerThreshold: { type: Number, value: 50 },
    navigationBarBackgroundColor: { type: String, value: 'transparent' },
    navigationBarTitleText: { type: String, value: '墨问便签' },
    refresherEnabled: { type: Boolean, value: false },
    refresherTriggered: { type: Boolean, value: false },
    scrollTop: { type: Number, value: 0 },
    supportSticky: { type: Boolean, value: false },
  },
  data: {
    /** 是否需要下拉刷新 */
    _needPullDownRefresh: false,
    /** 页面是否展示 */
    _isPageShow: true,
    /** 下拉刷新的开始时间 */
    _refreshStartTime: 0,
    /** 触发下拉刷新 */
    pageRefresherTriggered: false,
    /** 是否 skyline 模式 */
    isSkyline: false
  },
  observers: {
    /** 监听触发下拉刷新 */
    'refresherTriggered' (refresherTriggered: boolean) {
      console.log('page refresherTriggered')
      if (refresherTriggered) {
        if (this.data._isPageShow) {
          this.startPullDownRefresh()

        // 只有页面展示时, 才可以下拉刷新
        } else {
          this.data._needPullDownRefresh = true
        }
      } else {
        this.stopPullDownRefresh()
      }
    },
    /** 监听设置滚动位置 */
    "scrollTop" (scrollTop) {
      this.setData({pageScrollTop: scrollTop})
    }
  },
  pageLifetimes: {
    show () {
      console.log('page show')
      this.data._isPageShow = true

      if (this.data._needPullDownRefresh) {
        this.data._needPullDownRefresh = false
        this.startPullDownRefresh()
      }
    },
    hide () {
      this.data._isPageShow = false
    }
  },
  lifetimes: {
    attached () {
      this.setData({
        isSkyline: isSkyline()
      })
    }
  },
  methods: {
    onPullDownRefresh () {
      this.data._refreshStartTime = Date.now()
      getPage().onPullDownRefresh()
    },
    onReachBottom () {
      getPage().onReachBottom()
    },
    touchstart (e: WechatMiniprogram.TouchEvent) {
      emitter.emit('page:touchstart', e)
    },
    touchend (e: WechatMiniprogram.TouchEvent) {
      emitter.emit('page:touchend', e)
    },
    tap (e: WechatMiniprogram.TouchEvent) {
      emitter.emit('page:tap', e)
    },
    startPullDownRefresh () {
      /**
       * hack：scroll-view 触发下拉刷新时，webview 模式不会回到顶部，而且会把 sticky 的元素拽走
       * @see: https://github.com/xiaweiss/miniprogram-bug-report/issues/33
       */
      if (!this.data.isSkyline) {
        this.setData({pageScrollTop: 0})
      }
      this.setData({pageRefresherTriggered: true})
    },
    async stopPullDownRefresh () {
      if (Date.now() - this.data._refreshStartTime < 500) {
        await sleep(200)
        await this.stopPullDownRefresh()
      } else {
        this.setData({pageRefresherTriggered: false})
      }
    },
  }
})
