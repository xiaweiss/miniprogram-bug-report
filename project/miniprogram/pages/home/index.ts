import { wxToPromise, getInstance } from '../../utils/index'

import { img_note_not_found } from './img_note_not_found'

Page({
  data: {
    img_note_not_found,
    /** 触发下拉刷新 */
    refresherTriggered: false,
    /** 列表类型 */
    type: 0,
     /** 列表（更换排序时，需要修改更新 noteList 相关代码） */
     typeList: [
      {label: '全部', scene: 1, orderList: [], hint: '', more: true, loading: false, newNum: 0},
      {label: '待支付', scene: 2, orderList: [], hint: '', more: true, loading: false, newNum: 0},
      {label: '已完成', scene: 3, orderList: [], hint: '', more: true, loading: false, newNum: 0},
    ] as any,
  },
  /** 改变列表类型 */
  changeType (e: WechatMiniprogram.CustomEvent<{type: number}>) {
    const { type } = e.detail

    // 由于没有记录滚动位置，以及空页面高度不够，切换类型时返回顶部
    this.setData({
      type,
      scrollTop: 0
    })
  }
})
