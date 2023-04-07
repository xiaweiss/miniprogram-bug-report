import { isSkyline } from "./isSkyline"

const app = getApp()

Page({
  data: {
    isSkyline: false,
  },
  onLoad() {
    this.setData({
      isSkyline: isSkyline(this),
    })
  },
})
