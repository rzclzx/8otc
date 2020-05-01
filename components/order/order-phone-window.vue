<template>
  <div class="order-phone-window" >
    <st-row class="user" justify="between"><div>{{otherUser.sf}}：<span>{{otherUser.name}}{{ otherUser.uName ? ('（' + otherUser.uName + '）') : ''}}</span></div><div>{{$t('order.callPhone')}}：<span>{{otherUser.phone}}</span></div></st-row>
    <p class="p1">{{$t('order.callPhoneMessage')}}</p>
    <p class="p2">{{$t('order.callPhoneMessageTwo')}}</p>
    <st-row justify="end" >
      <a class="btn2" @click="close">{{$t('order.meDown')}}</a>
    </st-row>
  </div>
</template>

<script>
  export default {
    name: 'order-phone-window',
    components: {
    },
    props: ['close', 'otherUser']
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .order-phone-window {
    padding: 0 30px 0 50px;
    .user {
      div {
        height: 80px;
        line-height: 80px;
        color: #999;
        font-size: 14px;
        span {
          color: #333;
        }
      }
    }
    .p1 {
      width: 392px;
      font-size: 14px;
    }
    .p2 {
      padding: 16px 0 20px;
      font-size: 14px;
      color: #597ab9;
    }
    .btn2 {
      width: 108px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      .border-radius()
    }
    .btn2 {
      color: #fff;
      background-color: #597ab9;
      &:hover {
        background: #4a6dae;
      }
    }
  }
</style>
