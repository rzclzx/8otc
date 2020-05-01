<template>
  <section class="container users-auth-one">
    <bread :arr="arr"></bread>
   <div class="info">
     <div class="title">
       <h4>{{$t('users.userAuth')}} </h4>
       <p><span></span>{{$t('users.userAuthMessage')}}</p>
     </div>
     <st-form v-model="ruleForm" :rules="rules" @submit="realNameVerify">
       <st-form-item :label="$t('users.choseCountry')">
         <st-select :initText="initText" v-model="ruleForm.country" @onSelect="selectItem">
           <st-option v-for="item in countryData" :key="item.id" :value="item.id" :label="item['name' + $store.state.auth.locale.replace(/^([a-z]{1})/, function (reg) { return reg.toUpperCase() })] || item['nameCh']"></st-option>
         </st-select>
       </st-form-item>
       <st-form-item
         :label="$t('users.name')"
         ruleName="realName"
         lineHeight="12px"
         marginBottom="8px"
         :tips="$t('users.placeCartMessage')"
       >
         <st-input type="text"
                   :maxLength="20"
                   :placeHolder="$t('users.placeName')"
                   v-model="ruleForm.realName"/>
         <!-- <p class="tips">请务必使用真实本人姓名及身份证号，一旦认证成功不可再次修改</p> -->
       </st-form-item>
       <st-form-item :label="$t('users.idCard')" v-if="ruleForm.country !== 211">
         <st-input type="text" :placeHolder="$t('users.placeCart')" v-model="ruleForm.idCard"/>
       </st-form-item>
       <st-form-item :label="$t('users.idCard')" ruleName="idCard" v-else>
         <st-input type="text" :maxLength="18" :placeHolder="$t('users.placeCart')" v-model="ruleForm.idCard"/>
       </st-form-item>
       <input :class="{btnOne: isBtnOne}" type="submit" :value="$t('users.auth')"/>
       <div v-if="showCaptcha">
         <captcha :purpose="purpose" :ticketType="ticketType" :callback="closeCaptcha"></captcha>
       </div>
     </st-form>
   </div>
  </section>
</template>

<script>
//  import SelectOption from '../../../../../components/form/src/element/option'
//  import DownSelect from '../../../../../components/form/src/element/select'
//  import checkMsg from '../../../../assets/js/errorMessage'
  import Bread from '../../../../components/template/bread'
  import Captcha from '../../../../components/common/captcha/src/captcha'
  export default {
    async asyncData ({ store, redirect }) {
      if (store.state.user.userInfo.baseAuth) redirect('/my')
    },
    name: 'users-auth-one',
    middleware: ['auth'],
    components: {
//      DownSelect,
//      SelectOption,
      Bread,
      Captcha
    },
    data () {
      return {
        // 点击过实名认证后，再次点击时弹图形验证码弹框框
        showCaptcha: false,
        ticketType: 'idTicket',
        purpose: 39,
        isBtnOne: false,
        arr: [{text: 'my.my', href: '/my'}, {text: 'users.userAuth'}],
        initText: this.$t('users.china'), // 传入组件的默认值
        countryData: [],
        ruleForm: {
          country: 211,
          realName: '',
          idCard: ''
        },
        rules: {
          realName: [
            {required: true, message: this.$t('message.placeName')}
          ],
          idCard: [
            {required: true, message: this.$t('message.placeCart')},
            {
              validator: value => {
                if (!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value))) {
                  return false
                } else {
                  return true
                }
              },
              message: this.$t('message.sfzError')
            }
//            ,
//            {
//              validator: value => {
//                if (!(/^[a-z0-9]+$/i).test(value)) {
//                  return false
//                } else {
//                  return true
//                }
//              },
//              message: this.$t('message.cartError')
//            },
//            {
//              validator: value => {
//                return checkMsg.isIdCard(value)
//              },
//              message: this.$t('message.placeHaveSfz')
//            }
          ]
        },
        limits: {}
      }
    },
    computed: {
      ticket () {
        return this.$store.state.ticket[this.ticketType]
      }
    },
    methods: {
      // 从组件中获得选择的国家
      getSelectData (obj) {
        this.formData.country = obj.id
        this.defaultString = obj.name
      },
      // 获取国家列表
      getListCountry () {
        this.userApi.listCountry()
          .then(res => {
            this.countryData = res.data.countryList
          })
      },
      selectItem (id, name) {
        this.ruleForm.country = id
      },
      closeCaptcha (bool) {
        if (bool) {
          this.realNameVerify()
        }
        this.showCaptcha = false
        this.$store.commit('ticket/SAVE_TICKET', {
          type: 'idTicket',
          ticket: ''
        })
      },
      realNameVerify () {
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        // console.log(this.ruleForm)
        this.userApi.realNameVerify(this.ruleForm, this.ticket)
          .then((res) => {
            this.$store.dispatch('getUserInfo')
          })
          .then(() => {
            this.$toast(this.$t('my.submitSuccess'))
            this.$router.push('/my')
          })
          .catch(error => {
            this.isBtnOne = false
            if (error.code === 112) {
              this.$store.commit('ticket/SAVE_TICKET', {
                type: 'idTicket',
                ticket: error.data.ticket
              })
              this.showCaptcha = true
              return false
            }
            this.$toast(error.message)
          })
      }
    },
    mounted () {
      this.getListCountry()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../assets/css/theme.less";
  .users-auth-one {
    .info {
      margin-top: 20px;
      padding: 0 40px 112px;
      background-color: #fff;
      h4 {
        line-height: 70px;
        font-size: 16px;
        border-bottom: 2px solid #eff2f5;
      }
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
          background: url("../../../../assets/images/tips1.png");
          vertical-align: sub;
        }
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
    .tips {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: #999;
    }
  }
  input.btnOne {
    background-color: #ebebeb;
    color: #888;
  }
</style>
