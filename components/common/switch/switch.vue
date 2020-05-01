<template>
  <a class="st-switch" :class="[ status && 'active']" @click="toggle">
    <span :class="[ status && 'active']"></span>
  </a>
</template>

<script>
  export default {
    name: 'st-switch',
    props: {
      status: {
        type: [Boolean, Number],
        required: true
      }
    },
    methods: {
      toggle () {
        this.$emit('callback')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../assets/css/theme";
  .st-switch {
    position: relative;
    display: block;
    width: 40px;
    height: 20px;
    border: 1px solid #e5e5e5;
    .border-radius(@radius: 10px);
    background: #e5e5e5;
    .transition(all .3s);
    &.active {
      border-color: @linkColor;
      background: @linkColor;
    }
    span {
      position: absolute;
      display: block;
      width: 18px;
      height: 18px;
      .border-radius(@radius: 50%);
      background: #fff;
      .transition(all .3s);
      &.active {
        .transform(translate3d(20px, 0px, 0px));
      }
    }
  }
</style>
