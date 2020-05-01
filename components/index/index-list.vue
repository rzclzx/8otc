<template>
  <div class="index-list">
    <table>
      <thead>
      <tr>
        <th style="width: 180px;">{{$t('index.tradersName')}}</th>
        <th>{{$t('index.cumulative')}}</th>
        <th>{{$t('index.averageDate')}}</th>
        <th>{{$t('index.methodPayment')}}</th>
        <th>{{$t('index.amount')}}</th>
        <th>{{$t('index.price')}}</th>
        <th>{{$t('index.operation')}}</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="item in list">
        <tr>
          <td>
            <st-row align="center" class="nickName">
              <div v-if="item.isMerchant === 1" class="rzsj">
                <div class="title">{{ $t('helper.merchants') }}</div>
              </div>
              <div class="name" :class="{login: item.isOnline}">{{item.nickName}}</div>
            </st-row>
          </td>
          <td>
            {{item.executeNum + $t('index.executeNum')}}
          </td>
          <td>
            {{item.executeTime ? $t('index.executeTime',{time:  parseInt(item.executeTime/60)+1}) : '--'}}
          </td>
          <td>
            <st-row justify="end">
              <div :class="'img icon_'+info" v-for="info in item.bankType">
              </div>
            </st-row>
          </td>
          <td>
            {{item.quantity|splitFormat(4, 8)}} {{curryencyItem.name}}
          </td>
          <td class="price">
            <div>{{item.price|splitFormat(curryencyItem.pricePrecision)|numberFormat}}CNY</div>
            <div>{{item.minAmount|numberFormat}}-{{item.maxAmount|numberFormat}}CNY</div>
          </td>
          <td>
            <st-row justify="end">
              <a @click="trade(item)" class="buy" :class="{noTrade: isHighAuth(item.onlyHighAuth) || isUser(item.userId)}" v-if="isBuyOrSell">{{$t('index.buy')}}</a>
              <a @click="trade(item)" class="sell" :class="{noTrade: isHighAuth(item.onlyHighAuth) || isUser(item.userId)}" v-else>{{$t('index.sell')}}</a>
            </st-row>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <div v-if="list && !list.length && page === 1" class="no-list">
      <img src="../../assets/images/nolist.jpg" alt="" />
      <h6 style="font-weight: normal">{{$t('public.noList')}}</h6>
    </div>
    <st-page :page="page" v-if="list && list.length >= 10 && page === 1" style="margin-top: 20px" :isDown="isDown"></st-page>
    <st-page :page="page" v-else-if="list && page > 1" style="margin-top: 20px" :isDown="isDown"></st-page>

    <popup :title="$t('index.determineBuy')"  width="640" :callback="buyClose" v-if="buyWindow">
      <index-buy-window :close="buyClose" @getAdvertList="getAdvertList" :orderInfo="orderInfo"></index-buy-window>
    </popup>
    <popup :title="$t('users.userAuthTwo')"  width="450" :callback="certificationClose" v-if="isCertification">
      <index-certification-window  :close="certificationClose"></index-certification-window>
    </popup>
  </div>
</template>

