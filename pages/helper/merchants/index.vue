<template>
  <section class="helper-merchants container">
    <st-row class="title" justify="between" align="center">
      <h2>{{$t('helper.merchants')}}</h2>
      <a href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360001486273-58Coin-C2C-%E8%AE%A4%E8%AF%81%E5%95%86%E5%AE%B6%E5%AE%A1%E6%A0%B8%E6%B5%81%E7%A8%8B" target="_blank">{{$t('helper.merchantsRules')}}</a>
    </st-row>
    <div class="info">
      <st-row class="preferential" justify="between">
        <div>
          <div></div>
          <p>{{$t('helper.exclusive')}}</p>
        </div>
        <div>
          <div></div>
          <p>{{$t('helper.prioritise')}}</p>
        </div>
        <div>
          <div></div>
          <p>{{$t('helper.favorable')}}</p>
        </div>
      </st-row>
      <p class="stepsOne">
        {{$t('helper.stepsOne') +': ' + $t('helper.stepsOnePlace')}}
      </p>
      <div class="place">
         <p class="place-p">{{$t('helper.stepsTwo') + ': '+ $t('helper.stepsTwoPlace')}}<span>{{$t('helper.stepsTwoEmail')}}</span></p>
        <st-row class="place-cl" justify="between"  direction="column">
          <p><span></span>{{$t('helper.information')}}</p>
          <p><span></span>{{$t('helper.WeQQ')}}</p>
          <p><span></span>{{$t('helper.WeChat')}}</p>
          <p><span></span>{{$t('helper.account')}}</p>
        </st-row>
        <div class="place-message">
          <p>{{$t('helper.stepsTwoMessageOne')}}</p>
          <p>{{$t('helper.stepsTwoMessageTwo')}}</p>
          <p>{{$t('helper.stepsTwoMessageThree')}}</p>
          <!--{{$t('helper.stepsTwoMessageFore')}}<span>{{$t('helper.stepsTwoEmail')}}</span>,{{$t('helper.stepsTwoMessageFive')}}"{{$t('helper.stepsTwoMessageSeven')}}"。-->
          <p v-html="$t('helper.stepsAll')"></p>
          <p>{{$t('helper.stepsTwoMessageEight')}}<span> 0.5BTC </span>{{$t('helper.stepsTwoMessageNine')}}</p>
        </div>
      </div>
      <div class="stepsThree">
        <p>{{$t('helper.stepsThree') + ':' + $t('helper.stepsThreePlace')}}</p>
        <p>{{$t('helper.stepsThreeMessage')}}</p>
      </div>
      <div class="kf">
        <div class="img">
          <img src="../../../assets/images/rzerweima.png" alt="">
          <p>{{$t('helper.authKF')}}</p>
        </div>
        <st-row class="check" align="center" justify="center">
          <a class="checkbox" :class="{active: isOk}" @click="isOk = !isOk"></a>
          {{$t('helper.myOk')}}
        </st-row>
      </div>
      <a class="btn2" @click="submit" :class="{three: (userInfo.isMerchant !== 2) || isBtnOne || !isOk}">{{ getStatus() }}</a>
    </div>
  </section>
</template>

<script>
import ApiConfig from '../../../config/api.config'
export default {
  name: 'helper-merchants',
  middleware: ['auth', 'niceName'],
  components: {
//    StRow
  },
  data () {
    return {
      isOk: false,
      isBtnOne: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    getStatus () {
      if (this.userInfo.isMerchant === 2) {
        return this.$t('helper.send')
      } else if (this.userInfo.isMerchant === 1) {
        return this.$t('helper.merchantsS')
      } else {
        return this.$t('helper.merchantsOn')
      }
    },
    isAuth () {
      if (!this.userInfo.baseAuth || !this.userInfo.highAuth) {
        this.$toast(this.$t('helper.kyc1OrKyc2'))
        setTimeout(() => {
          if (this.userInfo.baseAuth) {
            window.location.href = ApiConfig.userDomain + 'users/info/auth/high'
          } else {
            window.location.href = ApiConfig.userDomain + 'users/info'
          }
        }, 1500)
        return false
      } else {
        return true
      }
    },
    submit () {
      if (this.userInfo.isMerchant !== 2) {
        return false
      }
      if (this.isAuth()) {
        if (this.isOk) {
          if (this.isBtnOne) {
            return false
          } else {
            this.isBtnOne = true
          }
          this.toolsApi.merchantApply()
            .then(res => {
              this.$store.commit('user/SAVE_MERCHANTS', {data: 3})
              this.$toast(this.$t('helper.merchantsSuccess'))
              setTimeout(() => {
                this.$router.push('/my')
              }, 1500)
            }).catch(e => {
              this.isBtnOne = false
            })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../assets/css/theme";
  .helper-merchants {
    .title {
      margin-bottom: 2px;
      padding: 0 40px;
      background: #fff;
      h2 {
        line-height: 48px;
        font-size: 16px;
      }
      a {
        font-size: 14px;
        color: #ff7300;
      }
    }
    .info {
      padding: 66px 230px 95px;
      background-color: #fff;
      .preferential {
        /*margin-bottom: 22px;*/
        &>div {
          div {
            width: 92px;
            height: 92px;
            background-repeat: no-repeat;
            background-position: center center;
            .border-shadow(0px 4px 8px rgba(89,122,185,0.1));
            .border-radius(46px)
          }
          p {
            height: 56px;
            line-height: 56px;
            font-size: 16px;
            color: #1e2266;
            text-align: center;
          }
          &:first-child div{
            background-image: url("../../../assets/images/xinyu.png");
          }
          &:last-child div{
            background-image: url("../../../assets/images/feilv.png");
          }
          &:nth-child(2) div{
            background-image: url("../../../assets/images/youxian.png");
          }
        }
      }
      .place {
        /*.place-p,.place-cl,.send{*/
          /*height: 54px;*/
          /*line-height: 54px;*/
          /*font-size: 14px;*/
        /*}*/
        .place-p {
          height: 34px;
          line-height: 34px;
          font-size: 14px;
          color: #333;
        }
        .place-cl {
          padding: 10px;
           p {
             height: 34px;
             line-height: 34px;
             font-size: 14px;
             color: #999;
             span {
               display: inline-block;
               margin-right: 8px;
               width: 14px;
               height: 14px;
               background-image: url("../../../assets/images/right.png");
               vertical-align: middle;
             }
           }
        }
        .place-message {
          margin-top: 5px;
          p {
            /*height: 26px;*/
            line-height: 26px;
          }
        }
      }
    }
    .stepsOne,.place-message,.stepsThree {
      font-size: 14px;
      color: #333;
      span {
        color: #597ab9;
      }
    }
    .stepsOne {
      height: 54px;
      line-height: 54px;
    }
    .stepsThree {
      margin-top: 20px;
      P {
        height: 26px;
        line-height: 26px;
      }
    }
    .kf .img {
      margin-top: 35px;
      img {
        margin: 0 auto;
      }
      p {
        height: 42px;
        line-height: 42px;
        font-size: 12px;
        text-align: center;
      }
    }
    .kf .check {
      height: 64px;
      line-height: 64px;
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
          background: url("../../../assets/images/xuanzhong.png");
          background-color: #597ab9;
        }
      }
    }
    .btn2 {
      margin: 15px auto 0;
      display: block;
      width: 358px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #fff;
      background-color: #597ab9;
      &:hover {
        background: #4a6dae;
      }
      &.three {
        background-color: #ebebeb;
        color: #888;
      }
    }
  }
</style>
