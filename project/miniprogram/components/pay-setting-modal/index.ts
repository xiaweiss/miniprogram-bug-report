import type { Config } from './command'

const app = getApp<AppData>()

const defaultConfig: Config = {
  noteUuid: '',
  skuId: '',
  step: 0,
  success: null,
  fail: null
}

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
  },
  data: {
    ...defaultConfig,
    /** 弹层是否展示 */
    show: false,
    /** 系统主题 */
    theme: 'light' as WechatMiniprogram.SystemInfo['theme'],
    /** 步骤列表 */
    stepList: [
      {text: '相关须知'},
      {text: '付费图文设置'},
      {text: '预览'}
    ],
    /** 付费设置 - 是否同意协议 */
    isAgree: false,
    /** 付费设置 - 标题 */
    title: '',
    /** 付费设置 - 简介 */
    intro: '',
    /** 付费设置 - 价格 */
    price: '',
    isIntroFocus: false,
  },
  methods: {
    onIntroFocusChanged (e: WechatMiniprogram.CustomEvent<{focus: boolean}>) {
      const { focus: isIntroFocus } = e.detail
      console.log('onIntroFocusChanged', isIntroFocus)
      this.setData({
        isIntroFocus
      })
    },
    async getPaySetting (skuId: string) {
      return {
        title: '',
        intro: '',
        price: ''
      }
    },
    async setPaySetting ({title = '', intro = '', price = ''}) {

    },
    /**
     * 弹层展示
     */
    async show (config: Config) {
      const { skuId = '', step = 0 } = config || {}

      let title = ''
      // let intro = '作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介\n作品简介last'
      let intro = '作品简介'
      let price = ''

      this.setData({
        ...defaultConfig,
        ...config,
        title,
        intro,
        price,
        isAgree: step > 0 || Boolean(skuId),
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
    },
    /**
     * 取消，上一步
     */
    cancel () {
      const { step } = this.data
      if (step) {
        this.setData({
          step: step - 1
        })
      } else {
        this.close()
      }
    },
    /**
     * 确认、下一步
     */
    async confirm () {
      const { step, title, intro, price, success } = this.data
      switch (step) {
        case 0: {
          this.setData({
            isAgree: true,
            step: step + 1
          })
          break
        }
        case 1: {
          if (!title) {
            app.showModal({content: '请输入作品名称'})
            return
          }
          if (!intro) {
            app.showModal({content: '请输入作品简介'})
            return
          }
          if (!price) {
            app.showModal({ content: '请输入付费金额' })
            return
          }
          this.setData({ step: step + 1 })
          break
        }
        case 2: {
          if (typeof success === 'function') {
            await this.setPaySetting({
              title,
              intro,
              price,
            })
            success({confirm: true, cancel: false, setting: {
              title,
              intro,
              price,
            }})
            this.close()
          }
          break
        }
      }
    }
  },
})
