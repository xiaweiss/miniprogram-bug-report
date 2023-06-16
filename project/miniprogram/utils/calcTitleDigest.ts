/**
 * 计算标题摘要
 * @param digest 摘要
 * @param useText 是否使用 text 标签
 */
export const calcTitleDigest = (digest: string, useText?: boolean) => {
  let title = ''

  // 兼容旧数据（旧数据 title 存第 1 行，digest 存前 2 行，用<br>隔开）
  digest = digest.replace('<br>', '\n')

  const splitDigest = digest.split(/\n+/g)

  // 有标题时，摘要取 2 行
  if (splitDigest[0]?.length <= 20) {
    title = splitDigest[0]
    digest = splitDigest.slice(1, 3).join(useText ? '\n' : '<br>')

  // 无标题时，摘要取 3 行
  } else {
    digest = splitDigest.slice(0, 3).join(useText ? '\n' : '<br>')
  }

  return { title, digest }
}
