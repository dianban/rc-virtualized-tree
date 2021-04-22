const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 引入 css 单独打包插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  entry: {
    index: path.join(__dirname, "../src/index.js"),
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist/"),
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      }
    ],
  },
  plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin()],
});
