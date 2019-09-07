
export default {
  namespaced: true,
  state: {
    bondFilterId: ''
  },
  mutations: {
    setBondFilterId(state, bondFilterId) {
      state.bondFilterId = bondFilterId
    },
    clearBondFilterId(state) {
      state.bondFilterId = ''
    }
  },
  actions: {}
}
