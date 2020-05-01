w<template>
  <st-row class="order-complaint-window" direction="column"  align="center" >
    <p>{{$t('order.placeKYC2')}}</p>
    <st-row justify="between" >
      <nuxt-link to="/users/auth/two" class="btn1">{{$t('order.goKYC2')}}</nuxt-link>
      <a class="btn2" @click="close">{{$t('order.upComplaint')}}</a>
    </st-row>
  </st-row>
</template>

<script>
  export default {
    name: 'order-complaint-window',
    components: {
    },
    props: ['close']
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../assets/css/theme";
  .order-complaint-window {
    p {
      margin: 65px 0 35px;
      width: 220px;
      font-size: 14px;
      text-align: center;
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
      &:hover {
        color: #fff;
        background-color: #597ab9;
      }
    }
    .btn2 {
      color: #fff;
      background-color: #597ab9;
      &:hover {
        background: #4a6dae;
      }
    }
    div {
      a:nth-child(2) {
        margin-left: 20px;
      }
    }
  }
</style>
