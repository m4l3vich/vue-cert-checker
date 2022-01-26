<template>
  <router-view/>
</template>

<script>
export default {
  created () {
    this.calcHeight()
    window.addEventListener('resize', () => this.calcHeight())
  },

  methods: {
    calcHeight () {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
  }
}
</script>
