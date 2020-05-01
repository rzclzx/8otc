<template>
  <st-row class="type-nav" justify="between">
    <st-row class="nav">
      <template v-for="(item,index) in arr">
        <a v-if="!item.key">{{ $t(item.text) }}</a>
        <nuxt-link v-else :class="{active: $route.query.type? ($route.query.type.toString() === item.key.toString()): (index ===0)}" :to="getUrl(item.key)" >{{ $t(item.text) }}</nuxt-link>
      </template>
    </st-row>
    <div class="no-price" v-if="$route.name === 'index'">
      <span>{{ $t('index.noPrice') }}</span>
      <nuxt-link to="/adv/buy" >{{ $t('index.advertising') }}</nuxt-link>
    </div>
  </st-row>
</template>

<script>
  export default {
    name: 'type-nav',
    props: ['arr'],
    methods: {
      getUrl (key) {
        let obj = {}
        Object.assign(obj, this.$route.query, {type: key})
        delete obj.page
        return {name: this.$route.name, query: obj}
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../assets/css/theme";
  .type-nav {
    padding: 0 40px;
    height: 48px;
    background: #fff;
    .nav {
      a {
        position: relative;
        margin-right: 30px;
        font-size: 16px;
        line-height: 48px;
        color: #333;
      }
      .active {
        color: #597ab9;
        &:after {
          position: absolute;
          left: 0;
          bottom: 0;
          content: '';
          width: 100%;
          height: 2px;
          background: #597ab9;
        }
      }
      a:hover {
        color: #597ab9;
      }
    }
    .no-price {
      line-height: 48px;
      font-size: 14px;
      span {
        color: #999;
      }
      a {
        color: #ff7300;
      }
    }
  }
</style>
