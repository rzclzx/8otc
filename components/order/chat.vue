<template>
  <div class="chat-index">
    <div class="chat-title">
      <h2>{{$t('order.chat')}}</h2>
    </div>
    <div class="chat-content">
      <st-scroll :options="{height: '400px'}" ref="scroll">
        <h4 class="chat-more" v-if="moreShow"><a @click="getHistoryList">{{$t('order.more')}}</a></h4>
          <div  class="chat-item" v-for="(item,index) in list">
          <h4 class="chat-time" v-if="!index || isShowTime(item.createDate, list[index - 1].createDate)">
            {{item.createDate|timeFormat('YMD')}}
          </h4>
          <div class="chat-message">
            <st-row class="chat-message-left" v-if="(userInfo&&userInfo.id) !== item.userId && item.userId">
              <div class="head-portrait" >
                {{item.userName && item.userName.slice(0, 1)}}
                <em :class="{nologo: !isOnline}"></em>
              </div>
              <div class="message">
                <h6>{{item.userName}}</h6>
                <div class="message-chat-content"><p>
                  <template v-if="item.msgType === 1">
                    {{item.message}}
                  </template>
                  <a @click="isMaxImg = true ; maxImgSrc= oosImgUrl + item.message" v-else-if="item.msgType === 2"><img :src="oosImgUrl + item.message" alt=""></a>
                </p></div>
                <div class="message-time-content"><span>{{item.createDate|timeFormat('HMS')}}</span></div>
              </div>
            </st-row>
            <div class="chat-message-center" v-else-if="!item.userId">
              <p>{{item.message}}</p>
              <div><span>{{item.createDate|timeFormat('HMS')}}</span></div>
            </div>
            <st-row class="chat-message-right" direction="row-reverse" v-else-if="(userInfo&&userInfo.id) === item.userId">
              <div class="head-portrait" >
                {{item.userName && item.userName.slice(0, 1)}}
                <em></em>
              </div>
              <div class="message">
                <h6>{{item.userName}}</h6>
                <div class="message-chat-content"><p>
                  <template v-if="item.msgType === 1">
                    {{item.message}}
                  </template>
                  <a @click="isMaxImg = true ; maxImgSrc= oosImgUrl + item.message" v-else-if="item.msgType === 2"><img :src="oosImgUrl + item.message" alt=""></a>
                </p></div>
                <div class="message-time-content"><span>{{item.createDate|timeFormat('HMS')}}</span></div>
              </div>
            </st-row>
          </div>
        </div>
      </st-scroll>
    </div>
    <div class="chat-send">
      <i></i>
      <div>
        <!--<input type="file" title="上传图片" accept="image/jpg,image/jpeg,image/png">-->
        <upload k='range1' :range="range" :beforeUpload="beforeUpload" :afterUpload="upload"  @fileName="fileName"></upload>
      </div>
      <input maxlength="250" v-model="message" type="text" @keyup.13='sendMessage(1)' :placeholder="$t('order.chatSend')">
      <a @click="sendMessage(1)"></a>
      <i></i>
    </div>
    <st-row align="center" justify="center" class="maxImg" v-show="isMaxImg">
      <img :src="maxImgSrc">
      <i @click="maxImgClose">+</i>
    </st-row>
  </div>
