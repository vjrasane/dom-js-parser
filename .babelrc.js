const ROOT_PATH_SUFFIX = "./src";

module.exports = {
  presets: ["@babel/env", "./babel-preset-mechanism"],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        rootPathSuffix: ROOT_PATH_SUFFIX
      }
    ],
    "@babel/proposal-optional-chaining",
    "@babel/proposal-class-properties",
    "@babel/transform-runtime"
  ]
};
