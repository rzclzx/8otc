<template>
  <st-row class="account-list" align="center" justify="between">
    <template v-for="item in list">
      <div  v-if="item.info"  class="item">
        <div class="have-bg"></div>
        <st-row justify="between" align="center" class="operation">
          <h4>{{item.info.realName}} <nuxt-link style="margin-left: 20px;" :to="`/my/account/${item.type}?id=${item.info.id}`">{{$t('my.edit')}}</nuxt-link></h4>
          <st-row align="center"> <span style="margin-right: 5px">{{$t('my.isShow')}}</span> <st-switch class="switch" @callback="isShowFn(item.info.id, item.info.visible)" :status="item.info.visible === 1"></st-switch></st-row>
        </st-row>
        <st-row class="cart" justify="between">
          <st-row class="cart-img" align="center">
            <div :class="item.type"></div>
            <p>{{item.info.accountNo}}</p>
            <p v-if="item.type !=='bank'">{{$t('my.'+item.type)}}</p>
          </st-row>
          <div class="cart-sm">
            <span v-if="item.type ==='bank'">{{$t('my.'+item.type)}}</span>
            <i v-else><div class="cart-sm-ewm" v-if="item.info.qrcode"><span></span><img :src="oosUrl+item.info.qrcode" ></div></i>
          </div>
        </st-row>
      </div>
    <a @click="isUserAuth(item.type)"  v-else class="item">
      <div class="have-bg"></div>
      <h4></h4>
      <st-row class="cart" justify="between">
        <st-row class="cart-img" align="center">
          <div :class="item.type"></div>
           <p>{{$t('my.'+item.type)}}{{$t('my.noHave')}}</p>
        </st-row>
        <div class="cart-sm">
          <span class="go">{{$t('my.gpHave')}}</span>
        </div>
      </st-row>
    </a>
    </template>
  </st-row>
</template>

<script>
  import apiConfig from '../../config/api.config'
//  import StSwitch from '../../../components/switch/switch'
  export default {
    name: 'account-list',
    components: {
//      StSwitch
    },
    data () {
      return {
        list: [{type: 'bank', id: 0, info: null}, {type: 'pay', id: 1, info: null}, {type: 'wechat', id: 2, info: null}],
        oosUrl: apiConfig.oosImgUrl
      }
    },
    mounted () {
      this.getList()
    },
    computed: {
      userInfo () {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
      isShowFn (id, action) {
        this.userApi.modifyStatusOfPayment(id, action === 1 ? 2 : 1)
          .then(res => {
            this.getList()
          })
      },
      getList () {
        this.userApi.searchModeOfPayment().then(res => {
          res.data.forEach(item => {
            this.list[item.bankType].info = item
          })
        })
      },
      isUserAuth (type) {
        if (this.userInfo.baseAuth) {
          this.$router.push(`/my/account/${type}`)
        } else {
          this.$toast(this.$t('my.placeBaseAuth'))
          setTimeout(() => {
            this.$router.push('/users/auth/one')
          }, 1500)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .account-list {
    margin-top: 2px;
    padding: 30px 40px 50px;
    background-color: #fff;
    font-size: 14px;
    .item {
      padding: 0 20px;
      width: 340px;
      height: 118px;
      border: 1px solid #f0f1f3;
      .border-shadow(2px 2px 6px #eee);
      .operation {
        position: relative;
        z-index: 1;
        color: #999;
      }
      .operation a,.go {
        color: #6c85ae;
        &:hover {
          color: #112266;
        }
      }
      h4 {
        height: 52px;
        line-height: 52px;
        color: #999;
      }
      .cart {
        position: relative;
        z-index: 1;
        .cart-sm {
          color: #333;
          .cart-sm-ewm {
            display: none;
          }
          i {
            position: relative;
            display: block;
            width: 20px;
            height: 20px;
            background: url("../../assets/images/erweima.png");
            background-size: 100%;
            &:hover {
              cursor: pointer;
            }
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
        .cart-img {
          p {
            padding: 0 10px;
            max-width: 178px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            color: #333;
          }
          .bank,.pay,.wechat {
            width: 24px;
            height: 24px;
            background-size: 100%;
          }
          .bank {
            background-image: url("../../assets/images/icon-bank.png");
          }
          .pay {
            background-image: url("../../assets/images/icon-pay.png");
          }
          .wechat {
            background-image: url("../../assets/images/icon-wechat.png");
          }
        }
      }
    }
    .item {
      position: relative;
      .have-bg {
        position: absolute;
        top: 50%;
        right: 0px;
        width: 129px;
        height: 101px;
        margin-top: -50px;
        background: url("../../assets/images/bg_logo.png") no-repeat center center;
        background-size: 129px 101px;
        animation:  mymove  2s  alternate infinite;
        -webkit-animation:  mymove  2s  alternate infinite;
      }
    }
    .switch {
      .transform(scale(0.8))
    }
    .keyframes(mymove, { from {background-size: 80% 80%} to {background-size: 100% 100%} })
  }
</style>
