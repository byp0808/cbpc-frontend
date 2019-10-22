import { queryCurveYield, saveCurveBuild, resetBuild } from '@/api/curve/curve-build'
export default {
  namespaced: true,
  state: {
    curveBuildList: {},
    curveChartsList: {}
  },
  mutations: {
    setBuild(state, data) {
      const curveId = data.curveId
      state.curveBuildList[curveId] = data.solutions
      state.curveChartsList[curveId] = data.yields
    },
    updateBuild(state, list, curveId) {
      const curves = state.curveBuildList[curveId]
      const result = curves.map((value, index) => [...value, ...list[index]])
      state.curveBuildList[curveId] = result
    }
  },
  actions: {
    initData({ commit }, form) {
      queryCurveYield(form).then(response => {
        commit('setBuild', response)
      })
    },
    updateInitData({ commit }, list, curveId) {
      commit('updateBuild', list, curveId)
    },
    updateData({ commit }, list) {
      saveCurveBuild(list).then(response => {
        commit('setBuild', response)
      })
    },
    resetData({ commit }, form, callback) {
      resetBuild(form).then(response => {
        commit('setBuild', response)
        callback()
      })
    }
  }
}
