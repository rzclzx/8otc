<template>
  <section class="container">
    <type-nav :arr="navArr"></type-nav>
    <advertising-list></advertising-list>
  </section>
</template>

<script>
  import TypeNav from '../../components/type-nav'
  import AdvertisingList from '../../components/advertising/advertising-list'

  export default {
    name: 'adv-index',
    middleware: ['auth', 'niceName'],
    components: {
      TypeNav,
      AdvertisingList
    },
    data () {
      return {
        navArr: [{key: '', text: 'advertising.management'}]
      }
    }
  }
</script>

<style>
  .container {

  }
</style>
