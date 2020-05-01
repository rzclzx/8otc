<template>
  <st-row class="order-cancel-window" direction="column"  align="center" >
    <h4>{{$t('order.upOneTrade')}}</h4>
    <p>*{{$t('order.cancelOne')}}</p>
    <st-row justify="between" >
      <a class="btn1" @click="cancel">{{$t('order.confirmUp')}}</a>
      <a class="btn2" @click="close">{{$t('order.continueTrade')}}</a>
    </st-row>
  </st-row>
</template>

<script>
  export default {
    name: 'order-cancel-window',
    components: {
    },
    props: ['close', 'cancelId'],
    methods: {
      cancel () {
        this.orderApi.orderCancel(this.cancelId)
          .then(res => {
            this.$toast(this.$t('order.cancelOrder'))
            this.$emit('getOrderList')
            this.close()
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .order-cancel-window {
    h4 {
      margin-top: 48px;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
    }
    p {
      margin: 0px 0 25px;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #999;
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
