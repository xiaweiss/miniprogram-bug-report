import { toFixed, isIOS, isAndroid, requirePrivacyAuthorize, chooseImage } from '../../../utils/index'

const app = getApp<AppData>()

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
  },
  properties: {
    title: {type: String, value: ''},
    intro: {type: String, value: ''},
    introImage: Object,
    price: {type: String, value: ''},
    height: Number,
  },
  data: {
    _tapY: 0,
    scrollTop: 0,
    isAndroid: isAndroid(),
    isIOS: isIOS(),
    isReady: false,
    isFocusIntro: false,
    keyboardPlaceholderHeight: 0,
    titleLength: 0,
    introLength: 0,
  },
  lifetimes: {
    attached () {
      const { title, intro, price } = this.properties
      const { isIOS } = this.data
      const { safeAreaBottom } = app.globalData

      // 计算标题和简介的长度
      this.setData({
        keyboardPlaceholderHeight: isIOS ? (361 + 50 - safeAreaBottom - 98) : 0, // 微信键盘高度 361 + 工具栏 50 - 安全区 - 底部元素  18 + 80
        priceText: Number(price) >= 100 ? toFixed(Number(price) / 100, 2, { trim: true })  : '',
        titleLength: title.length,
        introLength: intro.length,
      })
    },
    detached () {
      console.log('detached')
    },
    moved() {
      console.log('moved')
    },
    ready() {
      /**
       * @bug: [android] textarea 组件，使用 wx:if 切换后高度异常
       * @see: https://github.com/xiaweiss/miniprogram-bug-report/issues/173
       * @hack: 先给外层设置样式 visibility: hidden; 隐藏，确保 auto-height 初始值是 false
       *   延时或者自定义组件 ready 后，再设置 auto-height 为 true，并且移除样式 visibility: hidden;
       */
      this.setData({isReady: true})
    }
  },
  methods: {
    noop () {},
    onScroll (e: WechatMiniprogram.ScrollViewScroll) {
      const { scrollTop } = e.detail
      this.data.scrollTop = scrollTop
    },
    onInputTitle(e: WechatMiniprogram.TextareaInput) {
      let { value: title } = e.detail

      title = title.replace(/(\r\n)|(\n)/g,  '')

      // 最多 20 个字符，任意字符按照 1 个字符计算
      const grapheme = title.split('')
      const titleLength = Math.min(grapheme.length, 20)
      title = grapheme.slice(0, 20).join('')

      this.setData({
        title,
        titleLength
      })
    },
    onTapIntro (e: WechatMiniprogram.TouchEvent) {
      const { y } = e.detail
      this.data._tapY = y
    },
    onFocusIntro () {
      const { isAndroid, _tapY, scrollTop } = this.data
      const { safeAreaBottom, windowHeight } = app.globalData
      const keyboardHeight = app.globalData.keyboardHeight + (isAndroid ? 50 : 0)

      if (isAndroid) {
        this.setData({
          keyboardPlaceholderHeight: keyboardHeight - safeAreaBottom - 80
        })
      }

      if (windowHeight - _tapY < keyboardHeight) {
        this.setData({scrollTop: scrollTop + keyboardHeight - (windowHeight - _tapY) + 14})
      }
      this.data.isFocusIntro = true
    },
    onBlurIntro () {
      const { isAndroid } = this.data
      if (isAndroid) {
        this.setData({keyboardPlaceholderHeight: 0})
      }
      this.data.isFocusIntro = false
    },
    onInputIntro (e: WechatMiniprogram.TextareaInput) {
      let { value: intro } = e.detail

      // 最多 20 个字符，任意字符按照 1 个字符计算
      const grapheme = intro.split('')
      const introLength = Math.min(grapheme.length, 500)
      intro = grapheme.slice(0, 500).join('')

      this.setData({
        intro,
        introLength
      })
    },
    onFocusPrice () {
      console.log('onFocusPrice')
      const { isAndroid, scrollTop } = this.data
      const { safeAreaBottom, windowHeight } = app.globalData
      const keyboardHeight = app.globalData.keyboardHeight

      console.log('keyboardHeight', keyboardHeight)

      if (isAndroid) {
        this.setData({
          keyboardPlaceholderHeight: keyboardHeight - safeAreaBottom - 80
        })
      }

      const query = this.createSelectorQuery()
      query.select('.price').boundingClientRect(res => {
        if (windowHeight - res.bottom < keyboardHeight) {
          this.setData({
            scrollTop: scrollTop + keyboardHeight - (windowHeight - res.bottom)
          })
        }
      }).exec()
    },
    onInputPrice (e: WechatMiniprogram.TextareaInput) {
      let { value: priceText } = e.detail

      // 只允许输入数字
      const grapheme = graphemeSplit(priceText)
      priceText = grapheme.filter(item => /[0-9]/.test(item)).join('')

      // 最高 10000 元
      if (Number(priceText) > 10000) priceText = '10000'

      this.setData({
        price: String(Number(priceText || 0) * 100),
        priceText
      })
    },
    async onTapImage () {

    },
    onTapDeleteImage () {
      this.triggerEvent('introImageUpdate', {introImage: null})
    },
    scrollToIntroImage () {
      const { scrollTop } = this.data
      const { windowHeight, safeAreaBottom } = app.globalData

      const query = this.createSelectorQuery()
      query.select('.intro-image').boundingClientRect(res => {
        this.setData({
          scrollTop: scrollTop + res.bottom - (windowHeight - safeAreaBottom - 80 - 31 - 16 - 8) // 底部按钮 80 + 作品简介底部
        })
      }).exec()
    },
    focusIntro () {
      this.setData({
        isFocusIntro: true
      })
    },
    blurIntro () {
      this.setData({
        isFocusIntro: false
      })
    },
    clearTitle () {
      this.setData({
        title: '',
        titleLength: 0,
      })
    },
    clearIntro () {
      this.setData({
        intro: '',
        introLength: 0,
      })
    }
  }
})
