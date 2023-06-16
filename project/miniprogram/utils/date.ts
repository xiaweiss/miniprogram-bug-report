/**
 * 格式化日期
 * @param {number} timestamp 时间戳 秒
 * @param {string} format 日期格式，默认 YYYY-MM-DD
 */
export const date = (timestamp: number, format = 'YYYY-MM-DD') : string => {
  if (timestamp) {
    const _date = new Date(timestamp * 1000)
    const _year = String(_date.getFullYear())
    let _month = String(_date.getMonth() + 1)
    let _day = String(_date.getDate())
    let _hour = String(_date.getHours())
    let _minute = String(_date.getMinutes())
    let _second = String(_date.getSeconds())

    if (format === 'relative') {
      const now = new Date()
      const _diff = Math.floor(now.getTime() / 1000) - timestamp
      const yesterday = new Date(now.getTime() - 86400000)
      const yesterdayYear = String(yesterday.getFullYear())
      const yesterdayMonth = String(yesterday.getMonth() + 1)
      const yesterdayDay = String(yesterday.getDate())

      if (_year === yesterdayYear && _month === yesterdayMonth && _day === yesterdayDay) return date(timestamp, '昨天 hh:mm')

      if (_diff < 60) return '刚刚'
      if (_diff < 3600) return `${Math.floor(_diff / 60)} 分钟前`
      if (_diff < 86400) return `${Math.floor(_diff / 3600)} 小时前`

      return date(timestamp, 'M-D hh:mm')
    }

    let _week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][_date.getDay()]

    _month = _month.length === 2 ? _month : '0' + _month
    _day = _day.length === 2 ? _day : '0' + _day
    _hour = _hour.length === 2 ? _hour : '0' + _hour
    _minute = _minute.length === 2 ? _minute : '0' + _minute
    _second = _second.length === 2 ? _second : '0' + _second

    format = format.replace('YYYY', _year)
    format = format.replace('YY', _year.replace(/^\d{2}/gi, ''))
    format = format.replace('MM', _month)
    format = format.replace('M', _month.replace(/^0{1}/gi, ''))
    format = format.replace('DD', _day)
    format = format.replace('D', _day.replace(/^0{1}/gi, ''))

    // 12 小时制
    if (format.includes('a')) {
      let hour = Number(_hour)
      let _ampm = hour >= 12 ? '下午' : '上午'
      hour = hour % 12;
      hour = hour ? hour : 12;
      format = format.replace('a', _ampm)
      format = format.replace('hh', String(hour))
      format = format.replace('h', String(hour).replace(/^0{1}/gi, ''))
    // 24 小时制
    } else {
      format = format.replace('hh', _hour)
    }

    format = format.replace('mm', _minute)
    format = format.replace('ss', _second)

    format = format.replace('W', _week)

    return format
  }

  console.error('date: timestamp is undefined', timestamp)
  return ''
}
