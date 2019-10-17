export default {
  namespaced: true,
  state: {
    tempMainId: '',
    opType: '',
    tempMainInfo: {}
  },
  mutations: {
    setOpType(state, tempMainId) {
      state.opType = opType
    },
    setTempMainId(state, tempMainId) {
      state.tempMainId = tempMainId
    },
    setTempMainInfo(state, tempMainInfo) {
      state.tempMainInfo = tempMainInfo
    }
  },
  actions: {}
}
