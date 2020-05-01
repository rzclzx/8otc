<template>
  <st-row class="popup" justify="center" align="center">
    <div class="popup-box" :style="`width:${width}px` ">
      <st-row class="header" justify="between" align="center">
        <h3>{{ title }}</h3>
        <a @click="close"></a>
      </st-row>
      <slot></slot>
    </div>
  </st-row>
</template>

<script>
//  import StRow from '../../st-ui/packages/row/row'

  export default {
    name: 'popup',
    components: {
//      StRow
    },
    props: {
      title: {
        type: String,
        required: true
      },
      callback: {
        type: Function,
        required: true
      },
      width: {
        type: String
      }
    },
    methods: {
      close () {
        this.callback()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../assets/css/theme";
  .popup {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popup-box {
      width: 712px;
      min-height: 296px;
      .border-radius();
      padding-bottom: 40px;
      background-color: #fff;
      overflow: hidden;
      .header {
        padding: 0 18px;
        background-color: #e2e7ef;
        h3 {
          line-height: 50px;
          font-size: 16px;
        }
        a {
          display: block;
          width: 8px;
          height: 8px;
          background: url("./icon-popupclose.png") no-repeat;
        }
      }
    }
  }
</style>
