<template>
  <div class="order-user">
     <h3>{{haveCart(info) ? $t('order.buyDetail') : $t('order.sellDetail')}}</h3>
     <st-row justify="between" align="center">
       <st-row  align="center">
         <div class="user-logo">{{info.nickName && info.nickName.slice(0, 1)}}<em :class="{logo: info.isOnline}"></em></div>
         <div class="user-info">
           <p>{{info.nickName}}</p>
           <st-row v-if="this.info.isMerchant === 1" align="center" justify="end"><span></span><span>{{$t('order.merchant')}}</span></st-row>
         </div>
       </st-row>
       <a @click="isPhone = true"><div class="phone"><span></span>{{$t('order.phoneContact')}}</div></a>
     </st-row>
    <st-row justify="between" class="number">
      <div>
        <p>{{$t('order.successTrade')}}</p>
        <h5>{{info.userTransactionDTO.executeNum || 0}}</h5>
      </div>
      <div>
        <p>{{$t('order.likeNumL')}}</p>
        <h5>{{parseInt(info.userTransactionDTO.likeNum/(info.userTransactionDTO.dislikeNum+info.userTransactionDTO.likeNum)*100) || 0}}%</h5>
      </div>
      <div>
        <p>{{$t('order.likeNum')}}</p>
        <h5>{{info.userTransactionDTO.likeNum || 0}}</h5>
      </div>
    </st-row>
    <popup :title="$t('order.callOther')" width="480" :callback="phoneClose" v-if="isPhone">
      <order-phone-window :otherUser="phone(info)" :close="phoneClose"></order-phone-window>
    </popup>
  </div>
</template>

<script>
  import Popup from '../../components/common/popup/popup'
  import OrderPhoneWindow from './order-phone-window'
  export default {
    name: 'order-user',
    props: ['info'],
    components: {
      Popup,
      OrderPhoneWindow
    },
    data () {
      return {
        isPhone: false
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
      phone (item) {
        let sf = ''
        let name = ''
        let phone = ''
        let uName = ''
        if (this.userInfo.id === item.makerId) {
          sf = item.orderType === 2 ? this.$t('order.sellJ') : this.$t('order.buyJ')
        } else {
          sf = item.orderType === 1 ? this.$t('order.sellJ') : this.$t('order.buyJ')
        }
        name = item.nickName
        phone = item.mobile
        uName = item.userName
        return {name, phone, sf, uName}
      },
      haveCart (info) {
        let bl = false
        if (info.makerId === this.userInfo.id) {
          bl = info.orderType === 1
        } else {
          bl = info.orderType === 2
        }
        return bl
      },
      phoneClose () {
        this.isPhone = false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/theme";
.order-user {
  padding: 0 40px;
  width: 400px;
  height: 550px;
  background-color: #fff;
  h3 {
    height: 76px;
    font-size: 16px;
    line-height: 76px;
  }
  .user-logo {
    position: relative;
    margin-right: 18px;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 50px;
    background: -webkit-linear-gradient(#9cc7ff, #7ab2fd); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#9cc7ff, #7ab2fd);/* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#9cc7ff, #7ab2fd); /* Firefox 3.6 - 15 */
    background: linear-gradient(#9cc7ff, #7ab2fd); /* 标准的语法 */
    font-size: 18px;
    color: #fff;
    border: 6px solid #fff;
    .border-radius(30px);
    .border-shadow(0px 4px 8px rgba(71, 78, 114, .1));
    em {
      position: absolute;
      bottom: 0px;
      right: 0px;
      height: 14px;
      width: 14px;
      background-color: #ccc;
      border: 3px solid #fff;
      &.logo {
        background-color: #00c481;
      }
    }
  }
  .user-info {
    p {
      font-size: 14px;
    }
    div {
      margin-top: 6px;
      width: 61px;
      height: 16px;
      background-color: #53b7e8;
      span:first-child {
        margin-right: -3px;
        width: 8px;
        height: 8px;
        background: url("../../assets/images/V_white.png");
      }
      span:last-child {
        color: #fff;
        font-size: 12px;
        .transform(scale(0.8, 0.8));
      }
      .border-radius(8px)
    }
  }
  .phone {
    /*margin-top: 12px;*/
    span {
      margin-right: 2px;
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: sub;
      background-image: url("../../assets/images/phone1.png");
    }
    color: #597ab9;
    font-size: 14px;
    &:hover {
      span {
        background-image: url("../../assets/images/phone2.png");
      }
      color: #112266;
    }
  }
  .number {
    margin-top: 25px;
    div {
      p {
        font-size: 12px;
        color: #999;
      }
      h5 {
        font-size: 20px;
        color: #597ab9;
        text-align: center;
      }
    }
  }
}
</style>
