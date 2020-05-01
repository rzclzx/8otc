<!-- 短信验证码 -->
<template>
  <div class="send-SMS">
    <a class="get-code button" :class="{ active: smallStyle }" @click="countDown" v-if="status"><div>{{ $t('common.sendSMS') }}</div></a>
    <a class="get-code" :class="{ active: smallStyle }" v-else><div>{{ time }} {{ $t('common.second') }}</div></a>
    <div v-if="showCaptcha">
      <captcha :purpose="purpose" :nation="nation" :ticketType="ticketType" :callback="closeCaptcha" :popupType="popupType"></captcha>
    </div>
  </div>
</template>

<script>
  import Captcha from './captcha.vue'

  export default {
    name: 'count-down',
    components: {
      Captcha
    },
    props: {
      purpose: {
        type: Number,
        required: true
      },
      nation: Number,
      mobile: String,
      ticket: String,
      ticketType: {
        type: String,
        required: true
      },
      smallStyle: Boolean,
      channel: Number,
      defaultName: String,
      popupType: String,
      type: String
    },
    data () {
      return {
        time: 60,
        status: true,
        buttonStatus: true,
        showCaptcha: false
      }
    },
    computed: {
      userMobile () {
        return this.$store.state.user.userInfo && this.$store.state.user.userInfo.mobile
      }
    },
    methods: {
      countDown () {
        let mobile = this.userMobile && this.purpose !== 37 ? '' : this.mobile
        if (!this.userMobile && !this.mobile && !this.ticket) {
          this.$toast(this.$t('register.enterMobile'))
          return false
        }
        if (this.mobile) {
          if (this.nation === 211) {
            if (this.mobile.length < 11) {
              this.$toast(this.$t('promptInformation.mobileWrongFormat'))
              return false
            } else if (!(/^1(([34578]\d{9}$)|(((99)|(98)|(66))\d{8}$))/.test(this.mobile))) {
              this.$toast(this.$t('promptInformation.mobileWrongFormat'))
              return false
            }
          }
          if (this.nation !== 211) {
            if (!(/^\d{1,14}$/.test(this.mobile))) {
              this.$toast(this.$t('promptInformation.mobileWrongFormat'))
              return false
            }
          }
        }
        if (this.type) {
          if (!this.mobile) {
            this.$toast(this.$t('register.enterMobile'))
            return false
          }
        }
        this.status = false
        let time = setInterval(() => {
          if (this.time === 1) {
            clearInterval(time)
            this.time = 60
            this.status = true
            this.buttonStatus = true
          } else {
            this.time -= 1
          }
        }, 1000)
        if (this.buttonStatus) {
          this.buttonStatus = false
          this.$store.dispatch('getSMSCode', {
            purpose: this.purpose,
            nation: this.nation,
            mobile: mobile,
            ticket: this.ticket,
            channel: this.channel,
            ticketType: this.ticketType
          })
            .then(res => {
              // this.status = false
              // let time = setInterval(() => {
              //   if (this.time === 1) {
              //     clearInterval(time)
              //     this.time = 60
              //     this.status = true
              //     this.buttonStatus = true
              //   } else {
              //     this.time -= 1
              //   }
              // }, 1000)
            })
            .catch(error => {
              if (error.code === 112) {
                this.showCaptcha = true
              }
              this.buttonStatus = true
            })
        } else {
          return false
        }
      },
      closeCaptcha () {
        this.showCaptcha = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "~assets/css/theme";
  .send-SMS {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
    height: 40px;
  }
  .get-code {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-box-pack: center;
    -webkit-justify-content:  center;
    justify-content:  center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    align-items: center;
    width: 140px;
    height: 100%;
    font-size: 14px;
    color: #597ab9;
    text-align: center;
    background: #dee4f1;
    /*border: 1px solid #d9d9d9;*/
    cursor: pointer;
    .border-radius(@radius: 3px);
  }
  .button {
    &:hover {
      color: #3a5a99;
      background: #cdd7ea;
    }
  }
  .active {
    margin-top: 16px;
    margin-left: 8px;
    width: 100px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
  }
</style>
