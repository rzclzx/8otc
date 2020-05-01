<template>
  <div class="index-content">
    <div class="number" v-if="count">{{count}}</div>
    <st-row class="good" align="center" justify="between">
      <st-row class="good-img">
        <st-row align="center">
          <div class="img"></div>
          <p>{{$t('index.fast')}}</p>
        </st-row>
        <st-row align="center">
          <div class="img"></div>
          <p>{{$t('index.security')}}</p>
        </st-row>
        <st-row align="center">
          <div class="img"></div>
          <p>{{$t('index.maxTrade')}}</p>
        </st-row>
      </st-row>
      <st-row align="center">
        <st-row class="check" align="center">
          <a class="checkbox" :class="{active: isMerchant}" @click="merchantFn(!isMerchant)"></a>
          {{$t('index.isMerchant')}}
        </st-row>
        <index-select></index-select>
      </st-row>
    </st-row>
    <type-nav :arr="navArr"></type-nav>
    <!--<order-list v-if="isOrder"></order-list>-->
    <index-list :advertList="advertList"></index-list>
  </div>
</template>

<script>
  import TypeNav from '../type-nav'
  import IndexList from './index-list'
  import OrderList from '../order/order-list'
  import IndexSelect from './index-select'
  export default {
    name: 'index-content',
    props: ['advertList'],
    components: {
      IndexList,
      OrderList,
      TypeNav,
      IndexSelect
    },
    data () {
      return {
//        , {key: '5', text: 'index.tradeOrder'}
        navArr: [{key: 'buy', text: 'index.buy'}, {key: 'sell', text: 'index.sell'}],
//        isOrder: !isNaN(this.$route.query.type) && Number(this.$route.query.type) === 5,
        count: '',
        isMerchant: false
      }
    },
//    watch: {
//      '$route' (route) {
//        this.isOrder = !isNaN(this.$route.query.type) && Number(this.$route.query.type) === 5
//        this.getOrderListCount()
//      }
//    },
    computed: {
      currencyId () {
        return this.$route.query.id || 1
      },
      userInfo () {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
//      getOrderListCount () {
//        if (this.userInfo) {
//          this.orderApi.getOrderList(5, this.currencyId)
//            .then(res => {
//              let list = res.data || []
//              this.count = list.length
//            })
//        } else {
//          this.count = 0
//        }
//      },
      merchantFn (bl) {
        this.isMerchant = bl
        let obj = {}
        if (this.isMerchant) {
          Object.assign(obj, this.$route.query, {isMerchant: 1})
        } else {
          Object.assign(obj, this.$route.query)
          delete obj.isMerchant
        }
        delete obj.page
        this.$router.push({query: obj})
      }
    },
    mounted () {
      this.isMerchant = !!this.$route.query.isMerchant
//      this.getOrderListCount()
//      this.$store.getOrderCount = (len) => { len === undefined ? this.getOrderListCount() : this.count = len }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
 .index-content {
   width: 980px;
   position: relative;
   .number {
     position: absolute;
     top: 80px;
     left: 246px;
     width: 18px;
     height: 18px;
     font-size: 12px;
     background-color: #ff7300;
     color: #fff;
     line-height: 18px;
     text-align: center;
     .border-radius(6px 6px 6px 0px)
   }
   .good {
     padding-right: 40px;
     padding-left: 10px;
     height: 48px;
     margin-bottom: 10px;
     background-color: #fff;
     .good-img>div {
       margin-left: 30px;
       color: #597ab9;
       .img {
         margin-right: 10px;
         width: 24px;
         height: 24px;
         background: no-repeat center center;
         animation:  mymove  2s  alternate infinite;
         -webkit-animation:  mymove  2s  alternate infinite;
       }
       &:first-child .img{
         background-image: url("../../assets/images/fast.png");
       }
       &:nth-child(2) .img{
         background-image: url("../../assets/images/safe.png");
       }
       &:last-child .img{
         background-image: url("../../assets/images/dae.png");
       }
       p {
         font-size: 14px;
       }
     }
     .check {
       font-size: 14px;
       color: #333;
       .checkbox {
         margin-right: 6px;
         display: inline-block;
         width: 13px;
         height: 13px;
         border: 1px solid #597ab9;
         vertical-align: text-top;
         .border-radius();
         &.active {
           background: url("../../assets/images/xuanzhong.png");
           background-color: #597ab9;
         }
       }
     }
   }
   .keyframes(mymove, { from {background-size: 80% 80%} to {background-size: 100% 100%} })
 }
</style>
