/**
 * 是否在 windows 上
 */
export const isWindows = (app = getApp<AppData>()) => {
  return (
    app.globalData.systemInfo?.platform === 'windows'
  )
}
