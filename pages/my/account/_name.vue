<template>
  <section class="container account-name">
    <bread :arr="arr"></bread>
    <div class="info">
      <st-row justify="between" class="title">
         <st-row><span :class="$route.params.name"></span>{{ !~['ko', 'ja'].indexOf($store.state.auth.locale) ? ($t('my.add') + $t('my.'+ $route.params.name)) : ($t('my.'+ $route.params.name) + $t('my.add'))}}</st-row>
        <!--<st-row align="center" v-if="!$route.query.id"> <span>{{$t('my.isShow')}}</span> <st-switch @callback="isShowFn" :status="isShow"></st-switch></st-row>-->
      </st-row>
      <st-form class="form" v-model="ruleForm" :rules="rules" @submit="submit">
        <st-form-item
          :label="$t('my.name')"
          ruleName="name"
        >
          <div class="unit">
            <st-input
              type="text"
              :maxLength="30"
              v-model="ruleForm.name"
              style="width: 360px"
              :readonly="$route.params.name === 'bank'"
            />
          </div>
        </st-form-item>
        <st-form-item
          :label="$t('my.bankAddress')"
          style="height: 65px; min-height: 65px"
          v-if="$route.params.name === 'bank'"
        >
          <st-select class="item" v-model="bankId" :value="bankId" :initText="initText" @onSelect="selectBank" width="360px">
            <st-option
              v-for="item in bankList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </st-option>
          </st-select>
        </st-form-item>
        <st-form-item
          :label="$t('my.carId')"
          limitName="cart"
          ruleName="cart"
          v-if="$route.params.name === 'bank'"
        >
          <st-input
            type="text"
            :maxLength="19"
            v-model="ruleForm.cart"
            :limits="limits.cart"
            style="width: 360px"
          />
        </st-form-item>
        <st-form-item
          :label="$t('my.accountId')"
          limitName="cart"
          ruleName="cart"
          v-else
        >
          <st-input
            type="text"
            :maxLength="50"
            v-model="ruleForm.cart"
            :limits="limits.cart"
            style="width: 360px"
            :placeholder="$t('my.place',{type: $t('my.'+$route.params.name)})"
          />
        </st-form-item>
        <st-form-item
          :label="$t('my.openCart')"
          ruleName="branchName"
          v-if="$route.params.name === 'bank'"
        >
          <st-input
            type="text"
            :maxLength="50"
            v-model="ruleForm.branchName"
            style="width: 360px"
          />
        </st-form-item>
        <st-row v-if="$route.params.name !== 'bank'" :class="['upload-img', flagStatus ? 'upload-img-flag' : '']" direction="column" align="center" justify="center">
          <img ref="qrCode" />
          <st-row  v-if="imgName" class="zzc" direction="column" align="center" justify="center">
            <div></div>
            <p>更换</p>
          </st-row>
           <div class="upload-img-btn"><a> <upload k='range1' :range="range" :beforeUpload="beforeUpload" :afterUpload="upload"  @fileName="fileName" @upLoadStatus="uploadFlag"></upload>
             <div class="range" ref="range1"></div>
           </a></div>
          <p>{{$t('my.placeImg')}}（*.jpg*.png*.jpeg）</p>
        </st-row>
        <p class="er" v-if="flagStatus">{{$t('my.placeImg')}}</p>
        <input :class="{btnOne: isBtnOne}" style="width: 360px"  type="submit" :value="$t('my.confirm')"/>
      </st-form>
    </div>
  </section>
</template>

<script>
//  import SelectOption from '../../../../components/form/src/element/option'
//  import DownSelect from '../../../../components/form/src/element/select'
  import Bread from '../../../components/template/bread'
