/**
 * 程序等待一段时间
 * @param ms 停止的毫秒数
 * @returns
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
