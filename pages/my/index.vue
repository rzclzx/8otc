<template>
  <section class="container">
    <my-user></my-user>
    <my-title :arr="['my.onAdvertising',{text: 'my.goAdvertising', href: '/adv'}]"></my-title>
    <advertising-list style="padding-bottom: 50px" :number="2"></advertising-list>
    <my-title style="margin-top: 20px" :arr="['my.moneyAccount']"></my-title>
    <account-list></account-list>
  </section>
</template>

<script>
import MyUser from '../../components/my/my-user'
import MyTitle from '../../components/my/my-title'
import AdvertisingList from '../../components/advertising/advertising-list'
import AccountList from '../../components/my/account-list'
export default {
  name: 'my-index',
  middleware: ['auth', 'niceName'],
  components: {
    MyUser,
    MyTitle,
    AdvertisingList,
    AccountList
  },
  data () {
    return {
      navArr: [{key: '1', text: 'order.forPayment'}, {key: '2', text: 'order.toReleased'}, {key: '3', text: 'order.beenCompleted'}, {key: '4', text: 'order.beenCancelled'}]
    }
  }
}
</script>
