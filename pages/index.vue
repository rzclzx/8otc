<template>
 <div class="container">
   <advertising ></advertising>
   <st-row justify="between">
     <div class="slider">
       <index-slider :list="currencyList" :title="$t(`index.selectCoin`)"></index-slider>
       <index-slider :noOtc="true" :list="urlList" :title="$t(`index.newsGuide`)"></index-slider>
     </div>
     <index-content :advertList="advertList"></index-content>
   </st-row>
 </div>
</template>

<script>
  import Advertising from '../components/index/advertising'
  import IndexSlider from '../components/index/index-slider'
  import IndexContent from '../components/index/index-content'
  import AdvertApi from '../assets/js/api/advertApi'

  export default {
    head () {
      return {
        title: this.$t('title.otc')
      }
    },
    components: {
      Advertising,
      IndexSlider,
      IndexContent
    },
    async asyncData (context) {
      let dictionary = context.store.state.dictionary
      let query = context.route.query
      let advertList = []
      let currencyId = 1
      if (dictionary.otcCurrencyList && dictionary.otcCurrencyList[0]) {
        currencyId = dictionary.otcCurrencyList[0].currencyId
      }
      try {
        advertList = await AdvertApi.getAdvertList(dictionary.enum[query.type !== 'sell' ? 'advBuy' : 'advSell'], query.page || 1, query.id || currencyId, query.isMerchant, dictionary.priceSelect[query.price || 0].conditionId)
      } catch (ex) {
      }
      return {
        advertList: advertList.data
      }
    },
    data () {
      return {
        urlList: [
          {name: this.$t('index.otcUrlOne'), url: 'https://58coin-support.zendesk.com/hc/zh-cn/articles/360001392434-C2C-%E4%BA%A4%E6%98%93CNY%E5%85%85%E5%80%BC%E4%B9%B0%E5%B8%81'},
          {name: this.$t('index.otcUrlTwo'), url: 'https://58coin-support.zendesk.com/hc/zh-cn/articles/360001393134-C2C%E5%8D%96%E5%B8%81%E6%8F%90%E7%8E%B0CNY'},
          {name: this.$t('index.otcUrlThree'), url: 'https://58coin-support.zendesk.com/hc/zh-cn/articles/360001377873-C2C%E4%BA%A4%E6%98%93%E8%A7%84%E5%88%99'},
          {name: this.$t('index.otcUrlFore'), url: 'https://58coin-support.zendesk.com/hc/zh-cn/articles/360001486273-58COIN-%E6%B3%95%E5%B8%81OTC%E4%BA%A4%E6%98%93%E5%8C%BA%E8%AE%A4%E8%AF%81%E5%95%86%E5%AE%B6%E5%AE%A1%E6%A0%B8%E6%B5%81%E7%A8%8B'}
        ]
      }
    },
    computed: {
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      }
    }
  }
</script>
<style lang="less" scoped>
  .slider div:last-child {
    margin-top: 10px;
  }
</style>
