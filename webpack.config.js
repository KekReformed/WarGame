const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const serveDirectory = path.resolve(__dirname, 'public')

module.exports = {
  entry: [
    'p5',
    './node_modules/p5.play/lib/p5.play.js',
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