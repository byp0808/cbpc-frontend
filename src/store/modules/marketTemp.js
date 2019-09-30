export default {
  namespaced: true,
  state: {
    marketTempInfo: {
    },
    extendColInfo: {

    }
  },
  mutations: {
    setMarketTempInfo(state, marketTempInfo) {
      state.marketTempInfo = marketTempInfo
    },
    setExtendColInfo(state, extendColInfo) {
      state.extendColInfo = extendColInfo
    }
  },
  actions: {
  }
}
