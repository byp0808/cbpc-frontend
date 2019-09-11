export default {
  namespaced: true,
  state: {
    curveSampleFilterInfo: {},
    curveProductInfo: {}
  },
  mutations: {
    setCurveSampleFilterInfo(state, curveSampleFilterInfo) {
      state.curveSampleFilterInfo = curveSampleFilterInfo
    },
    setCurveProductInfo(state, curveProductInfo) {
      state.curveProductInfo = curveProductInfo
    }
  },
  actions: {}
}
