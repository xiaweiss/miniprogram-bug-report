/**
 * 保留指定位数小数
 * @param num - 数值
 * @param decimals - 小数位数
 * @param config - 设置
 * @param config.round - 是否四舍五入
 * @param config.trim - 是否去掉末尾的 0
 * @returns 保留指定位数小数的字符串
 */
export const toFixed = (num: number, decimals: number, config?: {round?: boolean, trim?: boolean}) : string => {
  config = {
    round: true,
    trim: false,
    ...config
  }

  let result = ''
  if (config.round) {
    result = num.toFixed(decimals)
  } else {
    const pow = Math.pow(10, decimals)
    result = (Math.floor(num * pow) / pow).toFixed(decimals)
  }

  if (config.trim) {
    result = result.replace(/\.0+$/, '')
  }

  return result
}
