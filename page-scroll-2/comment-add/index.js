const customStyle =
    'box-sizing: content-box;' +
    'border-bottom: env(safe-area-inset-bottom) solid transparent;' +
    'box-shadow: 0px -3px 4px 0px rgba(228,229,231,0.5);'

Component({
  options: {
    pureDataPattern: /^_/
  },
  properties: {
    note: Object,
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    _loading: false,
    commentAudio: '',
    commentText: '',
    customStyle,
    keyboardHeight: 0,
    isFocus: false
  },

  methods: {
    cancel () {
      console.log('cancel')
      this.setData({
        isFocus: false
      })
    },
    onFocus () {
      console.log('onFocus')
      this.setData({
        isFocus: true,
        isActive: true
      })

      wx.pageScrollTo({
        scrollTop: 52
      })
    },
    onBlur () {
      console.log('onBlur')
      this.setData({
        isFocus: false,
        isActive: false
      })
    },
    /**
     * 输入文字
     */
    onInput (e) {
      this.setData({
        commentText: e.detail.value
      })
    },

    /**
     * 键盘高度变化
     */
    onKeyboardHeightChange (e) {
      const {height} = e.detail
      // 键盘弹起时，使用键盘高度
      if (height > 0) {
        this.setData({
          keyboardHeight: height,
          customStyle: customStyle.replace('env(safe-area-inset-bottom)', height + 'px')
        })

      // 键盘收起时，用默认的安全区高度
      } else {
        this.setData({
          keyboardHeight: 0,
          customStyle
        })
      }
    },

    focus () {
      this.setData({
        isFocus: true
      })
    },

    async send () {

    },
  }
})
