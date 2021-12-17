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
import { Scanner } from '../scanner.js'
const SCAN_INTERVAL = 500

export default {
  props: { doScan: Boolean },

  data: () => ({
    dimensions: {
      aspectRatio: window.screen.width / window.screen.height,
      physical: {
        width: window.screen.width * window.devicePixelRatio,
        height: window.screen.height * window.devicePixelRatio
      },
      half: {
        width: (window.screen.width * window.devicePixelRatio) / 2,
        height: (window.screen.height * window.devicePixelRatio) / 2
      }
    }
  }),

  async beforeMount () {
    try {
      await this.init()
      this.$emit('initSuccess')
    } catch (err) {
      this.$emit('initError', err)
      console.error(err)
    }
  },

  watch: {
    doScan (val) {
      if (val) this.scanner.startScanning(SCAN_INTERVAL)
      else this.scanner.stopScanning()
    }
  },

  methods: {
    async init () {
      const constraints = {
        facingMode: 'environment',
        width: { ideal: this.dimensions.half.width },
        height: { ideal: this.dimensions.half.height }
      }

      // Weird stuff but it works
      if (this.dimensions.aspectRatio < 1) {
        constraints.width.ideal = this.dimensions.half.height
        constraints.height.ideal = this.dimensions.half.width
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: constraints
      })

      const video = document.querySelector('#camera-video')
      video.srcObject = mediaStream
      video.setAttribute('playsinline', '')
      video.play()

      await new Promise(resolve => {
        video.onloadedmetadata = resolve
      })

      this.scanner = new Scanner('#camera-video')
      this.scanner.onRead = obj => this.$emit('read', obj.decode())

      if (this.doScan) this.scanner.startScanning(SCAN_INTERVAL)
    }
  }
}
</script>
