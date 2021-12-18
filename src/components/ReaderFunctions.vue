<template>
  <div class="fns">
    <div :class="containerClass">
      <button class="fns__btn-flash" @click="switchFlash">
        <Icon v-if="flash" small i="flash-off" primary/>
        <Icon v-else small i="flash"/>
      </button>
      <div class="fns__separator"/>
      <button class="fns__btn-fullscreen" @click="switchFullscreen">
        <Icon v-if="fullscreen" small i="arrow-collapse"/>
        <Icon v-else small i="arrow-expand"/>
      </button>
    </div>
  </div>
</template>

<style>
.fns {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  padding: 16px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.fns__btns-container {
  display: flex;
  align-items: center;
  z-index: 1;

  overflow: hidden;
  border-radius: 99px;

  transform: translateY(0px);
  transition: transform 0.3s ease-in-out;

  background: white;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.25),
              0px 4px 28px rgba(0, 0, 0, 0.25);
}

.fns__btns-container_hidden {
  transform: translateY(100px);
}

.fns__btn-flash, .fns__btn-fullscreen {
  display: flex;
  justify-content: center;
  align-items: center;

  background: none;
  border: none;
  padding: 12px 36px;

  cursor: pointer;
}

.fns__separator {
  height: 32px;
  width: 1px;
  background: rgba(0, 0, 0, 0.5);
}
</style>

<script>
import Icon from './Icon.vue'

export default {
  components: { Icon },
  props: { show: Boolean },

  data: () => ({
    flash: false,
    fullscreen: !!document.fullscreenElement
  }),

  computed: {
    containerClass () {
      if (this.show) return 'fns__btns-container'
      else return 'fns__btns-container fns__btns-container_hidden'
    }
  },

  methods: {
    switchFullscreen () {
      const el = document.documentElement

      if (this.fullscreen) document.exitFullscreen()
      else el.requestFullscreen()
    },

    switchFlash () {
      this.flash = !this.flash

      this.track.applyConstraints({
        advanced: [{ torch: this.flash }]
      })
    },

    onFullscreenChange () {
      this.fullscreen = !!document.fullscreenElement
    }
  },

  beforeDestroy () {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange)
  },

  async created () {
    document.addEventListener('fullscreenchange', this.onFullscreenChange)

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
        width: { max: 1 },
        height: { max: 1 }
      }
    })

    this.track = mediaStream.getVideoTracks()[0]
  }
}
</script>
