<template>
  <div class="order-list index-list">
    <table>
      <thead>
      <tr>
        <th style="width: 145px">{{$t('order.createdTime')}}</th>
        <th style="width: 80px;">{{$t('index.orderNumber')}}</th>
        <th style="width: 106px">{{$t('order.tradeType')}}</th>
        <th style="width: 120px;">{{$t('index.tradePrice')}} (CNY)</th>
        <th>{{$t('index.tradeAmount')}}</th>
        <th style="width: 120px;">{{$t('index.tradeMoney')}} (CNY)</th>
        <th style="width: 180px">{{$t('index.contact')}}</th>
        <th>{{$t('index.operation')}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in list">
        <td>
          {{item.createDate|timeFormat}}
        </td>
        <td>
          {{item.id}}
        </td>
        <td :style="{color: getTradeType(item) ? '#f37053' : '#67c18c'}">
         {{getTradeType(item) ? $t('order.buyOn') : $t('order.sellOn')}}{{getCoinName(item.currencyId)}}
        </td>
        <td>
          <!-- ~[183, 24].indexOf(item.currencyId) ===> [183, 24].indexOf(item.currencyId) > -1 -->
          {{item.price|splitFormat(~[183, 24].indexOf(item.currencyId) ? 4 : 2)|numberFormat}}
        </td>
        <td>
          {{item.quantity|splitFormat(4, 8)}}
        </td>
        <td>
         {{item.amount|splitFormat(2)|numberFormat}}
        </td>
        <td>
          <a>
            <st-row class="contact" justify="end"  >
              <div>{{getName(item)}}</div>
              <!--<a @click="phone(item)">{{$t('order.phoneContact')}}</a>-->
            </st-row>
          </a>
        </td>
        <td>
          <st-row class="operation" justify="end" align="center">
            <nuxt-link :to="`/order/${item.id}`">{{$t('order.seeDetail')}}</nuxt-link>
            <!--<template v-if="havePayment(item)">-->
              <!--<a @click="confirmPayment(item.id, 2)">确认付款</a>-->
              <!--&lt;!&ndash;<a @click="cancel(item.id)">取消交易</a>&ndash;&gt;-->
            <!--</template>-->
           <!--<template v-else-if="havePut(item)">-->
             <!--<a @click="confirmPayment(item.id, 3)">确认放行 </a>-->
             <!--<a @click="complaintFn(item.id)">订单申诉</a>-->
           <!--</template>-->
          </st-row>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="list && list.length === 0 && page === 1" class="no-list">
      <img src="../../assets/images/nolist.jpg" alt="" />
      <h6 style="font-weight: normal">{{$t('public.noList')}}</h6>
    </div>
    <st-page :page="page" v-if="list && list.length >= 10 && page === 1" style="margin-top: 40px" :isDown="isDown"></st-page>
    <st-page :page="page" v-else-if="list && page > 1" style="margin-top: 40px" :isDown="isDown"></st-page>
    <!--<popup :title="$t('order.cartAuth')" width="480" :callback="complaintClose" v-if="isComplaint">-->
      <!--<order-complaint-window  :close="complaintClose"></order-complaint-window>-->
    <!--</popup>-->
    <popup :title="$t('order.upTrade')" width="480" :callback="cancelClose" v-if="isCancel">
      <order-cancel-window  :cancelId="cancelId" @getOrderList="getOrderList" :close="cancelClose"></order-cancel-window>
    </popup>
    <popup :title="$t('order.callOther')" width="480" :callback="phoneClose" v-if="isPhone">
      <order-phone-window :otherUser="otherUser" :close="phoneClose"></order-phone-window>
    </popup>
    <popup :title="$t('order.submitComplaint')" width="480" :callback="submitComplaintClonse" v-if="isSubmitComplaint">
      <order-submit-complaint-window @getOrderList="getOrderList" :complaintId="complaintId" :close="submitComplaintClonse"></order-submit-complaint-window>
    </popup>
  </div>
</template>

<script>
//  import Page from '../../../components/page/page'
  import Popup from '../../components/common/popup/popup'
//  import OrderComplaintWindow from './order-complaint-window'
  import OrderCancelWindow from './order-cancel-window'
  import OrderPhoneWindow from './order-phone-window'
  import OrderSubmitComplaintWindow from './order-two-confirm-window'
  import apiConfig from '../../config/api.config'
  export default {
    name: 'order-list',
    components: {
//      Page,
      Popup,
//      OrderComplaintWindow,
      OrderCancelWindow,
      OrderPhoneWindow,
      OrderSubmitComplaintWindow
    },
    data () {
      return {
        isDown: false,
        page: 1,
        isPhone: false,
        isCancel: false,
        isComplaint: false,
        isSubmitComplaint: false,
        list: null,
        otherUser: {},
        cancelId: '',
        complaintId: ''
      }
    },
    watch: {
      '$route' (route) {
        this.getOrderList()
      }
    },
    computed: {
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      },
//      currencyId () {
//        return this.$route.query.id || 1
//      },
      userInfo () {
        return this.$store.state.user.userInfo
      },
      getStatus () {
        return (this.$route.query.type && Number(this.$route.query.type)) || 1
      }
    },
    methods: {
      getCoinName (coinId) {
        if (coinId === 183) {
          let name = '58B'
          return name
        }
        let name = this.currencyList.filter(item => { return item.currencyId === coinId })[0].name
        return name
      },
      complaintClose () {
        this.isComplaint = false
      },
      cancelClose () {
        this.isCancel = false
      },
      phoneClose () {
        this.isPhone = false
      },
      getOrderList () {
        let pg = this.$route.query.page
        if (pg) { this.page = pg } else { this.page = 1 }
//        this.getStatus !== 5 ? undefined : this.currencyId
        this.orderApi.getOrderList(this.getStatus, this.page)
          .then(res => {
            this.isDown = true
            if (res.data && res.data.length) {
              this.list = res.data
              this.list.length === 10 && (this.isDown = false)
            } else {
              this.list = []
            }
//            this.eidtOrderCount(this.list.length)
          })
      },
      submitComplaintClonse () {
        this.isSubmitComplaint = false
      },
      complaintFn (id) {
        this.complaintId = id
        this.isSubmitComplaint = true
//        if (this.userInfo.highAuth) {
//        } else {
//          this.isComplaint = true
//        }
      },
      getTradeType (item) {
        let tp = ''
        if (this.userInfo.id === item.makerId) {
          tp = item.orderType === 2
        } else {
          tp = item.orderType === 1
        }
        return tp
      },
      getName (item) {
        let name = ''
        if (this.userInfo.id === item.makerId) {
          name = item.takerName
        } else {
          name = item.makerName
        }
        return name
      },
      phone (item) {
        let sf = ''
        let name = ''
        let phone = ''
        if (this.userInfo.id === item.makerId) {
          sf = item.orderType === 2 ? this.$t('order.sellJ') : this.$t('order.buyJ')
          name = item.takerName
          phone = item.takerMobile
        } else {
          sf = item.orderType === 1 ? this.$t('order.sellJ') : this.$t('order.buyJ')
          name = item.makerName
          phone = item.makerMobile
        }
        this.otherUser = {name, phone, sf}
        this.isPhone = true
      },
      confirmPayment (id, status) {
        this.orderApi.orderChange(id, status)
          .then(res => {
            this.$toast(this.$t('order.success'))
            this.getOrderList()
          })
      },
      cancel (id) {
        this.cancelId = id
        this.isCancel = true
      },
//      eidtOrderCount (len) {
//        if (this.getStatus === 5) {
//          this.$store.getOrderCount(len)
//        }
//      },
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
      havePut (info) {
        // 放币是用户挂卖单或者用户交易买单才能操作
        let bl = false
        if (info.status === 2) {
          if (info.makerId === this.userInfo.id) {
            bl = info.orderType === 1
          } else {
            bl = info.orderType === 2
          }
        }
        return bl
      },
      isPermissions () {
        if (!this.$store.state.user.userInfo) {
          window.location.href = apiConfig.mainDomain + 'manage/login?position=' + apiConfig.otcDomain
        }
      }
    },
    mounted () {
      this.isPermissions()
      this.getOrderList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  @import "../index/list-table";
  .order-list {
   table tbody {
      tr {
        height: 50px;
        td:first-child {
          color: #6c85ae;
        }
        td:nth-child(5) {
          font-size: 14px;
        }
        .contact {
          div:first-child {
            color: #597ab9;
          }
          a {
            margin-left: 5px;
            width: 72px;
            height: 20px;
            font-size: 12px;
            border: 1px solid #6c86ae;
            color: #6c86ae;
            text-align: center;
            line-height: 20px;
            .border-radius(10px);
            &:hover {
              background-color: #597ab9;
              color: #fff;
            }
          }
        }
        .operation {
          a:first-child {
            color: #53b7e8;
            span {
              margin-left: 2px;
              display: inline-block;
              width: 14px;
              height: 14px;
              background-image: url("../../assets/images/721519370836_.pic.jpg");
              vertical-align: text-top;
            }
          }
          a:nth-child(n+2) {
            margin-left: 10px;
            width: 80px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            color: #fff;
            background-color: #53b7e8;
            .border-radius();
            &:hover {
              background-color: #4fafde;
            }
          }
        }
      }
    }
    tbody {
      tr {
        &:hover {
          background: #f3f7ff;
        }
      }
    }
  }
</style>
