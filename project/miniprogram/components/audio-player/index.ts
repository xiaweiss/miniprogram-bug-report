/**
 * 音频播放器组件
 * 使用页面：
 * 预览器页面 /pages/detail/index
 * 插入音频页面 /pages/audioRecord/index
 */
import { emitter, secondToHMS, backgroundAudioManager, getPage } from '../../utils/index'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** 资源 id */
    uuid: String,
    /** 音频路径 */
    src: String,
    /** 音频时长（可选，本地音频开始时取不到，建议传值） */
    audioDuration: Number,
    /** 颜色模式 */
    colorMode: { type: String, value: '' as '' | 'red' },
  },

  /**
   * 组件的初始数据
   */
  data: {
    /** 音频列表定时器 */
    audioListUpdateTimer: 0,
    /** 音频 index */
    audioIndex: 0,
    /** 当前时长（秒） */
    current: 0,
    /** 当前时长 */
    currentTime: '00:00',
    /** 音频时长（秒） */
    duration: 0,
    /** 音频时长 */
    durationTime: '00:00',
    /** 是否正在播放 */
    playing: false,
    /** 进度（0-100） */
    progress: 0,
    /** 拖动过程中的临时进度 */
    progressTemp: 0,
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    created () {
      this.onPlay = this.onPlay.bind(this)
      this.onPause  = this.onPause.bind(this)
      this.onStop = this.onStop.bind(this)
      this.onEnded = this.onEnded.bind(this)
      this.onTimeUpdate = this.onTimeUpdate.bind(this)
    },
    attached () {
      emitter.on('audio:onPlay', this.onPlay)
      emitter.on('audio:onPause', this.onPause)
      emitter.on('audio:onStop', this.onStop)
      emitter.on('audio:onEnded', this.onEnded)
      emitter.on('audio:onTimeUpdate', this.onTimeUpdate)
    },
    detached () {
      emitter.off('audio:onPlay', this.onPlay)
      emitter.off('audio:onPause', this.onPause)
      emitter.off('audio:onStop', this.onStop)
      emitter.off('audio:onEnded', this.onEnded)
      emitter.off('audio:onTimeUpdate', this.onTimeUpdate)
    },
  },

  observers: {
    audioDuration (audioDuration = 0) {
      const durationTime = secondToHMS(audioDuration)
      this.setData({duration: audioDuration, durationTime})
    },
  },

  methods: {
    noop () {},
    onPlay ({uuid = ''}) {
      if (uuid === this.properties.uuid) {
        this.setData({playing: true})
        this.triggerEvent('play')
      }
    },

    onPause ({uuid = ''}) {
      if (uuid === this.properties.uuid) {
        this.setData({playing: false})
        this.triggerEvent('pause')
      }
    },

    onStop ({uuid = ''}) {
      if (uuid === this.properties.uuid) {
        this.setData({playing: false})
        this.triggerEvent('stop')
      }
    },

    onEnded ({uuid = ''}) {
      if (uuid === this.properties.uuid) {
        this.setData({playing: false})
        this.triggerEvent('stop')
      }
    },

    onTimeUpdate ({uuid = '', current = 0, duration = 0, currentTime = '00:00', durationTime = '00:00', progress = 0, playing = false}) {
      if (uuid === this.properties.uuid) {

        // 播放中时，如果 playing 状态不对，需要更新 playing 时状态
        if (!this.data.playing && playing) this.triggerEvent('play')
        if (this.data.playing && !playing) this.triggerEvent('pause')

        this.setData({current, duration, currentTime, durationTime, progress, playing})
      }
    },

    /** 播放 */
    async play () {
      const { uuid, src } = this.properties
      const { duration } = this.data
      const page = getPage()
      if (page.onPlay) {
        await page.onPlay({uuid, src, duration})
      }
      backgroundAudioManager.play({uuid})
    },

    /** 暂停 */
    pause () {
      backgroundAudioManager.pause()
    },

    /** 完成一次拖动后触发的事件 */
    progressChange (event: WechatMiniprogram.CustomEvent) {
      const { value } = event.detail
      const { uuid } = this.properties
      const current = value / 100 * this.data.duration
      backgroundAudioManager.seek({uuid, current})

      // 暂时先设置进度，等 onTimeUpdate 事件触发后再更新
      this.setData({progress: value, progressTemp: 0})
    },

    /** 拖动过程中触发的事件 */
    progressChanging (event: WechatMiniprogram.CustomEvent) {
      const {value} = event.detail
      const current = value / 100 * this.data.duration
      const currentTime = secondToHMS(current)
      this.setData({current, currentTime, progressTemp: value})
    }
  }
})
