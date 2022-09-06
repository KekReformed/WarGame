const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const serveDirectory = path.resolve(__dirname, 'public')

module.exports = {
  entry: {
    index: ['./src/index.js', './src/joinGame.js'],
    game: ['./src/lobby/lobby.ts', 'p5', './src/lobby/game/sketch.ts']
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
    port: 9999,
  },
};