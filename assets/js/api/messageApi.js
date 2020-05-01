import { otcAxios } from '~/plugins/axiosConfig'

const MessageApi = {
  // create advert
  createMessage (orderId, message, msgType) {
    return otcAxios.post('/otc/message/create', {
      orderId,
      message,
      msgType
    })
  },
  // get advert list
  getMessageList (orderId, queryTime) {
    return otcAxios.post('/otc/message/list', {
      orderId,
      queryTime
    })
  },
  // get advert list
  getHistoryList (orderId, id = 0, size = 20) {
    return otcAxios.post('/otc/message/history/list', {
      orderId,
      id,
      size
    })
  }
}

export default MessageApi
