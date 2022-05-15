const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const serveDirectory = path.resolve(__dirname, 'public')

module.exports = {
  entry: [
    'p5',
    './src',
    './src/sketch.js'
  ],
  mode: "development",
  output: {
    filename: 'bundle.js',
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