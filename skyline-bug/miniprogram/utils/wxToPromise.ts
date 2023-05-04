type Res = WechatMiniprogram.GeneralCallbackResult

type Result<T = WechatMiniprogram.GeneralCallbackResult, E = WechatMiniprogram.GeneralCallbackResult> = Promise<[T?, E?]>

/**
 * 微信 api 转为 promise
 */
function wxToPromise (authPrivateMessage: typeof wx.authPrivateMessage, option: WechatMiniprogram.AuthPrivateMessageOption) : Result<WechatMiniprogram.AuthPrivateMessageSuccessCallbackResult>
function wxToPromise (chooseImage: typeof wx.chooseImage, option: WechatMiniprogram.ChooseImageOption) : Result<WechatMiniprogram.ChooseImageSuccessCallbackResult>
function wxToPromise (chooseMedia: typeof wx.chooseMedia, option: WechatMiniprogram.ChooseMediaOption) : Result<WechatMiniprogram.ChooseMediaSuccessCallbackResult>
function wxToPromise (downloadFile: typeof wx.downloadFile, option: WechatMiniprogram.DownloadFileOption) : Result<WechatMiniprogram.DownloadFileSuccessCallbackResult>
function wxToPromise (getClipboardData: typeof wx.getClipboardData) : Result<WechatMiniprogram.GetClipboardDataSuccessCallbackOption & WechatMiniprogram.GeneralCallbackResult>
function wxToPromise (getImageInfo: typeof wx.getImageInfo, option: WechatMiniprogram.GetImageInfoOption) : Result<WechatMiniprogram.GetImageInfoSuccessCallbackResult>
function wxToPromise (getNetworkType: typeof wx.getNetworkType): Result<WechatMiniprogram.GetNetworkTypeSuccessCallbackResult>
function wxToPromise (getSetting: typeof wx.getSetting): Result<WechatMiniprogram.GetSettingSuccessCallbackResult>
function wxToPromise (login: typeof wx.login) : Result<WechatMiniprogram.LoginSuccessCallbackResult>
function wxToPromise (navigateBack: typeof wx.navigateBack, option: WechatMiniprogram.NavigateBackOption) : Result
function wxToPromise (previewImage: typeof wx.previewImage, option: WechatMiniprogram.PreviewImageOption) : Result
function wxToPromise (setClipboardData: typeof wx.setClipboardData, option: WechatMiniprogram.SetClipboardDataOption) : Result
function wxToPromise (setKeepScreenOn: typeof wx.setKeepScreenOn, option: WechatMiniprogram.SetKeepScreenOnOption) : Result
function wxToPromise (showModal: ShowModal, option: ShowModalOption): Result<WechatMiniprogram.ShowModalSuccessCallbackResult>
function wxToPromise (showShareImageMenu: typeof wx.showShareImageMenu, option: WechatMiniprogram.ShowShareImageMenuOption) : Result
function wxToPromise (updateShareMenu: typeof wx.updateShareMenu, option: WechatMiniprogram.UpdateShareMenuOption) : Result

function wxToPromise (checkSession: typeof wx.checkSession): Result

function wxToPromise (stat: WechatMiniprogram.FileSystemManager['stat'], option: WechatMiniprogram.StatOption) : Result<WechatMiniprogram.StatSuccessCallbackResult>
function wxToPromise (readdir: WechatMiniprogram.FileSystemManager['readdir'], option: WechatMiniprogram.ReaddirOption) : Result<WechatMiniprogram.ReaddirSuccessCallbackResult>
function wxToPromise (mkdir: WechatMiniprogram.FileSystemManager['mkdir'], option: WechatMiniprogram.MkdirOption) : Result
function wxToPromise (mkdir: WechatMiniprogram.FileSystemManager['rmdir'], option: WechatMiniprogram.RmdirOption) : Result
function wxToPromise (readFile: WechatMiniprogram.FileSystemManager['readFile'], option: WechatMiniprogram.ReadFileOption) : Result<WechatMiniprogram.ReadFileSuccessCallbackResult>
function wxToPromise (writeFile: WechatMiniprogram.FileSystemManager['writeFile'], option: WechatMiniprogram.WriteFileOption) : Result
function wxToPromise (unlink: WechatMiniprogram.FileSystemManager['unlink'], option: WechatMiniprogram.UnlinkOption) : Result

function wxToPromise (api: any, option?: any): Result {
  // API 存在判断
  if (!api) {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
    return Promise.reject()
  }

  return new Promise((resolve) => {
    api({
      ...option,
      success (res: Res) {
        resolve([res, undefined])
      },
      fail (err: Res) {
        console.error(err)
        resolve([undefined, err])
      },
    })
  })
}

export {
  wxToPromise
}
