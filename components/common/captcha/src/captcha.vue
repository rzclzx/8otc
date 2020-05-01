<template>
  <st-row :class="['captcha', popupType]" justify="center" align="center">
    <div class="bg"></div>
    <div class="box">
      <st-row class="header" justify="between" align="center">
        <h3>{{ $t('common.captcha') }}</h3>
        <a @click="close"></a>
      </st-row>
      <st-form v-model="ruleForm" :rules="rules" @submit="submit">
        <st-form-item
          ruleName="picCode"
        >
          <st-input
            type="text"
            :maxLength="6"
            v-model="ruleForm.picCode"
            :placeholder="''"
            autofocus
          />
          <a class="img" @click="fresh"><img :src="captchaUrl" v-if="captchaUrl"/></a>
          <a class="change-pic" @click="fresh">{{ $t('common.changeCaptcha') }}</a>
        </st-form-item>
        <!-- 提交 -->
        <input type="submit" :value="$t('common.submit')"/>
      </st-form>
    </div>
  </st-row>
</template>

<script>
  import apiConfig from '../../../../config/api.config'

  export default {
    name: 'captcha',
    props: {
      popupType: String,
      purpose: {
        type: Number,
        required: true
      },
      nation: Number,
      ticketType: {
        type: String,
        required: true
      },
      callback: {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        captchaUrl: '',
        ruleForm: {
          picCode: ''
        },
        rules: {
          picCode: [
            { required: true, message: this.$t('common.captchaError') }
          ]
        }
      }
    },
    computed: {
      ticket () {
        return this.$store.state.ticket[this.ticketType]
      }
    },
    methods: {
      close () {
        this.callback(false)
      },
      // 刷新图片验证码
      fresh () {
        this.userApi.refreshCaptcha(this.purpose, this.ticket)
          .then(res => {
            this.$store.commit('ticket/SAVE_TICKET', {
              type: this.ticketType,
              ticket: res.data.ticket
            })
            // this.captchaUrl = 'http://192.168.200.90:7012' + '/user/security/captcha/show?ticket=' + res.data.ticket + '&rnd=' + Math.random()
            this.captchaUrl = apiConfig.baseURL + 'user/security/captcha/show?ticket=' + res.data.ticket + '&rnd=' + Math.random()
          })
      },
      submit () {
        this.userApi.verifyCaptcha(this.ticket, this.ruleForm.picCode)
          .then(res => {
            this.callback(true)
          })
      }
    },
    created () {
      this.fresh()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "~assets/css/theme";
  .captcha {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(59, 89, 153, 0.3);
    box-shadow: 0 4px 8px 0 rgba(205, 205, 205, 0.5);
    z-index: 1100;
    .box {
      width: 472px;
      .border-radius();
      background-color: #fff;
      box-shadow: 0 4px 8px 0 rgba(205, 205, 205, 0.5);
      overflow: hidden;
      .header {
        padding: 0 30px;
        background-color: #e2e7ef;
        h3 {
          line-height: 40px;
          font-size: 16px;
        }
        a {
          display: block;
          width: 8px;
          height: 8px;
          background: url("./images/icon-popupclose.png") no-repeat;
        }
      }
    }
    .st-form {
      margin: 25px 0 0 94px;
      .st-form-item {
        padding-top: 5px;
        .st-input {
          width: 150px;
          height: 35px;
        }
        .img {
          display: inline-block;
          margin-left: 10px;
          width: 82px;
          height: 35px;
          background: greenyellow;
          vertical-align: bottom;
          img {
            width: 82px;
            height: 35px;
            vertical-align: bottom;
          }
        }
        .change-pic {
          margin-left: 10px;
          text-decoration: underline;
          font-size: 12px;
        }
      }
      input[type=submit] {
        margin: 0 0 30px;
        width: 290px;
      }
    }
    &.register {
      min-width: 1160px;
      .box {
        margin-top: 150px;
      }
    }
  }
</style>
