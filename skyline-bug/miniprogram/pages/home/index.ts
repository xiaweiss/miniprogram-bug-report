Page({
  data: {
    linkModalShow: false,
    isFold: false,
    isShow: false
  },
  showLinkModal () {
    this.setData({
      linkModalShow: true
    })
  },
  closeLinkModal () {
    this.setData({
      linkModalShow: false
    })
  },
  noop () {},

  onLoad () {

  },

  onTap () {
    this.setData({
      isShow: !this.data.isShow
    })
  },
})
