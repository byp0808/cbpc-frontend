export default {
  namespaced: true,
  state: {
    marketTempInfo: {
    },
    extendColInfo: {
    },
    colData: {}
  },
  mutations: {
    setMarketTempInfo(state, marketTempInfo) {
      state.marketTempInfo = marketTempInfo
    },
    setExtendColInfo(state, extendColInfo) {
      state.extendColInfo = extendColInfo
    },
    setColData(state, colData) {
      state.colData = colData
    }
  },
  actions: {
  }
}