//  import StSwitch from '../../../../components/switch/switch'
  import apiConfig from '../../../config/api.config'
  import checkMsg from '../../../assets/js/errorMessage'
  export default {
    name: 'account-name',
    middleware: ['auth', 'niceName'],
    components: {
//      DownSelect,
//      SelectOption,
      Bread
//      StSwitch
    },
    data () {
      return {
        isBtnOne: false,
        isShow: true,
        arr: [{text: 'my.my', href: '/my'}, {text: 'my.setAccount'}],
        bankId: 1,
        bankList: [],
        selImg: 'qrCode',
        flagStatus: false,
        flagStatus1: true,
        imgName: '',
        initText: '',
        ruleForm: {
          name: '',
          cart: '',
          branchName: ''
        },
        rules: {
          name: [
            { required: true, message: this.$t('message.placeNameTitle') },
            {
              validator: value => {
                return true
              },
              message: this.$t('message.placeNameTitle')
            }
          ],
          cart: [
            { required: true, message: this.$t('message.placeNumber') },
            {
              validator: value => {
                if (this.$route.params.name === 'bank') {
                  return checkMsg.bankVerity(value)
                }
                return true
              },
              message: this.$t('message.placeNumber')
            }
          ],
          branchName: [
            { required: true, message: this.$t('message.placeBankAddress') },
            {
              validator: value => {
                return true
              },
              message: this.$t('message.placeBankAddress')
            }
          ]
        },
        limits: {
          cart: [
            value => {
              return this.$route.params.name === 'bank' ? value.replace(/\D/g, '') : value
            }
          ]
        }
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.user.userInfo
      }
    },
    methods: {
      getBankList () {
        if (this.$route.params.name === 'bank') {
          this.toolsApi.getBank().then(res => {
            this.bankList = res.data.bankList
            if (this.$route.query.id) {
              this.userApi.getAccountDetail(this.$route.query.id).then(res => {
                this.ruleForm.branchName = res.data.branchName
                this.ruleForm.cart = res.data.accountNo
                this.bankId = res.data.bankId
                this.isShow = res.data.visible === 1
                this.initText = this.bankList.filter(item => {
                  return item.id === this.bankId
                })[0].name
              })
            } else {
              this.initText = this.bankList[0].name
            }
          })
        } else {
          if (this.$route.query.id) {
            this.userApi.getAccountDetail(this.$route.query.id).then(res => {
              this.ruleForm.branchName = res.data.branchName
              this.ruleForm.cart = res.data.accountNo
              this.bankId = res.data.bankId
              this.isShow = res.data.visible === 1
              this.imgName = res.data.qrcode
              if (res.data.qrcode) {
                this.$refs[this.selImg].src = apiConfig.oosImgUrl + res.data.qrcode
                this.$refs[this.selImg].style.display = 'block'
              }
            })
          }
        }
      },
      range (display, height, k) {
        this.$refs[k].style.display = display
        this.$refs[k].style.height = height
      },
      upload (e) {
        let reader = new FileReader()
        let that = this
        reader.onload = function (event) {
          that.$refs[that.selImg].src = event.target.result
          that.$refs[that.selImg].style.display = 'block'
        }
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
      },
      uploadFlag (flag) {
        this.flagStatus1 = flag
        this.flagStatus = this.flagStatus1
      },
      selectBank (val) {
        this.bankId = val
      },
      submit () {
        if (this.flagStatus1 && this.$route.params.name === 'wechat') {
          this.flagStatus = this.flagStatus1
          return
        }
        if (this.isBtnOne) {
          return
        } else {
          this.isBtnOne = true
        }
        if (!this.$route.query.id) {
          switch (this.$route.params.name) {
            case 'bank': this.userApi.bindBankCard(this.bankId, this.ruleForm.name, this.ruleForm.cart, this.ruleForm.branchName, this.isShow ? 1 : 2).then(res => { this.$router.replace('/my') }).catch(() => { this.isBtnOne = false }); break
            case 'pay': this.userApi.bindThirdPartyPaymentPlatform(this.ruleForm.name, this.ruleForm.cart, this.imgName, 1, this.isShow ? 1 : 2).then(res => { this.$router.replace('/my') }).catch(() => { this.isBtnOne = false }); break
            case 'wechat': this.userApi.bindThirdPartyPaymentPlatform(this.ruleForm.name, this.ruleForm.cart, this.imgName, 2, this.isShow ? 1 : 2).then(res => { this.$router.replace('/my') }).catch(() => { this.isBtnOne = false }); break
          }
        } else {
          switch (this.$route.params.name) {
            case 'bank': this.userApi.modifyBackCard(this.$route.query.id, this.bankId, this.ruleForm.name, this.ruleForm.cart, this.ruleForm.branchName, this.isShow ? 1 : 2).then(res => { this.$router.replace('/my') }).catch(() => { this.isBtnOne = false }); break
            case 'pay': this.userApi.modifyThirdPartyPaymentPlatform(this.$route.query.id, this.ruleForm.name, this.ruleForm.cart, this.imgName, 1, this.isShow ? 1 : 2).then(res => { this.$router.replace('/my') }).catch(() => { this.isBtnOne = false }); break
            case 'wechat': this.userApi.modifyThirdPartyPaymentPlatform(this.$route.query.id, this.ruleForm.name, this.ruleForm.cart, this.imgName, 2, this.isShow ? 1 : 2).then(res => { this.$router.replace('/my') }).catch(() => { this.isBtnOne = false }); break
          }
        }
      },
      isShowFn () {
        this.isShow = !this.isShow
      },
      getName () {
        this.userApi.userPersonalInfo().then(res => {
          this.ruleForm.name = res.data.info.realName
        })
      },
      isBaseAuth () {
        if (!this.userInfo.baseAuth) {
          this.$toast(this.$t('advertising.placeUserAuth'))
          setTimeout(() => {
            this.$router.push('/users/auth/one')
          }, 1500)
        }
      }
    },
    mounted () {
      this.isBaseAuth()
      this.getBankList()
      this.getName()
    }
  }
