interface TypeItem {
  /** 标签名 */
  label: string
  /** 是否有新消息 */
  new?: boolean
  /** 新消息数量 */
  newNum?: number
}

Component({
  options: {
    virtualHost: true,
  },
  externalClasses: ['class', 'item-class'],
  properties: {
    style: String,
    /** 当前类型 index */
    type: Number,
    /** 类型列表 */
    typeList: Array,
    /** 是否使用小尺寸 */
    mini: Boolean,
    /** 子项间距 */
    spacing: { type: Number, value: 20 },
    fontSize: { type: Number, value: 18 },
  },
  methods: {
    /** 改变列表类型 */
    changeType (e: WechatMiniprogram.CustomEvent) {
      const { index: type } = e.currentTarget.dataset

      this.triggerEvent('change', { type })
    },
  }
})
