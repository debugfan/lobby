const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const serverConfig = {
  target: 'node',
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
};

const clientConfig = {
  target: 'web', // <=== can be omitted as default is 'web'
  entry: './index.js',
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html', inject: false }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
};

module.exports = [serverConfig, clientConfig];
