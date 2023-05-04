import { PageContainer } from '../../../config'
import { wxToPromise, isIOS } from '../../../utils/index'

const { customStyle } = PageContainer

/** 链接：（https:// 或者 http:// 开头，非空格结尾） */
const linkReg = /https?:\/\/[^\s]+/i

Component({
  options: {
    pureDataPattern: /^_/
  },
  properties: {
    show: Boolean
  },
  data: {
    customStyle,
    isIOS: isIOS(),
    /** 输入框链接 */
    linkUrl: ''
  },

  methods: {
    close () {
      this.triggerEvent('close')
    },

    /**
     * 键盘高度变化
     */
    onKeyboardHeightChange (e: WechatMiniprogram.TouchEvent) {
      const {height} = e.detail
      // 键盘弹起时，使用键盘高度
      if (height > 0) {
        this.setData({
          customStyle: customStyle.replace('env(safe-area-inset-bottom)', height + 'px')
        })
      // 键盘收起时，用默认的安全区高度
      } else {
        this.setData({
          customStyle
        })
      }
    },

    /**
     * 贴入剪切板数据
     */
    async paste () {
      const [res] = await wxToPromise(wx.getClipboardData)
      if (res) {
        // 如果复制了链接，则取出第一个链接
        const clipboardLink = res.data.match(linkReg)
        if (clipboardLink) {
          this.setData({
            linkUrl: clipboardLink[0]
          })
        }
      }
    },

    /**
     * 输入链接
     */
    inputLinkUrl (e: WechatMiniprogram.Input) {
      const { value } = e.detail
      this.setData({
        linkUrl: value
      })
    },

    /**
     * 保存链接
     */
    send () {
      const {linkUrl} = this.data
      if (!linkUrl) {
        wx.showToast({
          title: '链接不能为空',
          icon: 'error'
        })
        return
      } else if(!linkReg.test(linkUrl)) {
        wx.showToast({
          title: '链接格式错误',
          icon: "error"
        })
        return
      }
      this.clearData()
      this.goToshareLink({linkUrl})
    },

    goToshareLink ({linkUrl} : {linkUrl: string}) {
      this.close()

      // const url = stringifyUrl({
      //   url: '/pages/shareLink/index',
      //   query: {url: linkUrl}
      // })
      // wx.navigateTo({url})
    },

    /**
     * 清空数据
     */
    clearData () {
      this.setData({
        linkUrl: '',
        clipboardText: ''
      })
    }
  }
})
