const webpack = require("webpack");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withPlugins = require('next-compose-plugins');
module.exports = withPlugins(
  [withBundleAnalyzer,require('postcss-pxtorem')({
    rootValue: 16,
    unitPrecision: 5,
    mediaQuery: false,
    minPixelValue: 0,
    propList: [
      '*'
    ]
  })],
  {webpack(config) {
    const prod = process.env.NODE_ENV === "production";
    const plugins = [...config.plugins];
    return {
      ...config,
      mode: prod ? "production" : "development",
      devtool: prod ? "hidden-source-map" : "eval",
      plugins: plugins,
    };
  },}
);