import { isPC, isWindows, wxToPromise } from '../../utils/index'
import type { Config } from './command'

const app = getApp<AppData>()

const defaultConfig: Config = {
  success: null,
  fail: null
}

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  data: {
    ...defaultConfig,
    _loading: false,
    realName: '',
    cardNo: '',
    isAgree: false,
    /** 弹层是否展示 */
    show: false,
  },
  methods: {
    noop () {},
    onInputRealName (e: WechatMiniprogram.Input) {
      const { value } = e.detail
      this.data.realName = value
    },
    onInputCardNo (e: WechatMiniprogram.Input) {
      const { value } = e.detail
      this.data.cardNo = value
    },
    onTapProtocol () {
      this.setData({
        isAgree: !this.data.isAgree
      })
    },
    /**
     * 弹层展示
     */
    async show (config: Config) {
      this.setData({
        ...defaultConfig,
        ...config,
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
      // 清除数据
      this.setData({...defaultConfig})
    },
    /**
     * 取消
     */
    cancel () {
      this.close()
    },
    /**
     * 确认
     */
    async confirm () {
      const { isAgree, realName, cardNo, success, fail } = this.data
      if (!realName) {
        wx.showToast({  icon: 'none', title: '请输入姓名' })
        return
      }
      if (!cardNo) {
        wx.showToast({  icon: 'none', title: '请输入证件号' })
        return
      }
      if (!isAgree) {
        wx.showToast({icon: 'none', title: '请阅读并勾选同意协议'})
        return
      }

      // 防止重复请求
      if (this.data._loading) return
      this.data._loading = true

      try {
        const realNameInfo = {
          name: realName,
          cardNo,
          cardType: 1,
          cardName: '身份证'
        }

        if (typeof success === 'function') {
          success({realNameInfo})
        }

        this.close()
        return true
      } catch (err) {
        if (typeof fail === 'function') {
          fail({})
        }
        return Promise.reject(err)
      } finally {
        this.data._loading = false
      }
    },
    /**
     * 跳转到云账户协议
     */
    async goToProtocolCloudAccount () {
      /**
       * @bug [windows] wx.openDocument 无法打开 pdf 文件
       * @see https://github.com/xiaweiss/miniprogram-bug-report/issues/193
       */
      if (isPC() && isWindows()) {
        const [res] = await wxToPromise(wx.setClipboardData, {
          data: 'https://pub-sdn-001.mowen.cn/fe/assets/mini-note/protocol-cloud-account.pdf',
        })

        if (res) {
          app.showModal({
            content: '查看协议 pdf 文件，目前的桌面版本不支持该操作。请在浏览器中粘贴链接查看。',
            showCancel: false
          })
        }
      } else {
        wx.downloadFile({
          url: 'https://pub-sdn-001.mowen.cn/fe/assets/mini-note/protocol-cloud-account.pdf',
          success: function (res) {
            wx.openDocument({
              filePath: res.tempFilePath,
              fileType: 'pdf'
            })
          }
        })
      }
    }
  }
})
