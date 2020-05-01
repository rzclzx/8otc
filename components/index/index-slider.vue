<template>
  <div class="index-slider">
    <h2>{{ title }}</h2>
    <st-row class="item" :class="{active: !noOtc && ($route.query.id ? ($route.query.id.toString() === item.currencyId.toString()) : (list[0].id === item.id))}" justify="center" align="center" v-for="item in list" :key="item.id">
      <a v-if="noOtc" :href="item.url" target="_blank"><p>{{item.name}}</p></a>
      <nuxt-link v-else :to="getUrl(item.currencyId)"><p>{{ item.name }}</p></nuxt-link>
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
      },
      list: {
        type: Array
      },
      noOtc: {
        type: Boolean
      }
    },
    methods: {
      getUrl (currencyId) {
        let obj = {}
        Object.assign(obj, this.$route.query, {id: currencyId})
        delete obj.page
        return {name: this.$route.name, query: obj}
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .index-slider {
    width: 160px;
    padding: 4px 0 26px;
    background: #fff;
    h2 {
      padding-left: 24px;
      line-height: 54px;
      font-size: 14px;
      color: @tipColor;
    }
    .item {
      /*height: 40px;*/
      a {
        display: block;
        width: 100%;
        /*height: 40px;*/
        text-align: center;
        font-size: 14px;
        color: #333;
        p {
          padding: 10px 16px;
          line-height: 20px;
        }
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
