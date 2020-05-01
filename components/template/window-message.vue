<template>
  <div class="window-message">
    <st-row class="title" align="center" justify="between">
      <st-row align="center" class="close">
        <a @click="showMessage"></a>
        <h3>{{$t('header.messageCenter')}}</h3>
      </st-row>
      <div class="clear" :class="{no: !messageList.length}"><a @click="clearAll"><i></i><span>{{$t('header.clear')}}</span></a></div>
    </st-row>
    <st-scroll :options="{maxHeight: '600px'}">
      <div class="message-info" :class="{read: item.readFlag}" v-for="(item, index) in messageList">
        <st-row class="message-info-time" justify="between" align="center">
          <p>{{item.createDate | timeFormat}}</p>
          <p>{{item.topicName === '/otc/order' ? $t('header.orderMessage') : $t('header.advMessage')}}</p>
        </st-row>
        <a v-if="item.topicName === '/otc/order'" @click="options(item)">
          <st-row class="message-one" justify="between" align="center">
            <div class="message-one-detail">
              <st-row class="name" align="center">
                <div class="name-logo">
                  {{item.userName.slice(0, 1)}}
                </div>
                <p>{{item.userName}}</p>
              </st-row>
              <p class="message-one-detail-text">{{item.payload.text }} {{listDate[item.payload.orderId] === void(0) ? '' : `${getTime(listDate[item.payload.orderId], item.payload.status)}` }}</p>
              <p class="message-one-detail-price"><span>{{item.payload.totalMoney}}CNY</span><span>{{item.payload.amount + item.payload.coinName}}</span></p>
            </div>
            <div class="options">
              >
            </div>
          </st-row>
        </a>
        <a v-else-if="item.topicName === '/otc/advertise'" @click="options(item)">
          <st-row class="message-two" justify="between" align="center">
            <div class="message-two-detail">
              <p>
                {{item.payload.text }}
              </p>
            </div>
            <div class="options">
              >
            </div>
          </st-row>
        </a>
      </div>
    </st-scroll>
    <!--<div class="message-info">-->
      <!--<st-row class="message-info-time" justify="between" align="center">-->
        <!--<p>2018-03-12 18:54:43</p>-->
        <!--<p>订单消息</p>-->
      <!--</st-row>-->
      <!--<a>-->
        <!--<st-row class="message-one" justify="between" align="center">-->
          <!--<div class="message-one-detail">-->
            <!--<st-row class="name" align="center">-->
              <!--<div class="name-logo">-->
                <!--N-->
              <!--</div>-->
              <!--<p>Nanuo</p>-->
            <!--</st-row>-->
            <!--<p class="message-one-detail-text">您有一笔待付款</p>-->
            <!--<p class="message-one-detail-price"><span>69846CNY</span><span>1.109BTC</span></p>-->
          <!--</div>-->
          <!--<div class="options">-->
            <!--&gt;-->
          <!--</div>-->
        <!--</st-row>-->
      <!--</a>-->
    <!--</div>-->
    <!--<div class="message-info">-->
      <!--<st-row class="message-info-time" justify="between" align="center">-->
        <!--<p>2018-03-12 18:54:43</p>-->
        <!--<p>订单消息</p>-->
      <!--</st-row>-->
      <!--<st-row class="message-two" justify="between" align="center">-->
        <!--<div class="message-two-detail">-->
          <!--<p>-->
            <!--恭喜你的高级认证通过，您现在可以发起发布广告和大额交易-->
          <!--</p>-->
        <!--</div>-->
        <!--<div class="options">-->
          <!--<a>x</a>-->
        <!--</div>-->
      <!--</st-row>-->
    <!--</div>-->
    <div class="no-message" v-if="!messageList.length">
      {{$t('header.noMessage')}}
    </div>
  </div>
</template>

