import { isPC } from './isPC'
import { wxToPromise } from './wxToPromise'

interface ChooseImageOptions {
  /** 最多可以选择的图片张数 */
  count: number
  /** 所选的图片的尺寸 */
  sizeType?: ('original' | 'compressed')[]
}

/**
 * 选择图片并上传
 * @param count 最多选择图片数量
 * @param sizeType 图片尺寸
 * @returns tempFilePaths 选择的图片列表
 */
export const chooseImage = async ({count, sizeType = ['original']} : ChooseImageOptions) => {
  let tempFilePaths : string[] = []
  if (isPC()) {
    const [res] = await wxToPromise(wx.chooseImage, {
      count: Math.max(count, 9),
      sizeType,
      sourceType: ['album']
    })
    if (res) {
      tempFilePaths = res.tempFilePaths
    }
  } else {
    const [res] = await wxToPromise(wx.chooseMedia, {
      count,
      mediaType: ['image'],
      sizeType,
      sourceType: ['album']
    })
    if (res) {
      tempFilePaths = res.tempFiles.map(item => item.tempFilePath)
    }
  }

  return { tempFilePaths }
}
