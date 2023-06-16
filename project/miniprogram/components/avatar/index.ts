import type { Avatar } from '../../services/index'

Component({
  options: {
    virtualHost: true,
  },
  externalClasses: ['class'],
  properties: {
    style: { type: String, value: '' },
    size: { type: Number, value: 23 },
    avatar: Object,
    url: { type: String, value: '' },
  },
  data: {
    src: '',
  },
  observers: {
    'avatar, url' (avatar: Avatar | null, url: string) {
      if (avatar?.scale.w_240) {
        this.setData({ src: avatar.scale.w_240 })
      } else if (url) {
        this.setData({ src: url })
      }
    }
  },
  methods: {
    onError () {
      this.setData({ src: '' })
    }
  }
})