<script>
  import StScroll from './st-scroll'
  export default {
    name: 'window-message',
    props: ['arr'],
    components: {
      StScroll
    },
    data () {
      return {
        timeInterval: null,
        listDate: {}
      }
    },
    computed: {
      messageList () {
        return this.$store.state.message.message
      }
    },
    watch: {
      messageList () {
        this.timeFn()
      }
    },
    methods: {
      showMessage () {
        this.$parent.$parent.messageShow()
      },
      options (item) {
        if (item.topicName === '/otc/order') {
          if (~[3, 21, 22, 23, 99].indexOf(item.payload.status)) {
            this.delete(item.topicName, item.messageId)
          } else if (!item.readFlag) {
            this.ack(item.topicName, item.messageId)
          }
          this.$router.push('/order/' + item.payload.orderId)
        } else if (item.topicName === '/otc/advertise') {
          this.delete(item.topicName, item.messageId)
          this.$router.push('/adv')
        }
        this.showMessage()
      },
      getTime (time, status) {
        let str = ''
        if (status === 1) {
          str = this.getZero(parseInt(time / 60)) + ':' + this.getZero(time % 60)
        } else if (status === 2) {
          str = this.getZero(parseInt(time / 3600)) + ':' + this.getZero(parseInt(time % 3600 / 60)) + ':' + this.getZero(time % 60)
        }
        return str && '(' + str + ')'
      },
      getZero (num) {
        let str = num.toString()
        if (str.length === 1) {
          str = '0' + str
        }
        return str
      },
      timeFn () {
        clearInterval(this.timeInterval)
        let listNow = {}
        let list = this.messageList.filter(item => {
          return item.topicName === '/otc/order' && ~[1, 2].indexOf(item.payload.status)
        })
        if (list.length) {
          this.toolsApi.getTime()
            .then(res => {
              for (var i = list.length; i--;) {
                listNow[list[i].payload.orderId] = parseInt((list[i].payload.appendDate + 1000 * 60 * list[i].payload.makerOrderCancelTimeOut - res.data) / 1000)
                if (listNow[list[i].payload.orderId] < 0) {
                  listNow[list[i].payload.orderId] = 0
                }
              }
              this.listDate = listNow
              this.timeInterval = setInterval(() => {
                for (i = list.length; i--;) {
                  if (this.listDate[list[i].payload.orderId]) {
                    this.listDate[list[i].payload.orderId]--
                  }
                }
              }, 1000)
            })
        }
      },
      delete (topicName, messageId) {
        window.webSocketSend(`{"event":"delete","params":{"topicName" : "${topicName}", "messageId":${messageId}}}`)
      },
      ack (topicName, messageId) {
        window.webSocketSend(`{"event":"ack","params":{"topicName": "${topicName}", "messageId":${messageId}}}`)
      },
      clearAll () {
        if (this.messageList.length) {
          window.webSocketSend(`{"event":"CLEAR","params":{}}`)
          this.$parent.$parent.messageShow()
        }
      }
    },
    mounted () {
      this.timeFn()
    },
    beforeDestroy () {
      clearInterval(this.timeInterval)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .window-message {
    width: 250px;
    background-color: #fff;
    .title {
      padding: 0 14px;
      height: 60px;
      .close {
        a {
          display: block;
          margin-right: 7px;
          /*height: 3px;*/
          /*width: 12px;*/
          /*background-color: #abbcdb;*/
          width: 16px;
          height: 16px;
          background-image: url("../../assets/images/zuojiantou.png");
          .transform(rotate(180deg))
        }
        h3 {
          font-size: 14px;
          color: #333;
        }
      }
      .clear {
        a {
          font-size: 14px;
          color: #597ab9;
          i {
            margin-right: 7px;
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 14px;
            background-image: url("../../assets/images/clearOne.jpg");
          }
          &:hover {
            color: #112266;
          }
        }
        &.no {
          a {
            color: #ababab;
            i {
              background-image: url("../../assets/images/clearTwo.jpg");
            }
            &:hover {}
          }
        }
      }
    }
    .message-info {
      color: #333;
      a {
        color: #333;
      }
      &.read {
        color: #ababab;
        a {
          color: #ababab;
        }
      }
      .message-info-time {
        padding: 0 14px;
        height: 30px;
        background-color: #fafafb;
        p {
          font-size: 12px;
          /*color: #999;*/
        }
      }
      .message-one {
        padding: 14px;
        .message-one-detail {
          font-size: 12px;
          .name {
            .name-logo {
              margin-right: 7px;
              width: 34px;
              height: 34px;
              border: 3px solid #fff;
              background: -webkit-gradient(linear, left top, left bottom, from(#9cc7ff), to(#7ab2fd));
              background: linear-gradient(#9cc7ff, #7ab2fd);
              text-align: center;
              line-height: 28px;
              color: #fff;
              .border-radius(50%);
              .border-shadow(0px 0px 2px rgba(100,100,100,0.4));
            }
            /*p {*/
              /*color: #666;*/
            /*}*/
          }
          .message-one-detail-text,.message-one-detail-price {
            height: 20px;
            line-height: 20px;
          }
          .message-one-detail-text {
            margin-top: 8px;
            /*color: #999;*/
          }
          .message-one-detail-price {
            /*color: #666;*/
            span:first-child {
              margin-right: 14px;
            }
          }
        }
      }
      .message-two {
        padding: 14px;
        .message-two-detail {
          p {
            width: 192px;
            line-height: 22px;
            font-size: 12px;
            /*color: #666;*/
          }
        }
      }
      .options {
        /*color: #999;*/
      }
    }
    .no-message {
      height: 80px;
      background-color: #fafafb;
      color: #999;
      text-align: center;
      line-height: 80px;
      font-size: 12px;
    }
  }
</style>
