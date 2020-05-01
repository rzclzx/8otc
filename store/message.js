export const state = () => ({
  message: []
})

export const mutations = {
  SET_MESSAGE (state, payload) {
    state.message = payload.data
  }
}
