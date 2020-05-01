import Vue from 'vue'
import StUI from '../node_modules/st-ui/src/main'
import { Toast } from '../components/common/toast'
import Upload from '../components/common/upload/upload'
Upload.install = Vue => {
  Vue.component(Upload.name, Upload)
}
if (process.client) {
  Vue.use(Toast)
  Vue.prototype.$toast = Toast
}
Vue.use(StUI.Row)
Vue.use(StUI.Form)
Vue.use(StUI.FormItem)
Vue.use(StUI.Input)
Vue.use(Upload)
Vue.use(StUI.Select)
Vue.use(StUI.Option)
Vue.use(StUI.Textarea)
Vue.use(StUI.Footer)
Vue.use(StUI.Page)
Vue.use(StUI.Switch)
