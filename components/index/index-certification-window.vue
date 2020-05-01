<template>
  <st-row class="order-cancel-window" direction="column"  align="center" >
    <h4>{{$t('index.onlyHighAuthMessage')}}</h4>
    <st-row justify="between" >
      <nuxt-link class="btn1" to="/users/auth/two">{{$t('index.goCertification')}}</nuxt-link>
      <a class="btn2" @click="close">{{$t('index.close')}}</a>
    </st-row>
  </st-row>
</template>

<script>
  export default {
    name: 'index-certification-window',
//    data () {
//      return {
//        type: this.$store.state.user.userInfo
//      }
//    },
    components: {
    },
    props: ['close', 'type']
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .order-cancel-window {
    h4 {
      margin: 48px 0;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
    }
    .btn1,.btn2 {
      width: 108px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      .border-radius()
    }
    .btn1 {
      color: #597ab9;
      border: 1px solid #597ab9;
    }
    .btn2 {
      color: #fff;
      background-color: #597ab9;
    }
    div {
      a:nth-child(2) {
        margin-left: 20px;
      }
    }
  }
</style>
