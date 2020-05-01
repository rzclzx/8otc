<template>
  <div class="index-list">
    <table>
      <thead>
      <tr>
        <th style="width: 120px">{{$t('advertising.advertisingNumber')}}</th>
        <th style="width: 120px">{{$t('advertising.advertisingType')}}</th>
        <th>{{$t('advertising.advertisingAmount')}}</th>
        <th>{{$t('advertising.beenDeal')}}</th>
        <th>{{$t('advertising.price')}}</th>
        <th>{{$t('advertising.premium')}}</th>
        <!--<th>{{$t('advertising.methodPayment')}}</th>-->
        <th>{{$t('advertising.status')}}</th>
        <th>{{$t('advertising.operation')}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!number||number>index" v-for="(item,index) in list">
        <td class="advertisingNumber">
        <span>{{item.id}}</span>
        </td>
        <td :style="{color: item.type === 1 ? '#f37053' : '#67c18c'}">
          {{getCoinName(item.currencyId)}}{{item.type === 1 ? $t('advertising.onBuy') : $t('advertising.onSell')}}
        </td>
        <td>
          {{item.status !== 2 ?((item.executedQuantity || 0) +  (item.reservedQuantity || 0) + (item.quantity || 0)) : '--'|splitFormat(4, 8)}}
        </td>
        <td>
          {{item.status !== 2 ?(item.executedQuantity||0):'--'|splitFormat(4, 8)}}
        </td>
        <td class="price">
          <div>{{item.pricingType === 2 ? getPrcie(item.premium, item.currencyId) : item.price|splitFormat(~[183, 24].indexOf(item.currencyId) ? 4 : 2)|numberFormat}}CNY</div>
        </td>
        <td>{{item.pricingType === 2 ? (item.premium || 0) + '%' : '--'}}</td>
        <!--<td>-->
          <!--<st-row justify="end">-->
            <!--<div :class="'img icon_'+info.bankType" v-for="info in item.bankType"></div>-->
          <!--</st-row>-->
        <!--</td>-->
        <td>{{item.status !== 2 ? $t('advertising.statusOne') : $t('advertising.statusTwo') }}</td>
        <td style="width: 220px;">
          <st-row justify="end">
            <a v-if="item.status !==2" class="shelves" @click="theShelves(item.id)">{{$t('advertising.downAdvertising')}}</a>
            <template v-else>
              <!--<a @click="deleteAdv(item.id)" class="eidt">{{$t('advertising.delete')}}</a>-->
              <nuxt-link :to="`/adv/${item.type === 1? 'buy': 'sell'}?id=${item.id}`" class="eidt">{{$t('advertising.editAdvertising')}}</nuxt-link>
              <a class="shelves" @click="shelves(item)" >{{$t('advertising.upAdvertising')}}</a>
            </template>
          </st-row>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="list && list.length === 0" class="no-list">
      <img src="../../assets/images/nolist.jpg" alt="" />
      <h6 style="font-weight: normal">{{$t('public.noList')}}</h6>
    </div>
    <popup :title="$t('advertising.advertisingOn')" width="480" :callback="onAdvClsoe" v-if="isOnAdv">
      <adv-on-window @getList="getList" :shelvesInfo="shelvesInfo" :close="onAdvClsoe"></adv-on-window>
    </popup>
  </div>
</template>

<script>
  import Popup from '../../components/common/popup/popup'
  import AdvOnWindow from './adv-on-window'
  import Utils from '../../assets/js/utils'
  export default {
    name: 'advertising-list',
    props: ['number'],
    components: {
      Popup,
      AdvOnWindow
    },
    data () {
      return {
        isBtnOne: false,
        isOnAdv: false,
        list: null,
        shelvesInfo: {},
        priceList: []
      }
    },
    computed: {
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      }
    },
    methods: {
      theShelves (id) {
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        this.advertApi.offlineAdvert(id)
          .then(res => {
            this.$toast(this.$t('advertising.downSuccess'))
            this.getList()
            this.isBtnOne = false
          }).catch(e => {
            this.isBtnOne = false
          })
      },
      shelves (info) {
        this.shelvesInfo = info
        this.isOnAdv = true
      },
      getCoinName (id) {
        return this.currencyList.filter(item => { return item.currencyId === id })[0].name
      },
      getList () {
        Promise.all([this.advertApi.getMyAdvertList(), this.toolsApi.getOtcPrice()])
          .then(res => {
            this.priceList = res[1].data
            if (this.number) {
              this.list = res[0].data.filter(item => { return item.status !== 2 })
            } else {
              this.list = res[0].data
            }
          })
      },
      getPrcie (premium, currencyId) {
        return Utils.retainDecimals(this.priceList.filter(item => { return currencyId === item.currencyId })[0].index * (1 + premium / 100), {decimal: 2})
      },
      onAdvClsoe () {
        this.isOnAdv = false
      },
      deleteAdv (id) {
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        this.advertApi.getDeleteAdvert(id).then(res => {
          this.$toast(this.$t('advertising.deleteSuccess'))
          this.isBtnOne = false
          this.getList()
        }).catch(e => {
          this.isBtnOne = false
        })
      }
    },
    mounted () {
      this.getList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  @import "../index/list-table";
  .index-list table {
    tbody {
      tr {
        height: 60px;
        &:hover {
          background: #f3f7ff;
        }
        td.advertisingNumber {
          span {
            color: #6c85ae;
          }
        }
        /*.img {*/
          /*margin-left: 3px;*/
          /*width: 18px;*/
          /*height: 18px;*/
          /*background-size: 100%;*/
          /*&.icon_1 {*/
            /*background-image: url("../../assets/images/icon-pay.png");*/
          /*}*/
          /*&.icon_0 {*/
            /*background-image: url("../../assets/images/icon-bank.png");*/
          /*}*/
          /*&.icon_2 {*/
            /*background-image: url("../../assets/images/icon-wechat.png");*/
          /*}*/
        /*}*/
        .price {
          font-size: 14px;
        }
      }
    }
  }
  .eidt,.shelves {
    width: 46px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    .border-radius()
  }
  .eidt {
    margin-right: 8px;
    color: #53b7e8;
    border: 1px solid #53b7e8;
    &:hover {
      background-color: #53b7e8;
      color: #fff;
    }
  }
  .shelves {
    background-color: #53b7e8;
    color: #fff;
    &:hover {
      background-color: #4fafde;
    }
  }
</style>
