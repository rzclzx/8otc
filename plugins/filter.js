import Vue from 'vue'

function singleFormat (str) {
  return str.toString().length === 1 ? ('0' + str) : str
}

function getYMD (time) {
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  return year + '-' + singleFormat(month) + '-' + singleFormat(date)
}

function getHMS (time) {
  let hours = time.getHours()
  let minutes = time.getMinutes()
  let seconds = time.getSeconds()
  return singleFormat(hours) + ':' + singleFormat(minutes) + ':' + singleFormat(seconds)
}

const nicknameList = [
  {name: 'BTC', title: '比特币', symbol: '฿'},
  {name: 'LTC', title: '莱特币', symbol: 'Ł'},
  {name: 'BCH', title: '比特现金', symbol: 'BCH'},
  {name: 'ETH', title: '以太坊', symbol: 'E'},
  {name: 'DASH', title: '达世币', symbol: 'D'}
]

const statusArr = ['提币失败', '等待处理', '提币成功', '提币取消', '等待邮件确认', '处理中']

const Filter = {
  getOrderStatus (id) {
    let name = ''
    switch (id) {
      case 1: name = '待付款'
        break
      case 2: name = '已付款'
        break
      case 3: name = '已完成'
        break
      case 10: name = '申诉中'
        break
      case 11: name = '申诉完成'
    }
    return name
  },
  coinStatus (satus) {
    return statusArr[satus]
  },
  getAccountNickname: (name, key) => {
    if (!name) return name
    let info = nicknameList.filter(item => {
      return item.name === name
    })[0]
    return info && info[key || 'title']
  },
  numberFormat (num) {
    if (num) {
      let [num1, num2] = num.toString().split('.')
      num1 = num1.split('').reverse().map((item, index) => {
        return (index) % 3 || !index || item === '-' || item === '+' ? item : item + ','
      }).reverse().join('')
      num2 ? num = num1 + '.' + num2 : num = num1
    }
    return num
  },
  splitFormat (num, fractionDigits, len) {
    if (isNaN(num)) return num
    if (num) {
      if (num === '0') {
        return num
      }
      if (num.toString().indexOf('.') > -1) {
        let digit = num.toString().split('.')
        if (digit[1].length < fractionDigits) {
          let digitResult = ''
          for (let i = 0; i < fractionDigits - digit[1].length; i++) {
            digitResult += '0'
          }
          return num + digitResult
        } else {
          let digitResult = digit[1].substring(0, len || fractionDigits)
          return digit[0] + '.' + digitResult
        }
      } else {
        let digitResult = '.'
        for (let i = 0; i < fractionDigits; i++) {
          digitResult += '0'
        }
        return num + digitResult
      }
    } else {
      return num
    }
  },
  timeFormat (time, type) {
    let GTM_8 = 480  // -480
    let date = new Date(time)
    let subMin = date.getTimezoneOffset() + GTM_8
    date.setMinutes(date.getMinutes() + subMin)
    if (!type) return getYMD(date) + ' ' + getHMS(date)
    switch (type) {
      case 'HMS': return getHMS(date)
      case 'YMD': return getYMD(date)
    }
  }
}

Object.keys(Filter).forEach(key => {
  Vue.filter(key, Filter[key])
})
export default Filter
