import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export function getLocale() {
  return navigator.language || navigator.userLanguage
}

export function getLang() {
  return getLocale().substr(0, 2)
}
