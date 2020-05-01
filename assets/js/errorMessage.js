import Vue from 'vue'

let checkMsg = {
  verifyIdCard: (identityNo) => {
    if (!identityNo) {
      return Vue.$i18n_t('message.placeHaveSfz')
    }
    if (!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(identityNo))) {
      return Vue.$i18n_t('message.sfzError')
    }
    return ''
  },
  verifyLicenseNumber: (identityNo) => {
    if (!identityNo) {
      return Vue.$i18n_t('message.placeCart')
    }
    if (!(/^[a-z0-9]+$/i).test(identityNo)) {
      return Vue.$i18n_t('message.cartError')
    }
    return ''
  },
  verifyRealName: (realName) => {
    if (!realName) {
      return Vue.$i18n_t('message.placeName')
    }
    return ''
  },
  checkHighAuth: (fileName, fileNameError) => {
    if (fileName && fileNameError) {
      return ''
    } else {
      return false
    }
  },
  verifyHighAuth: (fileNameOne, fileNameTwo, fileNameThree) => {
    // if (!fileNameOne || !fileNameTwo || !fileNameThree) {
    //   return '请先上传证件照！'
    // }
    if (!fileNameOne) {
      return Vue.$i18n_t('message.placeCartOne')
    }
    if (!fileNameTwo) {
      return Vue.$i18n_t('message.placeCartTwo')
    }
    if (!fileNameThree) {
      return Vue.$i18n_t('message.placeCartThree')
    }
    return ''
  },
  isIdCard: (cardid) => {
    // 身份证正则表达式(18位)
    let isIdCard2 = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    let stard = '10X98765432' // 最后一位身份证的号码
    let first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 1-17系数
    let sum = 0
    if (!isIdCard2.test(cardid)) {
      return false
    }
    let year = cardid.substr(6, 4)
    let month = cardid.substr(10, 2)
    let day = cardid.substr(12, 2)
    let birthday = cardid.substr(6, 8)
    // 校验日期是否合法
    if (birthday !== checkMsg.dateToString(new Date(year + '/' + month + '/' + day))) {
      return false
    }
    for (let i = 0; i < cardid.length - 1; i++) {
      sum += cardid[i] * first[i]
    }
    let result = sum % 11
    let last = stard[result] // 计算出来的最后一位身份证号码
    if (cardid[cardid.length - 1].toUpperCase() === last) {
      return true
    } else {
      return false
    }
  },
  // 日期转字符串 返回日期格式20080808
  dateToString: (date) => {
    if (date instanceof Date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      return year.toString() + month.toString() + day.toString()
    }
    return ''
  },
  // 验证资金密码
  moneyPwdVerity: (pwd) => {
    if (!pwd) {
      return Vue.$i18n_t('message.placeMoneyPwd')
    }
    if (!(/^\d{6}$/.test(pwd))) {
      return Vue.$i18n_t('message.moneyPwdError')
    }
    return ''
  },
  bankVerity: (num) => {
    if (!num) {
      return false
    }
    let odd = 0
    let even = 0
    let n = 0
    for (let i = num.length; i--;) {
      n = Number(num.slice(i, i + 1))
      if (isNaN(n)) {
        return false
      }
      if ((num.length - i) % 2) {
        odd += n
      } else {
        n *= 2
        if (n.toString().length === 2) {
          n -= 9
        }
        even += n
      }
    }
    if ((odd + even) % 10) {
      return false
    }
    return true
  }
}

export default checkMsg
