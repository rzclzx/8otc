import { otcAxios } from '~/plugins/axiosConfig'

const OrderApi = {
  // create Order
  createOrder (advertiseId, price, quantity, tradePwd) {
    return otcAxios.post('/otc/order/create', {
      advertiseId,
      price,
      quantity,
      tradePwd
    })
  },
  // get order list
  getOrderList (status, pageNo, currencyId, pageSize = 10) {
    return otcAxios.post('/otc/order/list', {
      status,
      currencyId,
      pageNo,
      pageSize
    })
  },
  orderChange (orderId, action, tradePwd) {
    return otcAxios.post('/otc/order/status/change', {
      orderId,
      action,
      tradePwd
    })
  },
  orderCancel (orderId) {
    return otcAxios.post('/otc/order/cancel', {
      orderId
    })
  },
  orderDetail (orderId) {
    return otcAxios.post('/otc/order/detail', {
      orderId,
      status: 1
    })
  },
  orderStatus (orderId, status) {
    return otcAxios.post('/otc/order/status', {
      orderId,
      status: 1
    })
  },
  orderCommentList (orderId) {
    return otcAxios.post('/otc/order/comment/list', {
      orderId
    })
  },
  orderComment (orderId, action) {
    return otcAxios.post('/otc/order/comment/create', {
      orderId,
      action
    })
  },
  // 获取订单最新价格
  getOrderPrice (postId) {
    return otcAxios.post('otc/price/getPrice', {
      postId
    })
  }
  // get order detail
}

export default OrderApi
