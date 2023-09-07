import { emitter, isSkyline } from '../../utils/index'
const app = getApp<AppData>()

Component({
  options: {
    virtualHost: true,
  },

  data: {
    isSkyline: false,
    keyboardHeight: app.globalData.keyboardHeight || 0,
  },
  lifetimes: {
    created () {
      this.onKeyboardHeightChange = this.onKeyboardHeightChange.bind(this)
    },
    attached () {
      this.setData({
        isSkyline: isSkyline(),
      })
      emitter.on('keyboardHeightChange', this.onKeyboardHeightChange)
    },
    detached () {
      emitter.off('keyboardHeightChange', this.onKeyboardHeightChange)
    }
  },
  methods: {
    noop() {},

    onKeyboardHeightChange (e: {height: number}) {
      this.setData({keyboardHeight: e.height})
    }
  }
})
