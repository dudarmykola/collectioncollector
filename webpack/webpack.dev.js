const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

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
        icons: [
          {
            src: path.resolve('src/assets/img/coll-coll.svg'),
            sizes: [96, 128, 192, 256, 384, 512]
          }
        ],
        includeDirectory: true
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
