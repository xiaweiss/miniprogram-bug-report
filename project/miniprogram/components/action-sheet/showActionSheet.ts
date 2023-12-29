import { getInstance } from '../../utils/index'

export interface ShowActionSheetOption {
  /** 按钮的文字数组，数组长度最大为 6 */
  itemList: string[]
  /** 警示文案 */
  alertText?: string
  /** 按钮的文字颜色（自定义-可以传数组） */
  itemColor?: string | string[]
  /** 按钮的文字颜色，深色模式（自定义-可以传数组） */
  itemColorDark?: string | string[]
  /** 选择器 */
  selector?: string
  /** 接口调用成功的回调函数 */
  success?: WechatMiniprogram.ShowActionSheetSuccessCallback | null
}

export interface ShowActionSheet {
  (config: ShowActionSheetOption): void
}

export const showActionSheet: ShowActionSheet = (config) => {
  const { selector = '#action-sheet' } = config
  getInstance(selector)?.show(config)
}
