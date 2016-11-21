/*
  ONLY RUN BUILDS WITH `npm run web-dist`!
  DO NOT USE NORMAL WEBPACK! IT WILL NOT WORK!
*/

const webpack = require('webpack');
const createVariants = require('parallel-webpack').createVariants;
const version = require('./package.json').version;

const createConfig = (options) => {
  const plugins = [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ];

  if (options.minify) plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));

  const filename = `./webpack/discord${process.env.VERSIONED === 'false' ? '' : '.' + version}${options.minify ? '.min' : ''}.js`; // eslint-disable-line

  return {
    entry: './src/index.js',
    output: {
      path: __dirname,
      filename,
    },
    module: {
      rules: [
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.md$/, loader: 'ignore-loader' },
      ],
    },
    externals: {
      ws: { commonjs: 'ws' },
      opusscript: { commonjs: 'opusscript' },
      'node-opus': { commonjs: 'node-opus' },
      'tweet-nacl': { commonjs: 'tweet-nacl' },
    },
    node: {
      fs: 'empty',
      dns: 'mock',
      tls: 'mock',
      child_process: 'empty',
      dgram: 'empty',
      zlib: 'empty',
      __dirname: true,
    },
    plugins,
  };
};

module.exports = createVariants({}, { minify: [false, true] }, createConfig);