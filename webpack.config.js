var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  stats: {
    colors: true
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
};
