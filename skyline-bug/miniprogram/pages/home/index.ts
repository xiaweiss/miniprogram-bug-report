import { arrayUniqId } from '../../utils/index'
import { noteMine } from './noteMine'

Page({
  data: {
    _loading: false,
    _noteListOrigin: [] as NoteDetail[],
    _page: 1,
    /** 总数 */
    total: 0,
    /** 触发下拉刷新 */
    refresherTriggered: false,
    /** 笔记列表 */
    noteList: [] as NoteDetail[],
    /** 是否加载完成 */
    loaded: false,
  },

  async onLoad() {
    await this.getNoteMine(1)
  },

  async onPullDownRefresh() {
    await this.getNoteMine(1)
  },

  async onReachBottom() {
    await this.getNoteMine(this.data._page + 1)
  },

  /**
   * 获取我的笔记列表
   */
  async getNoteMine (page: number) {
    const { _loading, noteList, _noteListOrigin: noteListOrigin } = this.data

    // 超过总数时，不再请求
    if (page > 1 && noteList.length >= this.data.total) return

    // 防止重复请求
    if (_loading) return
    this.data._loading = true

    try {
      const { notes, paging } = await noteMine({
        paging: {
          page,
          size: 10
        }
      })

      let _noteList: NoteDetail[] = []
      let _noteListOrigin: NoteDetail[] = []

      // 非首页合并数据
      if (page > 1) {
        _noteList = arrayUniqId([...noteList, ...notes], 'uuid')
        _noteListOrigin = [...noteListOrigin, ...notes]
      // 首页覆盖数据
      } else {
        _noteList = notes
        _noteListOrigin = notes
      }

      // 更新页码
      this.data._page = paging.page
      this.data._noteListOrigin = _noteListOrigin

      this.setData({
        noteList: _noteList,
        total: Number(paging.total)
      })

      return true
    } catch (err) {
      return Promise.reject(err)
    } finally {
      this.setData({loaded: true})
      this.data._loading = false
      if (page === 1) this.setData({refresherTriggered: false})
    }
  },
})
