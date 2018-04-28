'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath :
      config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [
          {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [resolve('src'), resolve('test')],
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: !config.dev.showEslintErrorsInOverlay
          }
        },

        // Apply loader
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                // Provide path to the file with resources
                resources: '../src/style/global.scss',

                // Or array of paths
                // resources: ['./path/to/vars.scss', './path/to/mixins.scss']

              },
            },
          ],
        },
      ] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            sass: [
              'vue-style-loader',
              'css-loader',
              // postcss-loader非必须
              'postcss-loader',
              'sass-loader?indentedSyntax=1',
              {
                loader: 'sass-resources-loader',
                options: {
                  // 需更改为项目中实际scss文件路径
                  resources: path.resolve(__dirname, '../src/style/global.scss'),
                },
              },
            ],
            scss: [
              'vue-style-loader',
              'css-loader',
              // postcss-loader非必须
              'postcss-loader',
              'sass-loader',
              {
                loader: 'sass-resources-loader',
                options: {
                  // 需更改为项目中实际scss文件路径
                  resources: path.resolve(__dirname, '../src/style/global.scss'),
                },
              },
            ],
          },
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
