const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 需要 link
const { PrettyConsoleWebpackPlugin } = require('@sprit/pretty-console-webpack-plugin');

/**
 * @type import('webpack').Configuration
 */
module.exports = {
  mode: 'development',
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new PrettyConsoleWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: ['./dist'],
    port: 8000,
    hot: true
  }
};
