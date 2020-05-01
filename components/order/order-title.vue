<template>
  <st-row class="order-title" justify="between" align="center">
    <h2>{{isBuy() ? $t('order.buyTwo') : $t('order.sellTwo')}}{{getCoinName(info.currencyId)}} <span>{{$t('order.orderNumber')}}：{{info.id}}</span></h2>
    <p v-if="'1,2'.indexOf(info.status)>-1">
      <template v-if="time">
        {{info.status === 1 ? $t('order.buyPayMoney') : $t('order.sellPayCoin')}}（{{$t('order.time')}} {{getTime(time)}}）
      </template>
      <template v-else-if="time === 0">
        {{$t(info.status === 1 ? 'order.windowCancel' : 'order.windowPayCoin')}}
      </template>
    </p>
    <p v-else-if="[3, 21, 22, 23].indexOf(info.status) > -1">{{$t('order.onOrderSuccess')}}</p>
    <p v-else-if="[10].indexOf(info.status) > -1" style="color: #e6491a;">{{$t('order.onOrderComplaint')}}</p>
    <p v-else-if="[11].indexOf(info.status) > -1" style="color: #e6491a;">{{$t('order.toAccept')}}</p>
    <p v-else-if="[99].indexOf(info.status) > -1" >{{$t('order.upCancel')}}</p>
  </st-row>
</template>

<script>
  export default {
    name: 'order-title',
    props: ['info'],
    computed: {
      userInfo () {
        return this.$store.state.user.userInfo
      },
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      }
    },
    data () {
      return {
        timeInterval: null,
        time: ''
      }
    },
    methods: {
      getCoinName (id) {
        return this.currencyList.filter(item => { return item.currencyId === id })[0].name
      },
      getTime (time) {
        if (this.info.status === 1) {
          return this.getZero(parseInt(time / 60)) + ':' + this.getZero(time % 60)
        } else if (this.info.status === 2) {
          return this.getZero(parseInt(time / 3600)) + ':' + this.getZero(parseInt(time % 3600 / 60)) + ':' + this.getZero(time % 60)
        }
      },
      getZero (num) {
        let str = num.toString()
        if (str.length === 1) {
          str = '0' + str
        }
        return str
      },
      timeFn () {
        clearInterval(this.timeInterval)
        if (this.info.status === 1 || this.info.status === 2) {
          this.toolsApi.getTime()
            .then(res => {
              // ((this.info.status === 2) ? (12 * 60) : (this.info.orderType === 1 ? 20 : 30))
              this.time = parseInt(((this.info.status === 1 ? this.info.createDate : this.info.transferDate) + 1000 * 60 * this.info.makerOrderCancelTimeOut - res.data) / 1000)
              if (this.time < 0) {
                this.time = 0
              } else if (this.time) {
                this.timeInterval = setInterval(() => {
                  this.time--
                  if (this.time === 0) {
                    location.reload()
                  }
                }, 1000)
              }
            })
        }
      },
      isBuy () {
        let bl = true
        // 判断是否是本人挂的单
        if (this.info.makerId === this.userInfo.id) {
          bl = this.info.orderType === 2
        } else {
          bl = this.info.orderType === 1
        }
        return bl
      }
    },
    mounted () {
      this.timeFn()
    },
    beforeDestroy () {
      clearInterval(this.timeInterval)
    }
  }
</script>

<style lang="less" scoped>
.order-title {
  padding: 0 40px;
  height: 48px;
  background: #fff;
  h2 {
    font-size: 16px;
    span {
      font-size: 14px;
      color: #999;
    }
  }
  p {
    font-size: 14px;
    color: #67c18c;
  }
}
</style>
