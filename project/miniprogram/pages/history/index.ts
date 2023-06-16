import { noteUserFavorStats, noteUserFavors, noteCommentedStats, noteCommentedNotes } from '../../services/index'
import { emitPrevPage } from '../../utils/index'
import { img_vote_not_found, img_comment_not_found } from '../../assets/img/index'

import type { NoteDetailWithProfile } from '../../services/index'

interface BackData {
  isEdit?: boolean
  noteUuid: string
}

interface TypeItem {
  label: string
  noteList: NoteDetailWithProfile[]
  page: number
  total: number
}

const app = getApp<AppData>()

Page({
  data: {
    /** 是否编辑修改过笔记 */
    _isEdit: false,
    /** 是否加载中 */
    _loading: false,
    /** 图 */
    img_vote_not_found,
    img_comment_not_found,
    notFoundHeight: 0,
    /** 触发下拉刷新 */
    refresherTriggered: false,
    /** 是否加载完成 */
    loaded: false,
    /** 一级类型 0 赞过 1 评过 */
    firstType: 0 as 0 | 1,
    /** 类型列表 */
    typeList: [
      {label: '所有', noteList: [], page: 0, total: 0},
      {label: 'TA人', noteList: [], page: 0, total: 0},
      {label: '自己', noteList: [], page: 0, total: 0}
    ] as TypeItem[],
    /** 顶部 tag 类型 0 所有，1 他人，2 自己 */
    type: 0
  },

  async onLoadLogin() {
    try {
      await this.getNoteListStats()
      await this.getNoteList(1)
    } catch (err) {
    } finally {
      this.setData({
        loaded: true,
        notFoundHeight:
          app.globalData.systemInfo!.windowHeight -
          app.globalData.safeAreaBottom - 99 * 1.5
      })
    }
  },

  onPullDownRefresh() {
    this.clearNoteList()
    this.getNoteListStats()
    this.getNoteList(1)
  },

  onReachBottom () {
    const { type, typeList } = this.data
    const { page } = typeList[type]
    this.getNoteList(page + 1)
  },

  onBack (data: BackData) {
    // 保存笔记返回后刷新列表（从预览页返回，先清空再刷新，以免滚动太久）
    if (data.isEdit) {
      this.data._isEdit = data.isEdit
      this.clearNoteList()
      this.setData({
        refresherTriggered: true
      })
    }
  },

  onUnload () {
    const { _isEdit: isEdit } = this.data
    emitPrevPage('onBack', {isEdit})
  },

  async getNoteListStats () {
    let data
    if (this.data.firstType === 0) {
      data = await noteUserFavorStats()
    } else {
      data = await noteCommentedStats()
    }

    this.setData({
      'typeList[0].total': Number(data.Stats.all.total),
      'typeList[1].total': Number(data.Stats.other.total),
      'typeList[2].total': Number(data.Stats.self.total)
    })
  },

  /**
   * switch-note 也在调用
   */
  getScene () {
    const { type } = this.data
    const sceneList = [1, 3, 2] as (1 | 2 | 3)[]
    const scene = sceneList[type]
    return scene
  },

  /**
   * 获取笔记列表
   */
  async getNoteList (page: number) {
    if (this.data.firstType === 0) {
      await this.getVoteMine(page)
    } else {
      await this.getCommentMine(page)
    }
  },

  /**
   * 赞过的笔记列表
   */
  async getVoteMine (page: number) {
    const { _loading, typeList, type } = this.data

    const { noteList, total } = typeList[type]

    const scene = this.getScene()

    // 超过总数时，不再请求
    if (page > 1 && noteList.length >= total) return

    // 防止重复请求
    if (_loading) return
    this.data._loading = true

    try {
      const { notes, profiles, paging } = await noteUserFavors({
        scene,
        paging: {
          page,
          size: 10
        }
      })

      for (const item of notes) {
        item.uuid = item.noteBase.uuid
        item.avatar = profiles[item.noteBase.uid].avatar
        item.name = profiles[item.noteBase.uid].name
      }

      let _noteList = []

      // 非首页合并数据
      if (page > 1) {
        _noteList = [...noteList, ...notes]
      // 首页覆盖数据
      } else {
        _noteList = notes
      }

      // 更新列表、页码、总数
      if (this.data.firstType === 0) {
        this.setData({
          [`typeList[${type}]noteList`]: _noteList,
          [`typeList[${type}]page`]: paging.page,
          [`typeList[${type}]total`]: Number(paging.total),
        })
      }

      return true
    } catch (err) {
      return Promise.reject(err)
    } finally {
      this.data._loading = false
      // 首页停止下拉刷新
      if (page === 1) this.setData({refresherTriggered: false})
    }
  },

  /**
   * 评过的笔记列表
   */
  async getCommentMine (page: number) {
    const { _loading, typeList, type } = this.data

    const { noteList, total } = typeList[type]

    const scene = this.getScene()

    // 超过总数时，不再请求
    if (page > 1 && noteList.length >= total) return

    // 防止重复请求
    if (_loading) return
    this.data._loading = true

    try {
      const { notes, profiles, paging } = await noteCommentedNotes({
        scene,
        paging: {
          page,
          size: 10
        }
      })

      const _notes: ({commUuid: string} & NoteDetailWithProfile)[] = []

      for (const item of notes) {
        _notes.push({
          ...item.note,
          commUuid: item.commUuid,
          uuid: item.note.noteBase.uuid,
          avatar: profiles[item.note.noteBase.uid].avatar,
          name: profiles[item.note.noteBase.uid].name,
        })
      }

      let _noteList = []

      // 非首页合并数据
      if (page > 1) {
        _noteList = [...noteList, ..._notes]
      // 首页覆盖数据
      } else {
        _noteList = _notes
      }

      // 更新列表、页码、总数
      if (this.data.firstType === 1) {
        this.setData({
          [`typeList[${type}]noteList`]: _noteList,
          [`typeList[${type}]page`]: paging.page,
          [`typeList[${type}]total`]: Number(paging.total),
        })
      }

      return true
    } catch (err) {
      return Promise.reject(err)
    } finally {
      this.data._loading = false
      // 首页停止下拉刷新
      if (page === 1) this.setData({refresherTriggered: false})
    }
  },

  /**
   * 清空统计数据
   */
  clearNoteStats () {
    this.setData({
      'typeList[0].total': 0,
      'typeList[1].total': 0,
      'typeList[2].total': 0,
    })
  },

  /**
   * 清空笔记列表
   */
  clearNoteList () {
    this.setData({
      'typeList[0].noteList': [],
      'typeList[1].noteList': [],
      'typeList[2].noteList': [],
      'typeList[0].page': 0,
      'typeList[1].page': 0,
      'typeList[2].page': 0,
    })
  },

  /**
   * 列表项删除了
   */
  onNoteItemDeleted (e: WechatMiniprogram.CustomEvent<{note: NoteDetailWithProfile}>) {
    const { note } = e.detail
    const { typeList, type } = this.data

    const noteUuid = note.uuid

    const indexAll = typeList[0].noteList.findIndex(item => item.uuid === noteUuid)
    const indexGuest = typeList[1].noteList.findIndex(item => item.uuid === noteUuid)
    const indexMe = typeList[2].noteList.findIndex(item => item.uuid === noteUuid)

    if (indexAll >= 0) {
      typeList[0].total -= 1
      typeList[0].noteList.splice(indexAll, 1)
    }

    if (indexGuest >= 0) {
      typeList[1].total -= 1
      typeList[1].noteList.splice(indexGuest, 1)
    }

    if (indexMe >= 0) {
      typeList[2].total -= 1
      typeList[2].noteList.splice(indexMe, 1)
    }

    this.setData({
      ...(indexAll >= 0 ? {'typeList[0]' : typeList[0]} : null),
      ...(indexGuest >= 0 ? {'typeList[1]' : typeList[1]} : null),
      ...(indexMe >= 0 ? {'typeList[2]' : typeList[2]} : null),

    })

    // 连续删除多条笔记，笔记数不足一页 10 条时，为了避免空提示出现影响触底，主动触发下 onReachBottom
    if (typeList[type].noteList.length < 10 && typeList[type].noteList.length < typeList[type].total) {
      this.onReachBottom()
    }
  },

  /**
   * 切换一级类型（0 赞过、1评过）
   */
  toggleFirstType (e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    this.setData({firstType: index})
    this.clearNoteStats()
    this.clearNoteList()
    this.getNoteListStats()
    this.getNoteList(1)
  },

  /**
   * 切换顶部 tag 类型
   */
  changeType (e: WechatMiniprogram.TouchEvent) {
    const { typeList } = this.data
    const { index } = e.currentTarget.dataset
    this.setData({ type: index })

    const noteList = typeList[index].noteList

    if (!noteList.length) {
      this.getNoteList(1)
    }
  }
})
