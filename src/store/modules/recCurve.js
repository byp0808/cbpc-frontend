import { queryRecCurve } from '@/api/valuation/rec-curve.js'
export default {
  namespaced: true,
  state: {
    recCurveInfo: {
    }
  },
  mutations: {
    setRecCurveInfo(state, recCurveInfo) {
      state.recCurveInfo = recCurveInfo
    }
  },
  actions: {
    copyCurveInfo({ commit }, businessId) {
      queryRecCurve(this.businessId).then(reponse => {
        reponse.id = ''
        commit('setRecCurveInfo', reponse)
        // this.$store.commit('bondFilter/setBondFilterId', reponse.bondFilterId)
      })
    }
  }
}
