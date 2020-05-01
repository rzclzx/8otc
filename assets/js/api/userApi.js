import { axios, otcAxios } from '~/plugins/axiosConfig'

const UserApi = {
  // create nickname
  createNickname (nickName) {
    return otcAxios.post('/otc/user/nickname', {
      nickName: nickName
    })
  },
  // get user profile
  getUserProfile () {
    return otcAxios.get('/otc/user/profile')
  },
  // get user transaction info (maybe)
  getUserTransaction () {
    return otcAxios.get('/otc/user/transaction')
  },
  // bind B/C
  bindBankCard (bankId, realName, bankCard, branchName, action) {
    return otcAxios.post('/otc/user/account/bank', {
      bankId,
      realName,
      bankCard,
      branchName,
      action
    })
  },
  // modify B/C
  modifyBackCard (id, bankId, realName, bankCard, branchName, action) {
    return otcAxios.post('/otc/user/account/bank/update', {
      id,
      bankId,
      realName,
      bankCard,
      branchName,
      action
    })
  },
  // 微信/支付宝绑定
  bindThirdPartyPaymentPlatform (realName, accountNo, qrCode, type, action) {
    return otcAxios.post('/otc/user/account/3ppay', {
      accountNo,
      realName,
      qrCode,
      type,
      action
    })
  },
  getAccountDetail (id) {
    return otcAxios.post('/otc/user/account/detail', { id })
  },
  // 微信/支付宝修改
  modifyThirdPartyPaymentPlatform (id, realName, accountNo, qrCode, type, action) {
    return otcAxios.post('/otc/user/account/3ppay/update', {
      id,
      accountNo,
      realName,
      qrCode,
      type,
      action
    })
  },
  // search mode of payment
  searchModeOfPayment () {
    return otcAxios.get('/otc/user/account/list')
  },
  // modify the status of payment
  modifyStatusOfPayment (id, action) {
    return otcAxios.post('/otc/user/account/update', {
      id,
      action
    })
  },
  getUserCoin (currencyId) {
    return otcAxios.post('otc/user/account/wallet/coin', {
      currencyId
    })
  },
  // 国家码字典
  listCountry () {
    return axios.post('/tools/dict/country/list')
  },
  // 进行普通认证
  realNameVerify ({country, realName, idCard}, ticket) {
    return axios.post('/user/verify/real_name', {
      country: country,
      realName: realName,
      idCard: idCard,
      ticket: ticket
    })
  },
  // 获取用户个人信息
  userPersonalInfo () {
    return axios.post('/user/user_personal_info')
  },
  // 进行高级认证
  idCardPicVerify (path) {
    return axios.post('/user/verify/idcard_pic', { pic_path: path })
  },
    // 用户银行卡列表
  getCartList: () => {
    return axios.post('/deposit/money/card/list')
  },
  // 获得一个新的图片验证码图片
  refreshCaptcha: (purpose, ticket) => {
    return axios.post('/user/security/captcha/refresh', {
      purpose: purpose,
      ticket: ticket
    })
  },
  // 校验captcha
  verifyCaptcha: (ticket, captcha) => {
    return axios.post('/user/security/captcha/verify', {
      ticket: ticket,
      captcha: captcha
    })
  }
}

export default UserApi
