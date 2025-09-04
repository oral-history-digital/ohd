const path = require('path');
const { generateWebpackConfig } = require('shakapacker');
const webpack = require('webpack');

const pjson = require(path.resolve(__dirname, '../../package.json'));
const version = pjson && pjson.version ? pjson.version : 'unknown';

const webpackConfig = generateWebpackConfig(); // get base config
webpackConfig.plugins = webpackConfig.plugins || [];
webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(version)
  })
);

module.exports = webpackConfig;
