import apiConfig from '../config/api.config'
import AxiosClass from '../assets/js/axiosClass'

let axios = new AxiosClass(apiConfig.baseURL)
let otcAxios = new AxiosClass(apiConfig.otcURL)
let zendeskAxios = new AxiosClass(apiConfig.zendeskURL, false)
export { axios, otcAxios, zendeskAxios }
