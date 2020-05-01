<template>
  <st-row class="my-title" align="center" justify="between">
    <p>{{$t(arr[0])}}</p>
    <div v-if="arr[1]">
      <nuxt-link :to="arr[1].href">{{$t(arr[1].text)}}</nuxt-link>
    </div>
  </st-row>
</template>

<script>
  export default {
    name: 'my-title',
    props: ['arr']
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .my-title {
    padding: 0 40px;
    height: 48px;
    background: #fff;
    p {
      font-size: 16px;
    }
    div a {
      font-size: 14px;
      color: #ff7300;
    }
  }
</style>
