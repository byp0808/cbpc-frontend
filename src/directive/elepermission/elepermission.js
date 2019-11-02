import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.roles

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      console.log(el)
      if (!hasPermission) {
        el.disabled = true
        el.style = 'cursor: not-allowed;color: #fff;background-color: #ffc480;border-color: #ffc480'
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
