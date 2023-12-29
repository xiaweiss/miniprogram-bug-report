import { parseUrl } from 'query-string'
import { getUserProfile, log } from '../../utils/index'
import type { Avatar } from '../../services/index'

const app = getApp<AppData>()

Component({
  options: {
    pureDataPattern: /^_/,
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
    async 'avatar, url' (avatar: Avatar | null, url: string) {
      const { uuid } = app.globalData
      let avatarUrl = avatar?.scale.w_240 || url || ''

      // 去掉默认头像，使用本地图片
      if (avatarUrl.match('user/avatar/default.png')) avatarUrl = ''

      // 自己的头像过期时，重新获取一次
      if (uuid && avatarUrl && avatarUrl.match(uuid)) {
        const { query } = parseUrl(avatarUrl)
        const { Expires } = query

        if (Number(Expires) <= Date.now() / 1000) {
          await getUserProfile()
          const { userProfile } = app.globalData

          let avatarUrl = userProfile?.avatar?.scale.w_240 || ''
          if (avatarUrl.match('user/avatar/default.png')) avatarUrl = ''
          this.setData({ src: avatarUrl })
          return
        }
      }

      this.setData({ src: avatarUrl })
    }
  },
  methods: {
    async onError (e: WechatMiniprogram.ImageError) {
      const { src } = this.data

      this.setData({ src: '' })
      log.error('avatar:error', src, e)
    }
  }
})
