<template>
  <section class="container">
    <type-nav :arr="navArr"></type-nav>
    <order-list></order-list>
  </section>
</template>

<script>
import TypeNav from '../../components/type-nav'
import OrderList from '../../components/order/order-list'

export default {
  name: 'order-index',
  middleware: ['auth', 'niceName'],
  components: {
    TypeNav,
    OrderList
  },
  data () {
    return {
      navArr: [{key: 1, text: 'order.forPayment'}, {key: 2, text: 'order.toReleased'}, {key: 3, text: 'order.beenCompleted'}, {key: 4, text: 'order.beenCancelled'}, {key: 10, text: 'order.onComplaint'}]
    }
  }
}
</script>
