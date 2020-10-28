const { env, publicPath } = require('../configuration.js')

console.log(publicPath);

module.exports = {
  test: /\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2)$/i,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath: '/packs',
      name: env.NODE_ENV === 'production' ? '[name]-[hash].[ext]' : '[name].[ext]'
    }
  }]
}
