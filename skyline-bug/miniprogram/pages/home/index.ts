import { isSkyline } from '../../utils/index'
import { img_note_not_found } from '../../assets/img/index'

const app = getApp<AppData>()

Page({
  data: {
    _loading: false,
    _timeFrom: 0,
    _timeTo: 0,
    img_note_not_found,
    notFoundHeight: 0,
    /** 触发下拉刷新 */
    refresherTriggered: false,
    text: '',
    scrollTop: 0,
    isColor: true,
    isShow: true,
  },
  onLoad() {
    this.setData({
      isSkyline: isSkyline()
    })

    wx.showLoading({title: '加载中...'})

    this.onLoadLogin()
  },

  async onLoadLogin () {
    this.setData({
      notFoundHeight:
        app.globalData.systemInfo!.windowHeight -
        app.globalData.safeAreaBottom - 94
    })

    this.setData({loaded: true})
    wx.hideLoading()
  },

  toggleColor () {
    console.log('toggleColor')
    this.setData({
      isColor: !this.data.isColor
    })
  },

  toggleShow () {
    console.log('toggleShow')
    this.setData({
      isShow: !this.data.isShow
    })
  }
})
