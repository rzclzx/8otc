<template>
  <div class="index-buy-window">
    <st-row class="title" justify="between" align="center">
      <h6>{{$t(orderInfo.type === 2 ?'index.buy' : 'index.sell')}}</h6>
      <p>{{$t('index.orderMessage')}}</p>
    </st-row>
    <!--<st-row class="userInfo" justify="between" align="center" >-->
      <!--<div><span>{{$t('index.principal')}}：</span>{{orderInfo.nickName}}</div>-->
      <!--<div><span>{{$t('index.orderAmount')}}：</span>{{orderInfo.executeNum}}</div>-->
      <!--<div><span>{{$t('index.successRate')}}：</span>{{parseInt(orderInfo.executeNum/orderInfo.orderNum*100)||0}}%</div>-->
    <!--</st-row>-->
    <st-row class="price" align="center" justify="between">
      <div><span>{{$t('index.price')}}</span>{{orderPrice}}</div>
      <div>CNY</div>
    </st-row>
    <st-form class="form" v-model="ruleForm" :rules="rules" @submit="submit">
      <st-form-item
        :label="$t('index.amount')"
        limitName="amount"
        ruleName="amount"
        style="margin-left: 42px"
      >
        <st-input
          type="text"
          :maxLength="16"
          v-model="ruleForm.amount"
          :limits="limits.amount"
          :placeholder="$t('index.placeBuyAmount')"
          style="width: 360px"
          @input="changeBuyMoney"
          ref="amount"
        />
        <div class="all">
          <a @click="all">{{$t('index.all')}}</a>
        </div>
        <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
      </st-form-item>
      <st-form-item
        :label="$t('index.money')"
        limitName="price"
        ruleName="price"
        style="margin-left: 42px"
      >
        <st-input
          type="text"
          :maxLength="16"
          v-model="ruleForm.price"
          :limits="limits.price"
          :placeholder="$t('index.placeBuyMoney')"
          style="width: 360px"
          @input="changeBuyPrice"
          ref="price"
        />
        <div class="all">
          <a @click="all">{{$t('index.all')}}</a>
        </div>
        <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
      </st-form-item>
      <st-form-item
        :label="$t('index.moneyPw')"
        limitName="password"
        ruleName="password"
        style="margin-left: 42px"
        v-if="isPwd"
      >
        <st-input
          type="password"
          :maxLength="6"
          v-model="ruleForm.password"
          :limits="limits.password"
          :placeholder="$t('index.placeMoneyPw')"
          style="width: 360px"
        />
        <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
      </st-form-item>
      <st-row class="remaining" justify="between" align="center">
        <a @click="getQuantity(orderInfo.quantity)">
          <span>{{$t('index.remaining')}}</span>
          {{orderInfo.quantity}} {{currency.name}}
        </a>
        <a @click="getQuantity(userCoin)">
          <span>{{$t('index.userRemaining')}}</span>
          {{userCoin}} {{currency.name}}
        </a>
      </st-row>
      <st-row class="btn" justify="between">
        <a @click="close">{{$t('index.automaticCancel')}}({{closeTime}})</a>
        <input :class="{btnOne: isBtnOne}" type="submit" :value="$t('index.placeOrder')"/>
      </st-row>
    </st-form>
  </div>
</template>

