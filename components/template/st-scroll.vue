<template>
   <div class="scroll" :style="options" ref="scroll">
     <slot></slot>
   </div>
</template>

<script>
  export default {
    name: 'st-scroll',
    props: ['options'],
    methods: {
      scrollMove () {
        let dom = this.$refs.scroll
        setTimeout(() => {
          dom.scrollTop = dom.scrollHeight - dom.offsetHeight
        }, 100)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/css/theme";
  .scroll {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    overflow-y: auto;
    padding-right: 15px;
    &::-webkit-scrollbar-track {
      background: #f3f3f3;
    }
    &::-webkit-scrollbar {
      width: .2rem;
      height: 1rem;
      background-color: #33404f;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
    }
  }
</style>
