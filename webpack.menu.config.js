const path = require('path');

module.exports = {
  entry: './src-menu/index.js',
  mode: "development",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public-menu'),
  },
};