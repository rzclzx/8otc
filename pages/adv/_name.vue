<template>
  <section class="container adv-name">
    <h2>{{$t('advertising.releaseAdvertising')}}</h2>
    <div class="info">
      <st-row class="nav">
        <nuxt-link :class="{active: isBuy}" :to="{name: $route.name, params: {name: 'buy'}}">{{$t('advertising.buy')}}</nuxt-link>
        <nuxt-link :to="{name: $route.name, params: {name: 'sell'}}" :class="{active: !isBuy}">{{$t('advertising.sell')}}</nuxt-link>
      </st-row>
      <st-form class="form" v-model="ruleForm" :rules="rules" @submit="submit">
        <st-form-item
          :label="$t('advertising.tradeMoney')"
          v-if="$route.query.id"
        >
          <p style="height: 40px;line-height: 40px;">{{priceInfo.name}}</p>
        </st-form-item>
        <st-form-item
          :label="$t('advertising.tradeMoney')"
          v-else
        >
          <st-select class="item" v-model="coinId" :value="coinId" :initText="currencyList&&currencyList[0].name" @onSelect="selectCoin" width="360px">
            <st-option
              v-for="item in currencyList"
              :key="item.currencyId"
              :value="item.currencyId"
              :label="item.name"
            >
            </st-option>
          </st-select>
        </st-form-item>
        <st-form-item
          :label="$t('advertising.specifiedPrice')"
          limitName="price"
          ruleName="price"
        >
         <div class="unit">
           <st-input
             ref="price"
             type="text"
             :maxLength="16"
             v-model="ruleForm.price"
             :limits="limits.price"
             style="width: 360px"
             :readonly="isPremium"
             :style="{backgroundColor: isPremium ? '#f8f9fb' : ''}"
             @input="GetMaxTrade"
           />
           <p class="unit-p"><span :style="{color: isPremium ? '#ccc' : ''}">CNY</span></p>
         </div>
        </st-form-item>
        <st-form-item
          limitName="premium"
          ruleName="premium"
          v-if="exponent"
        >
          <div class="unit">
            <st-row class="unit-title" align="center" justify="end"><a class="checkbox2" :class="{active: isPremium}" @click="priceType"></a><span>{{$t('advertising.automaticPremium')}}</span></st-row>
          <st-input
            type="text"
            :maxLength="5"
            ref="premium"
            v-model="ruleForm.premium"
            :limits="limits.premium"
            style="width: 360px"
            :readonly="!isPremium"
            :style="{backgroundColor: isPremium ? '' : '#f8f9fb'}"
            @input="GetMaxTrade"
          />
            <st-row class="unit-message" style="width: 360px" :justify="ruleForm.premium && 0<=ruleForm.premium && ruleForm.premium  <=30 ?'between':'end'">
              <p v-if="ruleForm.premium && 0<=ruleForm.premium && ruleForm.premium  <=30">{{$t('advertising.currentPremium')}}：<span>{{retainDecimals(exponent*(1+ruleForm.premium/100), {integer: 9, decimal: 2})}}</span> CNY</p>
              <p>{{priceInfo.name}}{{$t('advertising.index')}}：<span>{{retainDecimals(exponent, {decimal: 2})}}</span></p>
            </st-row>
            <p class="unit-p"><span :style="{color: isPremium ? '' : '#ccc'}">%</span></p>
          </div>
        </st-form-item>
        <st-form-item
          :label="$route.params.name === 'buy'?$t('advertising.buyAmount'):$t('advertising.sellAmount')"
          limitName="amount"
          ruleName="amount"
        >
          <div class="unit">
          <st-input
            type="text"
            :maxLength="16"
            v-model="ruleForm.amount"
            :limits="limits.amount"
            ref="amount"
            style="width: 360px"
            @input="GetMaxTrade"
          />
            <div class="unit-message">
              <a @click="getQuantity(userCoin)">
                <span></span>
                {{$t('index.userRemaining')}}:{{userCoin}} {{priceInfo.name}}
              </a>
              <!--<p>{{$t('advertising.currentPrice')}}：<span>{{isPremium ? retainDecimals(utils.precision.times(exponent, (1 + ruleForm.premium / 100), ruleForm.amount), {integer: 14, decimal: 2}) : retainDecimals(utils.precision.times(ruleForm.price , ruleForm.amount), {integer: 14, decimal: 2}) }}</span></p>-->
            </div>
            <p class="unit-p"><span>{{priceInfo.name}}</span></p>
          </div>
        </st-form-item>
        <st-form-item
          :label="$t('advertising.minTrade')"
          limitName="price"
          ruleName="minTrade"
        >
          <div class="unit">
          <st-input
            type="text"
            :maxLength="16"
            v-model="ruleForm.minTrade"
            :limits="limits.price"
            style="width: 360px"
          />
            <p class="unit-p"><span>CNY</span></p>
          </div>
          <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
        </st-form-item>
        <st-form-item
          :label="$t('advertising.maxTrade')"
          limitName="price"
          ruleName="maxTrade"
        >
          <div class="unit">
          <st-input
            type="text"
            :maxLength="16"
            :limits="limits.price"
            v-model="ruleForm.maxTrade"
            style="width: 360px"
          />
            <p class="unit-p"><span>CNY</span></p>
          </div>
          <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
        </st-form-item>
        <st-form-item
          :label="$t('index.moneyPw')"
          limitName="password"
          ruleName="password"
          v-if="isPwd"
        >
          <st-input
            onfocus="this.type='password'"
            type="text"
            :maxLength="6"
            v-model="ruleForm.password"
            :limits="limits.password"
            :placeholder="$t('index.placeMoneyPw')"
            style="width: 360px"
          />
          <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
        </st-form-item>
        <st-form-item
          :label="$t('advertising.tradeMessage')"
          ruleName="tradeMessage"
         style="height: 130px"
        >
          <st-textarea
            type="text"
            elementType="textarea"
            :maxLength="200"
            v-model="ruleForm.tradeMessage"
            style="width: 360px;height: 100px;"
          />
          <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
        </st-form-item>
        <!--<h4 class="limit-title">{{isBuy ? $t('advertising.maxTrade') : $t('advertising.buyTradeLimit')}}</h4>-->
        <!--<st-form-item-->
          <!--:label="$t(isBuy ? 'advertising.sellTradeNumber': 'advertising.buyTradeNumber')"-->
          <!--limitName="number"-->
          <!--ruleName="number"-->
          <!--style="height: 65px; min-height: 65px"-->
        <!--&gt;-->
          <!--<st-input-->
            <!--type="text"-->
            <!--:maxLength="16"-->
            <!--v-model="ruleForm.number"-->
            <!--:limits="limits.number"-->
            <!--style="width: 360px"-->
          <!--/>-->
          <!--&lt;!&ndash;<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">&ndash;&gt;-->
        <!--</st-form-item>-->
        <!--<div class="limit">-->
          <!--<st-row align="center"><a class="checkbox" id="kyc1" :class="{active: isKYC1}" @click="isKYC1 = !isKYC1"></a><label for="kyc1">{{$t(isBuy?'advertising.kyc1Sell':'advertising.kyc1Buy')}}</label></st-row>-->
          <!--<st-row align="center"><a class="checkbox" id="kyc2" :class="{active: isKYC2}" @click="isKYC2 = !isKYC2"></a><label for="kyc2">{{$t(isBuy?'advertising.kyc2Sell':'advertising.kyc2Buy')}}</label></st-row>-->
          <!--<p>{{$t('advertising.tradeLimitMessage')}}</p>-->
        <!--</div>-->
        <st-form-item
          :label="$t('advertising.autoReply')"
          style="height: 150px"
          ruleName="autoReply"
        >
          <div class="unit">
            <a class="checkbox"   style="top: 20%;left: -118px; margin-top: -16px"  :class="{active: isAutoReply}" @click="openAutoReply"></a>
          <st-textarea
            type="text"
            elementType="textarea"
            :maxLength="200"
            v-model="ruleForm.autoReply"
            style="width: 360px;height: 150px;"
            ref = "autoReply"
          />
          </div>
        </st-form-item>
        <div class="limit">
        <st-row align="center"><a class="checkbox" id="kyc2" :class="{active: onlyHighAuth}" @click="onlyHighAuth = !onlyHighAuth"></a><label for="kyc2">{{$t('advertising.onlyHighAuth')}}</label></st-row>
        </div>
        <st-row class="btn" direction="column">
          <input :class="{btnOne: isBtnOne}"  type="submit" :value="$t('advertising.releaseAdvertising')"/>
          <st-row justify="between" style="width: 360px">
            <p>{{$t('advertising.fee')}}<span>0.00%</span></p>
            <p v-if="isBuy" class="marginLimit">{{$t('advertising.marginLimit')}}<span>{{priceInfo.marginLimit}} {{priceInfo.name}}</span><a
              href="https://58coin-support.zendesk.com/hc/zh-cn/articles/360001379613-%E8%B5%84%E8%B4%B9%E4%BB%8B%E7%BB%8D" target="_blank"><i>?</i></a></p>
          </st-row>
        </st-row>
      </st-form>
    </div>
    <popup :title="$t('advertising.releaseAdvertising')" width="480" :callback="priceMessageClose" v-if="isPriceMessage">
      <adv-price-message-window @priceMessageFn="priceMessageFn"  :close="priceMessageClose"></adv-price-message-window>
    </popup>
  </section>
