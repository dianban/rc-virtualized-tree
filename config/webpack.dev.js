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
    path: path.resolve(__dirname, "../example/"), // 开发模式下不会实际生成 bundle.js 文件，会存放到内存中的。
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
    contentBase: path.join(__dirname, "../example/"), // 本地服务加载页面所在目录
    host: "localhost", // 指定启动 ip，localhost 表示本地
    port: 3001, // 端口号 3000
    open: true, // 自动打开浏览器
  },
});
