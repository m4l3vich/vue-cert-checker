<template>
  <svg class="spinner" v-if="small" width="50" height="50">
    <path d="M0-24A24 24 0 1024 0" stroke-width="5"/>
  </svg>
  <svg class="spinner" v-else width="100" height="100">
    <path d="M0-48A48 48 90 1048 0" stroke-width="8"/>
  </svg>
</template>

<style>
.spinner > path {
  animation: spin 1s linear infinite;
  fill: none;
  stroke: var(--primary);
  stroke-linecap: round;
}

@keyframes spin {
  from { transform: translate(50%, 50%) rotate(0deg) scale(0.9) }
  to { transform: translate(50%, 50%) rotate(360deg) scale(0.9) }
}
</style>

<script>
export default {
  props: { small: Boolean }
}
</script>
