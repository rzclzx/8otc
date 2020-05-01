/* eslint-disable */
/*
** 只在生成模式的客户端中使用
*/
(function(a,h,c,b,f,g){a["UdeskApiObject"]=f;a[f]=a[f]||function(){(a[f].d=a[f].d||[]).push(arguments)};g=h.createElement(c);g.async=1;g.charset="utf-8";g.src=b;c=h.getElementsByTagName(c)[0];c.parentNode.insertBefore(g,c)})(window,document,"script","//assets-cli.udesk.cn/im_client/js/udeskApi.js","ud");
ud({
  'code': '22ab1akk',
  'link': '//58btc.udesk.cn/im_client/?web_plugin_id=38854'
})

export default ({ app: { router }, store }) => {

  router.afterEach((to, from) => {
    ud({
      'code': '22ab1akk',
      'link': '//58btc.udesk.cn/im_client/?web_plugin_id=38854'
    })
  })
}
