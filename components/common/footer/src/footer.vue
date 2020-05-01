<template>
  <footer class="st-footer">
    <st-row class="up" justify="between">
      <st-row class="left" justify="between">
        <ul>
          <li class="first-li">{{ $t('footer.products') }}</li>
          <li v-for="item in product" :key="item.id"><a :href="item.href">{{ item.name }}</a></li>
        </ul>
        <ul>
          <li class="first-li">{{ $t('footer.about_us') }}</li>
          <li><a href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360000620514-%E5%85%AC%E5%8F%B8%E4%BB%8B%E7%BB%8D" target="_blank">{{ $t('footer.about_us_1') }}</a></li>
          <li><a href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360000645174-%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC" target="_blank">{{ $t('footer.about_us_3') }}</a></li>
          <li><a href="https://58coin-support.zendesk.com/hc/zh-cn/categories/360000038673-%E5%AE%98%E6%96%B9%E5%85%AC%E5%91%8A" target="_blank">{{ $t('footer.about_us_4') }}</a></li>
        </ul>
        <ul>
          <li class="first-li">{{ $t('footer.service_support') }}</li>
          <li><a href="https://github.com/58COIN/58coin-api" target="_blank">{{ $t('footer.service_support_1') }}</a></li>
          <li><a href="https://58coin-support.zendesk.com/hc/zh-cn/categories/360000082253-%E5%B8%AE%E5%8A%A9%E4%B8%AD%E5%BF%83" target="_blank">{{ $t('footer.service_support_2') }}</a></li>
          <li><a href="https://58coin-support.zendesk.com/hc/zh-cn/sections/360000123013-%E6%95%B0%E5%AD%97%E8%B5%84%E4%BA%A7%E4%BB%8B%E7%BB%8D" target="_blank">{{ $t('footer.service_support_3') }}</a></li>
          <li><a href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360000836973-%E4%B8%8A%E5%B8%81%E7%94%B3%E8%AF%B7%E8%AF%B4%E6%98%8E" target="_blank">{{ $t('footer.service_support_4') }}</a></li>
        </ul>
      </st-row>
      <div class="center"></div>
      <st-row class="right" justify="between">
        <ul>
          <li class="first-li">{{ $t('footer.official_community') }}</li>
          <li @mouseenter="showErcode('wechat')" @mouseleave="hideErcode('wechat')">
            <a>{{ $t('footer.official_community_4') }}</a>
            <img v-if="ercode.wechat" src="../assets/images/wechat_ercode.png" alt="" />
          </li>
          <li><a href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360000812354-%E5%A6%82%E4%BD%95%E5%8A%A0%E5%85%A558COIN%E5%AE%98%E6%96%B9Telegram%E7%BE%A4" target="_blank">{{ $t('footer.official_community_1') }}</a></li>
          <li @mouseenter="showErcode('api')" @mouseleave="hideErcode('api')">
            <a>{{ $t('footer.official_community_5') }}</a>
            <img v-if="ercode.api" src="../assets/images/api.png" alt="" />
          </li>
        </ul>
        <ul>
          <li class="first-li">{{ $t('footer.downLoad') }}</li>
          <li @mouseenter="showErcode('ios')" @mouseleave="hideErcode('ios')">
            <a class="download-ios">{{ $t('footer.downLoad_1') }}</a>
            <img v-if="ercode.ios" src="../assets/images/download.png" alt="" />
          </li>
          <li @mouseenter="showErcode('android')" @mouseleave="hideErcode('android')">
            <a class="download-android">{{ $t('footer.downLoad_2') }}</a>
            <img v-if="ercode.android" src="../assets/images/download.png" alt="" />
          </li>
          <li @mouseenter="showErcode('googlePlay')" @mouseleave="hideErcode('googlePlay')">
            <a class="download-google-play">{{ $t('footer.downLoad_3') }}</a>
            <img v-if="ercode.googlePlay" src="../assets/images/googlePlay.png" alt="" />
          </li>
        </ul>
        <div class="focus">
          <h3>{{ $t('footer.follow') }}</h3>
          <span>58COIN GLOBAL</span>
          <st-row class="share">
            <a href="https://www.facebook.com/coin.wuba.7" target="_blank"></a>
            <a href="https://twitter.com/58_coin" target="_blank"></a>
            <a href="https://weibo.com/6357500607/profile?topnav=1&wvr=6" target="_blank" style="margin-right: 0;"></a>
          </st-row>
        </div>
      </st-row>
    </st-row>
    <div class="down">
      <p>Copyright © {{(new Date).getFullYear()}} 58COIN. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>

  export default {
    name: 'st-footer',
    props: ['product'],
    data () {
      return {
        ercode: {
          wechat: false,
          api: false,
          ios: false,
          android: false,
          googlePlay: false,
          rnd: 0
        }
      }
    },
    methods: {
      showErcode (name) {
        this.ercode[name] = true
      },
      hideErcode (name) {
        this.ercode[name] = false
      }
    },
    mounted () {
      let rnd = Math.floor(Math.random() * 10 + 1)
      this.rnd = rnd
    }
  }
</script>

<style lang="less" scoped>
  .st-footer {
    position: absolute;
    width: 100%;
    min-width: 1300px;
    height: 338px;
    background-color: rgb(18, 18, 42);
    font-size: 20px;
    .up {
      width: 100%;
      height: 260px;
      padding: 60px 8% 0 10%;
      border-bottom: 1px solid #04040f;
      .left,
      .right {
        position: relative;
        width: 30%;
        ul li {
          position: relative;
          img {
            position: absolute;
            top: 50%;
            right: -130px;
            z-index: 2;
            margin-top: -60px;
            width: 120px;
            height: 120px;
          }
          a {
            display: block;
            margin-bottom: 14px;
            line-height: 1em;
            font-size: 12px;
            color: #fff;
            &:hover {
              color: #c5caea;
            }
          }
          &:last-child a {
             margin-bottom: 0;
          }
          &.first-li {
             margin-bottom: 14px;
             line-height: 1em;
             font-size: 12px;
             color: #72829d;
          }
        }
        .focus {
          width: 140px;
          h3 {
            margin-bottom: 14px;
            line-height: 1em;
            font-size: 12px;
            color: #72829d;
          }
          span {
            display: block;
            line-height: 1em;
            margin-bottom: 23px;
            font-size: 12px;
            color: #72829d;
          }
          .share a {
            display: block;
            margin-right: 20px;
            width: 36px;
            height: 36px;
            border-radius: 100%;
            background: #6c85ae;
            background-repeat: no-repeat;
            background-position: 50%;
            &:hover {
              background: #c5caea;
              background-repeat: no-repeat;
              background-position: 50%;
            }
            &:nth-child(1) {
              background-image: url("../assets/images/facebook.png");
            }
            &:nth-child(2) {
              background-image: url("../assets/images/twitter.png");
            }
            &:nth-child(3) {
              background-image: url("../assets/images/sina.png");
            }
          }
        }
      }
      .center {
        width: 185px;
        height: 160px;
        background: url("../assets/images/footerImg.png") no-repeat center 10px;
      }
    }
    .down {
      width: 100%;
      padding: 0 8% 0 10%;
      border-top: 1px solid #212145;
      p {
        height: 77px;
        line-height: 77px;
        font-size: 12px;
        text-align: center;
        color: #6c85ae;
      }
    }
  }
</style>
