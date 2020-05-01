export default function ({ store, redirect, route }) {
  if (!store.state.user.userInfo.otcName) {
    redirect('/users/nickName')
  }
}
