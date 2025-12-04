/* eslint-env node */

const path = require('path');
const { generateWebpackConfig } = require('shakapacker');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const pjson = require(path.resolve(__dirname, '../../package.json'));
const version = pjson && pjson.version ? pjson.version : 'unknown';

const isDevelopment = process.env.NODE_ENV === 'development';

const webpackConfig = generateWebpackConfig(); // get base config
webpackConfig.plugins = webpackConfig.plugins || [];

// Add version definition plugin
webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(version),
    })
);

// Add React Fast Refresh plugin for true HMR in development
// This works in conjunction with the babel plugin
if (isDevelopment) {
    webpackConfig.plugins.push(
        new ReactRefreshWebpackPlugin({
            overlay: false, // Disable overlay, webpack-dev-server already has one
        })
    );
}

module.exports = webpackConfig;
