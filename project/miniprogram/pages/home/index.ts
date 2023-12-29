import { emitPrevPage, wxToPromise, chooseImage, isPC, cropImage, getUserProfile, navigateTo, isMac, isIOS, emitter } from '../../utils/index'
import { userRealnInfo } from '../../services/index'
import { officialGroup } from '../../config'
import { showActionSheet } from '../../components/action-sheet/showActionSheet'
import { showRealNameModal } from '../../components/real-name-modal/command'

import type { RealNameInfo } from '../../services/index'


const app = getApp<AppData>()

Page({
  data: {
    _isEditProfile: false,
    _avatarId: '',
    loaded: false,
    isPC: isPC(),
    isIOS: isIOS(),
    /** 触发下拉刷新 */
    refresherTriggered: false,
    /** 头像 url */
    avatarUrl: '',
    /** 昵称 */
    nickName: '',
    /** 简介 */
    intro: '',
    /** 简介长度*/
    introLength: 0,
    /** 实名信息 */
    realNameInfo: null as RealNameInfo | null,
  },
  async onLoad () {
    try {
      this.getUserRealNameInfo()
      await this.getUserProfile()
      emitter.emit('closeVersionTipSetting')
    } catch {
    } finally {
      this.setData({loaded: true})
    }
  },
  async onPullDownRefresh() {
    try {
      await this.getUserRealNameInfo()
      await this.getUserProfile()
    } catch (err) {
    } finally {
      this.setData({refresherTriggered: false})
    }
  },
  onUnload () {
    if (this.data._isEditProfile) {
      emitPrevPage('onBack', {isEditProfile: true})
    }
  },
  async onTapAvatar () {
    const [res] = await wxToPromise(showActionSheet, {
      selector: '#action-sheet-avatar',
      alertText: '上传头像',
      itemList: ['用高清图', '']
    })

    // 用高清图
    if (res?.tapIndex === 0) {
      const { tempFilePaths } = await chooseImage({count: 1, sizeType: ['original', 'compressed']})
      let avatarUrl = tempFilePaths[0]

      if (avatarUrl) {
        const [res] = await wxToPromise(wx.getImageInfo, {src: avatarUrl})

        // 不是方图时，裁剪图片
        if (res && res.width / res.height !== 1) {
          avatarUrl = await cropImage({src: avatarUrl, cropScale: '1:1'})
        }
      }

      if (avatarUrl) {
        this.setData({avatarUrl})
      }
    }
  },
  async onChooseAvatar (e: WechatMiniprogram.CustomEvent) {
    const { avatarUrl } = e.detail
    this.setData({avatarUrl})
  },

  async getUserProfile () {
    await getUserProfile()

    const { userProfile } = app.globalData

    this.setData({
      avatarUrl: userProfile.avatar.scale.w_240 || '',
      nickName: userProfile.name,
      intro: userProfile.intro,
    })

    this.data._avatarId = userProfile.avatar?.fileUuid || ''
  },

  async getUserRealNameInfo () {
    const realNameInfo = await userRealnInfo()
    this.setData({realNameInfo})
  },

  async postUserProfile () {
    const { userProfile } = app.globalData
    const { _avatarId, avatarUrl, nickName, intro } = this.data
    let avatarId = ''

    // 和上次的头像相同，不需要上传
    if (avatarUrl === userProfile.avatar.scale.w_240) {
      avatarId = _avatarId

    // 更换头像后，需要上传，获取文件 id
    } else {
      const file = await uploadAvatar({filePath: avatarUrl})
      avatarId = file.uuid
    }

    // const { profile } = await userProfileSync({
    //   avatar: avatarId,
    //   name: nickName,
    //   intro
    // })

    // app.globalData.userProfile = profile
  },

  /**
   * 加入社群
   */
  joinGroup () {

  },

  /**
   * 显示创作者指南底部弹窗
   */
  async createrGuide () {
    const [res] = await wxToPromise(showActionSheet, {
      itemList: ['创作者指南', '创作者规则']
    })

    switch (res?.tapIndex) {
      case 0: {
        navigateTo({
          url: '/pages/webview/index',
          query: {
            url: 'https://mp.weixin.qq.com/s/JM_6_B-ndEMYukeBsIE0jg'
          }
        })
        break
      }
      case 1: {
        this.goToProtocolCreator()
        break
      }
    }
  },

  /**
   * 联系客服
   */
  contact () {
    if (isMac()) {
      app.showModal({
        content: '「联系客服」请在移动端操作，目前的桌面版本不支持该操作',
        showCancel: false
      })
    }
  },

  /**
   * 更新昵称
   */
  updateNickName ({nickName}: {nickName: string}) {
    this.setData({nickName})
  },

  /**
   * 更新简介
   */
  updateIntro ({intro}: {intro: string}) {
    this.setData({intro})
  },

  /**
   * 更新实名认证
   */
  updateRealName ({realNameInfo} : {realNameInfo: RealNameInfo}) {
    this.setData({realNameInfo})
  },

  /**
   * 去昵称设置页
   */
  goToSettingName () {
    navigateTo({url: '/pages/settingName/index'})
  },

  /**
   * 去简介设置页
   */
  goToSettingIntro () {
    navigateTo({url: '/pages/settingIntro/index'})
  },

  /**
   * 去实名认证
   */
  async goToRealName () {
    const { realNameInfo } = this.data

    // 已实名认证
    if (realNameInfo?.name) {
      navigateTo({
        url: '/pages/settingRealName/index',
        success: (res) => {
          res.eventChannel.emit('navigateTo:realName', {
            realNameInfo,
            success: false
          })
        }
      })
    // 未实名认证
    } else {
      showRealNameModal({
        success: (res) => {
          const { realNameInfo } = res
          this.setData({realNameInfo})
          navigateTo({
            url: '/pages/settingRealName/index',
            success: (res) => {
              res.eventChannel.emit('navigateTo:realName', {
                realNameInfo,
                success: true
              })
            }
          })
        }
      })
    }
  },

  /**
   * 去消息通知设置页
   */
  goToSettingMessage () {
    navigateTo({url: '/pages/settingMessage/index'})
  },

  /**
   * 去订阅关系展示设置页
   */
  goToSettingSub () {
    navigateTo({url: '/pages/settingSub/index'})
  },

  /**
   * 去墨问服务协议页
   */
  goToProtocolMowenService () {
    navigateTo({
      url: '/pages/protocol/index',
      query: {
        id: 'mowen_service'
      }
    })
  },
  /**
   * 去创作者规则
   */
  goToProtocolCreator () {
    navigateTo({
      url: '/pages/protocol/index',
      query: {
        id: 'creator'
      }
    })
  },
  /**
   * 去隐私政策
   */
  goToProtocolPrivacy () {
    navigateTo({
      url: '/pages/protocol/index',
      query: {
        id: 'privacy'
      }
    })
  }
})
