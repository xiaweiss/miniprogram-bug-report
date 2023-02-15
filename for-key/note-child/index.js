Component({
  properties: {
    /** 页面数据，接收 html 字符串 */
    content: {
      type: String,
      default: '',
    },
  },

  // lifetimes: {
  //   created() {
  //     console.log('child created')
  //   },
  //   attached () {
  //     console.log('child attached')
  //   },
  //   ready() {
  //     console.log('child ready')
  //   },
  //   moved() {
  //     console.log('child moved')
  //   },
  //   detached () {
  //     console.log('child detached')
  //   }
  // }
})
