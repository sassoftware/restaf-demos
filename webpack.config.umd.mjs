// webpack.config.js
import path from 'path';
import nodeExternals  from 'webpack-node-externals';
let p = path.resolve('dist');
export default {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: p,
    library: 'viyaAssistant',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  externals: [nodeExternals()],
  devtool: 'source-map',
};