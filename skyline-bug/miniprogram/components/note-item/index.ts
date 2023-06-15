// 笔记展示类型
// 1. 纯文本
// 2. 图片 + 文本
// 3. 音频 + 文本
// 4. 图片 + 音频 + 文本
// 5. 纯音频 或 纯图片
// 6. 图片 + 音频
import { secondToHMS, date, isIOS, isPC, calcTitleDigest, isSkyline, getInstance } from '../../utils/index'

import type { NoteDetail, NoteTag, Profile } from '../../services/index'

const app = getApp<AppData>()

/** 卡片类型 */
type Type = '' | 'image' | 'audio' | 'favor' | 'collect'

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
    /** 模式: 默认 '', 图片 'image', 音频 'audio', 点赞 'favor', 收藏 'collect' */
    type: { type: String, value: '' },
    /** 笔记作者信息，不填时默认为本人 */
    profile: Object,
    /** 笔记详情 */
    note: {type: Object, value: {}},
    /** 列表里笔记 index */
    index: {type: Number, value: 0},
    /** 列表里笔记总数 */
    total: {type: Number, value: 0},
    /** 是否展示笔记标签 */
    showTag: Boolean,
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
    /** 是否开启置顶 */
    enableStickyOnTop: Boolean,
    /** 是否开启滑动 */
    enableSwipe: Boolean,
    /** 是否识别 em */
    enableEm: Boolean,
    /** 是否可选 */
    enableSelect: Boolean
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
    menuStyle: '',
    /** swipe-action 右侧滑动的距离 */
    rightWidth: 0,
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

        if (noteFlag?.hasAudio && noteAudio.length) {
          audioTime = secondToHMS(noteAudio[0].duration)
        }

        if (noteFlag?.hasImage && noteImage.length) {
          isOnlyAudio = false
          imageUrl = noteImage[0].scale.w_240
        }

        if (noteBase.title || noteBase.digest) {
          isOnlyAudio = false
        }

        // 微信输入状态，用标签形式展示
        const noteTags = note.noteTags || []

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
    // 计算 swipe-action 右侧滑动的距离 rightWidth
    'confirmDelShow, type, isGuest' (confirmDelShow, type, isGuest) {
      /**
       * 右侧滑动距离计算，单位 px：
       * 长条按钮，X 按钮字数：左边距 4 + 右边距 28 + 按钮内边距 30 + 图标宽度 22 + 字宽 14 * X === 84 + 14 * X
       * 圆形按钮，X 按钮数量：左边距 4 + 右边距 28 + 圆形按钮 42 * X + 间距 14 * (X - 1) === 18 + 56 * X
       */
      let rightWidth = 0

      switch (type) {
        // 赞过
        case 'favor': {
          // 长条按钮，3（取消赞）
          if (confirmDelShow) rightWidth = 126
          // 圆形按钮，1
          else rightWidth = 74
          break
        }

        // 收藏
        case 'collect': {
          // 长条按钮，4（取消收藏）
          if (confirmDelShow) rightWidth = 140
          // 圆形按钮，2
          else rightWidth = 130
          break
        }

        // 笔记
        default: {
          // 长条按钮，2（删除）
          if (confirmDelShow) rightWidth = 112
          // 圆形按钮，1（客人）
          else if (isGuest) rightWidth = 74
          // 圆形按钮，3
          else rightWidth = 186
        }
      }

      this.setData({rightWidth})
    }
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

    closeRight () {
      getInstance('.note-item-container', this)?.close()
    },
  }
})
