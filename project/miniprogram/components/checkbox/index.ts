Component({
  options: {
    virtualHost: true,
  },
  externalClasses: ['class'],
  properties: {
    checked: Boolean,
  },
  methods: {
    onTap () {
      this.setData({
        checked: !this.data.checked,
      })
    }
  }
})
