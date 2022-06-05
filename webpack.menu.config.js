const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const serveDirectory = path.resolve(__dirname, 'public-menu')

module.exports = {
  entry: {
    index: ['./src-menu/', './src-menu/joinGame.js'],
    lobby: './src-menu/lobby/lobby.ts'
  },
  mode: "development",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js']
  },

  output: {
    filename: '[name].js',
    path: serveDirectory,
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })]
  },
  devServer: {
    static: {
      directory: serveDirectory,
    },
    compress: true,
    port: 3000,
  },
};