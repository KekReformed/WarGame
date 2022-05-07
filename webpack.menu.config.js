const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src-menu/index.js',
  mode: "development",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public-menu'),
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })]
  }
};