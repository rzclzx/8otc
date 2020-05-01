<template>
  <st-row class="my-user" align="center" justify="between">
     <st-row class="user" align="center">
       <st-row class="round" align="center" justify="center">
         <div class="img">
           {{userInfo.otcName.slice(0,1)}}
         </div>
       </st-row>
       <div class="name">
         <!--<nuxt-link to="/">{{$t('my.edit')}}</nuxt-link>-->
         <h4>{{userInfo.otcName}}</h4>
         <st-row class="certification">
           <st-row class="rzsj"  justify="end" v-if="userInfo&&userInfo.isMerchant === 1">
             <span></span>
             <span>{{$t('helper.merchants')}}</span>
           </st-row>
           <st-row class="certification-kyc" v-if="userInfo&&(userInfo.highAuth || heightStatus === $store.state.dictionary.enum.userPersonalInfo.AUTH_PASS)"><span>{{$t('my.KYCTwo')}}</span></st-row>
           <st-row class="certification-kyc" v-else-if="userInfo&&userInfo.baseAuth&&heightStatus === $store.state.dictionary.enum.userPersonalInfo.WAITING_AUTH"><span>{{$t('my.heightAuthMessage')}}</span></st-row>
           <st-row class="certification-kyc" v-else-if="userInfo&&userInfo.baseAuth"><span>{{$t('my.KYCOne')}}</span></st-row>
           <st-row class="certification-kyc" v-if="userInfo&&userInfo.isMerchant !== 2"><span>{{$t('my.deposit')}}</span></st-row>
         </st-row>
       </div>
     </st-row>
    <div class="line"></div>
    <st-row class="number" justify="between">
       <div>
         <p>{{$t('my.successTrade')}}</p>
         <h6>{{info.executeNum || 0}}</h6>
       </div>
      <div>
        <p>{{$t('my.goodComments')}}</p>
        <h6>{{parseInt(info.likeNum/(info.dislikeNum+info.likeNum)*100) || 0}}<span>%</span></h6>
      </div>
      <div>
        <p>{{$t('my.goodNumber')}}</p>
        <h6>{{info.likeNum || 0}}</h6>
      </div>
    </st-row>
    <div class="line" v-if="userInfo && IsKycTwo"></div>
    <div class="kyc">
      <a v-if="userInfo&&!userInfo.baseAuth" :href="apiConfig.userDomain + 'users/info'">{{$t('my.goKYCOne')}}</a>
      <a v-else-if="userInfo && IsKycTwo" :href="apiConfig.userDomain + 'users/info/auth/high'">{{$t('my.goKYCTwo')}}</a>
    </div>
  </st-row>
</template>

<script>
//  import StRow from '../../../58hash/src/components/st-ui/row/src/row.vue'
  import ApiConfig from '../../config/api.config'
  export default {
//    components: {
//      StRow
//    },
    name: 'my-user',
    computed: {
      userInfo () {
        return this.$store.state.user.userInfo
      }
    },
    data () {
      return {
        info: {},
        IsKycTwo: false,
        heightStatus: '',
        apiConfig: ApiConfig
      }
    },
    methods: {
      getTrade () {
        this.userApi.getUserTransaction()
          .then(res => {
            this.info = res.data
          })
      },
      getIsKycTwo () {
        this.userApi.userPersonalInfo()
          .then(res => {
            if (res.data.info) {
              this.heightStatus = res.data.info.picAuthStatus
              if (res.data.info.picAuthStatus === this.$store.state.dictionary.enum.userPersonalInfo.AUTH_PASS || res.data.info.picAuthStatus === this.$store.state.dictionary.enum.userPersonalInfo.WAITING_AUTH) {
                this.IsKycTwo = false
              } else {
                this.IsKycTwo = true
              }
            }
          })
      }
    },
    created () {
      this.getTrade()
      this.getIsKycTwo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .my-user {
    margin-bottom: 20px;
    padding: 0 100px 0 40px;
    height: 170px;
    background-image: url("../../assets/images/wode_bg.jpg");
    .user {
      .round {
        margin-right: 12px;
        width: 80px;
        height: 80px;
        .border-radius(50%);
        background-color: #fff;
        .border-shadow(0 1px 5px 0 rgba(71, 78, 114, .24));
      }
     .img {
       width: 68px;
       height: 68px;
       background-color:  #597ab9;
       text-align: center;
       color: #fff;
       line-height: 64px;
       font-size: 24px;
       background: -webkit-linear-gradient(#9cc7ff, #7ab2fd); /* Safari 5.1 - 6.0 */
       background: -o-linear-gradient(#9cc7ff, #7ab2fd);/* Opera 11.1 - 12.0 */
       background: -moz-linear-gradient(#9cc7ff, #7ab2fd); /* Firefox 3.6 - 15 */
       background: linear-gradient(#9cc7ff, #7ab2fd); /* 标准的语法 */
       .border-radius(50%)
     }
      .name {
        font-size: 18px;
        color: #fff;
        a {
          margin-left: 16px;
          font-size: 14px;
          color: #fff;
        }
        .certification {
          margin-top: 6px;
          .rzsj {
            padding: 0 4px 0 8px;
            /*width: 61px;*/
            height: 16px;
            background-color: #53b7e8;
            span:first-child {
              margin-top: 4px;
              margin-right: -3px;
              width: 8px;
              height: 8px;
              background-image: url("../../assets/images/V_white.png");
            }
            span:last-child {
              font-size: 12px;
              .transform(scale(0.8, 0.8));
            }
            .border-radius(8px)
          }
          .certification-kyc {
            margin-left: 6px;
            padding: 0 2px;
            height: 16px;
            background-color: #53b7e8;
            .border-radius(8px);
            span {
              font-size: 12px;
              .transform(scale(0.8, 0.8));
            }
          }
        }
      }
    }
    .line {
      width: 1px;
      height: 50px;
      background-color: #a9aec9;
    }
    .number {
      width: 340px;
      text-align: center;
      p {
        font-size: 12px;
        color: #a9aec9;
      }
      h6 {
        margin-top: 5px;
        font-size: 30px;
        color: #fff;
        span {
          font-size: 16px;
        }
      }
    }
    .kyc {
      a {
        display: block;
        width: 120px;
        height: 32px;
        font-size: 14px;
        color: #fff;
        background-color: #597ab9;
        text-align: center;
        line-height: 32px;
        .border-radius();
        &:hover {
          background: #4a6dae;
        }
      }
    }
  }
</style>
