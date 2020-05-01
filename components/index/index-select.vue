<template>
  <div class="index-select">
    <st-form-item minHeight="30px" class="otc-index-select">
      <st-select class="item" ref="select" v-model="info.id" :value="info.id" :initText="initText" @onSelect="select" :width="filterWidth + 'px'">
        <st-option v-for="item in priceSelect"
                   :key="item.id"
                   :value="item.id"
                   :label="item.text"
        >
        </st-option>
      </st-select>
    </st-form-item>
  </div>
</template>

<script>
  export default {
    name: 'index-select',
    data () {
      let arr = [{id: 0, text: this.$t('index.moneyAll')}, {id: 1, text: this.$t('index.fiveDown'), max: 50000}, {id: 2, text: this.$t('index.fiveOrTwo'), min: 50000, max: 200000}, {id: 3, text: this.$t('index.twoUp'), min: 200000}]
      return {
        info: arr[0],
        priceSelect: arr,
        initText: this.$t('index.moneySelect'),
        filterWidth: this.$store.state.auth.locale === 'cn' ? 90 : 120
      }
    },
    methods: {
      select (id) {
        let obj = {}
        Object.assign(obj, this.$route.query, {price: id})
        delete obj.page
        this.$router.push({query: obj})
        this.selectFn(id)
      },
      selectFn (id) {
        this.info = this.priceSelect.filter(item => {
          return item.id === Number(id)
        })[0]
        if (!isNaN(this.$route.query.price)) {
          this.initText = this.info.text
        }
      }
    },
    created () {
      this.selectFn(this.$route.query.price || 0)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../assets/css/theme";
 .index-select {
   .otc-index-select {
     margin-left: 30px;
     .st-select .box {
       height: 28px;
       background: #fff;
       border: solid 1px #597ab9;
       p {
         color: #597ab9;
         &:hover {
           color: #112266;
         }
       }
     }
     .st-select ul {
       border:  none;
       overflow: hidden;
       .border-shadow(1px 1px 5px #ccc);
       .st-option {
         height: 34px;
         line-height: 34px;
         background-color: #fff;
         color: #597ab9;
         &:hover {
           color: #112266;
           background-color: #eff1f6;
         }
         border:  none;
       }
     }
   }
 }
</style>
