const app = getApp()

Page({
  data: {
    recording: false
  },
  onLoad() {
  },
  start () {
    console.log('开始录音')
    this.recorder = wx.getRecorderManager()
    this.recorder.onStart(() => {
      console.log('onStart')
    })

    this.recorder.onError(async (res) => {
      console.log('onError', res)
      const errMsg = res.errMsg
      wx.showToast({
        icon: errMsg.length > 7 ? 'none' : 'error',
        title: errMsg,
      })
    })

    this.recorder.start({
      duration: 600000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
      sampleRate: 16000, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 48000, // 编码码率
      format: 'mp3', // 音频格式
      frameSize: 0.32, // 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3、pcm 格式
    })
    this.setData({
      recording: true
    })
  },

  end () {
    console.log('结束录音')
    this.recorder.stop()
    this.setData({
      recording: false
    })
  }
})
