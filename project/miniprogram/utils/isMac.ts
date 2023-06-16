/**
 * 是否在 Mac 上
 */
export const isMac = (app = getApp<AppData>()) => {
  return (
    app.globalData.systemInfo?.platform === 'mac'
  )
}
