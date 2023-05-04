type Context = WechatMiniprogram.Page.TrivialInstance | WechatMiniprogram.Component.TrivialInstance;

/**
 * 是否 skyline 渲染模式（请在 onLoad 时调用）
 */
export const isSkyline = (context?: Context) => {
  if (!context) {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    context = page
  }

  if (!context) {
    console.error('isSkyline: context is undefined. 请在 onLoad、attached 时调用')
    return false
  }

  return context.renderer === 'skyline'
}
