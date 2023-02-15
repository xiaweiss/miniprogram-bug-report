/**
 * 程序停止一段时间
 * @param ms 停止的毫秒数
 * @returns
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
