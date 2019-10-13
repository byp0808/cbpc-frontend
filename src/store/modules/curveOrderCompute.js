export default {
  namespaced: true,
  state: {
    orderId: '',
    taskDay: ''
  },
  mutations: {
    setOrderId(state, orderId) {
      state.orderId = orderId
    },
    setTaskDay(state, taskDay) {
      state.taskDay = taskDay
    }
  },
  actions: {}
}
