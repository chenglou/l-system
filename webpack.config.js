var webpack = require('webpack');

module.exports = {
  entry: {
    index: './index.jsx',
  },
  output: {
    path: './build',
    filename: 'index.js',
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /build|node_modules/, loader: 'babel-loader?stage=0'},
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

