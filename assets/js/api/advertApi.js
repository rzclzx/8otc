import { otcAxios } from '~/plugins/axiosConfig'

const AdvertApi = {
  getAutoReply (type) {
    return otcAxios.post('/otc/post/getAutoReply', {
      type
    })
  },
  getFee () {
    return otcAxios.get('/otc/currency/ratio')
  },
  // create advert
  createAdvert (type, price, currencyId, premium, pricingType, remark, quantity, minAmount, maxAmount, tradePwd, autoReply, onlyHighAuth) {
    return otcAxios.post('/otc/post/create', {
      type,
      price,
      currencyId,
      premium,
      pricingType,
      remark,
      quantity,
      minAmount,
      maxAmount,
      tradePwd,
      autoReply,
      onlyHighAuth
    })
  },
  // get advert list
  getAdvertList (type, pageNo, currencyId, isMerchant, conditionId, pageSize = 10) {
    return otcAxios.get('/otc/post/list/online', {
      params: {
        type,
        pageNo,
        currencyId,
        isMerchant,
        conditionId,
        pageSize
      }
    })
  },
  getAdvertInfo (id) {
    return otcAxios.post('/otc/post/detail', { id })
  },
  getDeleteAdvert (postId) {
    return otcAxios.post('/otc/post/delete', { postId })
  },
  // get my advert list
  getMyAdvertList () {
    return otcAxios.get('/otc/post/mine')
  },
  // online advert
  onlineAdvert (id, amount, tradePwd) {
    return otcAxios.post('/otc/post/toOnline', {
      id,
      amount,
      tradePwd
    })
  },
  // offline advert
  offlineAdvert (id) {
    return otcAxios.post('/otc/post/toOffline', {
      id
    })
  },
  // update advert
  updateAdvert (id, price, currencyId, premium, pricingType, remark, quantity, minAmount, maxAmount, tradePwd, autoReply, onlyHighAuth) {
    return otcAxios.post('/otc/post/update', {
      id,
      price,
      premium,
      currencyId,
      pricingType,
      remark,
      quantity,
      minAmount,
      maxAmount,
      tradePwd,
      autoReply,
      onlyHighAuth
    })
  }
}

export default AdvertApi
