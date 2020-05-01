<template>
  <section class="container users-auth-one">
    <!--<bread :arr="arr"></bread>-->
    <h4>{{$t('users.setNikeName')}} </h4>
   <div class="info">
     <div class="title">
       <p><span></span>{{$t('users.nikeNameMessage')}}</p>
     </div>
     <st-form v-model="ruleForm" :rules="rules" @submit="setNikeName">
       <st-form-item
         :label="$t('users.nikeName')"
         ruleName="nickName"
       >
         <st-input type="text"
                   :maxLength="6"
                   :placeHolder="$t('users.placeNikeName')"
                   v-model="ruleForm.nickName"/>
         <!-- <p class="tips">请务必使用真实本人姓名及身份证号，一旦认证成功不可再次修改</p> -->
       </st-form-item>
       <p class="nike-message">{{$t('users.nikeNameMessageTwo')}}</p>
       <input style="margin-top: 10px" :class="{btnOne: btnOne}" type="submit" :value="$t('users.set')"/>
     </st-form>
   </div>
  </section>
</template>

<script>
  import Bread from '../../../components/template/bread'
  export default {
    name: 'users-nick-name',
    middleware: ['auth'],
    components: {
      Bread
    },
    data () {
      return {
        arr: [{text: 'my.my', href: '/my'}, {text: 'users.setNikeName'}],
        countryData: [],
        btnOne: false,
        ruleForm: {
          nickName: ''
        },
        rules: {
          nickName: [
            {required: true, message: this.$t('message.placeNickName')},
            {
              validator: value => {
                if (value.length > 6) {
                  return false
                }
                return true
              },
              message: this.$t('message.placeNickName')
            }
          ]
        },
        limits: {}
      }
    },
    methods: {
      isPermissions () {
        if (this.$store.state.user.userInfo.otcName) {
          this.$router.push('/my')
        }
      },
      setNikeName () {
        if (this.btnOne) {
          return false
        } else {
          this.btnOne = true
        }
        this.userApi.createNickname(this.ruleForm.nickName.trim()).then(res => {
          location.reload()
        }).catch(() => {
          this.btnOne = false
        })
      }
    },
    mounted () {
      this.isPermissions()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/css/theme.less";
  .users-auth-one {
    h4 {
      padding-left: 40px;
      line-height: 46px;
      font-size: 16px;
      border-bottom: 2px solid #eff2f5;
    }
    background: #fff;
    .info {
      margin-top: 20px;
      padding: 0 40px 112px;
      .title {
        p {
          margin-top: 20px;
          padding-left: 20px;
          height: 40px;
          line-height: 40px;
          background-color: #f8f9fb;
          font-size: 12px;
          color: #6c85ae;
          span {
            margin-right: 10px;
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url("../../../assets/images/tips1.png");
            vertical-align: sub;
          }
        }
      }
      .nike-message {
        position: relative;
        left: -150px;
        margin-top: -15px;
        width: 500px;
        font-size: 12px;
        /*line-height: 12px;*/
        color: #999;
        text-align: right;
      }
    }
  }
  .st-form {
    margin: 70px 0 0 442px;
    .item-name {
      margin-bottom: 40px;
      p {
        position: absolute;
        top: 44px;
        font-size: 12px;
        color: #999;
      }
    }
  }
  input.btnOne {
    background-color: #ebebeb;
    color: #888;
  }
</style>
