<template>
  <router-view/>
</template>

<script>
export default {
  beforeCreate () {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
}
</script>
