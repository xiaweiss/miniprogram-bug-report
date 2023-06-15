
/**
 * 秒数转换为时分秒
 * @param {number} second 秒数
 * @returns {string} 时分秒 或 分秒
 */
export function secondToHMS (second: number) : string {
  if (!second || second === Infinity) second = 0

  second = Math.floor(second)
  const h = Math.floor(second / 3600)
  const m = Math.floor(second / 60) - h * 60
  const s = second - h * 3600 - m * 60


  const hh = h < 10 ? '0' + h : h
  const mm = m < 10 ? '0' + m : m
  const ss = s < 10 ? '0' + s : s

  return h ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`
}
