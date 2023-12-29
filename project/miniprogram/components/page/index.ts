import { emitter, getPage, isSkyline, sleep } from '../../utils/index'

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
    multipleSlots: true
  },
  properties: {
    background: { type: String, value: '#fff' },
    /**
     * 问题: [skyline] scroll-view 的内容不足时，依然可以上下拉动回弹（不是问题，仅需要注意下）
     * @see: https://github.com/xiaweiss/miniprogram-bug-report/issues/142
     *
     * @bug: [ios] scroll-view 开启 enhanced 时，textarea 无法自动聚焦
     * @see: https://github.com/xiaweiss/miniprogram-bug-report/issues/198
     *
     * @hack：通过设置 scrollY 来控制是否回弹
     */
    scrollY: { type: Boolean, value: true },
    bounces: { type: Boolean, value: true },
    loaded: { type: Boolean, value: true },
    lowerThreshold: { type: Number, value: 50 },
    navigationBarBackgroundColor: { type: String, value: 'transparent' },
    navigationBarTitleText: { type: String, value: '墨问便签' },
    navigationBarFrontColor: { type: String, value: '#000000' },
    refresherEnabled: { type: Boolean, value: false },
    refresherBackground: { type: String, value: '' }, // 默认值 #fff 表示透明色，如果需要白色，需要设置为 #ffffff、white
    /** 设置自定义下拉刷新默认样式，支持设置 black | white | none， none 表示不使用默认样式 */
    refresherDefaultStyle: { type: String, value: 'black' },
    refresherTriggered: { type: Boolean, value: false },
    scrollTop: { type: Number, value: 0 },
    supportSticky: { type: Boolean, value: false },
    /** 在设置滚动条位置时使用动画过渡 */
    scrollWithAnimation: { type: Boolean, value: false },
    /** 是否启用 bottom slot */
    enableBottom: { type: Boolean, value: false },
    /** 上边内边距 */
    paddingTop: { type: Number, value: 0 },
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
      if (this.data.pageRefresherTriggered === refresherTriggered) return

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
    'scrollTop' (scrollTop) {
      this.setData({pageScrollTop: scrollTop})
    }
  },
  pageLifetimes: {
    show () {
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
    /**
     * 页面滚动
     */
    onPageScroll (e: WechatMiniprogram.ScrollViewScroll) {
      const page = getPage()
      if (typeof page.onPageScroll === 'function') {
        page.onPageScroll(e.detail)
      }
    },
    /**
     * 滚动到底部时触发
     */
    onReachBottom () {
      const page = getPage()
      if (typeof page.onReachBottom === 'function') {
        page.onReachBottom()
      }
    },
    /**
     * 自定义下拉刷新被触发
     */
    onRefresherRefresh () {
      this.data._refreshStartTime = Date.now()
      this.data.pageRefresherTriggered = true

      const page = getPage()
      if (typeof page.onPullDownRefresh === 'function') {
        page.onPullDownRefresh()
      }
    },
    /**
     * 自定义下拉刷新被复位
     */
    onRefresherRestore () {
      this.data.pageRefresherTriggered = false
    },
    /**
     * 自定义下拉刷新被中止
     */
    onRefresherAbort () {
      this.data.pageRefresherTriggered = false
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
      if (this.data.isSkyline) {
        this.setData({pageRefresherTriggered: true})

      } else {
        /**
         * @bug: scroll-view 触发下拉刷新时，webview 模式不会回到顶部，而且会把 sticky 的元素拽走
         * @see: https://github.com/xiaweiss/miniprogram-bug-report/issues/33
         * @hack: 先回到顶部，再触发下拉刷新
         */
        this.setData({pageScrollTop: 0})

        /**
         * @bug: scroll-view 滚动列表后，设置 scroll-top 为 0，再执行下拉刷新。下拉刷新无法触发
         * @see: https://github.com/xiaweiss/miniprogram-bug-report/issues/83
         * @hack: 滚动到顶部后，延时 100 ms 再执行下拉刷新
         */
        setTimeout(() => {
          this.setData({pageRefresherTriggered: true})
        }, 100)
      }
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
