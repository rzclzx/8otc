<template>
  <div>
    <common-header></common-header>
    <div class="wrap">
      <nuxt/>
      <st-footer :product="product" style="bottom: 0;"></st-footer>
    </div>
    <!--<div class="system">-->
      <!--<div class="content">-->
        <!--<a :href="apiConfig.mainDomain" :class="$i18n.locale"></a>-->
        <!--<span :class="$i18n.locale"></span>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import CommonHeader from '../components/template/common-header'
  import StFooter from '../components/common/footer/src/footer'
  import ApiConfig from '../config/api.config'
  import webSocketFn from '../assets/js/webSocket'
  export default {
    components: {
      CommonHeader,
      StFooter
    },
    data () {
      return {
        apiConfig: ApiConfig,
        product: [
          {
            name: this.$t('footerProduct.otc'),
            href: ApiConfig.otcDomain
          },
          {
            name: this.$t('footerProduct.coin'),
            href: ApiConfig.spotDomain
          },
          {
            name: this.$t('footerProduct.comingSoon'),
            href: ApiConfig.swapsDomain
          },
          {
            name: this.$t('header.subject'),
            href: ApiConfig.marginDomain
            // ApiConfig.marginDomain ApiConfig.mainDomain + 'coming/experience'
            // this.$t('footerProduct.experience')
          },
          {
            name: this.$t('footerProduct.loan'),
            href: ApiConfig.loanDomain
          },
          {
            name: this.$t('footerProduct.58BTopics'),
            href: ApiConfig.mainDomain + '58BTopics'
          },
          {
            name: this.$t('footerProduct.hash'),
            href: ApiConfig.hashDomain
          }
//          ,
//          {
//            name: this.$i18n('footer.pool'),
//            href: ApiConfig.poolDomain
//          }
        ],
        messageObject: {
          cmd: '',
          timeObject: null,
          that: null,
          store: null,
          _getTimer: null,
          messageInit (that, store) {
            this.that = that
            this.store = store
//            this.stopGet()
            this.that.wb.errorCallBackFunArr.push(this.socketFail.bind(this))
            this.that.wb.successFn['data'] = (data) => {
              data && this.setMessage(data)
            }
            this.that.wb.successFn['delete'] = (data) => {
              this.options(data, true)
            }
            this.that.wb.successFn['ack'] = (data) => {
              this.options(data)
            }
            this.that.wb.successFn['CLEAR'] = (data) => {
              if (data.code === '0') {
                this.that.$store.commit('message/SET_MESSAGE', {
                  data: []
                })
              }
            }
            this.send()
          },
          options (data, isDelete) {
            if (data.code === '0') {
              let list = [...this.that.$store.state.message.message]
              for (var i = list.length; i--;) {
                if (data.params.topicName === list[i].topicName && data.params.messageId === list[i].messageId) {
                  if (isDelete) {
                    list.splice(i, 1)
                  } else {
                    let info = Object.assign({}, list[i])
                    info.readFlag = 1
                    list[i] = info
                  }
                  break
                }
              }
              this.that.$store.commit('message/SET_MESSAGE', {
                data: list
              })
            }
          },
          setMessage (message) {
            let list = [...this.that.$store.state.message.message]
            if (message.topicName === '/otc/order') {
              for (var i = list.length; i--;) {
                if (list[i].topicName === '/otc/order' && message.messageId === list[i].messageId) {
                  list.splice(i, 1)
                  break
                }
              }
            }
            list.unshift(message)
            this.that.$store.commit('message/SET_MESSAGE', {
              data: list
            })
          },
          send () {
            window.webSocketSend(`{"event":"login","params":{"token":"${this.that.$store.state.auth.token}"}}`)
            window.webSocketSend("{'event': 'SUB'}")
          },
          socketFail () {
            this._getTimer = setInterval(() => {
              if (this.that.wb.isConnection()) {
                clearInterval(this._getTimer)
                this.that.$store.commit('message/SET_MESSAGE', {
                  data: []
                })
                this.send()
              }
            }, 2000)
          }
        }
      }
    },
    beforeMount () {
      this.wb = webSocketFn(ApiConfig.otcSocketURL)
      window.webSocketSend = this.wb.webSocketSend
      if (this.$store.state.user.userInfo && this.$store.state.user.userInfo.id) {
        this.messageObject.messageInit(this, this.$store)
      }
    },
    beforeDestroy () {
      window.webSocketSend('{"event":"logout"}')
    }
  }
</script>

<style scoped>
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    padding-top: 105px;
    padding-bottom: 388px;
  }
  .system {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 1160px;
    min-height: 100%;
    background: #f2f3fc;
  }
  .system .content {
    margin: 0 auto;
    padding-top: 40px;
    width: 1160px;
    height: 100%;
  }
  .content a {
    display: block;
    width: 146px;
    height: 40px;
    background: url('../assets/images/logo.png') no-repeat;
    background-size: 100% 100%;
  }
  .content a.en, .content a.ja, .content a.ru, .content a.ko {
    width: 152px;
    height: 40px;
    background: url('../assets/images/logo_e.png') no-repeat;
    background-size: 100% 100%;
  }
  .content span {
    display: block;
    margin: 160px auto 0;
    width: 450px;
    height: 432px;
    background: url('../assets/images/system/system-cn.png') no-repeat;
    background-size: 100% 100%;
  }
  .content span.en {
    width: 483px;
    background: url('../assets/images/system/system-en.png') no-repeat;
    background-size: 100% 100%;
  }
  .content span.ru {
    background: url('../assets/images/system/system-ru.png') no-repeat;
    background-size: 100% 100%;
  }
  .content span.ja {
    background: url('../assets/images/system/system-jq.png') no-repeat;
    background-size: 100% 100%;
  }
  .content span.ko {
    background: url('../assets/images/system/system-ko.png') no-repeat;
    background-size: 100% 100%;
  }
</style>
