/*https://segmentfault.com/a/1190000012925212*/
const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    vendor: [
      'vue-router',
      'vuex',
      'vue/dist/vue.common.js',
      'vue/dist/vue.js',
      'vue-loader/lib/component-normalizer.js',
      'vue',
      'axios',
      'echarts',
      'element-ui'
    ]
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('./dist', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
