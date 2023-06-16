/**
 * 是否在 Android 上
 */
export const isAndroid = (app = getApp<AppData>()) => {
  return (
    app.globalData.systemInfo?.platform === 'android'
  )
}
