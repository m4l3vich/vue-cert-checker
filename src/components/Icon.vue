<template>
  <div :class="['mdi', `mdi-${i}`, 'icon', small && 'icon_small', large && 'icon_large', primary && 'icon_primary']"/>
</template>

<style>
.icon {
  font-size: 32px;
  width: 32px;
  height: 32px;
}

.icon.icon_small {
  font-size: 28px;
  width: 28px;
  height: 28px;
}

.icon.icon_large {
  font-size: 64px;
  width: 64px;
  height: 64px;
}

.icon.icon_primary {
  color: var(--primary);
}
</style>

<script>
export default {
  props: { i: String, small: Boolean, large: Boolean, primary: Boolean }
}
</script>
