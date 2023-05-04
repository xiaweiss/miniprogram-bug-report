/**
 * 是否在 PC 上
 */
export const isPC = (app = getApp<AppData>()) => {
  return (
    app.globalData.systemInfo?.platform === 'mac' ||
    app.globalData.systemInfo?.platform === 'windows'
  )
}
