<template>
  <div class="order-detail">
    <div class="prompt">
      <st-row align="center" justify="between" v-if="haveCart(info)">
        <p><span></span>{{$t('order.placeTime', {time: this.info.orderType === 1 ? 20 : 30})}}</p>
        <div>
          <!--<nuxt-link to="/">申诉次订单</nuxt-link>-->
        </div>
      </st-row>
    </div>
    <div class="detail">
      <st-row class="detail-top" justify="between">
        <div class="detail-top-one">
          <div>
            <p class="p-title">{{$t('order.tradeMoney')}}：</p>
            <h6>{{info.amount}}<span> CNY</span></h6>
          </div>
          <div>
            <p class="p-title">{{$t('order.tradeNumber')}}：</p>
            <h6>{{info.quantity}} {{getCoinName(info.currencyId)}}</h6>
          </div>
          <div>
            <p class="p-title">{{$t('order.tradePrice')}}：</p>
            <h6>{{info.price}} CNY</h6>
          </div>
        </div>
        <div class="detail-top-two">
         <p class="p-title">{{$t('order.payType')}}：</p>
          <ul>
            <li v-for="item in info.bankCardDTOS">
              <template >
                <st-row>
                  <div :class="'img-pay pay' + item.bankType" ></div>
                  <div>
                    <p style="max-width: 240px;">{{item.realName}}&nbsp;&nbsp;{{getPaymentName(item)}}</p>
                    <p> {{item.branchName}} </p>
                    <p style="max-width: 240px;word-wrap: break-word;">{{[1, 2].indexOf(item.bankType)> -1 ? item.accountNo : item.accountNo.split('').map(function(item, index) {  return (index + 1) % 4 ?  item : item + ' ' }).join('')}}</p>
                  </div>
                  <p> </p>
                  <div class="img-ewm" >
                    <i v-if="'1,2'.indexOf(item.bankType)>-1"><div class="cart-sm-ewm" v-if="item.qrcode"><span></span><img :src="oosUrl+item.qrcode" ></div></i>
                  </div>
                </st-row>
              </template>
            </li>
          </ul>
        </div>
        <div class="detail-top-three">
          <p class="p-title"><span></span>{{$t('order.attention')}}：</p>
          <ul v-if="haveCart (info)">
            <li>1.<span>{{$t('order.attentionBuyOne')}}</span></li>
            <li>2.<span>{{$t('order.attentionBuyTwo')}}</span></li>
            <li>3.<span>{{$t('order.attentionBuyThree')}}<a target="_blank" style="color: #ff7300;" href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360001377873-58-OTC%E4%BA%A4%E6%98%93%E8%A7%84%E5%88%99">{{$t('order.attentionBuyFore')}}</a> </span></li>
          </ul>
          <ul v-else>
          <li>1.<span>{{$t('order.attentionSellOne')}}</span></li>
          <li>2.<span>{{$t('order.attentionSellTwo')}}</span></li>
          <li>3.<span>{{$t('order.attentionSellThree')}}</span></li>
        </ul>
        </div>
      </st-row>
      <st-row class="detail-bottom" justify="between" align="end">
        <div class="detail-bottom-left">
          <p v-if="info.makerId !== this.userInfo.id">{{info.orderType === 2 ? $t('order.buyRemark') : $t('order.sellRemark')}}：<span>{{info.remark}}</span></p>
          <p style="width: 600px">{{$t('order.payCode')}}：<span>{{info.payCode}}</span> {{$t('order.payCodeOne')}}</p>
        </div>
        <st-row class="detail-bottom-right">
          <a  class="btn-one"  v-if="cancelPayment(info)" @click="twoConfirm(info.id, 99)">{{$t('order.upTrade')}}</a>
          <a  class="btn-two" v-if="havePayment(info)" @click="twoConfirm(info.id, 2)">{{$t('order.myConfirmPayment')}}</a>
          <!--<template v-if="havePayment(info)">-->
            <!--<a  class="btn-one"  v-if="info.orderType === 1" @click="twoConfirm(info.id, 99)">取消交易</a>-->
            <!--<a  class="btn-two"  @click="twoConfirm(info.id, 2)">我已完成转账</a>-->
          <!--</template>-->
          <template v-else-if="havePut(info)">
            <a class="btn-one" @click="twoConfirm(info.id, 3)">{{$t('order.confirmCoin')}}</a>
            <a class="btn-two" v-if="info.status === 2" @click="twoConfirm(info.id, 10)">{{$t('order.orderComplaint')}}</a>
          </template>
        </st-row>
      </st-row>
    </div>
    <!--<popup :title="$t('order.cartAuth')" width="480" :callback="complaintClose" v-if="isComplaint">-->
      <!--<order-complaint-window  :close="complaintClose"></order-complaint-window>-->
    <!--</popup>-->
    <popup :title="message[0]" width="480" :callback="twoConfirmClose" v-if="isTwoConfirm">
      <order-two-confirm-window :message="message" :typeId="typeId" :orderInfoId="orderInfoId"  :close="twoConfirmClose"></order-two-confirm-window>
    </popup>
  </div>
