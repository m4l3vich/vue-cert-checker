<template>
  <div class="error">
    <slot/>
    <h1 class="error__title" v-text="title"/>
    <p class="error__body" v-text="body"/>
    <slot name="button">
      <button class="error__btn" @click="e => $emit('click', e)" v-text="actionLabel"/>
    </slot>
  </div>
</template>

<style>
@media screen and (max-width: 600px) {
  .error {
    width: 100vw;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }
}

@media screen and (min-width: 600px) {
  .error {
    width: 500px;
    height: min(100vh, 600px);
    height: min(calc(var(--vh, 1vh) * 100), 600px);
    margin: auto;
  }
}

.error {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.error__title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.error__body {
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  flex: 1 0 auto;
  margin: 0;
  white-space: pre-wrap;
}

.error__btn {
  padding: 12px 28px;
  border: none;
  border-radius: 100px;
  width: 100%;

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
    }
  }
}
</script>
