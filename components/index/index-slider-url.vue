<template>
  <div class="index-slider">
    <h2>{{ title }}</h2>
    <st-row class="item" :class="{active: $route.query.id ? ($route.query.id.toString() === item.currencyId.toString()) : (currencyList[0].id === item.id)}" justify="center" align="center" v-for="item in currencyList" :key="item.id">
      <nuxt-link :to="{name: $route.name, query: {id: item.currencyId,type: $route.query.type}}">{{ item.name }}</nuxt-link>
    </st-row>
  </div>
</template>

<script>
  export default {
    name: 'index-slider',
    components: {
    },
    props: {
      title: {
        type: String,
        required: true
      }
    },
    data () {
      return {
      }
    },
    computed: {
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../assets/css/theme";
  .index-slider {
    width: 160px;
    padding: 4px 0 26px;
    background: #fff;
    h2 {
      padding-left: 24px;
      line-height: 54px;
      font-size: 16px;
      color: @tipColor;
    }
    .item {
      height: 40px;
      a {
        font-size: 14px;
        color: #333;
      }
      a:hover {
        color: #597ab9;
      }
      &.active {
        background: @linkColor;
        a {
          color: #fff;
        }
      }
    }
  }
</style>
