const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { env } = require('../configuration.js')

module.exports = {
  test: /\.(scss|sass|css)$/i,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // you can specify a publicPath here
        // by default it use publicPath in webpackOptions.output
        publicPath: '../'
      }
    },
    "css-loader", "postcss-loader", 'resolve-url-loader', 'sass-loader'
  ]
}
