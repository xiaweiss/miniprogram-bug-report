import { wxToPromise, sleep } from '../utils/index'

const app = getApp()

Page({
  data: {
    _reachBottomTimer: 0,
    _pageScrollTop: 0,
    _timer: 0,
    _startPointY: 0,
    _loadNextStartTime: 0,
    barHeight: 0,
    heightLimit: false,
    noteDetailList: [],
    loosing: false,
    tip: false,
  },

  async onLoad() {
    const note = {uuid: 'a', content:
`
纯文字文章

第一，你确实在这公司没成长了，你每天在空转，你在消耗自己，你本是一把利剑，现在快被磨成废铜烂铁了。

第二，你讨厌所在团队的人文环境，大家做一些看起来无厘头、很可笑的事情，这已经影响了你的身心健康。

第三，工资和实力不匹配，沟通无果，无法共鸣。

这个内容来自说实话，今年互联网人跳槽的逻辑变了。小盖主笔，写挺好。但这几句话是精髓，拿出来给大家分享一下。

有同学说了，如果 1 和 2 让人难受，但就是给钱多咋办？其实也很简单，要么忍，要么走。为钱低头，也不算丢人，有了本事和资格再争取自主权呗。
`
    }
    this.setData({'noteDetailList[0]': note})
  },

  onPageScroll (e) {
    this.data._pageScrollTop = e.scrollTop
  },

  setHeightLimit () {
    return new Promise(resolve => {
      this.setData({heightLimit: true}, resolve)
    })
  },

  async onLoadNext () {
    await this.setHeightLimit()

    // step 1: show next
    await this.getNoteNext()

    // step 2: scroll to next
    await wxToPromise(wx.pageScrollTo, {selector: '.note-container-1'})

    await this.stopLoadNext()

    console.log('replace current')

    // step 3: replace current
    const { noteDetailList } = this.data
    noteDetailList.shift()
    this.setData({noteDetailList})

    await sleep(100)

    this.setData({heightLimit: false})
  },

  onTouchStart (e) {
    const { touches } = e
    if (touches.length !== 1) return

    const { windowHeight } = wx.getWindowInfo() || {}
    if (!windowHeight) return

    const query = wx.createSelectorQuery()
    query.select('.note-container-0').boundingClientRect((res) => {
      const isBottom = res.height + res.top <= windowHeight
      console.log('isBottom', isBottom, res.height, res.top, windowHeight)
      if (isBottom) {
        const { pageY } = touches[0];

        this.setData({ loosing: false });
        this.data._startPointY = pageY
      }
    }).exec()
  },

  async onTouchMove (e) {
    if (!this.data._startPointY) return

    const { touches } = e
    if (touches.length !== 1) return

    const { pageY } = touches[0]
    const barHeight = pageY - this.data._startPointY


    // 只允许向上偏移
    if (barHeight < 0) {
      this.setData({ barHeight: barHeight, tip: true })
    }
  },

  onTouchEnd (e) {
    console.log('touchend', e)
    if (!this.data._startPointY) return

    this.setData({ loosing: true })

    const { changedTouches } = e
    const { pageY } = changedTouches[0]
    const barHeight = pageY - this.data._startPointY

    this.data._startPointY = 0

    if (barHeight > -50) {
      this.stopLoadNext()
    } else {
      this.setData({ barHeight: -50})

      this.startLoadNext()

      // 超时结束上拉
      clearTimeout(this.data._reachBottomTimer)
      this.data._reachBottomTimer = setTimeout(() => {
        this.data._reachBottomTimer = 0

        this.stopLoadNext()
      }, 5000)
    }
  },

  startLoadNext () {
    this.data._loadNextStartTime = Date.now()
    this.setData({ barHeight: -50, loosing: true })
    this.onLoadNext()
  },

  async stopLoadNext () {
    // if (Date.now() - this.data._loadNextStartTime < 500) {
      // await sleep(200)
      // await this.stopLoadNext()
    // } else {
      this.setData({ barHeight: 0 })
      await sleep(300)
      this.setData({ tip: false })
    // }
  },

  async getNoteNext () {
    const note = {uuid: '' + Math.random(), content:
`
现在招聘现状是啥呢？

过去半年的数据表明，工程师，特别是 3 年左右的工程师招聘需求并没有明显减少。但产品和运营类的岗位少了很多，特别是产品。表面看产品是有很多的 HC，但追溯一下，这些 HC 可能是去年 12 月就开出来了，企业拖着节奏不停地在面试，其实并不着急。从几家大公司的招聘需求看，产品的岗位需求确实少了很多，具体原因不详。

相比工程师、设计师之类的岗位，运营岗位的业务场景属性比较强。你之前是做教育的，现在做电商，有难度。你之前是做电商的，现在做短视频运营，也有难度。所以，对于技能迁移不是那么平滑的岗位，更要思考怎么把基本功做扎实，怎么选准一个好行业然后持续深耕。

需要说明的是，这些数据来源于 Dolphin 猎头公司，并不能全部代表整个市场的情况，仅供参考和理解。

最后是胶片环节，798，最近很少外出，北京也足够拍的。

现在招聘现状是啥呢？

过去半年的数据表明，工程师，特别是 3 年左右的工程师招聘需求并没有明显减少。但产品和运营类的岗位少了很多，特别是产品。表面看产品是有很多的 HC，但追溯一下，这些 HC 可能是去年 12 月就开出来了，企业拖着节奏不停地在面试，其实并不着急。从几家大公司的招聘需求看，产品的岗位需求确实少了很多，具体原因不详。

相比工程师、设计师之类的岗位，运营岗位的业务场景属性比较强。你之前是做教育的，现在做电商，有难度。你之前是做电商的，现在做短视频运营，也有难度。所以，对于技能迁移不是那么平滑的岗位，更要思考怎么把基本功做扎实，怎么选准一个好行业然后持续深耕。

需要说明的是，这些数据来源于 Dolphin 猎头公司，并不能全部代表整个市场的情况，仅供参考和理解。

最后是胶片环节，798，最近很少外出，北京也足够拍的。
`
  }
    this.setData({'noteDetailList[1]': note})
  },

  noop () {},
})
