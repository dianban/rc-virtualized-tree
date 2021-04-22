module.exports = {
  resolve: {
    // 定义 import 引用时可省略的文件后缀名
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: "file-loader",
        options: {
          outputPath: "assets", // 打包后资源存放的目录
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          outputPath: "assets", // 打包后资源存放的目录
        },
      },
      {
        test: /(\.js(x?))|(\.ts(x?))$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
};