</template>

<script>
  import Popup from '../../components/common/popup/popup'
  import orderTwoConfirmWindow from './order-two-confirm-window'
  import apiConfig from '../../config/api.config'
  export default {
    name: 'order-detail',
    props: ['info'],
    components: {
      Popup,
      orderTwoConfirmWindow
    },
    data () {
      return {
        oosUrl: apiConfig.oosImgUrl,
        isTwoConfirm: false,
        orderInfoId: '',
        cancelId: '',
        typeId: '',
        message: [],
        messageList: {
          2: [this.$t('order.confirmPayment'), this.$t('order.confirmPaymentMessage'), this.$t('order.confirmPaymentWarning'), this.$t('order.confirmPayment'), this.$t('order.up'), this.$t('order.confirmPaymentMy')],
          3: [this.$t('order.confirmReleased'), this.$t('order.confirmReleasedMessage'), this.$t('order.confirmReleasedWarning'), this.$t('order.confirmReleased'), this.$t('order.up')],
          10: [this.$t('order.submitComplaint'), this.$t('order.submitComplaintMessage'), this.$t('order.submitComplaintWarning'), this.$t('order.submitComplaintConfirm'), this.$t('order.up')],
          99: [this.$t('order.upTrade'), this.$t('order.upOneTrade'), this.$t('order.cancelOne'), this.$t('order.confirmUp'), this.$t('order.continueTrade'), this.$t('order.upOneTradeMy')]
        }
      }
    },
    computed: {
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      },
      userInfo () {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
      getCoinName (coinId) {
        let name = this.currencyList.filter(item => { return item.currencyId === coinId })[0].name
        return name
      },
      havePayment (info) {
        // 待付款只能是用户为挂买单或者用户交易卖单才能操作
        let bl = false
        if (info.status === 1) {
          if (info.makerId === this.userInfo.id) {
            bl = info.orderType === 2
          } else {
            bl = info.orderType === 1
          }
        }
        return bl
      },
      cancelPayment (info) {
        let bl = false
        if (info.status === 1) {
          if (info.makerId !== this.userInfo.id) {
            bl = info.orderType === 1
          }
        }
        return bl
      },
      havePut (info) {
        // 放币是用户挂卖单或者用户交易买单才能操作
        let bl = false
        if ([2, 10, 11].indexOf(info.status) > -1) {
          if (info.makerId === this.userInfo.id) {
            bl = info.orderType === 1
          } else {
            bl = info.orderType === 2
          }
        }
        return bl
      },
      haveCart (info) {
        let bl = false
        if (info.makerId === this.userInfo.id) {
          bl = info.orderType === 2
        } else {
          bl = info.orderType === 1
        }
        return bl
      },
      twoConfirm (id, typeId) {
        this.message = this.messageList[typeId]
        this.orderInfoId = id
        this.typeId = typeId
        this.isTwoConfirm = true
      },
      twoConfirmClose () {
        this.isTwoConfirm = false
      },
      getPaymentName (item) {
        if (item.bankType === 1) {
          return this.$t('order.payTypeOne')
        } else if (item.bankType === 2) {
          return this.$t('order.payTypeTwo')
        } else {
          return item.bankName
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/theme";
.order-detail {
  margin-top: 2px;
  background-color: #fff;
  .prompt {
    margin: 0 40px 0;
    padding-top: 19px;
    &>div {
      padding: 0 20px;
      width: 1080px;
      height: 40px;
      background-color: #f8f9fb;
      font-size: 12px;
      p {
        color: #6c85ae;
        span {
          display: inline-block;
          vertical-align: sub;
          margin-right: 9px;
          width: 16px;
          height: 16px;
          background: url("../../assets/images/tips1.png");
        }
      }
      div {
        a {
          color: #6c85ae;
        }
      }
    }
  }
  .detail {
    padding: 30px 60px 60px;
    .detail-top {
      .detail-top-one,.detail-top-two,.detail-top-three {
        .p-title {
          height: 30px;
          line-height: 30px;
          color: #999;
          font-size: 12px;
        }
      }
      .detail-top-one {
        div:first-child {
          h6 {
            height: 46px;
            font-size: 28px;
            line-height: 46px;
            color: #597ab9;
            span {
              font-size: 16px;
            }
          }
        }
        div:nth-child(n+2) {
          h6 {
            height: 34px;
            line-height: 34px;
            font-size: 16px;
          }
        }
        div h6 {
          margin-bottom: 10px;
        }
      }
      .detail-top-two {
        ul {
          margin-top: 10px;
          li {
            margin-bottom: 30px;
            p {
              margin: 0 12px;
              font-size: 14px;
            }
            .img-pay {
              width: 24px;
              height: 24px;
              background-size: 100%;
              background-repeat: no-repeat;
            }
            .img-ewm {
              .cart-sm-ewm {
                display: none;
              }
              i {
                position: relative;
                display: block;
                width: 18px;
                height: 18px;
                background: url("../../assets/images/erweima.png");
                background-size: 100%;
                &:hover .cart-sm-ewm {
                  position: absolute;
                  bottom: 28px;
                  left: 50%;
                  display: block;
                  margin-left: -74px;
                  padding: 12px;
                  width: 148px;
                  /*height: 148px;*/
                  max-height: 296px;
                  background-color: #fff;
                  .border-shadow(1px 1px 6px #ccc);
                  span {
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    margin-left: -6px;
                    width: 14px;
                    height: 14px;
                    background-color: #fff;
                    .border-shadow(4px 4px 6px  #ccc);
                    .transform(rotate(45deg))
                  }
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .img-pay.pay0 {
              background-image: url("../../assets/images/icon-bank.png");
            }
            .img-pay.pay1 {
              background-image: url("../../assets/images/icon-pay.png");
            }
            .img-pay.pay2 {
              background-image: url("../../assets/images/icon-wechat.png");
            }
          }
        }
      }
      .detail-top-three {
        p {
          span {
            display: inline-block;
            margin-right: 3px;
            width: 16px;
            height: 16px;
            background: url("../../assets/images/tips2.png");
            vertical-align: sub;
          }
        }
        ul {
          li {
            margin-top: 10px;
            width: 400px;
            line-height: 14px;
            font-size: 12px;
            color: #999;
            word-wrap:break-word;
            span {
              color: #333;
            }
          }
        }
      }
    }
    .detail-bottom {
      margin-top: 20px;
      .detail-bottom-left {
        p:first-child {
          font-size: 12px;
          color: #999;
          span {
            font-size: 14px;
            color: #333;
          }
        }
        p:last-child {
          margin-top: 10px;
          font-size: 12px;
          color: #999;
          span {
            font-size: 20px;
            color: #597ab9;
          }
        }
      }
      .detail-bottom-right {
         a {
           width: 140px;
           height: 40px;
           text-align: center;
           line-height: 40px;
           .border-radius();
           &:nth-child(2) {
             margin-left: 14px;
           }
         }
        .btn-one {
          border: 1px solid   #597ab9;
          color:  #597ab9;
          &:hover {
            color: #fff;
            background-color: #597ab9;
          }
        }
        .btn-two {
          background-color: #597ab9;
          color: #fff;
          &:hover {
            background: #4a6dae;
          }
        }
      }
    }
  }
}
</style>
