<template>
  <st-row class="bread" align="center">
    <template v-for="(item, index) in arr">
      <div v-if="index < arr.length-1">
        <nuxt-link v-if="item.href" :to="item.href">{{$t(item.text)}}</nuxt-link>
        <a v-else>{{$t(item.text)}}</a>
        <span> > </span>
      </div>
      <p v-else>{{$t(item.text)}}</p>
    </template>
  </st-row>
</template>

<script>
  export default {
    name: 'bread',
    props: ['arr']
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .bread {
    padding-left: 40px;
    height: 48px;
    background: #fff;
    font-size: 16px;
    div {
      color: #597ab9;
      span {
        margin: 0 8px;
      }
    }
  }
</style>
