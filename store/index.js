import { axios } from '~/plugins/axiosConfig'
import ToolsApi from '~/assets/js/api/toolsApi'
import UserApi from '~/assets/js/api/userApi'
export const actions = {
  // 初始化配置
  async nuxtServerInit (store, { req }) {
    let initData = [
      store.dispatch('getOffset'),
      store.dispatch('getOtcCurrencyList')
    ]
    let token = req.token
    if (token) {
      store.commit('auth/SET_COOKIE', {
        token: token
      })
      axios.defaults.headers['ACCESS_TOKEN'] = store.state.auth.token
      initData.push(store.dispatch('getUserInfo'))
    }
    await Promise.all(initData).catch(er => {})
  },
  getOffset ({commit}) {
    return ToolsApi.getOffset()
      .then(res => {
        commit('dictionary/SET_DICTIONARY', {
          type: 'offset',
          data: res.data.offset
        })
      })
  },
  getOtcCurrencyList ({commit}) {
    return ToolsApi.getOtcCurrencyLimit()
      .then(res => {
        res.data.forEach(item => { item.name = item.name.toUpperCase() })
        commit('dictionary/SET_DICTIONARY', {
          type: 'otcCurrencyList',
          data: res.data
        })
      })
  },
// 获取用户信息
  getUserInfo ({commit}) {
    return Promise.all([ToolsApi.getUserInfo(), UserApi.getUserProfile()])
      .then(res => {
        if (res[0].data.info) {
          res[0].data.info.otcName = ''
          res[0].data.info.isMerchant = false
          if (res[1].data) {
            res[0].data.info.otcName = res[1].data.nickName
            res[0].data.info.isMerchant = res[1].data.isMerchant
          }
        }
        commit('user/SAVE_USERINFO', {
          data: res[0].data.info
        })
      })
      .catch((e) => {
        commit('auth/SET_COOKIE', {
          token: null
        })
        delete axios.defaults.headers['ACCESS_TOKEN']
      })
  }
}
