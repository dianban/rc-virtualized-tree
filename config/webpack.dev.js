const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    app: path.join(__dirname, "../example/app.js"),
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../example/"),
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "../example/"),
    host: "localhost",
    port: 3001,
    open: true,
  },
});
