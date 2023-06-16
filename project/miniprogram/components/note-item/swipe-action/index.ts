import { emitter } from '../../../utils/index'

/**
 * 侧滑操作组件
 * @event open - 展开时触发
 * @event close - 关闭时触发
 */
Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
    multipleSlots: true
  },
  externalClasses: ['class'],
  properties: {
    /** 样式 */
    style: { type: String, value: '' },
    /** 右侧区域宽度 */
    rightWidth: { type: Number, value: 0 },
    /** 是否禁用 */
    disabled: { type: Boolean, value: false },
    /** 是否阻止触摸移动事件冒泡 */
    stopTouchmove: { type: Boolean, value: false },
    /** 是否启用 hover 效果 */
    hover: Boolean
  },
  data: {
    /** 是否展开了 */
    isOpen: false,
  },

  observers: {
    // 打开状态变化后，触发事件
    'isOpen' (isOpen: boolean) {
      this.triggerEvent(isOpen ? 'open' : 'close')
    }
  },

  lifetimes: {
    created() {
      this.close = this.close.bind(this)
    },
    attached() {
      emitter.on('page:touchstart', this.close)
    },
    detached() {
      emitter.off('page:touchstart', this.close)
    },
  },

  methods: {
    noop () {},
    /**
     * 同步 isOpen 状态（wxs 调用）
     */
    onIsOpenChange ({isOpen} : {isOpen: boolean}) {
      if (this.data.isOpen !== isOpen) {
        this.setData({ isOpen })
      }
    },

    /**
     * 同步 stopTouchmove 状态（wxs 调用）
     */
    onStopTouchmoveChange ({stopTouchmove} : {stopTouchmove: boolean}) {
      if (this.data.stopTouchmove !== stopTouchmove) {
        this.setData({ stopTouchmove })
      }
    },

    open () {
      if (this.data.isOpen) return
      this.setData({ isOpen: true })
    },

    close () {
      if (!this.data.isOpen) return
      this.setData({ isOpen: false })
    },

    /**
     * 触摸页面
     * @hack mut-bind 绑定不需要阻止 page touchstart 事件时，使用 '' 空字符串无效，依然会阻止事件，这里手动触发下
     */
    pageTouchstart (e: WechatMiniprogram.TouchEvent) {
      emitter.emit('page:touchstart', e)
    },
  }
})
