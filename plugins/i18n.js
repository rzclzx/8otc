import Vue from 'vue'
import VueI18n from 'vue-i18n'

import CN from '~/locales/cn.json'
import EN from '~/locales/en.json'
import JP from '~/locales/jp.json'
import KR from '~/locales/kr.json'
import RU from '~/locales/ru.json'
import StEN from '../node_modules/st-ui/src/locale/lang/en'
import StCN from '../node_modules/st-ui/src/locale/lang/cn'
import StJA from '../node_modules/st-ui/src/locale/lang/ja'
import StKO from '../node_modules/st-ui/src/locale/lang/ko'
import StRU from '../node_modules/st-ui/src/locale/lang/ru'
Vue.use(VueI18n)
export default ({ app, store, req }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and trade asyncData/fetch
  if (req && req.locale) {
    store.commit('auth/SET_LOCALE', {
      locale: req.locale
    })
  }
  let locale = store.state.auth.locale
  let messages = {
    'en': {...EN, ...StEN},
    'cn': {...CN, ...StCN},
    'ja': {...JP, ...StJA},
    'ko': {...KR, ...StKO},
    'ru': {...RU, ...StRU}
  }
  if (!locale || !messages[locale]) {
    locale = 'en'
  }
  // let language = (cookie.getCookie('locale') && global.sessionStorage.language) ? global.sessionStorage.language : 'cn'
  app.i18n = new VueI18n({
    locale: locale,
    messages
  })
  Vue.$i18n_t = (key) => { return app.i18n.t(key) }
}
