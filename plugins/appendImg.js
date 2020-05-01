export default () => {
  (function () {
    var img = document.createElement('img')
    img.src = 'https://mon.58coin.com/mon.gif'
    img.id = 'img-hidden'
    var nuxt = document.querySelector('#__nuxt')
    if (nuxt) document.body.insertBefore(img, nuxt)
    else document.body.appendChild(img)
  })()
}
