<template>
  <div id="onboarding">
    <FullscreenMsg :title="title" :body="body" actionLabel="Далее" @click="onNextClick">
      <div id="onboarding-anim"/>
      <template v-slot:button v-if="isLast">
        <a class="author-link" href="https://m4l3vich.ru/" target="_blank">
          Made with 🖤 and open source
        </a>

        <button @click="onTutorialComplete" class="complete-button" v-if="installPrompt">
          Установить приложение
        </button>
        <button @click="onTutorialComplete" class="complete-button" v-else>
          Открыть без установки
        </button>
      </template>
    </FullscreenMsg>
  </div>
</template>

<style>
#onboarding {
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.complete-button {
  padding: 12px 28px;
  border: none;
  border-radius: 100px;
  width: 100%;

  cursor: pointer;
  transition: opacity 0.2s, background 0.1s;

  color: white;
  background: var(--primary);

  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.complete-button:hover {
  opacity: 0.7;
}

.complete-button:active {
  opacity: 1;
  background: rgba(47, 168, 255, 0.3);
}

.author-link {
  text-decoration: none;
  font-size: 10px;
  text-align: center;
  letter-spacing: 0.05em;
  text-decoration-line: underline;
  text-transform: uppercase;
  color: #000000;
  opacity: 0.5;
}
</style>

<script>
import lottie from 'lottie-web'
import FullscreenMsg from '../components/FullscreenMsg.vue'
import anim from '../assets/anim.json'
import messages from '../lib/onboarding_messages.json'

const ANIM_FRAMERATE = 60
const ANIM_TRANSITION_SEC = 2
const ANIM_LOOP_SEC = 2
const ANIM_TOTAL_SEC = ANIM_TRANSITION_SEC + ANIM_LOOP_SEC

export default {
  components: { FullscreenMsg },

  data: () => ({
    index: 0,
    count: messages.length,
    transition: true,
    anim: null,

    installPrompt: null
  }),

  beforeCreate () {
    delete localStorage.passed
    window.addEventListener('beforeinstallprompt', e => {
      this.installPrompt = e
    })
  },

  async mounted () {
    this.anim = lottie.loadAnimation({
      animationData: anim,
      container: document.getElementById('onboarding-anim'),
      loop: true,
      autoplay: false,
      initialSegment: [
        0, ANIM_TRANSITION_SEC * ANIM_FRAMERATE
      ],

      rendererSettings: {
        filterSize: {
          width: '200%',
          height: '200%',
          x: '-50%',
          y: '-50%'
        }
      }
    })

    this.anim.addEventListener('DOMLoaded', () =>
      setTimeout(() => this.anim.play(), 500)
    )

    this.anim.addEventListener('loopComplete', this.onLoopComplete)
  },

  computed: {
    title () { return messages[this.index].title },
    body () { return messages[this.index].body },
    isLast () { return this.index + 1 === messages.length }
  },

  methods: {
    onNextClick () {
      if (this.transition) return
      this.transition = true
      this.index++

      const start = this.index * ANIM_TOTAL_SEC * ANIM_FRAMERATE
      const end = start + (ANIM_TRANSITION_SEC * ANIM_FRAMERATE)
      this.anim.playSegments([start, end], true)
    },

    async onTutorialComplete () {
      if (this.installPrompt) await this.installPrompt.prompt()

      localStorage.passed = 'true'
      this.$router.push('/scanner')
    },

    onLoopComplete () {
      if (!this.transition) return

      const offset = this.index * ANIM_TOTAL_SEC * ANIM_FRAMERATE
      const start = offset + (ANIM_TRANSITION_SEC * ANIM_FRAMERATE)
      const end = start + (ANIM_LOOP_SEC * ANIM_FRAMERATE)
      this.transition = false
      this.anim.playSegments([start, end], true)
    }
  }
}
</script>
