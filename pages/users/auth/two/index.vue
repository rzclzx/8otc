<template>
  <section class="container users-auth-two">
    <bread :arr="arr"></bread>
   <div class="info">
      <h4>{{$t('users.userAuthTwo')}}</h4>
     <div class="info-message">
       <span></span>
       <p>{{$t('users.userAuthTwoMessage1')}}</p>
       <p>{{$t('users.userAuthTwoMessage2')}}</p>
       <p>{{$t('users.userAuthTwoMessage3')}}</p>
     </div>
     <st-row class="info-img" justify="between">
       <div class="item">
         <div><img ref="imgShow1" src="../../../../assets/images/zheng.png" alt=""></div>
         <p>{{$t('users.cartPositive')}}</p>
         <div @click="selImg='imgShow1'" class="upload" :style="$i18n.locale === 'ru' ? 'width: 90px;' : 'width: 60px;'">
           <upload :beforeUpload="beforeUpload"  k='range1' :range="range" :afterUpload="upload" @fileName="fileName"></upload>
           <div class="range"  ref="range1"></div>
           <a :style="$i18n.locale === 'ru' ? 'width: 90px;' : 'width: 60px;'">{{$t('users.upload')}}</a>
         </div>
       </div>
       <div class="item">
         <div><img ref="imgShow2" src="../../../../assets/images/fan.png" alt=""></div>
         <p>{{$t('users.cartReverse')}}</p>
         <div @click="selImg='imgShow2'" class="upload" :style="$i18n.locale === 'ru' ? 'width: 90px;' : 'width: 60px;'">
           <upload :beforeUpload="beforeUpload" k='range2' :range="range" :afterUpload="upload"  @fileName="fileName"></upload>
           <div class="range" ref="range2"></div>
           <a :style="$i18n.locale === 'ru' ? 'width: 90px;' : 'width: 60px;'">{{$t('users.upload')}}</a>
         </div>
       </div>
       <div class="item">
         <div><img ref="imgShow3" src="../../../../assets/images/heying.png" alt=""></div>
         <p>{{$t('users.handCart')}}</p>
         <div @click="selImg='imgShow3'" class="upload" :style="$i18n.locale === 'ru' ? 'width: 90px;' : 'width: 60px;'">
           <upload :beforeUpload="beforeUpload" :afterUpload="upload" k='range3' :range="range" @fileName="fileName"></upload>
           <div class="range" ref="range3"></div>
           <a :style="$i18n.locale === 'ru' ? 'width: 90px;' : 'width: 60px;'">{{$t('users.upload')}}</a>
         </div>
       </div>
     </st-row>
     <st-row justify="center"  class="submit">
       <p class="error-tip" v-if="highAuthError" style="margin: 6px 0 -35px 0;">{{ highAuthError }}</p>
       <a class="sub" :class="{btnOne: isBtnOne}" @click="idCardVerify">{{$t('users.push')}}</a>
     </st-row>
   </div>
  </section>
</template>

<script>
  import Bread from '../../../../components/template/bread'
  import checkMsg from '../../../../assets/js/errorMessage'
  export default {
    name: 'users-auth-two',
    middleware: ['auth'],
    components: {
      Bread
    },
    data () {
      return {
        isBtnOne: false,
        arr: [{text: 'my.my', href: '/my'}, {text: 'users.userAuthTwo'}],
        highAuthError: '',
        picAuthStatus: this.$store.state.dictionary.enum.userPersonalInfo.NOT_UPLOADED,
        AddFileName: '',
        FileName: [],
        selImg: ''
      }
    },
    methods: {
      getShow (number) {
        this.selImg = 'imgShow' + number
      },
      upload (e) {
        let reader = new FileReader()
        let that = this
        reader.onload = function (event) {
          that.$refs[that.selImg].src = event.target.result
        }
        reader.readAsDataURL(e.target.files[0])
      },
      range (display, height, k) {
        this.$refs[k].style.display = display
        this.$refs[k].style.height = height
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
      fileName (fileName, num) {
        this.FileName[num.replace('range', '') - 1] = fileName
        this.highAuthError = checkMsg.checkHighAuth(fileName, this.highAuthError)
      },
      idCardVerify () {
        this.highAuthError = checkMsg.verifyHighAuth(this.FileName[0], this.FileName[1], this.FileName[2])
        if (this.highAuthError) {
          return false
        }
        this.AddFileName = this.FileName.join() // this.FileName[0] + ',' + this.FileName[1] + ',' + this.FileName[2]
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        this.userApi.idCardPicVerify(this.AddFileName)
          .then(() => {
            return this.$store.dispatch('getUserInfo')
          })
          .then(() => {
            this.$toast(this.$t('my.submitSuccess'))
            if (this.$route.query.position) {
              window.location.replace(this.$route.query.position)
              return false
            }
            this.$router.replace('/my')
          })
          .catch(er => {
            this.isBtnOne = false
          })
      }
    },
    mounted () {
      this.userApi.userPersonalInfo()
        .then(res => {
          if (res.data.info) {
            if (res.data.info.picAuthStatus === this.$store.state.dictionary.enum.userPersonalInfo.AUTH_PASS || res.data.info.picAuthStatus === this.$store.state.dictionary.enum.userPersonalInfo.WAITING_AUTH) {
              this.$router.replace('/my')
            }
          }
        })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../assets/css/theme.less";
  .users-auth-two {
    .info {
      margin-top: 20px;
      padding: 0 40px 100px;
      background-color: #fff;
      h4 {
        line-height: 70px;
        font-size: 16px;
        border-bottom: 2px solid #eff2f5;
    }
      .info-message {
        position: relative;
        margin-top: 20px;
        padding: 15px 45px;
        background-color: #f8f9fb;
        p {
          height: 22px;
          line-height: 22px;
          font-size: 12px;
          color: #6c85ae;
        }
        span {
          position: absolute;
          top: 18px;
          left: 22px;
          width: 16px;
          height: 16px;
          font-size: 14px;
          background: url("../../../../assets/images/tips1.png");
        }
      }
      .item {
        position: relative;
      }
      .info-img {
        padding: 60px;
        .item {
          div {
            img {
              width: 260px;
              height: 148px;
              /*max-width: 260px;*/
              /*max-height: 148px;*/
            }
          }
          p {
            height: 52px;
            line-height: 52px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .upload {
            margin: 0 auto;
            width: 60px;
            height: 32px;
            a {
              display: block;
              width: 60px;
              height: 32px;
              border: 1px solid #597ab9;
              color:  #597ab9;
              line-height: 32px;
              text-align: center;
              .border-radius();
            }
            &:hover {
              a {
                background-color: #597ab9;
                color: #fff;
              }
            }
            .range {
              display: none;
              position: absolute;
              top: 0;
              left: -1px;
              width: 260px;
              height: 148px;
              background: rgba(1,1,1,0.5);
            }
          }
        }
      }
      .submit {
       a {
         width: 358px;
         height: 40px;
         text-align: center;
         line-height: 40px;
         font-size: 16px;
         color: #fff;
         background-color: #597ab9;
         &:hover {
           background-color: #4a6dae;
         }
         &.btnOne {
           background-color: #ebebeb;
           color: #888;
         }
       }
      }
  }
  }
</style>
