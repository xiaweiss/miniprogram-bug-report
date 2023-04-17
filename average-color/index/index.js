import { wxToPromise, dominantAlgorithm } from '../utils/index'

const app = getApp()

Component({
  data: {
    imageUrl: '',
    imageBgColor: ''
  },
  lifetimes: {
    attached () {

    }
  },
  methods: {
    async chooseImage () {
      const [res] = await wxToPromise(wx.chooseImage, {
        count: 1,
        sizeType: ['original'],
        sourceType: ['album']
      })

      if (res) {
        this.setImage(res.tempFilePaths[0])
      }
    },

    async setImage (imageUrl) {
      // 图片占满了，不计算背景了（略）

      // 图片没占满，计算背景
      const [res] = await wxToPromise(wx.getImageInfo, { src: imageUrl })

      if (res) {
        // 自行计算背景色
        const imageInfo = res
        const width = 5 // 每行抽取点个数
        const height = 2 // 抽取顶部行、底部行

        // 创建离屏 2D canvas 实例（画布尺寸越大，越消耗性能）
        const canvas = wx.createOffscreenCanvas({type: '2d', width, height, compInst: this})
        const context = canvas.getContext('2d')

        const img = canvas.createImage()

        await new Promise(resolve => {
          img.onload = resolve
          img.src = imageInfo.path // 要加载的图片 url
        })

        // 把图片画到离屏 canvas 上
        context.clearRect(0, 0, width, height)

        // 第一行抽取的 4 个点
        const dis = imageInfo.width / 4

        // 第一行
        context.drawImage(img, 0          , 0, 1, 1, 0,     0, 1, 1);
        context.drawImage(img, dis        , 0, 1, 1, 1,     0, 1, 1);
        context.drawImage(img, dis * 2    , 0, 1, 1, 1 * 2, 0, 1, 1);
        context.drawImage(img, dis * 3    , 0, 1, 1, 1 * 3, 0, 1, 1);
        context.drawImage(img, dis * 4 - 1, 0, 1, 1, 1 * 4, 0, 1, 1);

        // 最后一行
        context.drawImage(img, 0           ,imageInfo.height - 1, 1, 1, 0,     1, 1, 1);
        context.drawImage(img, dis         ,imageInfo.height - 1, 1, 1, 1,     1, 1, 1);
        context.drawImage(img, dis * 2     ,imageInfo.height - 1, 1, 1, 1 * 2, 1, 1, 1);
        context.drawImage(img, dis * 3     ,imageInfo.height - 1, 1, 1, 1 * 3, 1, 1, 1);
        context.drawImage(img, dis * 4 - 1 ,imageInfo.height - 1, 1, 1, 1 * 4, 1, 1, 1);

        // 获取画完后的数据
        const bitmapData = context.getImageData(0, 0, width, height).data

        // 使用算法计算平均颜色
        const averageColor = dominantAlgorithm(bitmapData)

        // 这里最后将本地路径给 image 标签，以免多次从网络加载图片
        this.setData({
          imageUrl: res.path,
          imageBgColor: averageColor
        })
      }
    }
  }
})
