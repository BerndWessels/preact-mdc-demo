/**
 * Bernd Wessels (https://github.com/BerndWessels/)
 *
 * Copyright © 2017 Bernd Wessels. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

/**
 * Import dependencies.
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Export the build configuration.
 */
module.exports = function () {
  // Get the build environment.
  const DEV = process.env.NODE_ENV === 'development';
  const WEB = process.env.TARGET === 'web';
  // Build sass loaders.
  const sassLoaders = []
    .concat(DEV ? [
      {
        //https://github.com/webpack-contrib/style-loader
        loader: 'style-loader'
      }] : [])
    .concat([
      {
        // https://github.com/webpack-contrib/css-loader
        loader: 'css-loader',
        options: Object.assign({
            sourceMap: true,
            modules: true,
            importLoaders: 2
          },
          DEV ? {
            localIdentName: "[path]---[name]---[local]---[hash:base64:5]"
          } : {}
        )
      },
      {
        // https://github.com/postcss/postcss-loader
        loader: 'postcss-loader',
        options: {
          plugins: function () {
            return [
              autoprefixer({browsers: ['last 2 versions']})
            ];
          }
        }
      },
      {
        // https://github.com/bholloway/resolve-url-loader
        loader: 'resolve-url-loader'
      },
      {
        // https://github.com/webpack-contrib/sass-loader
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: []
        }
      }
    ]);
  // Build and export the build configuration.
  return {
    // https://webpack.js.org/configuration/target
    target: WEB ? 'web' : 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    // https://webpack.js.org/configuration/entry-context
    entry: {
      main: path.resolve(__dirname, WEB ? './src/index.client.js' : './src/server.js')
    },
    // https://webpack.js.org/configuration/output
    output: {
      filename: WEB ? '[name].[hash].js' : '[name].js',
      path: path.resolve(__dirname, WEB ? './dist/client' : './dist/server'),
      publicPath: '' // todo
    },
    // https://webpack.js.org/configuration/resolve
    resolve: {
      alias: {
        'preact': 'preact',
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
      },
      extensions: ['.js', '.jsx', '.json', '.scss'],
      modules: ['node_modules']
    },
    // https://webpack.js.org/configuration/module
    module: {
      noParse: /\.min\.js/,
      rules: [{
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [{
          // https://github.com/babel/babel-loader
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', {loose: true, modules: false}]
            ],
            plugins: [
              'transform-class-properties',
              'transform-object-rest-spread',
              ['transform-react-jsx', {pragma: 'h'}]
            ]
          },
        }]
      }, {
        test: /(\.scss|\.css)$/,
        exclude: [/node_modules/, /normalize.css/, /icomoon/],
        use: DEV ? sassLoaders : ExtractTextPlugin.extract(sassLoaders)
      }]
    },
    // https://webpack.js.org/configuration/plugins
    plugins: [
      // https://github.com/johnagan/clean-webpack-plugin
      new CleanWebpackPlugin(WEB ? ['dist/client'] : ['dist/server'], __dirname),
      // https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([
        {from: 'public'}
      ]),
      // https://webpack.js.org/plugins/loader-options-plugin
      new webpack.LoaderOptionsPlugin({
        minimize: !DEV,
        debug: !DEV
      }),
      // https://webpack.js.org/plugins/define-plugin
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(DEV ? 'development' : 'production'),
          WEB: JSON.stringify(WEB)
        }
      })
    ].concat(WEB ? [
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.ejs'),
        inject: false,
        baseurl: '/'
      })
    ] : [])
      .concat(DEV ? [
        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin()
      ] : [])
      .concat(!DEV ? [
        // https://github.com/webpack-contrib/extract-text-webpack-plugin
        new ExtractTextPlugin({
          filename: '[name].[hash].css'
        }),
        // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false
          },
          output: {
            comments: false,
            screw_ie8: true
          },
          mangle: {
            screw_ie8: true
          },
          sourceMap: true
        })
      ] : []),
    // https://webpack.js.org/configuration/devtool
    devtool: DEV ? 'cheap-module-eval-source-map' : 'source-map',
    // https://webpack.js.org/configuration/other-options/#bail
    bail: !DEV,
    // https://webpack.js.org/configuration/stats
    stats: {
      colors: true
    },
    // https://webpack.js.org/configuration/dev-server
    devServer: {
      port: process.env.PORT || 8080,
      host: 'localhost',
      publicPath: '/',
      contentBase: './src',
      historyApiFallback: true,
      key: fs.readFileSync(path.resolve(__dirname, './certificates/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './certificates/localhost.crt')),
      proxy: {
        // OPTIONAL: proxy configuration:
        // '/optional-prefix/**': { // path pattern to rewrite
        //   target: 'http://target-host.com',
        //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
        // }
      }
    }
  };
};
