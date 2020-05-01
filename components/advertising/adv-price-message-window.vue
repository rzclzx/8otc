<template>
  <st-row class="order-submit-complaint-window" direction="column"  align="center" >
    <h4>{{$t('advertising.upMessage')}}</h4>
    <!--<p>*恶意提交申诉会被冻结订单并追究一切责任。</p>-->
    <st-row justify="between" >
      <a @click="confirm" class="btn1">{{$t('advertising.confirm')}}</a>
      <a class="btn2" @click="close">{{$t('advertising.up')}}</a>
    </st-row>
  </st-row>
</template>

<script>
  export default {
    name: 'adv-price-massage-window',
    components: {
    },
    props: ['close'],
    data () {
      return {
        message: ''
      }
    },
    methods: {
      confirm () {
        this.$emit('priceMessageFn')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .order-submit-complaint-window {
    h4 {
      margin: 50px 0 25px;
      width: 218px;
      height: 48px;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
    }
    /*p {*/
      /*margin: 15px 0 25px;*/
      /*height: 44px;*/
      /*line-height: 44px;*/
      /*font-size: 14px;*/
      /*color: #999;*/
      /*text-align: center;*/
    /*}*/
    .btn1,.btn2 {
      width: 148px;
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
        margin-left: 30px;
      }
    }
  }
</style>
