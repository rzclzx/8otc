<!-- 安全验证弹框 -->
<template>
  <st-form v-model="ruleForm" :rules="rules" @submit="verify">
    <!-- 短信验证码 -->
    <st-form-item
      ruleName="SMSCode"
      :label="$t('users.SMSCode')"
      v-if="twiceMobileAuth"
    >
      <st-input
        :maxLength="6"
        v-model="ruleForm.SMSCode"
        :limits="limits.SMSCode"
        :placeholder="$t('users.enterSMSCode')"
        style="width: 200px;"
      />
      <count-down
        class="code"
        :ticketType="ticketType"
        :purpose='purpose'
        :ticket="null"
      />
    </st-form-item>
    <!-- 谷歌验证 -->
    <st-form-item
      ruleName="googleCode"
      :label="$t('users.googleCode')"
      v-if="twiceGoogleAuth"
    >
      <google-code v-model="ruleForm.googleCode" />
    </st-form-item>
    <!-- 提交 -->
    <input type="submit" value="确定" />
  </st-form>
</template>

<script>
  import StForm from '../form/src/form'
  import StFormItem from '../form/src/form-item'
  import StInput from '../form/src/element/input'
  import CountDown from '../form/src/element/count-down'
  import GoogleCode from '../form/src/element/google-code'
  export default {
    name: 'verify-box',
    components: {
      StForm,
      StFormItem,
      StInput,
      CountDown,
      GoogleCode
    },
    props: {
      purpose: {
        required: true
      },
      ticketType: {
        required: true
      }
    },
    data () {
      return {
        ruleForm: {
          SMSCode: '',
          googleCode: ''
        },
        rules: {
          SMSCode: [
            { required: true, message: '请输入正确的短信验证码！' },
            {
              validator: value => {
                if (!(/^\d{6}$/.test(value))) return false
                else {
                  return true
                }
              },
              message: '请输入正确的短信验证码！'
            }
          ],
          googleCode: [
            { required: true, message: '请输入正确的google验证码！' },
            {
              validator: value => {
                if (!(/^\d{6}$/.test(value))) return false
                else {
                  return true
                }
              },
              message: '请输入正确的google验证码！'
            }
          ]
        },
        limits: {
          SMSCode: [
            value => {
              return value.replace(/\D/g, '')
            }
          ]
        },
        submitStatus: true
      }
    },
    computed: {
      ticket () {
        return this.$store.state.ticket[this.ticketType]
      },
      twiceMobileAuth () {
        return this.$store.state.user.userInfo.twiceMobileAuth
      },
      twiceGoogleAuth () {
        return this.$store.state.user.userInfo.twiceGoogleAuth
      }
    },
    methods: {
      verify () {
        if (this.submitStatus) {
          if (!this.ticket) {
            this.$toast(this.$store.state.dictionary.error['0005'])
            return false
          }
          this.submitStatus = false
          this.$store.dispatch('twiceVerify', {
            code: this.ruleForm.SMSCode,
            googleCode: this.ruleForm.googleCode,
            ticket: this.ticket,
            purpose: this.purpose,
            ticketType: this.ticketType
          })
            .then(res => {
              return this.$emit('verify', res)
            })
            .catch(error => {
              this.submitStatus = true
              this.$toast(error.message)
            })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .st-form {
    margin: 60px 0 30px 210px;
  }
</style>
