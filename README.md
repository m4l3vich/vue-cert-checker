<center>
  <img src="app_icon.png" alt="Иконка приложения" width="256">
  <h1>Сканер сертификатов</h1>
  <p>
  Открытое веб-приложение для проверки сертификатов COVID-19, сгенерированных Госуслугами.
  </p>

  <a href="https://web.dev/progressive-web-apps/" target="_blank">
    <img alt="Progressive Web Application" src="https://img.shields.io/badge/PWA-5A0FC8?logo=pwa">
  </a>
  <a href="https://vuejs.org/" target="_blank">
    <img alt="Vue.js 2" src="https://img.shields.io/badge/Vue.js%202-4FC08D?logo=vue.js&logoColor=white">
  </a>
  <a href="https://standardjs.com" target="_blank">
    <img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  </a>
</center>

Последняя версия приложения всегда доступна здесь: https://qrcode.m4l3vich.ru   
Макет интерфейса в Figma: https://www.figma.com/file/a9uER6ADHqwp2GmsyqmrX9/CertChecker

Для проверки сертификатов используется модуль `gosuslugi-cert-checker` ([GitHub](https://github.com/m4l3vich/gosuslugi-cert-checker), [NPM](https://npmjs.org/package/gosuslugi-cert-checker))

## Установка зависимостей
Yarn (рекомендуется):
```
yarn
```

NPM:
```
npm install
```

### Запуск devserver с hot-reload
Yarn (рекомендуется):
```
yarn serve
```

NPM:
```
npm run serve
```

### Компиляция для production-окружения
Yarn (рекомендуется):
```
yarn build
```

NPM:
```
npm run build
```
