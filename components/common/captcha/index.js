import CountDown from './src/count-down.vue'

CountDown.install = Vue => {
  Vue.component(CountDown.name, CountDown)
}

export default CountDown
