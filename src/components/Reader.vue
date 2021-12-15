<template>
  <video ref="video"/>
</template>

<script>
import { scanImageData } from 'zbar.wasm'
const SCAN_INTERVAL = 500

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  data: () => ({
    canvas: document.createElement('canvas')
  }),

  async mounted () {
    try {
      await this.init()
      this.scan()
    } catch (err) {
      // TODO
      console.error(err)
    }
  },

  methods: {
    async init () {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
          width: { max: 640 },
          height: { max: 640 }
        }
      })
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
      const width = video.videoWidth
      const height = video.videoHeight
      this.canvas.width = width
      this.canvas.height = height
      const ctx = this.canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, width, height)
      const imgData = ctx.getImageData(0, 0, width, height)
      const res = await scanImageData(imgData)

      // TODO
      console.log(res)
      await delay(SCAN_INTERVAL)
      this.scan()
    }
  }
}
</script>
