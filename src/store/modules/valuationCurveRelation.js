export default {
  namespaced: true,
  state: {
    targetValue: '',
    relativeValue: ''
  },
  mutations: {
    setCopyRelation(state, { targetValue, relativeValue }) {
      state.targetValue = targetValue
      state.relativeValue = relativeValue
    },
    clearCopyRelation(state) {
      state.targetValue = ''
      state.relativeValue = ''
    }
  },
  actions: {}
}
