const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, {mode}) => {
  const devMode = mode !== 'production';

  const config = {
    mode,
    entry: [
      './src/main.js'
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../dist')
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: [/(node_modules)/, /\.spec\.js$/],
          include: [
            path.resolve(__dirname, '../js')
          ],
          use: []
        },
        {
          test: /\.scss$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(jpg|png|gif|svg|ico)$/,
          use: [
            {
              loader: 'file-loader',
            }
          ],
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./index.html')
      }),
      new CopyWebpackPlugin([
        {
          from: './src/assets/favicon/favicon.ico',
          to: './assets/favicon'
        }
      ]),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      new WebpackPwaManifest({
        filename: 'manifest.webmanifest',
        name: 'CollectionCollector',
        short_name: 'CollColl',
        description: 'You can create your own collections',
        background_color: '#4caf50',
        theme_color: '#4caf50',
        includeDirectory: true,
        inject: true,
        ios: {
          'apple-mobile-web-app-title': 'CollectionCollector',
          'apple-mobile-web-app-status-bar-style': 'black-translucent'
        },
        icons: [
          {
            src: path.resolve('src/assets/favicon/favicon-16x16.png'),
            sizes: '16x16'
          },
          {
            src: path.resolve('src/assets/favicon/favicon-32x32.png'),
            sizes: '32x32'
          },
          {
            src: path.resolve('src/assets/favicon/favicon-32x32.png'),
            sizes: '70x70'
          },
          {
            src: path.resolve('src/assets/favicon/mstile-144x144.png'),
            sizes: '144x144'
          },
          {
            src: path.resolve('src/assets/favicon/mstile-150x150.png'),
            sizes: '150x150'
          },
          {
            src: path.resolve('src/assets/favicon/mstile-310x150.png'),
            sizes: '310x150'
          },
          {
            src: path.resolve('src/assets/favicon/mstile-310x310.png'),
            sizes: '310x310'
          },
          {
            src: path.resolve('src/assets/favicon/android-chrome-512x512.png'),
            sizes: '512x512',
            destination: path.join('icons', 'android')
          },
          {
            src: path.resolve('src/assets/favicon/android-chrome-192x192.png'),
            sizes: '192x192',
            destination: path.join('icons', 'android')
          },
          {
            src: path.resolve('src/assets/favicon/apple-touch-icon.png'),
            sizes: '180x180',
            destination: path.join('icons', 'ios'),
            ios: true
          },
          {
            src: path.resolve('src/assets/favicon/safari-pinned-tab.svg'),
            size: 1024,
            destination: path.join('icons', 'ios'),
            ios: 'startup'
          }

        ]
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, '../'),
      compress: true,
      historyApiFallback: true,
      disableHostCheck: true
    }
  };
  return config;
};
