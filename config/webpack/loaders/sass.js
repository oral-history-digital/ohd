// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { env } = require('../configuration.js')

module.exports = {
  test: /\.(scss|sass|css)$/i,
  // use: ExtractTextPlugin.extract({
  //   fallback: 'style-loader',
  //   use: [
  //     { loader: 'css-loader', options: { minimize: env.NODE_ENV === 'production' } },
  //     { loader: 'postcss-loader', options: { sourceMap: true } },
  //     'resolve-url-loader',
  //     { loader: 'sass-loader', options: { sourceMap: true } }
  //   ]
  // })
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
