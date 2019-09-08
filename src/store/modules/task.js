export default {
  namespaced: true,
  state: {
    businessNo: ''
  },
  mutations: {
    setBusinessNo(state, businessNo) {
      state.businessNo = businessNo
    },
    clear(state) {
      state.businessNo = ''
    }
  },
  actions: {}
}
