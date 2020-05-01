export const state = () => ({
  token: null,
  locale: 'cn'
})

export const mutations = {
  SET_COOKIE (state, payload) {
    state.token = payload.token
  },
  SET_LOCALE (state, payload) {
    state.locale = payload.locale
  }
}
