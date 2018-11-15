const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./index.html')
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
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
