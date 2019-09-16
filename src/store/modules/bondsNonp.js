export default {
  namespaced: true,
  state: {
    bondsNonpInfo: {
      bondsConceptType: '',
      bondsShortName: '',
      bondsIssuer: ''
    }
  },
  mutations: {
    setBondsNonpInfo(state, bondsNonpInfo) {
      state.bondsNonpInfo = bondsNonpInfo
    },
    setBondsAttrInfo(state, { bondsConceptType, bondsShortName, bondsIssuer }) {
      state.bondsNonpInfo.bondsConceptType = bondsConceptType
      state.bondsNonpInfo.bondsShortName = bondsShortName
      state.bondsNonpInfo.bondsIssuer = bondsIssuer
    }
  },
  actions: {
  }
}
