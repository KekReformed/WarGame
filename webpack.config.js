const path = require('path');

module.exports = {
  entry: './src',
  mode: "production",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
};