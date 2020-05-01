<template>
  <section class="container">
    <order-title :info="orderDetail"></order-title>
    <order-comments :info="orderDetail" v-if="[3, 21, 22, 23].indexOf(orderDetail.status) > -1"></order-comments>
    <order-detail :info="orderDetail" v-else></order-detail>
    <st-row style="margin-top: 20px" justify="between">
      <order-user :info="orderDetail"></order-user>
      <chat :isOnline="orderDetail.isOnline"></chat>
    </st-row>
  </section>
</template>

<script>
import Chat from '../../components/order/chat'
import OrderTitle from '../../components/order/order-title'
import OrderDetail from '../../components/order/order-detail'
import OrderUser from '../../components/order/order-user'
import orderComments from '../../components/order/order-comments'
import OrderApi from '~/assets/js/api/orderApi'
export default {
  name: 'order-buy',
  middleware: ['auth', 'niceName'],
  components: {
    Chat,
    OrderTitle,
    OrderDetail,
    orderComments,
    OrderUser
  },
  async asyncData (context) { // 3（已完成）, 21卖家评论, 22买家评论, 23双方互评能进入评论页
    // 1, 2, 10, 11 99 待付款 待放行 申诉 申诉受理中 取消申诉
    let res = await OrderApi.orderDetail(context.route.params.id)
    if (!res.data) {
      context.router.push('/order')
    }
    return {
      orderDetail: res.data
    }
  },
  methods: {
    getStatus () {
      clearInterval(this.timeInterval)
      if (!([23, 99].indexOf(this.orderDetail.status) > -1)) {
        this.timeInterval = setInterval(() => {
          this.orderApi.orderStatus(this.orderDetail.id)
            .then(res => {
              if (this.orderDetail.status !== res.data) {
                location.reload()
              }
            })
        }, 10000)
      }
    }
  },
  data () {
    return {
      timeInterval: null
    }
  },
  mounted () {
    this.getStatus()
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  }
}
</script>

<style>

</style>
