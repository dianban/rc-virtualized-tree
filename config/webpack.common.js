module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: "file-loader",
        options: {
          outputPath: "assets",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          outputPath: "assets",
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
