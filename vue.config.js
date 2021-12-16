module.exports = {
  devServer: {
    disableHostCheck: true
  },

  configureWebpack: {
    module: {
      rules: [
        { test: /\.wasm.bin$/i, use: [{ loader: 'file-loader' }] }
      ]
    }
  }
}
