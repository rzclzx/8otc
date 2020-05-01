<template>
  <st-row class="order-two-confirm-window" direction="column"  align="center" >
    <h4>{{message[1]}}</h4>
    <p>*{{message[2]}}</p>
    <div class="check" v-if="[2, 99].indexOf(typeId) > -1">
      <a class="checkbox" :class="{active: isYes}" @click="isYes = !isYes"></a>
      {{message[5]}}
    </div>
    <st-form class="form" v-model="ruleForm" :rules="rules" @submit="complaint">
    <st-form-item
      limitName="password"
      ruleName="password"
      style="margin-bottom: -25px"
      v-if="isPwd"
    >
      <!--:label="$t('index.moneyPw')"-->
      <st-input
        type="password"
        :maxLength="6"
        v-model="ruleForm.password"
        :limits="limits.password"
        :placeholder="$t('index.placeMoneyPw')"
        style="width: 320px"
      />
      <!--<input v-model="password" type="password" @input="pwdVerityError = ''" @blur="moneyPwdVerity" :placeholder="$t(`account.placeMoneyPW`)">-->
    </st-form-item>
    <st-row justify="between" class="btn" >
      <a  class="btn1" @click="close">{{message[4]}}</a>
      <input type="submit" :value="message[3]" :class="{three: ([2, 99].indexOf(typeId) > -1 && !isYes) || isBtnOne}" class="btn2" />
    </st-row>
    </st-form>
  </st-row>
</template>

<script>
  export default {
    name: 'order-two-confirm-window',
    data () {
      return {
        isBtnOne: false,
        isYes: false,
        isPwd: false,
        ruleForm: {
          password: ''
        },
        rules: {
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
          password: [
            value => {
              value = value.replace(/\D/g, '')
              return value.slice(0, 6)
            }
          ]
        }
      }
    },
    props: ['close', 'typeId', 'message', 'orderInfoId'],
    methods: {
      complaint () {
        if ([2, 99].indexOf(this.typeId) > -1 && !this.isYes) {
          return false
        }
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        if ([2, 3].indexOf(this.typeId) > -1) {
          this.orderApi.orderChange(this.orderInfoId, this.typeId, this.ruleForm.password)
            .then(res => {
              this.$toast(this.$t('order.success'))
              location.reload()
            }).catch(e => {
              this.isBtnOne = false
            })
        } else if (this.typeId === 10) {
          this.orderApi.orderChange(this.orderInfoId, 10)
           .then(res => {
             this.$toast(this.$t('order.success'))
             location.reload()
           })
            .catch(e => {
              this.isBtnOne = false
            })
        } else if (this.typeId === 99) {
          this.orderApi.orderCancel(this.orderInfoId)
            .then(res => {
              this.$toast(this.$t('order.cancelOrderSuccess'))
              location.reload()
            })
            .catch(e => {
              this.isBtnOne = false
            })
        }
      },
      getPwd () {
        if (this.typeId === 3) {
          this.toolsApi.isNeedPwd().then(res => {
            this.isPwd = res.data.needTradePwd
          })
        }
      }
    },
    mounted () {
      this.getPwd()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .order-two-confirm-window {
    h4 {
      margin-top: 48px;
      width: 360px;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
    }
    p {
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #999;
      text-align: center;
    }
    .btn {
      margin-top: 25px;
    }
    .btn1,.btn2 {
      width: 148px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      .border-radius()
    }
    .btn1 {
      color: #597ab9;
      border: 1px solid #597ab9;
      &:hover {
        color: #fff;
        background-color: #597ab9;
      }
    }
    .btn2 {
      color: #fff;
      background-color: #597ab9;
      &:hover {
        background: #4a6dae;
      }
      &.three {
        background-color: #ebebeb;
        color: #888;
      }
    }
    .btn {
      input {
        margin-left: 30px;
      }
    }
    .check {
      font-size: 12px;
      color: #999;
      .checkbox {
        display: inline-block;
        width: 13px;
        height: 13px;
        border: 1px solid #597ab9;
        vertical-align: text-top;
        .border-radius();
        &.active {
          background: url("../../assets/images/icon-fxk.png");
          background-color: #597ab9;
        }
      }
    }
  }
</style>
