import { wxToPromise, getInstance } from '../../utils/index'

import { img_note_not_found } from './img_note_not_found'

Page({
  data: {
    img_note_not_found,
    /** 触发下拉刷新 */
    refresherTriggered: false,
    url: ''
  }
})
