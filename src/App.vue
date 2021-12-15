<template>
  <div id="app">
    <Spinner v-if="state === AppState.Loading"/>
    <Error v-if="state === AppState.Errored" :title="error.title" :subtitle="error.subtitle"/>
  </div>
</template>

<style>
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import Spinner from './components/Spinner.vue'
import Error from './components/Error.vue'
import './index.css'

const AppState = {
  Loading: 0,
  Errored: 1,
  ReaderAvailable: 2,
  ReaderProcessing: 3
}

export default {
  components: { Spinner, Error },
  data: () => ({
    AppState,
    state: AppState.Loading,
    error: { title: '', subtitle: '' }
  })
}
</script>
