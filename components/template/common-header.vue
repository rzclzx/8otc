<template>
  <st-row class="header-sliding" justify="between" align="center">
    <st-row class="header-sliding-left" justify="between">
      <st-row class="left" align="center">
        <div class="coin">
          <a :href="apiConfig.mainDomain">
            <div :class="['img', $i18n.locale]"></div>
          </a>
        </div>
        <div class="line">
        </div>
        <st-row class="nav">
          <st-row align="center"><nuxt-link :class="{active: path ==='/'}" to="/">{{ $t(`header.moneyTrade`) }}</nuxt-link></st-row>
          <st-row align="center">
            <div  class="a down" :class="{active: path.indexOf('/adv')>-1 || path.indexOf('/order')>-1 }">
              {{ $t('header.tradeManagement') }}
            <div>
              <nuxt-link to="/adv">{{ $t('header.myAdv') }}</nuxt-link>
              <nuxt-link to="/order">{{ $t('header.myTrade') }}</nuxt-link>
            </div>
          </div>
          </st-row>
          <st-row align="center"><nuxt-link to="/subject">{{ $t('header.subject') }}</nuxt-link></st-row>
          <st-row align="center"><a target="_blank" href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360001392434-%E4%BA%BA%E6%B0%91%E5%B8%81%E5%85%85%E5%80%BC%E4%B9%B0%E5%B8%81">{{ $t('header.news') }}</a></st-row>
          <st-row align="center"><nuxt-link :class="{active: path.indexOf('/helper/merchants')>-1}" to="/helper/merchants">{{ $t('helper.merchants') }}</nuxt-link></st-row>
        </st-row>
      </st-row>
      <st-row class="advertising-b" align="center" justify="end">
        <h2>{{$t('header.permanentFree')}}</h2>
        <a class="message" @click="messageShow">
          <div class="number" v-if="messageList.length">
             {{ messageList.length }}
          </div>
        </a>
        <nuxt-link class="newsAdv" to="/adv/buy">{{ $t('advertising.releaseAdvertising') }}</nuxt-link>
      </st-row>
    </st-row>
    <st-row class="right" align="center">
      <div class="go"><a :href="apiConfig.spotDomain">{{ $t('header.go') }}</a><a :href="apiConfig.userDomain+'account'">{{ $t('header.money') }}</a></div>
      <div class="line"></div>
      <st-row class="login down" v-if="userInfo" align="center">
        <a class="name" href="/my" :title="userInfo.otcName || userInfo.nickName">{{ $t('header.number') }}：{{ userInfo.otcName || userInfo.nickName }}</a>
        <div>
          <nuxt-link  to="/my">{{ $t('header.my') }}</nuxt-link>
          <a   @click="logout">{{ $t('header.logout') }}</a>
        </div>
      </st-row>
      <st-row class="login" v-else align="center">
        <a :href="`${apiConfig.mainDomain}manage/login?position=${apiConfig.otcDomain}`">{{ $t('header.sign_in') }}</a><span></span><a :href="`${apiConfig.mainDomain}manage/register?position=${apiConfig.otcDomain}`">{{ $t('header.sign_up') }}</a>
      </st-row>
    </st-row>
    <transition name="slide-fade">
      <window-message v-if="show" class="window-message"></window-message>
    </transition>
  </st-row>
</template>

