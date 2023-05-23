// 笔记展示类型
// 1. 纯文本
// 2. 图片 + 文本
// 3. 音频 + 文本
// 4. 图片 + 音频 + 文本
// 5. 纯音频 或 纯图片
// 6. 图片 + 音频
import { stringifyUrl } from 'query-string'
import { showShareModal } from '../share-modal/command'
import { showPrivacyModal } from '../privacy-modal/command'
import { secondToHMS, date, wxToPromise, clone, getNoteShareTitle, getMid,
  requestErrorTip, isIOS, isPC, calcTitleDigest, isSkyline, getInstance, getPage, getNoteText } from '../../utils/index'
import { noteDel, posterNoteSave, noteAuditInfo, notePrivacySid, notePrivacySetting, noteCovers, noteShow, noteUserFavorsDel } from '../../services/index'
import { officialTags, ShareConfig } from '../../config'

import type { RequestErrorData } from '../../utils/index'
import type { NoteDetail, NoteTag, NoteDetailImage, Profile } from '../../services/index'
import type { ShareModalConfig } from '../share-modal/command'

const app = getApp<AppData>()

/** 卡片类型 */
type Type = '' | 'image' | 'audio' | 'vote'

interface ImageItem {
  url: string
  background?: string
  mode?: string
}

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /** 模式: 默认 '', 图片 'image', 音频 'audio', 点赞 'vote' */
    type: { type: String, value: '' },
    /** 笔记作者信息，不填时默认为本人 */
    profile: Object,
    /** 笔记详情 */
    note: {type: Object, value: {}},
    /** 列表里笔记 index */
    index: {type: Number, value: 0},
    /** 列表里笔记总数 */
    total: {type: Number, value: 0},
    /** 是否显示选择框 */
    checkbox: Boolean,
    /** 是否显示额外信息 */
    showExtra: Boolean,
    /** 是否展示风险 flag（优先级比 hideFlag 高） */
    showRiskFlag: Boolean,
    /** 是否展示用户信息 */
    showProfile: Boolean,
    /** 是否隐藏 flag */
    hideFlag: Boolean,
    /** 是否隐藏分享按钮 */
    hideShare: Boolean,
    /** 是否隐藏卡片样式 */
    hideCard: Boolean,
    /** 日期类型 公开时间 public、创建时间 create */
    dateType: { type: String, value: 'create' },
    /** 合集是否有更新 */
    isRefUpdated: Boolean,
    /** 是否开启长按 */
    enableLongpress: Boolean,
    /** 是否开启滑动 */
    enableSwipe: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    _loading: false,
    /** 作者的分享设置 - 笔记过期时间 */
    _expireAt: 0,
    /** 是否转发私密消息 */
    _isPrivateMessage: false,
    /** 是否 skyline 模式 */
    isSkyline: false,
    /** ios */
    isIOS: isIOS(),
    /** 是否 PC */
    isPC: isPC(),
    /** 是否客人 */
    isGuest: true,
    /** 纯语音 */
    isOnlyAudio: false,
    /** 图片 url */
    imageUrl: '',
    /** 图片列表（用于图片模式）*/
    imageList: [] as ImageItem[],
    /** 音频时长 */
    audioTime: '',
    /** 标题 */
    title: '',
    /** 摘要 */
    digest: '',
    /** 笔记日期 */
    noteDate: '',
    /** 复制是否在下面 */
    isBottom: false,
    /** 笔记标签 */
    noteTags: [] as NoteTag[],
    /** 是否正在播放 */
    playing: false,
    /** 播放的音频序号 */
    playedIndex: 0,
    /** 确认删除提示 */
    confirmDelShow: false,
    /** 轮播图当前 index */
    swiperIndex: 0,
    /** 轮播图高度 */
    swiperHeight: 0,
    /** 菜单是否显示 */
    isMenuShow: false,
    /** 菜单中笔记卡片的样式 */
    menuNoteItemStyle: '',
    /** 菜单样式 */
    menuStyle: ''
  },

  observers: {
    'note': function(note: NoteDetail) {
      if (note && note.noteBase) {
        const { noteBase, noteFlag, noteAudio, noteImage } = note
        let noteDate = ''

        switch (this.properties.dateType) {
          case 'public':
            noteDate = date(note.noteBase.publicAt) || ''
            break
          case 'create':
          default:
            noteDate = date(note.noteBase.createdAt) || ''
        }

        let isOnlyAudio = true
        let imageUrl = ''
        let audioTime = ''

        if (noteFlag.hasAudio && noteAudio.length) {
          audioTime = secondToHMS(noteAudio[0].duration)
        }

        if (noteFlag.hasImage && noteImage.length) {
          isOnlyAudio = false
          imageUrl = noteImage[0].scale.w_240
        }

        if (noteBase.title || noteBase.digest) {
          isOnlyAudio = false
        }

        // 微信输入状态，用标签形式展示
        const noteTags = note.noteTags || []

        if (noteFlag.fromWechat && noteTags[0]?.id !== '-4') {
          noteTags.unshift(officialTags.find(tag => tag.id === '-4')!)
        }

        const {title, digest} = calcTitleDigest(noteBase.digest, true)

        this.setData({
          swiperIndex: 0, // 刷新后数据变化了时，重置 swiperIndex
          noteDate,
          isOnlyAudio,
          imageUrl,
          audioTime,
          title,
          digest,
          noteTags
        })
      }
    },
    // 切换 type 时，由于有 key 存在，可能不会触发 attached
    'type' (type: Type) {
      if (type === 'image') {
        this.setSwiperHeight()
        this.setImage(0)
        this.setImage(1)
      }
    },
  },
  lifetimes: {
    attached () {
      // 注：目前先不监听窗口尺寸变化了，以免旋转后 item 大小变化，导致列表滚动找不到卡片
      const profile = this.properties.profile as Profile

      this.setData({
        isSkyline: isSkyline(),
        isGuest: profile ? profile.uid !== app.globalData.uuid : false
      })
    },
  },

  methods: {
    noop () {},

    onSwiperChange (e: WechatMiniprogram.SwiperChange) {
      const { current: index } = e.detail
      if (this.data.swiperIndex === index) return

      this.setData({ swiperIndex: index })

      // 预加载下一页的图片
      this.setImage(index + 1)
    },

    onSwipeActionClose () {
      this.setData({
        confirmDelShow: false
      })
    },

    onPlay (e: WechatMiniprogram.CustomEvent) {
      const index = e.currentTarget.dataset.index as number

      this.setData({
        playing: true,
        playedIndex: index
      })
    },

    onPause () {
      this.setData({
        playing: false
      })
    },

    onStop () {
      this.setData({
        playing: false
      })
    },

    getNoteItemRect () {
      return new Promise<WechatMiniprogram.BoundingClientRectCallbackResult>(resolve => {
        this.createSelectorQuery()
        .select('.note-item')
        .boundingClientRect((rect) => {
          resolve(rect)
        })
        .exec()
      })
    },

    async getNoteContent () {
      // 防止重复请求
      if (this.data._loading) return
      this.data._loading = true

      const uuid = (this.properties.note as NoteDetail).noteBase.uuid

      try {
        const data = await noteShow({uuid, passport: null, accessToken: ''})
        return data.detail.noteBase.content
      } catch (err) {
        return Promise.reject(err)
      } finally {
        this.data._loading = false
      }
    },

    async showMenu () {
      const rect = await this.getNoteItemRect()

      if (!rect) return

      const { screenHeight } = app.globalData.systemInfo!
      const { navBarHeight } = app.globalData

      const menuHeight = 45 * 4 // item 数量

      // 下面摆放
      let menuLeft = 20
      let menuTop = 0

      // 下面空间够，下面摆放
      if (rect.bottom + 12 + menuHeight < screenHeight) {
        menuTop = rect.bottom + 12

      // 卡片上面够时，在上面摆放
      } else if (rect.top - menuHeight - 12 > navBarHeight) {
        menuTop = rect.top - menuHeight - 12

      // 上下都不够时，在卡片内部摆放
      } else {
        menuLeft = rect.left + 26
        menuTop = rect.top + 26
      }

      wx.vibrateShort({type: 'light'})

      this.setData({
        isMenuShow: true,
        menuNoteItemStyle: `top: ${rect.top}px;`,
        menuStyle: `left:${menuLeft}px;top:${menuTop}px;`
      })
    },

    closeMenu () {
      this.setData({isMenuShow: false})
    },

    pause () {
      const instance = this.selectAllComponents('.note-player')
      instance[this.data.playedIndex]?.pause()
    },

    play () {
      // 不好控制进度，从头开始播
      const instance = this.selectAllComponents('.note-player')
      instance[0]?.replay()
    },

    closeRight () {
      getInstance('.note-item-container', this)?.close()
    },

    /**
     * 计算轮播图高度
     */
    setSwiperHeight () {
      const note = this.properties.note as NoteDetail
      const noteImage = note.noteImage || []

      let { swiperHeight } = this.data

      for (const item of noteImage) {
        const { height } = this.calcImageSize(item)

        // 优先适配竖图，取缩放后最大高度
        swiperHeight = Math.max(swiperHeight, height)
      }

      // 限制最大高度
      // type 41 + list hr 15 + 卡片其它元素最大高度 16 + 41 + 47 + 36
      const maxHeight = (app.globalData.systemInfo!.windowHeight - 196)
      swiperHeight = Math.min(swiperHeight, maxHeight)

      this.setData({swiperHeight})
    },

    /**
     * 设置图片、图片背景色
     */
    async setImage (index: number) {
      const swiperWidth = app.globalData.systemInfo!.windowWidth - 72
      const note = this.properties.note as NoteDetail
      const noteImage = note.noteImage || []
      const {imageList, swiperHeight} = this.data
      const image = noteImage[index]

      if (!image) return

      // 已经加载过的图片，不加载了
      if (imageList[index]) return

      // 图片填充模式
      const { width, height } = this.calcImageSize(image)

      let mode = 'aspectFit'

      // 图片占满了，不计算背景了
      if (width >= swiperWidth && height >= swiperHeight) {
        mode = 'aspectFill'

        this.setData({
          [`imageList[${index}]`]: {
            mode,
            url: image.scale.w_1200,
          }
        })
        return
      }

      // 图片小于容器，上下左右居中显示，以免拉伸后糊了
      if (width < swiperWidth && height < swiperHeight) {
        mode = 'center'
      }

      // 图片没占满，设置背景（使用本地路径，避免多次请求网络）
      const [res] = await wxToPromise(wx.getImageInfo, { src: image.scale.w_1200 })

      if (res) {
        this.setData({
          [`imageList[${index}]`]: {
            mode,
            url: res.path
          }
        })
      }
    },

    /**
     * 计算图片实际显示的宽高
     */
    calcImageSize (image: NoteDetailImage) {
      const swiperWidth = app.globalData.systemInfo!.windowWidth - 72
      let width = 0
      let height = 0

      switch (image.orientation) {
        case 5:
        case 6:
        case 7:
        case 8: {
          width = image.height
          height = image.width
          break
        }
        default: {
          width = image.width
          height = image.height
        }
      }

      // 宽度超出容器时，缩放
      if (width > swiperWidth) {
        height = height / width * swiperWidth
        width = swiperWidth
      }

      // 宽度超出 1200 时，缩放（因为缩略图最宽 1200）
      const maxWidth = 1200
      if (width > maxWidth) {
        height = height / width * maxWidth
        width = maxWidth
      }

      return {width, height}
    },

    /**
     * 新增标签
     */
    async goToAddTag() {
      const noteUuid = (this.properties.note as NoteDetail).uuid

      this.closeRight()

      const url = stringifyUrl({
        url: '/pages/addTag/index',
        query: { noteUuid }
      })

      wx.navigateTo({url})
    },

    /**
     * 设置笔记公开私有
     */
    async togglePrivacy ({isPublic, success} : {isPublic?: boolean, success?: () => void} = {}) {
      const index = this.properties.index
      const note = clone(this.properties.note) as NoteDetail
      const noteUuid = note.noteBase.uuid
      let isSuccess = false

      this.closeRight()

      showPrivacyModal({
        noteUuid,
        isPublic,
        success: (res) => {
          if (res.confirm) {
            // 设置成功后，更新笔记列表中本条状态
            const { isPublic, setting } = res
            const publicStatus = isPublic ? (setting ? 2 : 1) : 0

            // 数据无变化时，不更新
            if (note.noteFlag.isPublic === isPublic && note.noteFlag.publicStatus === publicStatus) return

            note.noteFlag.isPublic = isPublic
            note.noteFlag.publicStatus = publicStatus

            // 在个人主页
            if (getPage().route === 'pages/people/index') {
              // 不公开
              if (!isPublic) {
                this.triggerEvent('deleted', { note, index })
              // 不允许转发
              } else if (setting && setting.allowShare === false) {
                this.triggerEvent('deleted', { note, index })
              // 其它情况
              } else {
                this.triggerEvent('changed', { note, index })
              }
            // 其它页面
            } else {
              this.triggerEvent('changed', { note, index })
            }

            isSuccess = true
          }
        },
        fail: (err) => {
          const data = err as RequestErrorData || null

          if (data?.reason === 'NOTE_IS_RISKY') {
            this.riskTip()
          } else {
            requestErrorTip(data)
          }
        },
        onClose: () => {
          if (isSuccess && typeof success === 'function') {
            success()
          }
        }
      })
    },

    async copy () {
      const content = await this.getNoteContent()

      this.closeMenu()

      if (content) {
        const data = getNoteText(content)

        const [res] = await wxToPromise(wx.setClipboardData, { data })
        if (res) {
          wx.showToast({
            icon: 'none',
            title: '已复制',
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '没有可复制的内容',
        })
      }
    },

    del () {
      this.setData({
        confirmDelShow: true
      })
    },

    delInMenu () {
      if (this.data.type === 'vote') {
        app.showModal({
          content: '确认清除笔记点赞？',
          success: (res) => {
            if (res.confirm) {
              this.confirmClearVote()
            }
          }
        })
      } else {
        app.showModal({
          content: '确认删除笔记？',
          success: (res) => {
            if (res.confirm) {
              this.confirmDelNote()
            }
          }
        })
      }
    },

    /**
     * 确认删除笔记
     */
    async confirmDelNote () {
      const index = this.properties.index
      const note = clone(this.properties.note) as NoteDetail
      const noteUuid = note.noteBase.uuid

      if (this.data._loading) return
      this.data._loading = true

      try {
        await noteDel({uuids: [noteUuid]})
        wx.showToast({
          icon: 'success',
          title: '删除成功'
        })
        wx.reportEvent('service_note_del')

        this.triggerEvent('deleted', { note, index })
        return true
      } catch (err) {
        return Promise.reject(err)
      } finally {
        this.data._loading = false
      }
    },

    /**
     * 确认清除点赞
     */
    async confirmClearVote () {
      const index = this.properties.index
      const note = clone(this.properties.note) as NoteDetail
      const noteUuid = note.noteBase.uuid

      if (this.data._loading) return
      this.data._loading = true


      try {
        await noteUserFavorsDel({noteUuid})
        wx.reportEvent('service_note_user_favors_del')

        wx.showToast({
          icon: 'none',
          title: '笔记点赞清除成功'
        })

        this.triggerEvent('deleted', { note, index })
        return true
      } catch (err) {
        return Promise.reject(err)
      } finally {
        this.data._loading = false
      }
    },

    /** 风险提示 */
    riskTip () {
      app.showModal({
        title: '风险内容提示',
        content: '你的笔记可能含有违反相关法律法规和政策的内容，请调整后再公开分享。',
        confirmText: '查看',
        success: (res) => {
          if (res.confirm) {
            this.goToEditor({riskShow: true})
          }
        }
      })
    },

    /**
     * 检查笔记风险
     */
    async checkNoteRisk () {
      const index = this.properties.index
      const note = clone(this.properties.note) as NoteDetail
      const noteUuid = note.noteBase.uuid
      const { isGuest } = this.data

      // 客人无权限不检查，主人检查获取最新的状态
      if (!isGuest) {
        const auditInfo = await noteAuditInfo({noteUuid})

        // 更新到最新的数据
        if (
          note.noteFlag.isPublic !== auditInfo.flag.public ||
          note.noteFlag.publicStatus !== auditInfo.flag.publicStatus ||
          note.noteFlag.auditStatus !== auditInfo.audit.status
        ) {
          note.noteFlag.isPublic = auditInfo.flag.public
          note.noteFlag.publicStatus = auditInfo.flag.publicStatus
          note.noteFlag.auditStatus = auditInfo.audit.status
        }
        this.triggerEvent('changed', { note, index })
      }

      switch (note.noteFlag.auditStatus) {
        // 通过
        case 64: {
          return true
        }
        // 审核中
        case 32: {
          wx.showToast({icon: 'none', title: '笔记正在审核中，稍后再试'})
          return false
        }
        // 拒绝
        default: {
          if (isGuest) {
            wx.showToast({icon: 'none', title: '笔记审核未通过'})
          } else {
            this.riskTip()
          }
          return false
        }
      }
    },

    /**
     * 分享笔记
     */
    async share () {
      if (getPage().browseOnlyTap()) return

      // 重置分享参数
      wx.updateShareMenu({
        withShareTicket: false,
        isPrivateMessage: false
      })
      this.data._isPrivateMessage = false
      this.data._expireAt = 0

      const { isGuest } = this.data
      const note = this.properties.note as NoteDetail
      const noteUuid = note.noteBase.uuid

      // 客人
      if (isGuest) {
        switch (note.noteFlag.publicStatus) {
          // 私有
          case 0: {
            wx.showToast({icon: 'error', title: '笔记未公开'})
            break
          }
          // 完全公开
          case 1: {
            if (await this.checkNoteRisk()) {
              this.shareNote()
            }
            break
          }
          // 部分公开
          case 2: {
            const { setting } = await notePrivacySetting({uuid: noteUuid})
            const allowShare = setting ? setting.allowShare : true
            const expireAt = setting ? Number(setting.expireAt) : 0
            this.data._expireAt = expireAt

            // 笔记公开时限已过期
            if (expireAt > 0 && expireAt <= Math.round(Date.now() / 1000)) {
              wx.showToast({icon: 'none', title: '笔记公开时限已过期'})

            // 笔记不允许分享
            } else if (!allowShare) {
              wx.showToast({icon: 'none', title: '作者设置了该笔记不可转发分享'})

            // 笔记分享
            } else {
              if (await this.checkNoteRisk()) {
                this.shareNote()
              }
            }
            break
          }
        }

      // 主人
      } else {
        switch (note.noteFlag.publicStatus) {
          // 私有
          case 0: {
            if (await this.checkNoteRisk()) {
              // 转公开
              app.showModal({
                content: '设置笔记的公开状态',
                success: async (res) => {
                  // 用户确认 - 笔记转公开
                  if (res.confirm) {
                    this.togglePrivacy({
                      isPublic: true,
                      success: () => {
                        this.share()
                      }
                    })
                  }
                }
              })
            }
            break
          }
          // 完全公开
          case 1: {
            if (await this.checkNoteRisk()) {
              this.shareNote()
            }
            break
          }
          // 部分公开
          case 2: {
            const { setting } = await notePrivacySetting({uuid: noteUuid})
            const allowShare = setting ? setting.allowShare : true
            const expireAt = setting ? Number(setting.expireAt) : 0
            this.data._expireAt = expireAt

            // 笔记公开时限已过期
            if (expireAt > 0 && expireAt <= Math.round(Date.now() / 1000)) {
              wx.showToast({icon: 'none', title: '笔记公开时限已过期，请左滑重新设置。'})

            // 笔记不允许分享
            } else if (!allowShare) {
              if (await this.checkNoteRisk()) {
                const { shareId } = await notePrivacySid({uuid: noteUuid})
                wx.updateShareMenu({
                  withShareTicket: true,
                  isPrivateMessage: true,
                  activityId: shareId
                })
                this.data._isPrivateMessage = true
                this.shareNote()
              }
            }

            break
          }
        }
      }
    },

    /**
     * 分享笔记
     */
    async shareNote () {
      const profile = this.properties.profile as Profile
      const { _expireAt: expireAt, _isPrivateMessage: isPrivateMessage } = this.data
      const note = clone(this.properties.note) as NoteDetail
      const noteUuid = note.noteBase.uuid
      const path = stringifyUrl({url: '/pages/detail/index', query: { noteUuid }})
      const isTimeLimit = expireAt > 0
      const { hasCover, hasRef, hasImage, hasAudio } = note.noteFlag
      let isSharePoster = false

      const _profile : Profile = profile ? profile : {
        uid: app.globalData.uuid,
        name: app.globalData.nickName,
        avatar: app.globalData.avatar!,
        relation: 1
      }

      const apiList: ShareModalConfig['apiList'] = ['shareFriend', 'createPoster', 'officialAccounts']

      // 拜年语音时，不能生成海报
      if (hasCover) {
        apiList.splice(apiList.findIndex(item => item === 'createPoster'), 1)
      }

      // 嵌套的笔记，不能生成海报
      if (hasRef) {
        apiList.splice(apiList.findIndex(item => item === 'createPoster'), 1)
      }

      showShareModal({
        title: '分享笔记',
        path,
        apiList,
        isPrivateMessage,
        onShareFriend: async () => {
          const title = getNoteShareTitle({note, profile: _profile, isTimeLimit})

          let imageUrl = ''

          // 拜年语音封面
          if (hasCover) {
            const { covers } = await noteCovers({noteUuid})
            imageUrl = covers[0].scale.card

          // 只有嵌套的笔记
          } else if (hasRef && !hasImage && !hasAudio && !note.noteBase.digest) {
            imageUrl = ShareConfig.imageUrl

          // 分享卡片海报
          } else {
            const {url} = await posterNoteSave({
              uuid: noteUuid,
              card: true
            })
            imageUrl = url
          }

          return {title, path, imageUrl}
        },
        onCreatePoster () {
          isSharePoster = true
        },
        async onOfficialAccounts () {
          await wxToPromise(wx.setClipboardData, {
            data: stringifyUrl({url: 'pages/detail/index', query: { noteUuid }})
          })

          wx.showToast({
            icon: 'none',
            title: '已复制小程序路径，请在微信公众号后台粘贴使用',
            duration: 2500
          })
        },
        onClose () {
          // 弹窗关闭后才能跳转，否则会触发微信 bug 导致无法返回
          if (isSharePoster) {
            isSharePoster = false
            const url = stringifyUrl({
              url: '/pages/shareNote/index',
              query: {
                noteUuid,
                shareTitle: getNoteShareTitle({note, profile: _profile, isTimeLimit})
              }
            })
            wx.navigateTo({url})
          }
        }
      })
    },

    /**
     * 评论
     */
    async comment () {
      this.goToNote({commentUuid: 'first'})
    },

    /**
     * 跳转到笔记详情页
     */
    goToNote(query: {commentUuid?: string} = {}) {
      if (getPage().browseOnlyTap()) return

      const { commentUuid } = query

      const {index: noteIndex, total: noteTotal} = this.properties
      const noteUuid = (this.properties.note as NoteDetail).noteBase.uuid
      const url = stringifyUrl({
        url: '/pages/detail/index',
        query: {
          noteUuid,
          noteIndex,
          noteTotal,
          commentUuid
        }
      })
      wx.navigateTo({url})
    },

    async goToEditor ({riskShow = false}) {
      if (getPage().browseOnlyTap()) return

      const {total: noteTotal} = this.properties
      const noteUuid = (this.properties.note as NoteDetail).noteBase.uuid
      const mid = getMid(noteUuid)
      const url = stringifyUrl({
        url: '/pages/editor/index',
        query: {
          noteUuid,
          noteTotal,
          mid,
          ...(riskShow ? {riskShow} : null)
        }
      })
      wx.navigateTo({url})
    },

    /**
     * 跳转到标签详情页
     */
    goToTagDetail(e: WechatMiniprogram.TouchEvent) {
      if (getPage().browseOnlyTap()) return

      const { id, name } = e.currentTarget.dataset as NoteTag

      const url = stringifyUrl({
        url: '/pages/tagDetail/index',
        query: {
          tagId: id,
          tagName: name,
          isOfficial: false
        },
      })

      if (getPage().route === 'pages/tagDetail/index') {
        wx.redirectTo({url})
      } else {
        wx.navigateTo({url})
      }
    },

    /**
     * 点击头像
     */
    goToPeople () {
      if (getPage().browseOnlyTap()) return

      const profile = this.properties.profile as Profile

      const url = stringifyUrl({
        url: '/pages/people/index',
        query: { puid: profile.uid }
      })

      wx.navigateTo({url})
    },

    /**
     * 选择笔记
     */
    toggleSelect () {
      const selected = !this.properties.note.selected

      this.triggerEvent('select', { selected })
    },
  }
})
