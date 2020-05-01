import Popup from './popup'
import VerifyBox from './verifyBox'

Popup.install = Vue => {
  Vue.component(Popup.name, Popup)
}
VerifyBox.install = Vue => {
  Vue.component(VerifyBox.name, VerifyBox)
}

export { Popup }
export { VerifyBox }
