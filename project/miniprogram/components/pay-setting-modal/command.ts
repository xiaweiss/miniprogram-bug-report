import { getInstance } from '../../utils/index'

type Context = WechatMiniprogram.Page.TrivialInstance | WechatMiniprogram.Component.TrivialInstance;

interface HandlerResult {
  /** 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭） */
  cancel: boolean
  /** 为 true 时，表示用户点击了确定按钮 */
  confirm: boolean
  /** 付费的设置 */
  setting: any
}

interface Handler {
  (result: HandlerResult) : void
}

export interface Config {
  /** 笔记 id */
  noteUuid: string
  /** 笔记商品 id */
  skuId: string
  /** 指定的步骤 */
  step?: number
  /** 设置成功 */
  success?: Handler | null
  /** 设置失败 */
  fail?: ((err: any) => void) | null
}

export const showPaySettingModal = (config: Config, context?: Context) => {
  getInstance('#pay-setting-modal', context)?.show(config)
}
