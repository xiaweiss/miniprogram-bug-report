import { isPC } from './isPC'

/**
 * 判断是否是自定义导航栏
 */
export const isCustomNavigation = (systemInfo: WechatMiniprogram.SystemInfo, app = getApp<AppData>()) => {
  // PC 端不需要自定义导航栏
  if (isPC(app)) {
    return false
  } else {
    const { windowHeight, screenHeight } = systemInfo
    return windowHeight === screenHeight && typeof wx.getMenuButtonBoundingClientRect === 'function'
  }
}
