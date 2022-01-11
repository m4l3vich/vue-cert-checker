<template>
  <div id="scanner">
    <Spinner v-if="state === AppState.Loading"/>
    <FullscreenMsg v-if="state === AppState.Errored" :title="error.title" :body="error.body" @click="onReload">
      <div id="camera-error-anim"/>
    </FullscreenMsg>

    <Reader
      v-if="state !== AppState.Errored"
      :doScan="state === AppState.ReaderAvailable"
      @initError="onReaderErr"
      @initSuccess="onReaderInit"
      @read="onRead"
    >
      <template v-if="state === AppState.ReaderAvailable || state === AppState.ReaderProcessing">
        <ReaderFunctions :show="state === AppState.ReaderAvailable"/>
        <ProcessingCard @dismiss="onCardDismiss" :url="url"/>
      </template>
    </Reader>
  </div>
</template>

<style>
#scanner {
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import lottie from 'lottie-web'
import animationData from '../assets/camera-error.json'
import Spinner from '../components/Spinner.vue'
import FullscreenMsg from '../components/FullscreenMsg.vue'
import Reader from '../components/Reader.vue'
import ReaderFunctions from '../components/ReaderFunctions.vue'
import ProcessingCard from '../components/ProcessingCard.vue'
import { CameraErrCode, CameraErrorStr } from '../lib/camera.js'

const ANIM_FRAMERATE = 60
const ANIM_TRANSITION_SEC = 2
const ANIM_LOOP_SEC = 2
const ANIM_TOTAL_SEC = ANIM_TRANSITION_SEC + ANIM_LOOP_SEC

const AppState = {
  Loading: 0,
  Errored: 1,
  ReaderAvailable: 2,
  ReaderProcessing: 3
}

export default {
  components: { Spinner, FullscreenMsg, Reader, ReaderFunctions, ProcessingCard },
  data: () => ({
    AppState,
    state: AppState.Loading,
    error: CameraErrorStr[CameraErrCode.Unknown],
    url: null
  }),

  methods: {
    async onReaderErr (code) {
      this.state = AppState.Errored
      this.error = CameraErrorStr[code]

      await this.$nextTick()
      const anim = lottie.loadAnimation({
        container: document.getElementById('camera-error-anim'),
        animationData,
        loop: true,
        autoplay: false,
        initialSegment: [
          0, ANIM_TRANSITION_SEC * ANIM_FRAMERATE
        ]
      })

      let transition = true

      anim.addEventListener('DOMLoaded', () =>
        setTimeout(() => anim.play(), 500)
      )

      anim.addEventListener('loopComplete', () => {
        if (!transition) return
        transition = false
        anim.playSegments([
          ANIM_TRANSITION_SEC * ANIM_FRAMERATE,
          ANIM_TOTAL_SEC * ANIM_FRAMERATE
        ], true)
      })
    },

    onReaderInit () {
      this.state = AppState.ReaderAvailable
    },

    async onRead (url) {
      this.state = AppState.ReaderProcessing
      this.$nextTick(() => { this.url = url })
    },

    onCardDismiss () {
      this.state = AppState.ReaderAvailable
      this.url = null
    },

    onReload () {
      window.location.reload()
    }
  }
}
</script>
