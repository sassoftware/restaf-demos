import path from 'path';
import nodeExternals  from 'webpack-node-externals';
let p = path.resolve('dist');
console.log(p);
export default {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: p,
    filename: 'index.esm.js',
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
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