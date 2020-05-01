module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '法币OTC交易-58COIN',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {src: '/js/zlib.pretty.js'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
 ** Global CSS
 */
  css: ['~static/css/main.css'],
  plugins: [
    { src: '~plugins/appendImg.js', ssr: false },
    '~plugins/filter.js',
    '~plugins/i18n.js',
    // '~plugins/dictionary.js',
    '~plugins/api.js',
    '~plugins/st-ui.js',
    '~plugins/enum.js',
    { src: '~plugins/udesk.js', ssr: false },
    { src: '~plugins/baidu.js', ssr: false }
  ],
  // modules: [
  //   // npm install @nuxtjs/proxy -D
  //   ['@nuxtjs/proxy']
  // ],
  // proxy: {
  //   '/api': {
  //     pathRewrite: {'^/api': '/'},
  //     target: 'http://otcapi.test.com/'
  //   }
  // },
  /*
  ** Build configuration
  */
  build: {
    // publicPath: 'https://img.58jdd.com',
    /*
     ** Run ESLINT on save
     */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
