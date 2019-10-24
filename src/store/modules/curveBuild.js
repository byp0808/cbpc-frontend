import Vue from 'vue'
import { queryCurveYield, resetBuild, saveCurveBuild } from '@/api/curve/curve-build'

export default {
  namespaced: true,
  state: {
    curveBuildList: {},
    curveChartsList: {}
  },
  mutations: {
    SET_BUILD(state, data) {
      const curveId = data.curveId
      Vue.set(state.curveBuildList, curveId, data.solutions)
      Vue.set(state.curveChartsList, curveId, data.yields)
    },
    UPDATE_BUILD(state, list, curveId) {
      const curves = state.curveBuildList[curveId]
      Vue.set(state.curveBuildList, curveId, curves.map((value, index) => [...value, ...list[index]]))
    }
  },
  actions: {
    initData({ commit }, form) {
      queryCurveYield(form).then(response => {
        commit('SET_BUILD', response)
      })
    },
    updateInitData({ commit }, list, curveId) {
      commit('UPDATE_BUILD', list, curveId)
    },
    updateData({ commit }, list) {
      saveCurveBuild(list).then(response => {
        commit('SET_BUILD', response)
      })
    },
    resetData({ commit }, form, callback) {
      resetBuild(form).then(response => {
        commit('SET_BUILD', response)
        callback()
      })
    }
  }
}