<script>
//  import Page from '../../../components/page/page'
  import Popup from '../../components/common/popup/popup'
  import IndexBuyWindow from './index-buy-window'
  import IndexCertificationWindow from './index-certification-window.vue'
  import apiConfig from '../../config/api.config'
  export default {
    name: 'index-list',
    props: ['advertList'],
    components: {
//      Page,
      Popup,
      IndexBuyWindow,
      IndexCertificationWindow
    },
    data () {
      return {
        isDown: false,
        isBuyOrSell: this.$route.query.type !== 'sell',
        page: 1,
        buyWindow: false,
        isCertification: false,
        orderInfo: '',
        list: '',
        timeInteval: null,
        priceSelect: this.$store.state.dictionary.priceSelect,
        curryencyItem: null
      }
    },
    computed: {
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      },
      currencyId () {
        let currencyId = 1
        if (this.currencyList && this.currencyList[0]) {
          currencyId = this.currencyList[0].currencyId
        }
        return Number(this.$route.query.id || currencyId)
      }
    },
    watch: {
      '$route' (route) {
        this.isBuyOrSell = this.$route.query.type !== 'sell'
        this.list = ''
        this.getList()
        this.curryencyItem = this.getCoinItem()
      }
    },
    methods: {
      getCoinItem () {
        return this.$store.state.dictionary.otcCurrencyList.filter(item => {
          return item.currencyId === this.currencyId
        })[0]
      },
      buyClose () {
        this.buyWindow = false
      },
      certificationClose () {
        this.isCertification = false
      },
      isHighAuth (onlyHighAuth) {
        if (this.$store.state.user.userInfo) {
          if (onlyHighAuth === 1 && !this.$store.state.user.userInfo.highAuth) {
            return true
          }
        }
        return false
      },
      getList () {
        let pg = this.$route.query.page
        if (pg) { this.page = pg } else { this.page = 1 }
        clearInterval(this.timeInteval)
        this.getAdvertList()
        this.timeInteval = setInterval(() => {
          this.getAdvertList()
        }, 5000)
      },
      getAdvertList () {
        let priceInfo = this.priceSelect[this.$route.query.price || 0]
        this.advertApi.getAdvertList(this.$store.state.dictionary.enum[this.isBuyOrSell ? 'advBuy' : 'advSell'], this.page, this.currencyId, this.$route.query.isMerchant, priceInfo.conditionId)
          .then(res => {
            this.getDate(res.data)
          }).catch(e => {
            this.list = ''
          })
      },
      getDate (dt) {
        this.isDown = true
        if (dt && dt.length) {
          let item = dt[0]
          if (item.currencyId === Number(this.currencyId) && this.$store.state.dictionary.enum[this.isBuyOrSell ? 'advBuy' : 'advSell'] === item.type) {
            this.list = dt
            this.list.length === 10 && (this.isDown = false)
          }
        } else {
          this.list = []
        }
      },
      trade (info) {
        this.isPermissions()
        if (this.isUser(info.userId)) {
          this.$toast(this.$t('index.userNoMyTrade'))
          return false
        }
        if (this.isHighAuth(info.onlyHighAuth)) {
//          this.$toast(this.$t('index.onlyHighAuthMessage'))
          this.isCertification = true
          return false
        }
        this.orderInfo = info
        this.buyWindow = true
      },
      isPermissions () {
        if (!this.$store.state.user.userInfo) {
          window.location.href = apiConfig.mainDomain + 'manage/login?position=' + apiConfig.otcDomain
        } else if (!this.$store.state.user.userInfo.otcName) {
          this.$router.push('/users/nickName')
        }
      },
      isUser (userId) {
        if (this.$store.state.user.userInfo) {
          if (userId === this.$store.state.user.userInfo.id) {
            return true
          }
        }
        return false
      }
    },
    mounted () {
      this.getList()
    },
    created () {
      this.getDate(this.advertList)
      this.curryencyItem = this.getCoinItem()
    },
    beforeDestroy () {
      clearInterval(this.timeInteval)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  @import "./list-table";
  .index-list {
    min-height: 700px;
    tbody {
      tr {
        &:hover {
          background: #f3f7ff;
        }
      }
    }
  }
  .name {
    color: #999;
    font-size: 15px;
    &.login {
      position: relative;
      color: #1e2266;
      &:after {
        position: absolute;
        right: -15px;
        top: 50%;
        margin-top: -3px;
        content: '';
        width: 7px;
        height: 7px;
        background-color: #67c18c;
        .border-radius(50%);
      }
    }
  }
  .nickName {
    cursor: pointer;
    &:hover {
      .title {
        /*display: block;*/
        opacity: 1;
      }
  }
  .rzsj {
    position: relative;
    margin-right: 8px;
    width: 28px;
    height: 28px;
    background-image: url("../../assets/images/zuanshi.png");
    }
    .title {
      /*display: none;*/
      position: absolute;
      top: -30px;
      left: -25px;
      width: 80px;
      height: 26px;
      line-height: 26px;
      color: #fff;
      text-align: center;
      background-color: rgba(70,76,91,0.9);
      box-shadow: 0 1px 6px rgba(0,0,0,.2);
      .border-radius(16px);
      .transition(opacity 0.2s ease-in-out);
      opacity: 0;
      &:after {
        position: absolute;
        bottom: -6px;
        left: 50%;
        margin-left: -6px;
        border-color:rgba(70,76,91,.9) transparent transparent;
        display:block;
        width:0;
        height:0;
        border-width:6px 6px 0 6px;
        border-style:solid;
        content: "";
      }
    }
  }
  .img {
    margin-left: 3px;
    width: 18px;
    height: 18px;
    background-size: 100%;
    &.icon_1 {
      background-image: url("../../assets/images/icon-pay.png");
    }
    &.icon_0 {
       background-image: url("../../assets/images/icon-bank.png");
    }
    &.icon_2 {
      background-image: url("../../assets/images/icon-wechat.png");
    }
  }
  &.price {
    div:first-child {
      font-size: 14px;
      color: #333;
    }
    div:last-child {
      font-size: 12px;
      color: #999;
    }
  }
  .buy,.sell {
    display: block;
    width: 60px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: #fff;
    .border-radius();
    &.noTrade {
      background-color: #ccc;
      &:hover {
        background-color: #666;
      }
    }
  }
  .buy {
    background-color: #67c18c;
    &:hover {
      background-color: #6eb885;
    }
  }
  .sell {
    background-color: #f37053;
    &:hover {
      background-color: #e7694d;
    }
  }
</style>
