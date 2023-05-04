type Context = WechatMiniprogram.Page.TrivialInstance | WechatMiniprogram.Component.TrivialInstance;

/**
 * 获取组件实例
 * @param selector 选择器
 * @param context 组件上下文
 */
export const getInstance = (selector: string, context?: Context) => {
  if (!context) {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    context = page
  }

  const instance = context ? context.selectComponent(selector) : null
  if (!instance) {
    console.warn('未找到组件, 请检查 selector 是否正确')
    return null
  }
  return instance
}
