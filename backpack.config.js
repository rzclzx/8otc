module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './server/index.js'
    config.module.rules.push({
      // enforce: 'pre',
      test: /\.(js)$/,
      loader: 'babel-loader',
      include: /(node_modules\/st-ui)/
    })
    return config
  }
}
