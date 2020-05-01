export const state = () => ({
  // 身份认证
  idTicket: ''
})

export const mutations = {
  SAVE_TICKET (state, payload) {
    state[payload.type] = payload.ticket
  }
}
