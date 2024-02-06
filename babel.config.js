module.exports = function(api) {
  var validEnv = ['development', 'test', 'production']
  var currentEnv = api.env()
  var isDevelopmentEnv = api.env('development')
  var isProductionEnv = api.env('production')
  var isTestEnv = api.env('test')
  var isWebpackDevServer = process.env.WEBPACK_DEV_SERVER;

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      'Please specify a valid `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(currentEnv) +
        '.'
    )
  }

  return {
    presets: [
      './node_modules/shakapacker/package/babel/preset.js',
      [
        '@babel/preset-react',
        {
          development: isDevelopmentEnv || isTestEnv,
          useBuiltIns: true,
          runtime: 'automatic',
        }
      ]
    ].filter(Boolean),
    plugins: [
    ].filter(Boolean)
  }
}