</script>

<style lang="less" scopeda>
  @import "../../../assets/css/theme";
.account-name {
  .info {
    margin-top: 2px;
    background: #fff;
    .title {
      padding: 26px 60px 40px;
      div:first-child {
        font-size: 16px;
        span {
          margin-right: 9px;
          display: block;
          width: 24px;
          height: 24px;
          background-size: 100%;
          &.pay {
            background-image: url("../../../assets/images/icon-pay.png");
          }
          &.bank {
            background-image: url("../../../assets/images/icon-bank.png");
          }
          &.wechat {
            background-image: url("../../../assets/images/icon-wechat.png");
          }
        }
      }
      div:last-child {
        font-size: 14px;
        span {
          margin-right: 14px;
        }
      }
    }
    .form {
      padding: 0 400px 80px;
      .upload-img-flag {
        margin-bottom: 0 !important;
        border: 1px dashed #e6491a !important;
      }
      .upload-img {
        position: relative;
        margin-bottom: 30px;
        width: 360px;
        height: 180px;
        border: 1px dashed #c5d4ed;
        &:hover {
          background-color: #f3f7ff;
          .zzc {
            visibility: visible;
          }
        }
        img {
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .zzc {
          position: absolute;
          visibility: hidden;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          background-color: rgba(0,0,0,.7);
          div {
            width: 36px;
            height: 36px;
            background-image: url("../../../assets/images/icon-add.png");
          }
          p {
            color: #fff;
          }
        }
        .upload-img-btn {
          a {
            position: relative;
            display: block;
            width: 36px;
            height: 36px;
            background-image: url("../../../assets/images/icon-add.png");
          }
        }
        p {
          margin-top: 10px;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  input.btnOne {
    background-color: #ebebeb;
    color: #888;
  }
  .er {
    line-height: 30px;
    font-size: 12px;
    color: #e6491a;
  }
}
</style>
