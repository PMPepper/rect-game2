var webpack = require('webpack');

module.exports = {
  entry: './js/main.js',
  output: {
      path: __dirname + "/webpack",
      filename: "scripts.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /.*.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              'env',
              {
                'targets': {
                  browsers: require('./browsers.json')
                }
              }
            ],
            'react'
          ],
          plugins: ['transform-runtime', 'transform-object-rest-spread', 'transform-class-properties']
        }
      }
    ]
  }
};
