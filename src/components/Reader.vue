<template>
  <div class="reader">
    <video ref="video" class="reader__video"/>
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
import { scanImageData } from 'zbar.wasm'
const SCAN_INTERVAL = 500

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  data: () => ({
    canvas: document.createElement('canvas')
  }),

  async created () {
    try {
      await this.init()
      this.$emit('initSuccess')
      this.scan()
    } catch (err) {
      this.$emit('initError', err)
      console.error(err)
    }
  },

  methods: {
    verify (obj) {
      if (!obj) return
      if (obj.typeName !== 'ZBAR_QRCODE') return
      this.$emit('read', obj.decode())
    },

    async init () {
      const aspectRatio = window.screen.width / window.screen.height

      const physWidth = window.screen.width * window.devicePixelRatio
      const physHeight = window.screen.height * window.devicePixelRatio

      const constraints = {
        facingMode: 'environment',
        width: { ideal: physWidth },
        height: { ideal: physHeight }
      }

      // Weird stuff but it works
      if (aspectRatio < 1) {
        constraints.width.ideal = physHeight
        constraints.height.ideal = physWidth
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: constraints
      })
      console.log(mediaStream.getVideoTracks()[0].getSettings())
      const video = this.$refs.video
      video.srcObject = mediaStream
      video.setAttribute('playsinline', '')
      video.play()
      await new Promise(resolve => {
        video.onloadedmetadata = resolve
      })
    },

    async scan () {
      const video = this.$refs.video
      // Downscale the image to make it easier for scanning
      const width = video.videoWidth / window.devicePixelRatio
      const height = video.videoHeight / window.devicePixelRatio
      this.canvas.width = width
      this.canvas.height = height
      const ctx = this.canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, width, height)
      const imgData = ctx.getImageData(0, 0, width, height)
      const res = await scanImageData(imgData)

      this.verify(res[0])
      await delay(SCAN_INTERVAL)
      this.scan()
    }
  }
}
</script>
