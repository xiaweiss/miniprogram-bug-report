import { emitter, toFixed } from '../../../utils/index'

Component({
  options: {
    virtualHost: true,
  },
  properties: {
    title: {type: String, value: ''},
    intro: {type: String, value: ''},
    price: {type: String, value: ''},
    height: Number,
  },
  data: {
    titleLength: 0,
    introLength: 0,
  },
  lifetimes: {
    attached () {
      const { title, intro, price } = this.properties

      // 计算标题和简介的长度
      this.setData({
        priceText: Number(price) >= 100 ? toFixed(Number(price) / 100, 2, { trim: true })  : '',
      })
    }
  },
  methods: {
    noop () {},
    onInputTitle(e: WechatMiniprogram.TextareaInput) {
      let { value: title } = e.detail

      title = title.replace(/(\r\n)|(\n)/g,  '')

      this.setData({
        title,
      })
    },
    onFocusIntro (e) {
      console.log('onFocusIntro', e)
      this.triggerEvent('introFocusChanged', {focus: true})
    },
    onBlurIntro () {
      this.triggerEvent('introFocusChanged', {focus: false})
    },
    onInputIntro (e: WechatMiniprogram.TextareaInput) {
      let { value: intro } = e.detail

      console.log('onInputIntro', e)


      this.setData({
        intro
      })
    },
    onInputPrice (e: WechatMiniprogram.TextareaInput) {
      let { value: priceText } = e.detail

      // 只允许输入数字
      const grapheme = graphemeSplit(priceText)
      priceText = grapheme.filter(item => !isNaN(Number(item))).join('')

      this.setData({
        price: String(Number(priceText || 0) * 100),
        priceText
      })
    }
  }
})
