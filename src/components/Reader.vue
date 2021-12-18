<template>
  <div class="reader">
    <video id="camera-video" class="reader__video"/>
    <div class="reader__overlay">
      <slot/>
    </div>
  </div>
</template>

<style>
.reader__video, .reader__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.reader__overlay {
  z-index: 2;
}

.reader__video {
  object-fit: cover;
}
</style>

<script>
import { Scanner } from '../lib/scanner.js'
import { initCamera, CameraInitError, CameraErrCode } from '../lib/camera.js'
const SCAN_INTERVAL = 500

export default {
  props: { doScan: Boolean },

  data: () => ({
    dimensions: {
      // Use half of screen's physical size for good
      // performance and camera feed quality balance
      width: (window.screen.width * window.devicePixelRatio) / 2,
      height: (window.screen.height * window.devicePixelRatio) / 2
    }
  }),

  async mounted () {
    try {
      await initCamera('#camera-video', this.dimensions)
    } catch (e) {
      console.error(e)
      if (!(e instanceof CameraInitError)) return this.$emit('initError', CameraErrCode.Unknown)
      return this.$emit('initError', e.type)
    }

    this.scanner = new Scanner('#camera-video')
    this.scanner.onRead = obj => this.$emit('read', obj.decode())

    if (this.doScan) this.scanner.startScanning(SCAN_INTERVAL)
    this.$emit('initSuccess')
  },

  watch: {
    doScan (val) {
      if (val) this.scanner.startScanning(SCAN_INTERVAL)
      else this.scanner.stopScanning()
    }
  }
}
</script>