</template>

<script>
  import ToolsApi from '~/assets/js/api/toolsApi'
//  import AdvertApi from '~/assets/js/api/advertApi'
//  import SelectOption from '../../../components/form/src/element/option'
//  import DownSelect from '../../../components/form/src/element/select'
//  import StTextarea from '../../../components/form/src/element/textarea'
  import Popup from '../../components/common/popup/popup'
  import AdvPriceMessageWindow from '../../components/advertising/adv-price-message-window'
  import Utils from '../../assets/js/utils'
  export default {
    name: 'adv-name',
    middleware: ['auth', 'niceName'],
    components: {
//      DownSelect,
//      SelectOption,
//      StTextarea,
      Popup,
      AdvPriceMessageWindow
    },
    async asyncData (context) {
      let res = await ToolsApi.isNeedPwd()
      let fee = {} // await AdvertApi.getFee()
      return {
        isPwd: res.data.needTradePwd,
        fee: fee
      }
    },
    data () {
      return {
        utils: Utils,
//        pricePrecision: 2,
        isBtnOne: false,
        coinId: 1,
        isPremium: false,
//        isKYC1: true,
//        isKYC2: true,
        isAutoReply: true,
        onlyHighAuth: false,
        isPriceMessage: false,
        exponent: 0,
        exponentList: [],
        priceInfo: {},
        priceInterval: null,
        userCoin: 0,
        ruleForm: {
          amount: '',
          price: '',
          premium: '',
          minTrade: 500,
          maxTrade: '',
          tradeMessage: '',
          password: '',
          autoReply: ''
        },
        rules: {
          amount: [
            { required: true, message: this.$t('message.placeAmount') },
            {
              validator: value => {
                if (Number(value) === 0) {
                  return false
                }
                return true
              },
              message: this.$t('message.placeAmount')
            }
          ],
          price: [
            { required: false, message: this.$t('message.placePrice') },
            {
              validator: value => {
                if (!this.isPremium && (!value || Number(value) === 0)) {
                  return false
                } else if (!this.isPremium && this.coinId === 24 && (Number(value) > 1.02 || Number(value) < 0.98)) {
                  return false
                }
                return true
              },
              message: this.$t('message.placePrice')
            }
          ],
          premium: [
            { required: false, message: this.$t('message.placePremium') },
            {
              validator: value => {
                if (this.isPremium) {
                  if (!value || isNaN(value) || Number(value) < 0 || Number(value) > 30) {
                    return false
                  }
                }
//                this.GetMaxTrade()
                return true
              },
              message: this.$t('message.placePremiumQj')
            }
          ],
          minTrade: [
            { required: true, message: this.$t('message.placePrice') },
            {
              validator: value => {
                if (!value || Number(value) < this.priceInfo.minLimit || (this.ruleForm.maxTrade && Number(value) > Number(this.ruleForm.maxTrade))) {
                  return false
                }
                return true
              },
              message: this.$t('message.placeMinTrade')
            }
          ],
          maxTrade: [
            { required: true, message: this.$t('message.placePrice') },
            {
              validator: value => {
                if (!value || Number(value) < this.priceInfo.minLimit || Number(value) > (!this.isPremium ? this.utils.precision.times(this.ruleForm.price, this.ruleForm.amount) : this.utils.precision.times(this.exponent, (1 + this.ruleForm.premium / 100), this.ruleForm.amount))) {
                  return false
                }
                return true
              },
              message: this.$t('message.placeMaxTrade')
            }
          ],
          tradeMessage: [
//            { required: true, message: '请输入正确的留言信息！' },
//            {
//              validator: value => {
//                return true
//              },
//              message: '请输入正确的留言信息！'
//            }
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
          ],
          autoReply: [
            { required: this.isAutoReply, message: this.$t('advertising.autoReplyMessage') },
            {
              validator: value => {
                if (this.isAutoReply && !value) {
                  return false
                }
                return true
              },
              message: this.$t('advertising.autoReplyMessage')
            }
          ]
        },
        limits: {
          amount: [
            value => {
              return Utils.retainDecimals(value, { integer: 7, decimal: (this.priceInfo.pricePrecision === 4 ? this.priceInfo.pricePrecision : 8) })
            }
          ],
          price: [
            value => {
              return Utils.retainDecimals(value, {decimal: this.priceInfo.pricePrecision})
            }
          ],
          premium: [
            value => {
              return Utils.retainDecimals(value, {integer: 2, decimal: 2})
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
    computed: {
      userInfo () {
        return this.$store.state.user.userInfo
      },
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      },
      isBuy () {
        return this.$route.params.name === 'buy'
      },
      advId () {
        return this.$route.query.id
      }
    },
//    watch: {
//      exponent () {
//        this.GetMaxTrade()
//      }
//    },
    methods: {
      getQuantity (quantity) {
        if (quantity > 0) {
          this.ruleForm.amount = this.retainDecimals(quantity, {decimal: this.priceInfo.pricePrecision === 4 ? this.priceInfo.pricePrecision : 8})
          this.$refs.amount.toggle(this.ruleForm.amount)
          this.GetMaxTrade()
        }
      },
      getUserCoin () {
        this.userApi.getUserCoin(this.coinId)
          .then(res => {
            this.userCoin = res.data.available < 0.0001 ? '0.0000' : res.data.available
          })
      },
      GetMaxTrade () {
        if ((this.isPremium || this.ruleForm.price) && this.ruleForm.amount) {
//          this.ruleForm.maxTrade = this.isPremium ? this.utils.precision.times(this.utils.retainDecimals(this.exponent * (1 + this.ruleForm.premium / 100), { decimal: 2 }), this.ruleForm.amount) : this.utils.precision.times(this.ruleForm.price, this.ruleForm.amount)
          this.ruleForm.maxTrade = this.isPremium ? this.utils.precision.times(this.exponent, (1 + this.ruleForm.premium / 100), this.ruleForm.amount) : this.utils.precision.times(this.ruleForm.price, this.ruleForm.amount)
          this.ruleForm.maxTrade = this.retainDecimals(this.ruleForm.maxTrade)
        }
      },
      dataInit () {
        this.ruleForm.price = ''
        this.ruleForm.amount = ''
      },
      retainDecimals (value, obj = {decimal: 2}) {
        return Utils.retainDecimals(value, obj)
      },
      priceMessageClose () {
        this.isPriceMessage = false
      },
      priceMessageFn () {
        this.isPriceMessage = false
        this.send()
      },
//      getTotalPrice (value) {
//        return Utils.retainDecimals(value, {decimal: 2})
//      },
      selectCoin (val) {
        this.coinId = val
        this.isPremium = false
        this.getUserCoin()
        this.priceInfo = this.getCoinItem()
        this.exponent = this.exponentList.filter(item => { return item.currencyId === this.coinId })[0].index
        this.rules.minTrade[1].message = this.rules.minTrade[1].message.replace('{price}', this.priceInfo.minLimit)
        this.rules.maxTrade[1].message = this.rules.maxTrade[1].message.replace('{price}', this.priceInfo.minLimit)
        this.rules.price[1].message = this.coinId === 24 ? this.$t('error.930022') : this.$t('message.placePrice')
        this.dataInit()
      },
      submit () {
        if (this.exponent && (this.isPremium ? this.ruleForm.premium > 5 : (this.ruleForm.price > this.exponent * 105 / 100 || this.ruleForm.price < this.exponent * 95 / 100))) {
          this.isPriceMessage = true
        } else {
          this.send()
        }
      },
      send () {
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        if (this.advId) {
          this.advertApi.updateAdvert(this.advId, this.ruleForm.price, this.coinId, this.ruleForm.premium, this.isPremium ? 2 : 1, this.ruleForm.tradeMessage, this.ruleForm.amount, this.ruleForm.minTrade, this.ruleForm.maxTrade, this.ruleForm.password, this.isAutoReply ? this.ruleForm.autoReply : undefined, this.onlyHighAuth ? 1 : 2)
            .then(res => {
              this.$toast(this.$t('advertising.editAdv'))
              this.$router.push('/adv')
            })
            .catch(e => {
              this.isBtnOne = false
            })
        } else {
          this.advertApi.createAdvert(this.isBuy ? 1 : 2, this.ruleForm.price, this.coinId, this.ruleForm.premium, this.isPremium ? 2 : 1, this.ruleForm.tradeMessage, this.ruleForm.amount, this.ruleForm.minTrade, this.ruleForm.maxTrade, this.ruleForm.password, this.isAutoReply ? this.ruleForm.autoReply : undefined, this.onlyHighAuth ? 1 : 2)
            .then(res => {
              this.$toast(this.$t('advertising.newsAdv'))
              this.$router.push('/adv')
            })
            .catch(err => {
              if (err.code === 920010 || err.code === 920009) {
                setTimeout(() => {
                  this.$router.push('/my')
                }, 1500)
              } else if (err.code === -440002) {
                setTimeout(() => {
                  this.$router.push('/adv')
                }, 1500)
              } else {
                this.isBtnOne = false
              }
            })
        }
      },
      priceType () {
        this.ruleForm.premium = ''
        this.ruleForm.price = ''
        this.isPremium = !this.isPremium
        this.$refs.price.toggle('')
        this.$refs.premium.toggle('')
      },
      getAdvertInfo () {
        Promise.all([this.toolsApi.getOtcPrice(), (() => { if (this.advId) { return this.advertApi.getAdvertInfo(this.advId) } else { return this.advertApi.getAutoReply(this.isBuy ? 2 : 1) } })()])
          .then(res => {
            if (this.advId) {
              if (res[1].data.pricingType === 2) {
                this.isPremium = true
                this.ruleForm.premium = res[1].data.premium || ''
              } else {
                this.isPremium = false
                this.ruleForm.price = res[1].data.price
              }
              this.coinId = res[1].data.currencyId
              this.ruleForm.tradeMessage = res[1].data.remark
              this.ruleForm.minTrade = res[1].data.minAmount
              this.ruleForm.maxTrade = res[1].data.maxAmount
              if (res[1].data.autoReply) {
                this.ruleForm.autoReply = res[1].data.autoReply
              } else {
                this.isAutoReply = false
              }
              this.onlyHighAuth = res[1].data.onlyHighAuth === 1
            } else {
              this.ruleForm.autoReply = res[1].data
            }
            this.exponentList = res[0].data
            this.exponent = res[0].data.filter(item => {
              return item.currencyId === this.coinId
            })[0].index
            if (this.advId && !this.exponent) {
              this.isPremium = false
              this.ruleForm.premium = ''
            }
            this.priceInfo = this.getCoinItem()
            this.getUserCoin()
            this.rules.minTrade[1].message = this.rules.minTrade[1].message.replace('{price}', this.priceInfo.minLimit)
            this.rules.maxTrade[1].message = this.rules.maxTrade[1].message.replace('{price}', this.priceInfo.minLimit)
            this.rules.price[1].message = this.coinId === 24 ? this.$t('error.930022') : this.$t('message.placePrice')
          })
      },
//      getCoinName () {
//        let info = this.currencyList.filter(item => { return item.currencyId === this.coinId })[0]
//        this.pricePrecision = info.pricePrecision || 2
//        return info.name
//      },
      getCoinItem () {
        let info = this.currencyList.filter(item => { return item.currencyId === Number(this.coinId) })[0]
        return info
      },
      getPrice () {
        this.toolsApi.getOtcPrice().then(res => {
          this.exponentList = res.data
          this.exponent = res.data.filter(item => {
            return item.currencyId === this.coinId
          })[0].index
        })
      },
      pollingPrice () {
        clearInterval(this.priceInterval)
        this.priceInterval = setInterval(() => {
          this.getPrice()
        }, 60000)
      },
      isAuth () {
        if (!this.userInfo.baseAuth || !this.userInfo.highAuth) {
          this.$toast(this.$t('advertising.kyc1OrKyc2'))
          setTimeout(() => {
            this.$router.push(`/users/auth/${this.userInfo.baseAuth ? 'two' : 'one'}`)
          }, 1500)
        }
      },
      openAutoReply () {
        this.$refs.autoReply.toggle('0')
        this.isAutoReply = !this.isAutoReply
      }
    },
    mounted () {
      if (this.currencyList && this.currencyList[0]) {
        this.coinId = this.currencyList[0].currencyId
      }
      this.getAdvertInfo()
//      this.priceInfo = this.getCoinItem()
      this.pollingPrice()
    },
    created () {
     // console.log(this.currencyList)
    },
    beforeDestroy () {
      clearInterval(this.priceInterval)
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/theme";
  .adv-name {
    h2 {
      margin-bottom: 2px;
      padding-left: 40px;
      height: 48px;
      background: #fff;
      font-size: 16px;
      line-height: 48px;
    }
    .info {
      padding: 50px 0 100px;
      background-color: #fff;
      .nav {
        margin-left: 409px;
        width: 280px;
        border: 1px solid #597ab9;
        a {
          width: 140px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          color: #6c85ae;
          &.active {
            background-color: #597ab9;
            color: #fff;
          }
        }
      }
      .form {
        margin-top: 40px;
        margin-left: 379px;
        .btn {
          input[type='submit'] {
            width: 358px;
            height: 40px;
            font-size: 16px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background: #597ab9;
            cursor: pointer;
            &:hover {
              background: #4a6dae;
            }
          }
          p {
            height: 36px;
            line-height: 36px;
            font-size: 12px;
            color: #b8b8b8;
          }
        }
        .unit {
          position: relative;
          width: 360px;
          .unit-title {
            position: absolute;
            left: -216px;
            height: 40px;
            width: 200px;
            .checkbox2 {
              margin-right: 7px;
              width: 13px;
              height: 13px;
              border: 1px solid #597ab9;
              .border-radius();
              &.active {
                background: url("../../assets/images/icon-fxk.png");
                background-color: #597ab9;
              }
            }
          }
          p.unit-p {
            position: absolute;
            right: 9px;
            top: 50%;
            font-size: 14px;
            margin-top: -11px;
          }
          .unit-message {
            position: absolute;
            right: 0px;
            bottom: -22px;
            color: #999;
            font-size: 12px;
            p {
              margin-left: 8px;
            }
            a {
              color: #6c85ae;
            }
          }
          .checkbox {
            position: absolute;
            top: 50%;
            left: -90px;
            margin-top: -7px;
            width: 13px;
            height: 13px;
            border: 1px solid #597ab9;
            .border-radius();
            &.active {
              background: url("../../assets/images/icon-fxk.png");
              background-color: #597ab9;
            }
          }
        }
        .limit-title {
          margin-bottom: 15px;
          font-size: 16px;
          color: #999;
        }
        .limit {
          margin-top: 20px;
          font-size: 14px;
          color: #999;
          div {
            margin-bottom: 16px;
            a {
              margin-right: 6px;
            }
          }
          p {
            margin-bottom: 30px;
            width: 360px;
          }
          .checkbox {
            width: 13px;
            height: 13px;
            border: 1px solid #597ab9;
            .border-radius();
            &.active {
              background: url("../../assets/images/icon-fxk.png");
              background-color: #597ab9;
            }
          }
        }
      }
    }
    .marginLimit {
      a {
        i {
          margin-left: 6px;
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 1px solid #597ab9;
          color: #597ab9;
          text-align: center;
          line-height: 14px;
          font-style: normal;
          .border-radius(50%);
          &:hover {
            background-color: #597ab9;
            color: #fff;
          }
        }
      }
    }
    input.btnOne {
      background-color: #ebebeb;
      color: #888;
    }
  }
</style>
