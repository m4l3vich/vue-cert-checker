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
const SCAN_INTERVAL = 1000

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  props: { doScan: Boolean },

  data: () => ({
    ctx: null,
    dimensions: {
      aspectRatio: window.screen.width / window.screen.height,
      physical: {
        width: window.screen.width * window.devicePixelRatio,
        height: window.screen.height * window.devicePixelRatio
      },
      logical: {
        width: window.screen.width,
        height: window.screen.height
      }
    }
  }),

  async created () {
    const canvas = document.createElement('canvas')
    canvas.width = this.dimensions.logical.width
    canvas.height = this.dimensions.logical.height

    this.ctx = canvas.getContext('2d')

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
      if (!this.doScan) return
      this.$emit('read', obj.decode())
    },

    async init () {
      const constraints = {
        facingMode: 'environment',
        width: { ideal: this.dimensions.physical.width },
        height: { ideal: this.dimensions.physical.height }
      }

      // Weird stuff but it works
      if (this.dimensions.aspectRatio < 1) {
        constraints.width.ideal = this.dimensions.physical.height
        constraints.height.ideal = this.dimensions.physical.width
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
      while (true) {
        const video = this.$refs.video
        const { width, height } = this.dimensions.logical

        this.ctx.drawImage(video, 0, 0, width, height)
        const imgData = this.ctx.getImageData(0, 0, width, height)
        const res = await scanImageData(imgData)

        this.verify(res[0])
        await delay(SCAN_INTERVAL)
      }
    }
  }
}
</script>
