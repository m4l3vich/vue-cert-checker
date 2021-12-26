<template>
  <div class="error">
    <slot/>
    <h1 class="error__title" v-text="title"/>
    <h2 class="error__body" v-text="body"/>
    <slot name="button">
      <button class="error__btn" @click="action" v-text="actionLabel"/>
    </slot>
  </div>
</template>

<style>
.error {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error__title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.error__body {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}

.error__btn {
  padding: 8px 28px;
  border: none;
  border-radius: 100px;

  cursor: pointer;
  transition: opacity 0.2s, background 0.1s;

  color: var(--primary);
  background: rgba(47, 168, 255, 0.15);

  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.error__btn:hover {
  opacity: 0.7;
}

.error__btn:active {
  opacity: 1;
  background: rgba(47, 168, 255, 0.3);
}
</style>

<script>
export default {
  props: {
    title: String,
    body: String,
    actionLabel: {
      type: String,
      default: 'Перезапустить'
    },
    action: {
      type: Function,
      default: () => window.location.reload()
    }
  }
}
</script>
