// eslint bug https://github.com/eslint/eslint/issues/15422
/* eslint-disable no-dupe-class-members */
import { scanImageData, ImageScanner } from 'zbar.wasm'
import { ZBarSymbolType, ZBarConfigType } from 'zbar.wasm/dist/enum.js'

export class Scanner {
  constructor (selector, { width, height } = {}) {
    this.video = document.querySelector(selector)
    if (!(this.video instanceof HTMLVideoElement)) {
      throw new Error('Passed element is not HTMLVideoElement')
    }

    const canvas = document.createElement('canvas')
    canvas.width = width || this.video.videoWidth
    canvas.height = height || this.video.videoHeight
    this.size = { width: canvas.width, height: canvas.height }

    this.ctx = canvas.getContext('2d')
  }

  async #createScanner () {
    this.scanner = await ImageScanner.create()
    this.scanner.enableCache(true)

    // Disable all code types, enable only QR codes
    this.scanner.setConfig(ZBarSymbolType.ZBAR_NONE, ZBarConfigType.ZBAR_CFG_ENABLE, 0)
    this.scanner.setConfig(ZBarSymbolType.ZBAR_QRCODE, ZBarConfigType.ZBAR_CFG_ENABLE, 1)
  }

  async #performScan () {
    const { width, height } = this.size

    this.ctx.drawImage(this.video, 0, 0, width, height)
    const imgData = this.ctx.getImageData(0, 0, width, height)
    const res = await scanImageData(imgData, this.scanner)

    if (!res[0]) return
    // If scanning was stopped in the middle of the process
    if (!this.scanning) return
    if (typeof this.onRead !== 'function') {
      console.warn('scanner.onRead is not a function')
      return
    }

    this.onRead(res[0])
  }

  #delay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  startScanning (interval) {
    if (this.scanning) {
      return console.warn('Scanning is already started; doing nothing')
    }
    this.scanning = true;

    (async () => {
      if (!this.scanner) await this.#createScanner()

      try {
        while (this.scanning) {
          await this.#performScan()
          await this.#delay(interval)
        }
      } catch (e) {
        if (typeof this.onError === 'function') return this.onError(e)
        console.error(e)
      }
    })()
  }

  stopScanning () {
    this.scanning = false
  }
}
