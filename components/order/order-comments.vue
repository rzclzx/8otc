<template>
  <div class="order-comments">
    <st-row justify="between">
      <div class="comments-one">
        <div>
          <p class="p-title">{{$t('order.tradeMoney')}}：</p>
          <h6>{{info.amount}}<span> CNY</span></h6>
        </div>
        <div>
          <p class="p-title">{{$t('order.tradeNumber')}}：</p>
          <h6>{{info.quantity}} {{getCoinName(info.currencyId)}}</h6>
        </div>
        <div>
          <p class="p-title">{{$t('order.tradePrice')}}：</p>
          <h6>{{info.price}} CNY</h6>
        </div>
      </div>
      <div class="comments-two">
        <h3>{{$t('order.commentsTrade')}}</h3>
        <st-row>
          <a @click="selectComment(true)">
            <st-row class="good" align="center">
              <span :class="{active:isGood}"></span>
              <span></span>
              <span>{{$t('order.commentsGood')}}</span>
            </st-row>
          </a>
          <a @click="selectComment(false)">
            <st-row class="poor" align="center">
              <span :class="{active:!isGood}"></span>
              <span></span>
              <span>{{$t('order.commentsPoor')}}</span>
            </st-row>
          </a>
        </st-row>
        <st-row class="btn" :class="{active: isComment || isBtnOne}"><a @click="!isComment && !isBtnOne ? comment() :''">{{isComment ? $t('order.onComments') : $t('order.comments')}}</a></st-row>
      </div>
      <div class="comments-three">
        <h3>{{$t('order.tradeComments')}}</h3>
        <template v-for="item in list" :keys="item.id">
          <st-row class="comments-three-pl" align="center" justify="between">
            <st-row align="center" class="img"><span :class="item.type === 1 ?  'img-poor' : 'img-good'"></span>{{item.type === 1 ? $t('order.commentsPoor') : $t('order.commentsGood')}}</st-row>
            <p :style="{color: isBuy(item.userId) ? '#f37053' : '#67c18c'}">{{item.userName}}({{isBuy(item.userId) ? $t('order.buy') : $t('order.sell')}})</p>
            <p>{{item.updateDate|timeFormat}}</p>
          </st-row>
        </template>
      </div>
    </st-row>
    <div class="detail-bottom-left">
      <p v-if="info.makerId !== this.userInfo.id">{{info.orderType === 2 ? $t('order.buyRemark') : $t('order.sellRemark')}}：<span>{{info.remark}}</span></p>
      <p>{{$t('order.payCode')}}：<span>{{info.payCode}}</span> {{$t('order.payCodeOne')}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'order-comments',
    props: ['info'],
    data () {
      return {
        isBtnOne: false,
        isGood: true,
        isComment: false,
        list: null
      }
    },
    computed: {
      currencyList () {
        return this.$store.state.dictionary.otcCurrencyList
      },
      userInfo () {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
      getCoinName (coinId) {
        let name = this.currencyList.filter(item => { return item.currencyId === coinId })[0].name
        return name
      },
      comment () {
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        this.orderApi.orderComment(this.info.id, this.isGood ? 0 : 1)
          .then(res => {
            this.$toast(this.$t('order.commentsSuccess'))
            location.reload()
          }).catch(e => {
            this.isBtnOne = false
          })
      },
      getComment () {
        if (this.userInfo.id === this.info.makerId) {
          return [21, 23].indexOf(this.info.status) > -1
        } else {
          return [22, 23].indexOf(this.info.status) > -1
        }
      },
      getCommentList () {
        this.orderApi.orderCommentList(this.info.id)
          .then(res => {
            this.list = res.data
            let commentInfo = this.list.filter(item => {
              return item.userId === this.userInfo.id
            })[0]
            if (commentInfo) {
              this.isGood = commentInfo.type !== 1
            }
          })
      },
      selectComment (bl) {
        if (!this.isComment) {
          this.isGood = bl
        }
      },
      isBuy (uid) {
        if (uid === this.info.makerId) {
          return this.info.orderType === 2
        } else {
          return this.info.orderType === 1
        }
      }
    },
    mounted () {
      this.isComment = this.getComment()
      this.getCommentList()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/theme";
.order-comments {
  padding-bottom: 60px;
  margin-top: 2px;
  background-color: #fff;
  .comments-one {
    padding-left: 60px;
    width: 280px;
    .p-title {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #999;
    }
    &>div {
      margin-bottom: 10px;
      &:first-child {
        margin-top: 17px;
        h6 {
          height: 46px;
          line-height: 46px;
          color: #597ab9;
          font-size: 28px;
          span {
            font-size: 16px;
          }
        }
      }
      &:nth-child(n+2){
        h6 {
          height: 34px;
          line-height: 34px;
          font-size: 16px;
        }
      }
    }
  }
  .comments-two {
    margin-top: 38px;
    padding: 0 80px;
    width: 374px;
    border-left: 1px solid #f3f5f9;
    border-right: 1px solid #f3f5f9;
    h3 {
      margin-bottom: 20px;
      font-size: 14px;
    }
    .good {
      margin-right: 38px;
    }

    .good,.poor {
      span:first-child {
        width: 14px;
        height: 14px;
        border: 1px solid #d5d5d5;
        .border-radius(7px)
      }
      span:nth-child(2) {
        margin: 0 4px 0 10px;
        width: 27px;
        height: 27px;
        .border-radius(13px)
      }
      span:first-child {
        font-size: 14px;
      }
      span.active {
        position: relative;
        background-color: #597ab9;
        border: none;
        &:after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -3px;
          margin-left: -3px;
          width: 6px;
          height: 6px;
          background-color: #fff;
          .border-radius()
        }
      }
    }
    .good {
      span:nth-child(2) {
        background: url("../../assets/images/haoping.png") no-repeat;
      }
    }
    .poor {
      span:nth-child(2) {
        background: url("../../assets/images/chaping.png") no-repeat;
      }
    }
    .btn {
      margin-top: 40px;
      a {
        width: 160px;
        height: 41px;
        background-color: #597ab9;
        .border-radius();
        color: #fff;
        text-align: center;
        line-height: 41px;
      }
      &.active a{
        background-color: #ccc;
      }
    }
  }
  .comments-three {
    margin-top: 38px;
    padding: 0 40px;
    width: 504px;
    h3 {
      margin-bottom: 20px;
      font-size: 14px;
    }
    .comments-three-pl {
      padding-right: 10px;
      font-size: 14px;
      .img {
        span {
          margin-right: 3px;
          width: 27px;
          height: 27px;
          .border-radius(13px)
        }
        .img-good {
          background: url("../../assets/images/haoping.png")no-repeat;
        }
        .img-poor {
          background: url("../../assets/images/chaping.png")no-repeat;
        }
      }
      p:nth-child(2) {
        margin-left: 40px;
        color: #f37053;
      }
      p:last-child {
        margin-left: 40px;
        color: #999;
      }
      &:nth-child(3) {
        margin-top: 10px;
      }
    }
  }
}
  .detail-bottom-left {
    margin: 20px 0px 0px 60px;
    p:first-child {
      font-size: 12px;
      color: #999;
      span {
        font-size: 14px;
        color: #333;
      }
    }
    p:last-child {
      margin-top: 10px;
      font-size: 12px;
      color: #999;
      span {
        font-size: 20px;
        color: #597ab9;
      }
    }
  }
</style>
