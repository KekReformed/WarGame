const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

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
    path: path.resolve(__dirname, 'public'),
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })]
  }
};