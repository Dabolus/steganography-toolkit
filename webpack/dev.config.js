const HtmlPlugin = require('html-webpack-plugin');
const { smartStrategy: smartMerge } = require('webpack-merge');
const baseConfig = require('./base.config');
const devServerConfig = require('./dev-server.config');

const sassConfig = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-preset-env')(),
        require('autoprefixer')(),
      ],
    },
  },
  {
    loader: 'sass-loader',
    options: {
      includePaths: ['./node_modules'],
    },
  },
];

module.exports = smartMerge({
  plugins: 'prepend',
})(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  serve: devServerConfig,
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  module: {
    rules: [
      {
        test: /components\/.*\.s?[ac]ss$/,
        use: [
          {
            loader: 'to-lit-html-loader',
          },
          ...sassConfig,
        ],
      },
      {
        test: /styles\/.*\.s?[ac]ss$/,
        exclude: /components\/.*\.s?[ac]ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          ...sassConfig,
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      inject: 'head',
      template: '!!handlebars-loader!./src/index.hbs',
      base: '/',
      showErrors: true,
    }),
  ],
});
