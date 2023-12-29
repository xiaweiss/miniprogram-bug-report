import type { ShowActionSheetOption } from './showActionSheet'

const app = getApp<AppData>()

const defaultConfig: ShowActionSheetOption = {
   itemList: [],
   alertText: '',
   itemColor: '',
   itemColorDark: '',
   success: null
}

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
    multipleSlots: true
  },
  data: {
    /** 加载中 */
    _loading: false,
    /** 弹层是否展示 */
    show: false,
    /** 主题 */
    theme: 'light' as WechatMiniprogram.SystemInfo['theme'],
    /** 配置项 */
    ...defaultConfig
  },
  methods: {
    show (config: ShowActionSheetOption) {
      this.setData({
        theme: app.globalData.systemInfo!.theme,
        show: true,
        ...defaultConfig,
        ...config
      })
    },
    /**
     * 关闭
     */
    close () {
      this.setData({
        show: false
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
    },
    /**
     * 点击选项
     */
    tap (e: WechatMiniprogram.TouchEvent) {
      const { index } = e.currentTarget.dataset

      const { success } = this.data

      if (typeof success === 'function') {
        success({
          tapIndex: index,
          errMsg: ''
        })
      }

      this.close()
    }
  }
})
