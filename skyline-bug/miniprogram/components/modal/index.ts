import { isIOS, emitter } from '../../utils/index'

const app = getApp<AppData>()

const defaultConfig: ShowModalOption = {
  title: '',
  content: '',
  showCancel: true,
  cancelText: '取消',
  cancelColor: '#888',
  confirmText: '确定',
  confirmColor: '#FFF',
  editable: false,
  maxLength: 140,
  placeholderText: '',
  success: null,
  fail: null,
  complete: null,
  overlayClose: false,
  contentAlign: 'center',
}

Component({
  data: {
    isIOS: isIOS(),
    modalShow: false,
    keyboardHeight: app.globalData.keyboardHeight || 0,
    ...defaultConfig,
  },
  lifetimes: {
    created () {
      this.showModal = this.showModal.bind(this)
      this.onKeyboardHeightChange = this.onKeyboardHeightChange.bind(this)
    },
    attached () {
      emitter.on('keyboardHeightChange', this.onKeyboardHeightChange)
    },
    detached () {
      emitter.off('keyboardHeightChange', this.onKeyboardHeightChange)
    }
  },
  methods: {
    noop() {},

    showModal(config: WechatMiniprogram.ShowModalOption) {
      this.setData({
        modalShow: true,
        ...config,
      })
    },

    hideModal () {
      this.setData({
        modalShow: false
      })
    },

    /**
     * 关闭动画结束后，继续关闭弹窗
     */
    afterClose () {
      this.setData({
        ...defaultConfig
      })
    },
    onKeyboardHeightChange (e: {height: number}) {
      const height = e.height
      this.setData({keyboardHeight: height})
    },
    onInput (e: WechatMiniprogram.Input) {
      this.setData({
        content: e.detail.value
      })
    },
    cancel () {
      this.hideModal()
      this.success({cancel: true})
    },
    confirm () {
      this.hideModal()
      this.success({confirm: true})
    },
    success (res: {cancel?: boolean, confirm?: boolean}) {
      const { success, complete, editable, content = '' } = this.data

      if (typeof success === 'function') {
        success({
          confirm: false,
          cancel: false,
          content: editable ? content.trim() : '',
          errMsg: 'showModal:ok',
          ...res,
        })
      }

      if (typeof complete === 'function') {
        complete({
          confirm: false,
          cancel: false,
          errMsg: 'showModal:ok',
          ...res,
        })
      }
    }
  }
})

