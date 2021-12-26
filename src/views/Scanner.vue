<template>
  <div id="scanner">
    <Spinner v-if="state === AppState.Loading"/>
    <FullscreenMsg v-if="state === AppState.Errored" :title="error.title" :body="error.body"/>

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
import Spinner from '../components/Spinner.vue'
import FullscreenMsg from '../components/FullscreenMsg.vue'
import Reader from '../components/Reader.vue'
import ReaderFunctions from '../components/ReaderFunctions.vue'
import ProcessingCard from '../components/ProcessingCard.vue'
import { CameraErrCode } from '../lib/camera.js'

const AppState = {
  Loading: 0,
  Errored: 1,
  ReaderAvailable: 2,
  ReaderProcessing: 3
}

const CameraErrorStr = {
  [CameraErrCode.OldBrowser]: {
    title: 'Ваш браузер устарел',
    body: 'Обновите браузер до последней версии и повторите попытку.'
  },
  [CameraErrCode.PermissionDenied]: {
    title: 'Нет доступа к камере',
    body: 'Вы запретили доступ к камере. Для использования приложения разрешите доступ к камере.'
  },
  [CameraErrCode.NoCamera]: {
    title: 'Камера не найдена',
    body: 'На вашем устройстве не найдена камера. Проверьте её подключение и повторите попытку.'
  },
  [CameraErrCode.CameraBusy]: {
    title: 'Камера уже используется',
    body: 'Другое приложение или веб-страница уже использует камеру вашего устройства. Закройте это приложение и повторите попытку.'
  },
  [CameraErrCode.Unknown]: {
    title: 'Ошибка доступа к камере',
    body: 'Не удалось получить доступ к камере из-за неизвестной ошибки. Проверьте подключение камеры и разрешите приложению её использование.'
  }
}

export default {
  components: { Spinner, FullscreenMsg, Reader, ReaderFunctions, ProcessingCard },
  data: () => ({
    AppState,
    state: AppState.Loading,
    error: CameraErrorStr[CameraErrCode.Unknown],
    url: null
  }),

  beforeCreate () {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  },

  methods: {
    onReaderErr (code) {
      this.state = AppState.Errored
      this.error = CameraErrorStr[code]
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
    }
  }
}
</script>
