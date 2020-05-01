<template>
  <transition name="toast-pop">
    <div class="toast" v-show="message && visible">
      <span class="text">{{ message }}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      message: String,
      className: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: 'middle'
      },
      iconClass: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        visible: false
      }
    }
  }
</script>

<style lang="less">
  @import "../../../../assets/css/theme";
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    .transform(translate(-50%, -50%));
    z-index: 3000;
    max-width: 80%;
    .border-radius(@radius: 5px);
    padding: 5px 10px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    text-align: center;
    transition: opacity .3s linear;
    .text {
      font-size: 14px;
      display: block;
      text-align: center;
    }
  }
  .toast-pop-enter,
  .toast-pop-leave-active {
    opacity: 0;
  }
</style>
