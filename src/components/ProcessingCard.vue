<template>
  <div class="card">
    <button class="card__dismiss" @click="dismiss">
      <Icon i="clear"/>
    </button>
    <div class="card__container">
    </div>
  </div>
</template>

<style>
.card {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 75%);
}
</style>

<script>
import Icon from './Icon.vue'
import { EpguCertificate } from 'gosuslugi-cert-checker'

const CardState = {
  Dismissed: -1,
  Processing: 0,
  Valid: 1,
  Invalid: 2
}

export default {
  components: { Icon },
  props: { url: String },

  data: () => ({
    state: CardState.Dismissed
  }),

  watch: {
    url (val) {
      if (val) return this.process()
      else return this.dismiss()
    }
  },

  mounted () {
    if (this.url) return this.process()
  },

  methods: {
    async process () {
      const { url } = this

      try {
        const cert = EpguCertificate.fetch(url)
        alert(JSON.stringify(cert))
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
