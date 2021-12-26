<template>
  <div id="onboarding">
    <FullscreenMsg :title="title" :body="body">
      <template v-slot:button>
        <button @click="onTutorialComplete" class="complete-button">
          Открыть сканер
        </button>
      </template>
    </FullscreenMsg>
  </div>
</template>

<style>
#onboarding {
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.complete-button {
  padding: 8px 28px;
  border: none;
  border-radius: 100px;

  cursor: pointer;
  transition: opacity 0.2s, background 0.1s;

  color: white;
  background: var(--primary);

  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.complete-button:hover {
  opacity: 0.7;
}

.complete-button:active {
  opacity: 1;
  background: rgba(47, 168, 255, 0.3);
}
</style>

<script>
import FullscreenMsg from '../components/FullscreenMsg.vue'

const messages = [{
  title: 'Отсканируйте QR-код',
  body: 'Наведите камеру на QR-код сертификата для начала проверки.'
}, {
  title: 'Подождите',
  body: 'Приложение проверит корректность QR-кода, а также запросит информацию о сертификате из Госуслуг. Это занимает несколько секунд.'
}, {
  title: 'Корректный сертификат',
  body: 'Если сертификат корректен, цвет карточки изменится на зелёный, а также будет отображена информация о владельце сертификата (дата рождения и часть номера паспорта)'
}, {
  title: 'Некорректный сертификат',
  body: 'Если сертификат некорректен (истёк срок действия, сертификат не существует) или QR-код не содержит данных о сертификате, цвет карточки изменится на красный, а также будет отображена информация об ошибке.'
}, {
  title: 'Ошибка при проверке',
  body: 'Если при проверке возникнет ошибка, не связанная с сертификатом, цвет карточки станет оранжевым, а также будет показана причина возникновения ошибки.'
}, {
  title: 'Сканер сертификатов',
  body: 'Это приложение является открытым решением для проверки сертификатов COVID-19 и никаким образом не связано с Госуслугами.'
}]

export default {
  components: { FullscreenMsg },

  data: () => ({
    index: 0
  }),

  beforeCreate () {
    if (localStorage.tutorial === 'passed') return this.$router.push('/scanner')
  },

  computed: {
    title () { return messages[this.index].title },
    body () { return messages[this.index].body }
  },

  methods: {
    onTutorialComplete () {
      localStorage.tutorial = 'passed'
      this.$router.push('/scanner')
    }
  }
}
</script>
