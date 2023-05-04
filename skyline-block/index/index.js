const app = getApp()

Page({
  data: {
		isColorChanged: false
  },
  onLoad() {
	},
	
	onLongPress () {
		wx.showToast({
			icon: 'none',
			title: '长按事件',
		})
	},

	changeColor () {
		this.setData({
			isColorChanged: !this.data.isColorChanged
		})
	}
})
