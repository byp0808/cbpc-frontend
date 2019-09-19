import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import VCalendar from 'v-calendar'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import _ from 'lodash'
import moment from 'moment'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  // mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.use(VCalendar, {
  locale: 'zh-CN',
  firstDayOfWeek: 2
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Object.defineProperty(Vue.prototype, '$lodash', { value: _ })
Object.defineProperty(Vue.prototype, '$moment', { value: moment })

Vue.config.productionTip = false

// ------------------------------------------------------------------------------------------------------------------->
const cloudOn = true
if (process.env.NODE_ENV === 'production') {
  // do nothing
} else {
  sessionStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjgyMDEzNTAsInVzZXJJZCI6ImFkbWluIiwib3JnSWQiOiIwMDAwMSIsInVzZXJuYW1lIjoi566h55CG5ZGYIn0.nDO2L6DjpiTZO6hCmLuL1BbZi-GNnej1Cqvp-wIi2bM')
  mockXHR()
}

const token = sessionStorage.getItem('token')
if (!token) {
  window.location = '/'
}

import { getLang } from './utils/i18n'
import VueI18n from 'vue-i18n'
import { getLanguagePack, getDicts } from './api/resources'
const messages = {}
let dictJob, i18nJob
if (cloudOn) {
  dictJob = new Promise((resolve, reject) => {
    getDicts().then((data) => {
      messages[getLang()] = _.assignIn(messages[getLang()], { dicts: data })
      resolve()
    })
  })
  i18nJob = new Promise((resolve, reject) => {
    getLanguagePack().then((response) => {
      messages[getLang()] = _.assignIn(messages[getLang()], response.data)
      resolve()
    })
  })
} else {
  dictJob = new Promise((resolve, reject) => {
    messages[getLang()] = _.assignIn(messages[getLang()], { dict: {}})
    resolve()
  })
  i18nJob = new Promise((resolve, reject) => {
    messages[getLang()] = _.assignIn(messages[getLang()], {
      'mymessage': '我的消息'
    })
    resolve()
  })
}
Promise.all([i18nJob, dictJob]).then((result) => {
  const i18n = new VueI18n({
    locale: getLang(),
    messages
  })
  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
  })
}).catch((error) => {
  console.log(error)
})
