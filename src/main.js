import Vue from 'vue'
import App from './App.vue'
import { router } from './lib/router'
import './registerServiceWorker'

Vue.config.productionTip = false

function isStandalone () {
  return (window.matchMedia('(display-mode: standalone)').matches)
}

function isTutorialPassed () {
  return localStorage.passed === 'true'
}

router.beforeEach((to, from, next) => {
  if (to.path === '/scanner' && (!isStandalone() || !isTutorialPassed())) return next('/')
  return next()
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
