export default ({ store }) => {
  store.enum = {
    trade: {
      // 广告买入
      advBuy: 2,
      // 广告出售
      advSell: 1
    },
    userPersonalInfo: {
      NOT_UPLOADED: 0, // 未上传
      WAITING_AUTH: 1, // 等待审核
      AUTH_FAIL: 2, // 审核不通过
      AUTH_PASS: 3 // 审核通过
    },
    // 支付方式
    bankType: {
      bank: 0,
      pay: 1,
      wechat: 2
    },
    orderStatus: {
      // 待付款
      thePayment: 1,
      // 已付款
      hasPayment: 2,
      // 已完成
      beenCompleted: 3,
      // 申诉中
      theComplaint: 10,
      // 申诉完成
      beenComplete: 11
    }
  }
}
