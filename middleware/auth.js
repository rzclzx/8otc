import apiConfig from '../config/api.config'
import Cookie from '../assets/js/cookie'
export default function ({store, redirect, req}) {
  if (!store.state.auth.token || (process.server ? (req.headers.cookie.indexOf('token') === -1) : !Cookie.getCookie('token'))) {
    process.server ? redirect(apiConfig.mainDomain + 'manage/login?position=' + apiConfig.otcDomain) : redirect('/login')
  }
}
