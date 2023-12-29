export interface RealNameInfo {
  /** 姓名 */
  name: string
  /** 证件号（测试环境：任意奇数成功、偶数失败） */
  cardNo: string
  /** 证件类型 1-身份证（未认证为 0） */
  cardType: number
  /** 证件名称 */
  cardName: string
}

/**
 * 用户 - 获取实名信息
 */
export const userRealnInfo = () => {
  return new Promise<RealNameInfo>(resolve => {
    setTimeout(() => {
      resolve({
        name: '',
        cardNo: '',
        cardType: 0,
        cardName: ''
      })
    })
  })
}
