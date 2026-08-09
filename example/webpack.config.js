const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ConsoleTagWebpackPlugin } = require('@sprit/console-tag');

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
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new ConsoleTagWebpackPlugin({
      HtmlPlugin: HtmlWebpackPlugin,
      git: { branch: true, hash: 7, version: true, lastCommitDateTime: true },
      custom: () => ({ 构建版本: process.env.BUILD_VERSION ?? '-' }),
    }),
  ],
  devServer: {
    static: ['./dist'],
    port: 8000,
    hot: true,
  },
};
