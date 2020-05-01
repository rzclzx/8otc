import { axios, otcAxios, zendeskAxios } from '~/plugins/axiosConfig'
const ToolsApi = {
  // 获取用户信息
  getUserInfo () {
    return axios.post('/user/userinfo')
  },
  // 用户退出接口
  userLogout () {
    return axios.post('/user/logout')
  },
  // 公告
  getAnnouncement (locale, id) {
    return zendeskAxios.get('api/v2/help_center/' + locale + '/sections/' + id + '/articles.json?per_page=1')
  },
  // 获取服务器时间偏移量
  getOffset () {
    return axios.get('/tools/time/zone/offset')
  },
  // 获取服务器时间
  getTime () {
    return otcAxios.get('/otc/tools/getTime')
  },
  // 认证商家
  merchantApply () {
    return otcAxios.get('/otc/user/merchant/apply')
  },
  // 获取金额接口
  otcCondition () {
    return otcAxios.get('/otc/condition')
  },
  // get oss token
  getOssToken (fileName) {
    return otcAxios.post('/otc/tools/oss/token', {
      fileName: fileName
    })
  },
  // upload to oss
  uploadOss (url, data, config) {
    return axios.post(url, data, config)
  },
  // 判断是否想要交易密码
  isNeedPwd () {
    return axios.post('/orders/trade_pwd/need')
  },
  // 银行卡列表
  getBank () {
    return axios.post('/tools/dict/bank/list')
  },
  // 获取币种列表
  // getOtcCurrencyList () {
  //   return otcAxios.get('/otc/currency/list')
  // },
  // 获取币种限价
  getOtcCurrencyLimit () {
    return otcAxios.get('/otc/currency/limit')
  },
  // 获取币种指数
  getOtcPrice () {
    return otcAxios.get('/otc/price/getIndex', {params: {currencyId: 1}})
  }
}

export default ToolsApi
