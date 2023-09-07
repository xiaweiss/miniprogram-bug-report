import { showPaySettingModal } from '../../components/pay-setting-modal/command'

Page({
  data: {
    /** 触发下拉刷新 */
    refresherTriggered: false,
  },

  onTap() {
    showPaySettingModal()
  }
})
