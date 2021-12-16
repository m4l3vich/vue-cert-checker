<template>
  <div id="app">
    <Spinner v-if="state === AppState.Loading"/>
    <Error v-if="state === AppState.Errored" :title="error.title" :subtitle="error.subtitle"/>

    <Reader
      :doScan="state === AppState.ReaderAvailable"
      v-show="state === AppState.ReaderAvailable || state === AppState.ReaderProcessing"
      @initError="onReaderErr"
      @initSuccess="onReaderInit"
      @read="onRead"
    >
      <ReaderFunctions v-if="state === AppState.ReaderAvailable"/>
      <ProcessingCard v-if="state === AppState.ReaderProcessing" @dismiss="onCardDismiss" :url="url"/>
    </Reader>
  </div>
</template>

<style>
#app {
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
import Spinner from './components/Spinner.vue'
import Error from './components/Error.vue'
import Reader from './components/Reader.vue'
import ReaderFunctions from './components/ReaderFunctions.vue'
import ProcessingCard from './components/ProcessingCard.vue'
import './index.css'

const AppState = {
  Loading: 0,
  Errored: 1,
  ReaderAvailable: 2,
  ReaderProcessing: 3
}

export default {
  components: { Spinner, Error, Reader, ReaderFunctions, ProcessingCard },
  data: () => ({
    AppState,
    state: AppState.Loading,
    error: {
      title: 'Ошибка доступа к камере',
      subtitle: 'Не удалось получить доступ к камере. Проверьте подключение камеры и разрешите приложению её использование.'
    },
    url: null
  }),

  beforeCreate () {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  },

  methods: {
    onReaderErr () {
      this.state = AppState.Errored
    },

    onReaderInit () {
      this.state = AppState.ReaderAvailable
    },

    async onRead (url) {
      this.state = AppState.ReaderProcessing
      this.url = url
    },

    onCardDismiss () {
      this.state = AppState.ReaderAvailable
      this.url = null
    }
  }
}
</script>
