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
})
