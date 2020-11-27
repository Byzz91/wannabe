const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // enntry file
  entry: './src/js/app.js',
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resoucePath, context) => {
                return path.relative(path.dirname(resoucePath), context) + '/'
              }
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              useRelativePath: true,
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js')
        ],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": [
              [
                "@babel/preset-env", {
                  "targets": {"chrome": "55"}, /* chrome 55 이상으로 지정 */
                  "debug": true
                }
              ],
            ],
            "plugins": ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
     filename: "[name].css",
     chunkFilename: "[id].css"
    })
  ],
  devtool: 'source-map',
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development'
};