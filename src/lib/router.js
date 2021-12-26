import Vue from 'vue'
import VueRouter from 'vue-router'

import Onboarding from '../views/Onboarding.vue'
import Scanner from '../views/Scanner.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/', component: Onboarding },
  { path: '/scanner', component: Scanner }
]

export const router = new VueRouter({ routes })
