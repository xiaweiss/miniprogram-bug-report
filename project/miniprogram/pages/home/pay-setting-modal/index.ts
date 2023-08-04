const app = getApp<AppData>()

const defaultConfig = {

}

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
  },
  data: {
    /** 弹层是否展示 */
    show: false,
    ...defaultConfig,
    /** 系统主题 */
    theme: 'light' as WechatMiniprogram.SystemInfo['theme'],
    step: 0,
    stepList: [
      {text: '相关须知'},
      {text: '付费图文设置'},
      {text: '预览'}
    ]
  },
  lifetimes: {
    created() {

    },
    attached() {

    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
    /**
     * 弹层展示
     */
    show (config: any) {
      this.setData({
        ...defaultConfig,
        ...config,
        theme: app.globalData.systemInfo!.theme,
        show: true
      })
    },
    /**
     * 关闭
     */
    close () {
      this.setData({
        show: false,
      })
    },
    /**
     * 弹层关闭后
     */
    afterClose () {
      const { onClose } = this.data

      // 清除数据
      this.setData({...defaultConfig})

      if (typeof onClose === 'function') {
        onClose()
      }
    }
  },
});
