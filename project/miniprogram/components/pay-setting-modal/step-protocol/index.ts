Component({
  options: {
    virtualHost: true,
  },
  properties: {
    isAgree: Boolean,
  },
  methods: {
    agree () {
      this.setData({
        isAgree: !this.data.isAgree
      })
    }
  }
})
