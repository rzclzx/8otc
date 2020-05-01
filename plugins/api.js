import Vue from 'vue'
import ToolsApi from '~/assets/js/api/toolsApi'
import UserApi from '~/assets/js/api/userApi'
import AdvertApi from '~/assets/js/api/advertApi'
import OrderApi from '~/assets/js/api/orderApi'
import MessageApi from '~/assets/js/api/messageApi'

Vue.prototype.toolsApi = ToolsApi
Vue.prototype.userApi = UserApi
Vue.prototype.advertApi = AdvertApi
Vue.prototype.orderApi = OrderApi
Vue.prototype.messageApi = MessageApi
