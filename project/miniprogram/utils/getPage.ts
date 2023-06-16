/**
 * 获取当前页面实例
 * 不要在 App.onLaunch 的时候调用，此时 page 还没有生成。
 */
export const getPage = () => {
  return getCurrentPages().pop()!
}

