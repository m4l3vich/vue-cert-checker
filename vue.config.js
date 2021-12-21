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
  },

  pwa: {
    name: 'Сканер сертификатов',
    themeColor: '#000000',
    msTileColor: '#0085FF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
}
