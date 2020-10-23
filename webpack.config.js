const path = require('path');

module.exports = {
  entry: './src/game.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { 
        test: /\.(html)$/,
        loader: "file?name=[path][name].[ext]&context=./dist"
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
  }
};