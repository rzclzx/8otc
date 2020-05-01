export const state = () => ({
  userInfo: null
})

export const mutations = {
  SAVE_USERINFO (state, payload) {
    state.userInfo = payload.data
  },
  SAVE_MERCHANTS  (state, payload) {
    state.userInfo.isMerchant = payload.data
  }
}
