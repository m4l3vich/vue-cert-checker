<template>
  <div class="cert-type" v-text="typeStr"/>
</template>

<style>
.cert-type {
  font-size: 18px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: black;
  padding: 8px 12px;
  border-radius: 999px;
}
</style>

<script>
const CertType = {
  VACCINE_CERT: 'Сертификат вакцинации',
  COVID_TEST: 'Отрицательный тест',
  ILLNESS_FACT: 'Сертификат о болезни',
  TEMPORARY_CERT: 'Временный сертификат'
}

export default {
  props: { type: String },

  computed: {
    typeStr () { return CertType[this.type] }
  }
}
</script>