<script>
  import apiConfig from '../../config/api.config'
  import Utils from '../../assets/js/utils'
  import { BigDecimal } from 'bigdecimal'
  export default {
    name: 'index-buy-window',
    props: ['close', 'orderInfo'],
    data () {
      return {
        closeTime: 45,
        timeInteval: null,
        isPwd: false,
        orderPrice: 0,
        userCoin: 0,
        isBtnOne: false,
        ruleForm: {
          amount: '',
          price: '',
          password: ''
        },
        rules: {
          amount: [
            { required: true, message: this.$t('message.placeAmount') },
            {
              validator: value => {
                return true
              },
              message: this.$t('message.placeAmount')
            }
          ],
          price: [
            { required: true, message: this.$t('message.placeMoney') },
            {
              validator: value => {
                if (value < this.currency.minLimit) {
                  this.rules.price[1].message = this.rules.price[1].message.replace('{price}', this.currency.minLimit)
                  return false
                }
                return true
              },
              message: this.$t('message.placeTradeMoney')
            }
          ],
          password: [
            { required: true, message: this.$t('message.placePassword') },
            {
              validator: value => {
                if (value && value.length !== 6) {
                  return false
                }
                return true
              },
              message: this.$t('message.placePassword')
            }
          ]
        },
        limits: {
          amount: [
            value => {
              return Utils.retainDecimals(value, {decimal: (this.currency.pricePrecision === 4 ? this.currency.pricePrecision : 8), integer: 7})
            }
          ],
          price: [
            value => {
              return Utils.retainDecimals(value, {decimal: 2})
            }
          ],
          password: [
            value => {
              value = value.replace(/\D/g, '')
              return value.slice(0, 6)
            }
          ]
        }
      }
    },
    mounted () {
      this.isPermissions()
      this.getUserCoin()
      this.getPwd()
      this.getPrice()
      this.timeInteval = setInterval(() => {
        this.closeTime--
        if (this.closeTime === 0) {
          this.close()
        }
      }, 1000)
    },
    computed: {
      currency () {
        let item = {}
        let list = this.$store.state.dictionary.otcCurrencyList
        if (list) {
          item = list.filter(item => { return item.currencyId === this.orderInfo.currencyId })[0] || {}
        }
        return item
      }
    },
    methods: {
      getQuantity (quantity) {
        this.ruleForm.amount = Utils.retainDecimals(quantity, {decimal: (this.currency.pricePrecision === 4 ? this.currency.pricePrecision : 8)})
        this.changeBuyMoney()
        this.$refs.amount.toggle(this.ruleForm.amount)
        this.$refs.price.toggle(this.ruleForm.price)
      },
      getPwd () {
        if (this.orderInfo.type === 1) {
          this.toolsApi.isNeedPwd().then(res => {
            this.isPwd = res.data.needTradePwd
          })
        }
      },
      isPermissions () {
        if (!this.$store.state.user.userInfo) {
          window.location.href = apiConfig.mainDomain + 'manage/login?position=' + apiConfig.otcDomain
        } else if (!this.$store.state.user.userInfo.otcName) {
          this.$router.push('/users/nickName')
        }
      },
      changeBuyPrice () {
        let price = new BigDecimal((this.ruleForm.price).toString())
        let orderPrice = new BigDecimal((this.orderPrice).toString())
        this.ruleForm.amount = this.ruleForm.price < 1 ? '' : Utils.retainDecimals(price.divide(orderPrice).toString(), {decimal: (this.currency.pricePrecision === 4 ? this.currency.pricePrecision : 8), integer: 7})
      },
      changeBuyMoney () {
        this.ruleForm.price = this.ruleForm.amount < 0.00001 ? '' : Utils.retainDecimals(Utils.precision.times(this.ruleForm.amount, this.orderPrice), {decimal: 2})
      },
      submit () {
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        this.orderApi.createOrder(this.orderInfo.id, this.ruleForm.price, this.ruleForm.amount, this.ruleForm.password)
          .then(res => {
            this.$toast(this.$t('index.orderSuccess'))
            setTimeout(() => {
              this.$router.push('/order/' + res.data)
            }, 1500)
//            this.$toast(this.$t('index.orderSuccess'))
//            this.$store.getOrderCount()
//            this.$emit('getAdvertList')
//            this.close()
          })
          .catch(er => {
            this.isBtnOne = false
            if (er.code === 920010 || er.code === 920009) {
              setTimeout(() => {
                this.$router.push('/my')
              }, 2000)
            } else {
              this.$emit('getAdvertList')
            }
          })
      },
      getPrice () {
        this.orderPrice = this.orderInfo.price
        this.orderApi.getOrderPrice(this.orderInfo.id)
          .then(res => {
            this.orderPrice = res.data || this.orderInfo.price
          }).catch(e => {
            this.close()
          })
      },
      getUserCoin () {
        this.userApi.getUserCoin(this.orderInfo.currencyId)
          .then(res => {
            this.userCoin = res.data.available < 0.0001 ? '0.0000' : res.data.available
          })
      },
      all () {
        let arr = [this.orderInfo.quantity * this.orderPrice, this.orderInfo.maxAmount]
        if (this.orderInfo.type === 1) {
          arr.push(this.userCoin * this.orderPrice)
        }
        let num = arr.indexOf(Math.min.apply(null, arr))
        if (!num) {
          this.ruleForm.amount = this.orderInfo.quantity
          this.changeBuyMoney()
        } else if (num === 1) {
          this.ruleForm.price = this.orderInfo.maxAmount
          this.changeBuyPrice()
        } else {
          this.ruleForm.amount = this.userCoin || ''
          this.changeBuyMoney()
        }
        this.$refs.amount.toggle(this.ruleForm.amount)
        this.$refs.price.toggle(this.ruleForm.price)
      }
    },
    beforeDestroy () {
      clearInterval(this.timeInteval)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .index-buy-window {
    padding: 23px 140px 0 100px;
    font-size: 14px;
    .title {
      height: 74px;
      h6 {
        font-size: 14px;
        color: #f37053;
      }
      p {
        color: #999;
      }
    }
    .userInfo {
      width: 403px;
      height: 40px;
      padding: 0 8px;
      background-color: #f8f9fb;
      color: #6c85ae;
    }
    .price {
      /*height: 62px;*/
      margin-bottom: 16px;
      div:first-child {
        span {
          margin-right: 22px;
        }
      }
      div:last-child {
        margin-right: 10px;
      }
    }
   .remaining {
     position: relative;
     z-index: 1;
     margin-top: -30px;
     margin-left: 42px;
     height: 43px;
     color: #597ab9;
     border-bottom: 1px solid #eff2f5;
     font-size: 12px;
   }
    .btn {
      margin: 38px 0 20px 42px;
      text-align: center;
      a {
        width: 140px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color:  #597ab9;
        border: 1px solid  #597ab9;
        &:hover {
          color: #fff;
          background-color: #597ab9;
        }
        .border-radius()
      }
      input {
        width: 140px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #fff;
        background-color: #597ab9;
        &:hover {
          cursor: pointer;
          background: #4a6dae;
        }
        &.btnOne {
          background-color: #ebebeb;
          color: #888;
        }
        .border-radius()
      }
    }
    .all {
      position: absolute;
      right: -44px;
      top: 9px;
      a {
        color: #597ab9;
        font-size: 14px;
      }
    }
  }
</style>
