import { isSkyline } from '../isSkyline'

Component({
  data: {
    isSkyline: isSkyline()
  },
  lifetimes: {
    attached () {
      // this.setData({
      //   isSkyline: isSkyline()
      // })
    }
  },
  methods: {
    log () {
      console.log('isSkyline', this.data.isSkyline)
    }
  }
})

