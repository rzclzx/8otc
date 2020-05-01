<template>
  <div class="adv-on-window">
    <st-form class="form" v-model="ruleForm" :rules="rules" @submit="submit">
      <st-form-item
        limitName="amount"
        ruleName="amount"
      >
        <div class="unit">
        <st-input
          type="text"
          :maxLength="16"
          v-model="ruleForm.amount"
          :limits="limits.amount"
          :placeholder="$t('advertising.placeAmount')"
          style="width: 326px"
          ref="amount"
        />
          <div class="unit-message">
            <a @click="getQuantity(userCoin)">
              <span></span>
              {{$t('index.userRemaining')}}:{{userCoin}} {{info.name}}
            </a>
          </div>
        <p class="unit-p"><span>{{info.name}}</span></p>
       </div>
        <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
      </st-form-item>
      <st-form-item
        limitName="password"
        ruleName="password"
        v-if="isPwd"
      >
        <!--:label="$t('index.moneyPw')"-->
        <st-input
          type="password"
          :maxLength="6"
          v-model="ruleForm.password"
          :limits="limits.password"
          :placeholder="$t('index.placeMoneyPw')"
          style="width: 326px"
        />
        <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
      </st-form-item>
      <st-row class="btn" justify="between">
        <a @click="close">{{$t('advertising.up')}}</a>
        <input :class="{btnOne: isBtnOne}" type="submit" :value="$t('advertising.confirm')"/>
      </st-row>
    </st-form>
  </div>
</template>

<script>
  import Utils from '../../assets/js/utils'
  export default {
    name: 'adv-on-window',
    props: ['close', 'shelvesInfo'],
    data () {
      return {
        userCoin: 0,
        isBtnOne: false,
        isPwd: false,
        info: {},
        ruleForm: {
          amount: '',
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
              return Utils.retainDecimals(value, { integer: 7, decimal: (this.info.pricePrecision === 4 ? this.info.pricePrecision : 8) })
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
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      }
    },
    methods: {
      getQuantity (quantity) {
        if (quantity > 0) {
          this.ruleForm.amount = Utils.retainDecimals(quantity, {decimal: this.info.pricePrecision === 4 ? this.info.pricePrecision : 8})
          this.$refs.amount.toggle(this.ruleForm.amount)
        }
      },
      getUserCoin (id) {
        this.userApi.getUserCoin(id)
          .then(res => {
            this.userCoin = res.data.available < 0.0001 ? '0.0000' : res.data.available
          })
      },
      getCoinName (id) {
        return this.currencyList.filter(item => { return item.currencyId === id })[0].name
      },
      getPwd () {
        this.toolsApi.isNeedPwd().then(res => {
          this.isPwd = res.data.needTradePwd
        })
      },
//      retainDecimals (value, obj = {}) {
//        if (!value) return value
//        value = value.toString()
//        let decimals = ''
//        if (value.indexOf('.') > 0) {
//          let decimalsRe = new RegExp('[.]{1}[0-9]{0,' + (obj.decimal || 8) + '}')
//          let decimalsExec = decimalsRe.exec(value)
//          decimalsExec && (decimals = decimalsExec[0])
//        }
//        let v = 0
//        let re = new RegExp('^0{1}|[1-9]{1}[0-9]{0,' + (obj.integer - 1 || 7) + '}')
//        v = re.exec(value)
//        let n = ''
//        if (v) {
//          n = v[0]
//        }
//        return n + decimals
//      },
      submit () {
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        this.advertApi.onlineAdvert(this.shelvesInfo.id, this.ruleForm.amount, this.ruleForm.password)
          .then(res => {
            this.$toast(this.$t('advertising.upSuccess'))
            this.$emit('getList')
            this.close()
          })
          .catch(e => {
            this.isBtnOne = false
          })
      }
    },
    mounted () {
      this.info = this.currencyList.filter(item => { return item.currencyId === this.shelvesInfo.currencyId })[0]
      this.getUserCoin(this.shelvesInfo.currencyId)
      this.getPwd()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .adv-on-window {
    padding: 60px 77px 0px;
    .unit {
      position: relative;
      width: 326px;
      p.unit-p {
        position: absolute;
        right: 9px;
        top: 50%;
        font-size: 14px;
        margin-top: -11px;
      }
    }
    .btn {
      margin-top: 16px;
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
          background: #4a6dae;
        }
        &.btnOne {
          background-color: #ebebeb;
          color: #888;
        }
        .border-radius()
      }
    }
    .unit-message {
      position: absolute;
      right: 0px;
      bottom: -22px;
      color: #999;
      font-size: 12px;
      a {
        color: #6c85ae;
      }
    }
  }
</style>
