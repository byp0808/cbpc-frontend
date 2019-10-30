import Vue from 'vue'
import _ from 'lodash'
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
    UPDATE_BUILD(state, data) {
      const curveId = data.curveId
      const curves = state.curveBuildList[curveId]
      Vue.set(state.curveBuildList, curveId, curves.map((value, index) => _.assign(value, data.list[index])))
    }
  },
  actions: {
    initData({ commit }, form) {
      queryCurveYield(form).then(response => {
        commit('SET_BUILD', response)
      })
    },
    updateInitData({ commit }, data) {
      commit('UPDATE_BUILD', data)
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