<script>
  import Cookie from '../../assets/js/cookie'
  import ApiConfig from '../../config/api.config'
  import WindowMessage from './window-message'

  export default {
    name: 'common-header',
    components: {
      WindowMessage
    },
    data () {
      return {
        apiConfig: ApiConfig,
        show: false
      }
    },
    computed: {
      messageList () {
        return this.$store.state.message.message.filter(item => { return !item.readFlag })
      },
      userInfo () {
        return this.$store.state.user.userInfo
      },
      path () {
        return this.$route.path
      }
    },
    watch: {
      '$route': function () {
        this.show = false
      }
    },
    methods: {
      logout () {
        this.toolsApi.userLogout().then(res => {
          Cookie.clearCookie('token', ApiConfig.domain)
          window.webSocketSend('{"event":"logout"}')
          window.location.reload()
        })
//        console.log(this.$router)
//        setTimeout(() => {
//          this.$router.push({
//            path: '/'
//          })
//        }, 3000)
      },
      messageShow () {
        if (this.userInfo) {
          this.show = !this.show
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .header-sliding .nav {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .header-sliding {
    position: relative;
    margin-bottom: 50px;
    box-sizing: border-box;
    padding: 0 45px 0 60px;
    background: #fff;
    width: 100%;
    min-width: 1300px;
    height: 74px;
    transition: top .5s linear;
    box-shadow: 0px 1px 2px rgba(0,0,0,.3);
    z-index: 1;
    .window-message {
      position: absolute;
      right: 5px;
      top: 125px;
      .border-shadow(0px 0px 10px rgba(200,200,200,0.5))
    }
  }
  .header-sliding-left {
    flex: 1;
    background: url('../../assets/images/nav_bg.png') no-repeat right;
  }
  .header-sliding .left .coin .img {
    width: 146.5px;
    height: 40.5px;
    background: url("../../assets/images/logo.png") no-repeat;
    background-size: 100% 100%;
    &.en, &.ja, &.ko, &.ru {
      width: 152px;
      height: 40.5px;
      background: url("../../assets/images/logo_e.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .header-sliding .left .line {
    width: 1px;
    height: 24px;
    background:#e2eafb;
    margin: 0 40px 0 40px;
  }
  .header-sliding .left .nav div {
    a, .a {
      display: block;
      height: 74px;
      line-height: 74px;
      text-decoration: none;
      font-size:14px;
      color:#6c85ae;
      margin-right: 30px;
      @media screen and (max-width: 1360px) {
        margin-right: 18px;
      }
      &.active {
        border-bottom: 2px solid #6c85ae;
      }
      &:hover {
        color: #112266;
      }
    }
  }
  .header-sliding .left .nav li:last-child a {
    margin-right: 0;
  }
  .header-sliding .advertising-b {
    height: 75px;
    .newsAdv {
      width: 80px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      color: #fff;
      font-size: 14px;
      background-color: #597ab9;
      .border-radius();
      &:hover {
        background: #4a6dae;
      }
    }
  }
  .advertising-b {
    h2 {
      margin-right: 30px;
      font-weight: 700;
      font-size: 14px;
      color: #6C85AE;
      @media screen and (max-width: 1450px) {
        display: none;
      }
    }
    .message {
      position: relative;
      display: block;
      margin-right: 30px;
      width: 24px;
      height: 25px;
      background-image: url("../../assets/images/xiaoxi.png");
      .number {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 18px;
        height: 18px;
        font-size: 12px;
        background-color: #ff7300;
        color: #fff;
        line-height: 18px;
        text-align: center;
        border-radius: 6px 6px 6px 0px;
      }
    }
  }
  .header-sliding .right .login a, .header-sliding .right .go a{
    &:first-child {
      margin-right: 10px;
    }
    font-size: 14px;
    color: #6c85ae;
    text-decoration: none;
    &:hover {
      color: #112266;
    }
  }
  .header-sliding .right {
    margin-left: 10px;
  }
  .header-sliding .right .line {
    margin: 0 15px;
    width: 1px;
    height: 11px;
    background-color: #6c85ae;
  }
  .header-sliding .right .login a.name{
    display: inline-block;
    max-width: 104px;
    height: 24px;
    line-height: 26px;
    white-space: nowrap;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }
  /*.header-sliding .right .login span {*/
    /*margin: 0 15px;*/
    /*display: inline-block;*/
    /*width: 1px;*/
    /*height: 6px;*/
    /*background-color: #6c85ae;*/
    /*vertical-align: middle;*/
  /*}*/
  .header-sliding .right .login.down .name {
    margin-right: 0px;
  }
  .header-sliding .left .nav div .down, .header-sliding .right .login.down {
    position: relative;
    padding-right: 14px;
    height: 74px;
    cursor: pointer;
    div {
      position: absolute;
      display: none;
      top: 60px;
      left: 50%;
      margin-left: -58px;
      padding: 16px 0;
      width: 116px;
      background-color: #f8f9fb;
      .border-radius();
      .border-shadow(0px 0px 10px rgba(100,100,100,0.4));
      &:after {
        position: absolute;
        top: -4px;
        left: 50%;
        margin-left: -4px;
        width: 8px;
        height: 8px;
        background-color: #f8f9fb;
        content: '';
        .transform(rotate(45deg));
        .border-radius(2px 0 0 0);
        .border-shadow(-2px -2px 2px rgba(100,100,100,0.1));
      }
      a {
        display: block;
        margin-right: 0px;
        width: 116px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        &:hover {
          background-color: #eff1f6;
        }
      }
    }
    &:hover {
      div {
        display: block;
      }
      &:before {
        background-image: url("../../assets/images/shangjiantou.png");
      }
    }
    &:before {
      position: absolute;
      right: 0px;
      top: 50%;
      margin-top: -2px;
      content: '';
      width: 7px;
      height: 5px;
      background-image: url("../../assets/images/xiajiantou.png");
    }
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-leave-active {
    transition: all .4s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(250px);
  }
</style>
