"use strict";
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      "/api/inner/platform/*": {
        // 正式
        //  target: "http://10.10.11.7:11095",
        // target: "http://10.10.11.7:11094",
        // 测试
      //  target: "http://172.16.8.111:11094",
        // 周敏后台
        target: "http://172.16.18.132:11094",
        // target: "http://172.16.18.26:11094",
        // 新测试环境ip
        // target: "http://172.16.8.207:11094",
        secure: false,
        changeOrigin: false,
        pathRewrite: {
          "^/api/inner/platform": "" //连接测试环境不能注掉
        }
      },
      "/api/inner/cost/*": {
        //target: 'http://172.19.11.222:8080', //网关
         // 正式
        //  target: "http://10.10.11.7:12095",
        // target: "http://10.10.11.7:12094",
        // 测试
        // target: "http://172.16.8.111:12094",
        // 周敏后台
        target: "http://172.16.18.132:12094",
        // target: "http://172.16.18.26:12094",
        // 新测试环境ip
        // target: "http://172.16.8.207:12094",
        secure: false,
        changeOrigin: false,
        pathRewrite: {
          "^/api/inner/cost": "" //连接测试环境不能注掉
        }
      }
    },

    // Various Dev Server settings
    host: "localhost", // can be overwritten by process.env.HOST
    port: 9528, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: "cheap-source-map",
    // devtool: 'source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, "../dist/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "static",

    // you can set by youself according to actual condition
    assetsPublicPath: "/",

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "#source-map",

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
