import { getInstance } from '../../utils/index'
import type { RealNameInfo } from '../../services/index'

export interface Config {
  /** 设置成功 */
  success: (({realNameInfo} : {realNameInfo: RealNameInfo}) => void) | null

  /** 设置失败 */
  fail?: ((err: any) => void) | null
}

export const showRealNameModal = (config: Config) => {
  getInstance('#real-name-modal')?.show(config)
}
