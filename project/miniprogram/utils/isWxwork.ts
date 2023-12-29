/**
 * 是否企业微信
 */
export const isWxwork = (app = getApp<AppData>()) => {
  return app.globalData.systemInfo?.environment === 'wxwork'
}
