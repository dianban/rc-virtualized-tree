import path from "path";
import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import ts from "rollup-plugin-typescript2";
import scss from "rollup-plugin-scss";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
const getPath = (_path) => path.resolve(__dirname, _path);
import packageJSON from "./package.json";

const extensions = [".ts", ".js", ".tsx", "jsx"];

const tsPlugin = ts({
  tsconfig: getPath("./tsconfig.json"),
  extensions,
});

const commonConf = {
  input: getPath("./src/index.ts"),
  plugins: [
    nodeResolve({
      extensions,
    }),
    commonjs({ include: "node_modules/**", extensions }),
    tsPlugin,
    babel({
      exclude: "node_modules/**",
      extensions,
    }),
    peerDepsExternal({
      packageJsonPath: packageJSON,
    }),
    scss({
      output: "styles.css",
      outputStyle: "compressed",
      processor: () => postcss([autoprefixer()]),
    }),
  ],
  output: {
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      "react-virtualized": "reactVirtualized",
    },
  },
  external: ["react", "react-dom", "react-virtualized"],
};

const outputMap = [
  {
    file: packageJSON.main,
    format: "umd",
  },
  {
    file: packageJSON.module,
    format: "es",
  },
];

const buildConf = (options) => Object.assign({}, commonConf, options);
export default outputMap.map((output) => {
  return buildConf({
    output: {
      name: packageJSON.name,
      ...output,
    },
  });
});
