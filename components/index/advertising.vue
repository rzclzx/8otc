<template>
  <st-row class="advertising" v-show="isShow" justify="between" align="center">
    <a :href="notice && notice.html_url" target="_blank">
      <st-row class="advertising-left" align="center">
        <div></div>
        <h3>{{$t('index.importantNotice')}}<span>{{ notice && notice.title }}</span></h3>
      </st-row>
    </a>
    <!--<div class="advertising-right">-->
      <!--<a @click="close"></a>-->
    <!--</div>-->
  </st-row>
</template>

<script>
  export default {
    name: 'advertising',
    data () {
      return {
        isShow: true,
        notice: null
      }
    },
    methods: {
      close () {
        sessionStorage.advertising = false
        this.isShow = false
      }
    },
    mounted () {
      this.isShow = sessionStorage.advertising !== 'false'
      console.log(this.$store.state.dictionary.zendeskLocale[this.$i18n.locale])
      this.toolsApi.getAnnouncement(this.$store.state.dictionary.zendeskLocale[this.$i18n.locale] || 'en-us', '360000286714')
        .then(res => {
          this.notice = res.articles[0]
        })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .advertising {
    margin-bottom: 20px;
    padding: 0 40px 0 24px;
    width: 100%;
    height: 48px;
    background: #fff;
    .advertising-left {
      div {
        width: 16px;
        height: 16px;
        background-image: url("../../assets/images/gonggao.png");
      }
      h3 {
        margin-left: 14px;
        font-size: 14px;
        color: #597ab9;
        span {
          color: #1e2266;
        }
      }
    }
    .advertising-right {
      a {
        display: block;
        width: 14px;
        height: 14px;
        background-image: url("../../assets/images/chahao.png");
      }
    }
  }
</style>
