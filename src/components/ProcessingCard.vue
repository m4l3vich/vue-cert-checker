<template>
  <div class="card">
    <div :class="overlayClass"/>

    <button class="card__dismiss" @click="dismiss" v-if="state !== CardState.Dismissed">
      <Icon i="close"/>
    </button>

    <div :class="sheetClass">
      <Spinner small v-if="state === CardState.Processing"/>
      <Icon large v-else :i="cardIcon"/>

      <CertificateType v-if="cert && state === CardState.Valid" :type="cert.type"/>

      <h1 class="card__header" v-if="state === CardState.Processing">
        Проверка...
      </h1>

      <div class="card__multiline" v-if="state === CardState.Valid">
        <h1 class="card__header">
          Дата рождения: {{cert.birthdate.toLocaleDateString()}}
        </h1>
        <h1 class="card__header">
          Паспорт: {{cert.passport.replace(/\*/g, '\u2022')}}
        </h1>
      </div>

      <h1
        class="card__header"
        v-if="state === CardState.Invalid"
        v-text="errorStr"
      />

      <div class="card__multiline" v-if="state === CardState.Warning">
        <h1 class="card__header">Не удалось проверить</h1>
        <h2 class="card__subheader" v-text="errorStr"/>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;

  padding: 24px;
  box-sizing: border-box;
  overflow-y: hidden;
}

.card__overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 75%);

  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.card__overlay-hidden {
  opacity: 0;
}

.card__dismiss {
  background: none;
  border: none;
  color: white;
  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.5));
}

.card__sheet {
  width: 100%;
  border-radius: 16px;

  padding: 24px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  transition: background 0.2s ease-in-out,
              color 0.2s ease-in-out,
              transform 0.5s ease-in-out;

  box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.25),
              0px 2px 12px rgba(0, 0, 0, 0.25),
              0px -12px 32px rgba(0, 0, 0, 0.25);
}

@media screen and (min-width: 600px) {
  .card__sheet {
    width: 400px;
  }
}

.card__sheet_dismissed,
.card__sheet_processing,
.card__sheet_warning {
  color: black;
}

.card__sheet_valid,
.card__sheet_invalid {
  color: white;
}

.card__sheet_dismissed,
.card__sheet_processing {
  background: white;
}

.card__sheet_valid { background: var(--positive) }
.card__sheet_invalid { background: var(--negative) }
.card__sheet_warning { background: var(--warning) }

.card__sheet_dismissed {
  background: transparent;
  transform: translateY(100vh);
}

.card__header {
  font-weight: 500;
  font-size: 20px;
  margin: 0;
}

.card__subheader {
  font-weight: 400;
  font-size: 16px;
  margin: 0;
}

.card__multiline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>

<script>
import CertificateType from './CertificateType.vue'
import Spinner from './Spinner.vue'
import Icon from './Icon.vue'
import { EpguCertificate } from 'gosuslugi-cert-checker/build/index.js'
import * as errors from 'gosuslugi-cert-checker/build/utils/errors.js'

const CardState = {
  Dismissed: Symbol('Dismissed'),
  Processing: Symbol('Processing'),
  Valid: Symbol('Valid'),
  Invalid: Symbol('Invalid'),
  Warning: Symbol('Warning')
}

const cardClass = {
  [CardState.Dismissed]: 'dismissed',
  [CardState.Processing]: 'processing',
  [CardState.Valid]: 'valid',
  [CardState.Invalid]: 'invalid',
  [CardState.Warning]: 'warning'
}

const cardIcon = {
  [CardState.Valid]: 'check',
  [CardState.Invalid]: 'close',
  [CardState.Warning]: 'alert'
}

const errStrings = {
  InvalidStr: 'Некорректный QR-код',
  Expired: 'Истёк срок действия',
  PositiveTest: 'Положительный тест',
  ConnectionErr: 'Проверьте Интернет-соединение.',
  ServiceUnavailable: 'Сервис Госуслуги недоступен.',
  Unknown: 'Произошла неизвестная ошибка.'
}

export default {
  components: { CertificateType, Spinner, Icon },
  props: { url: String },

  data: () => ({
    CardState,
    state: CardState.Dismissed,
    errorStr: null,
    cert: null
  }),

  computed: {
    sheetClass () {
      return `card__sheet card__sheet_${cardClass[this.state]}`
    },
    overlayClass () {
      if (this.state === CardState.Dismissed) return 'card__overlay card__overlay-hidden'
      else return 'card__overlay'
    },
    cardIcon () {
      return cardIcon[this.state]
    }
  },

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
    dismiss () {
      this.state = CardState.Dismissed
      this.errorStr = null
      this.cert = null

      // Let the animation end
      setTimeout(() => this.$emit('dismiss'), 500)
    },

    async process () {
      const { url } = this
      this.state = CardState.Processing

      try {
        this.cert = await EpguCertificate.fetch(url)

        if (this.cert.expired) throw new Error('expired')
        if (!this.cert.status && this.cert.type === 'COVID_TEST') throw new Error('positive_test')
        if (!this.cert.status) throw new Error('status')

        // Dismissed in the middle of processing
        if (this.state === CardState.Dismissed) return
        this.state = CardState.Valid
      } catch (err) {
        console.dir(err)

        this.state = CardState.Invalid
        if (err instanceof errors.InvalidUrlError) {
          this.errorStr = errStrings.InvalidStr; return
        }
        if (err instanceof errors.CertNotFoundError) {
          this.errorStr = errStrings.InvalidStr; return
        }
        if (err.message === 'status') {
          this.errorStr = errStrings.InvalidStr; return
        }
        if (err.message === 'expired') {
          this.errorStr = errStrings.Expired; return
        }
        if (err.message === 'positive_test') {
          this.errorStr = errStrings.PositiveTest; return
        }

        this.state = CardState.Warning
        if (err instanceof errors.EpguApiInternalError) {
          this.errorStr = errStrings.ServiceUnavailable; return
        }
        if (err.isAxiosError) {
          this.errorStr = errStrings.ConnectionErr; return
        }

        this.errorStr = errStrings.Unknown
      }
    }
  }
}
</script>