</template>
<script>
  import filter from '../../plugins/filter'
  import apiConfig from '../../config/api.config'
  import StScroll from '../template/st-scroll'
  export default {
    name: 'chat',
    props: ['isOnline'],
    computed: {
      userInfo () {
        return this.$store.state.user.userInfo || {}
      }
    },
    components: {
      StScroll
    },
    data () {
      return {
        oosImgUrl: apiConfig.oosImgUrl,
        imgName: '',
        newsTime: '',
        list: [],
        timeInterval: null,
        message: '',
        isMaxImg: false,
        maxImgSrc: '',
        orderId: this.$route.params.id,
        moreShow: true
      }
    },
    watch: {
      message () {
        // 用正则去掉输入的表情
        let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
        if (this.message.match(reg)) {
          this.message = this.message.replace(reg, '')
          console.log(this.message)
        }
      }
    },
    methods: {
      range (display, height, k) {
      },
      upload (e) {
        let reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
      },
      beforeUpload (file) {
        if (file.size > 6 * 1024 * 1024) {
          return false
        } else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          return false
        } else {
          return true
        }
      },
      fileName (fileName) {
        this.imgName = fileName
        this.sendMessage(2)
      },
      sendMessage (msgType) {
        if (!this.message && !this.imgName) { return false }
        this.messageApi.createMessage(this.orderId, msgType === 1 ? this.message : this.imgName, msgType)
          .then(res => {
            setTimeout(() => {
              this.getMessageList()
            }, 100)
          })
        this.message = ''
        this.imgName = ''
      },
      scrollMove (dom) {
        setTimeout(() => {
          dom.scrollTop = dom.scrollHeight - dom.offsetHeight
        }, 100)
      },
      getList () {
        clearInterval(this.timeInterval)
        this.messageApi.getHistoryList(this.orderId)
          .then(res => {
            this.list = res.data
            if (this.list.length < 20) {
              this.moreShow = false
            }
            this.$refs.scroll.scrollMove()
            this.timeInterval = setInterval(() => {
              this.getMessageList()
            }, 2000)
          })
      },
      isShowTime (timeOne, timeTwo) {
        return filter.timeFormat(timeOne, 'YMD') !== filter.timeFormat(timeTwo, 'YMD')
      },
      maxImgClose () {
        this.isMaxImg = false
      },
      getHistoryList () {
        this.messageApi.getHistoryList(this.orderId, this.list[0].id).then(res => {
          let len = res.data.length
          if (len) {
            this.list.unshift(...res.data)
          }
          this.moreShow = len && len === 20
        })
      },
      getMessageList () {
        if (this.list.length > 0) {
          this.messageApi.getMessageList(this.orderId, this.list[this.list.length - 1].createDate)
            .then(rej => {
              if (rej.data.length > 0 && rej.data[0].createDate > this.list[this.list.length - 1].createDate) {
                this.list.push(...rej.data)
                this.$refs.scroll.scrollMove()
              }
            })
        } else {
          this.messageApi.getHistoryList(this.orderId)
            .then(rej => {
              this.list = rej.data
            })
        }
      }
    },
    mounted () {
      this.getList()
    },
    beforeDestroy () {
      clearInterval(this.timeInterval)
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .chat-index {
    position: relative;
    width: 740px;
    height: 550px;
    background-color: #fff;
  }
  .chat-title {
    h2 {
      padding-left: 35px;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      border: 1px solid #ebeff5;
      .border-shadow(0 3px 9px 0 rgba(69, 112, 128, 0.14))
    }
  }
  .chat-content {
    padding: 0px 24px;
    height: 500px;
    border: 1px solid #ebeff5;
    border-top: none;
  }
  .chat-send {
    position: absolute;
    bottom: 22px;
    left: 50%;
    padding: 0 76px;
    margin-left: -330px;
    width: 660px;
    height: 60px;
    .border-shadow(0 0 3px 1px rgba(0, 0, 0, 0.1));
    i {
      position: absolute;
      top: 0px;
      display: block;
      width: 76px;
      height: 60px;
      &:first-child {
        left: 0px;
        background: url("../../assets/images/zhaopian.png") no-repeat center;
      }
      &:last-child {
        right: 0px;
        background: url("../../assets/images/fasong.png") no-repeat center;
      }
    }
    div {
      position: absolute;
      z-index: 1;
      left: 0;
      width: 76px;
      height: 60px;
      opacity: 0;
      cursor: pointer;
    }
    input:nth-child(3) {
      width: 100%;
      height: 60px;
      padding: 10px;
      font-size: 14px;
    }
    a {
      position: absolute;
      z-index: 1;
      top: 0px;
      right: 0px;
      display: block;
      width: 76px;
      height: 60px;
    }
  }
  .chat-more {
    a {
      display: block;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #597ab9
    }
  }
  .chat-item {
    .chat-time {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
    }
  }
  .chat-message {
    margin-bottom: 20px;
    .head-portrait {
      position: relative;
      margin-left: 1px;
      width: 52px;
      height: 52px;
      background: -webkit-linear-gradient(#9cc7ff, #7ab2fd); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#9cc7ff, #7ab2fd);/* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#9cc7ff, #7ab2fd); /* Firefox 3.6 - 15 */
      background: linear-gradient(#9cc7ff, #7ab2fd); /* 标准的语法 */
      border: 5px solid #fff;
      text-align: center;
      line-height: 42px;
      color: #fff;
      .border-radius(50%);
      .border-shadow(0 1px 5px 0 rgba(71,78,114,.24));
      em {
        position: absolute;
        bottom: 0px;
        right: 0px;
        height: 14px;
        width: 14px;
        background-color: #00c481;
        border: 3px solid #fff;
        &.nologo {
          background-color: #ccc;
        }
      }
    }
    .message {
      h6 {
        padding-left: 16px;
        margin-bottom: 4px;
        color: #8994a3;
      }
      .message-chat-content {
        max-width: 660px;
        p {
          position: relative;
          padding: 10px 16px;
          margin-left: 16px;
          /*max-width: 684px;*/
          word-wrap: break-word;
          word-break: break-all;
          /*overflow: hidden;*/
          background-color: #f8f9fb;
          // #f8f9fb;
          font-size: 12px;
          .border-radius(6px);
          color: #666666;
          &:after {
            position: absolute;
            display: block;
            content: '';
            width: 16px;
            height: 10px;
            background-color: #f8f9fb;
            .border-radius(3px);
            .transform(rotate(-40deg) skew(20deg));
          }
          img {
            height: 42px;
          }
        }
      }
      .message-time-content {
        padding-left: 16px;
        margin-top: 6px;
        text-align: right;
        font-size: 12px;
      }
    }
  }
  .chat-message-left {
    .message {
      p {
        &:after {
          top: 12px;
          left: -6px;
        }
      }
    }
  }
  .chat-message-right {
    flex-direction: row-reverse;
    .message {
      h6 {
        padding: 0 16px 0 0;
        text-align: right;
      }
      .message-chat-content {
        p {
          margin: 0 16px 0 0;
          background-color: #f8f9fb;
          color: #666666;
          &:after {
            top: 20px;
            right: -8px;
            border-left: 14px solid #f8f9fb;
            border-right: none;
          }
        }
      }
      .message-time-content {
        padding: 0 16px 0 0;
        text-align: left;
      }
    }
  }
  .chat-message-center {
    padding: 16px 24px;
    margin: 0 auto;
    background-color: #f3f5f9;
    .border-radius(8px);
    max-width: 500px;
    p {
      word-wrap: break-word;
      word-break: break-all;
      font-size: 16px;
      color: #6c85ae;
    }
    div span{
      display: block;
      text-align: right;
      font-size: 12px;
      color: #8994a3;
    }
  }
  .maxImg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: rgba(0,0,0,.5);
    img {
      max-height: 90%;
      max-width: 90%;
    }
    i {
      position: absolute;
      top: 10%;
      right: 10%;
      cursor: pointer;
      font-size: 72px;
      color: #fff;
      .transform(rotate(45deg))
    }
  }
</style>
