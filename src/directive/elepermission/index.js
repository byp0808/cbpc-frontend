import elepermission from './elepermission'

const install = function(Vue) {
  Vue.directive('elepermission', elepermission)
}

if (window.Vue) {
  window['elepermission'] = elepermission
  Vue.use(install); // eslint-disable-line
}

elepermission.install = install
export default elepermission
