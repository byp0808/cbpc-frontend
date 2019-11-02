import Vue from 'vue'
import _ from 'lodash'
import { queryCurveYield, resetBuild, saveCurveBuild, confirmBuild, refundBuild, lockBuild } from '@/api/curve/curve-build'

export default {
  namespaced: true,
  state: {
    curveBuildList: {},
    curveChartsList: {},
    curveStatus: {}
  },
  mutations: {
    SET_BUILD(state, data) {
      const curveId = data.curveId
      Vue.set(state.curveBuildList, curveId, data.solutions)
      Vue.set(state.curveChartsList, curveId, data.yields)
      Vue.set(state.curveStatus, curveId, { confirm: data.confirmStatus, lock: data.lockStatus })
    },
    UPDATE_BUILD(state, data) {
      const curveId = data.curveId
      const curves = state.curveBuildList[curveId]
      Vue.set(state.curveBuildList, curveId, curves.map((value, index) => _.assign(value, data.list[index])))
    },
    UPDATE_STATUS(state, data) {
      const curveId = data.curveId
      const _old = state.curveStatus[curveId]
      const _new = _.merge(_old, data.change)
      Vue.set(state.curveStatus, curveId, _new)
    },
    UPDATE_VARIATION(state, data) {
      const curveId = data.curveId
      const _old = state.curveBuildList[curveId]
      const _new = _old.map(el => {
        return _.merge(el, { historyDivision: data.map[el.standSlip] })
      })
      Vue.set(state.curveBuildList, curveId, _new)
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
    resetData({ commit }, data) {
      resetBuild({
        curveId: data.curveId,
        orderId: data.orderId,
        curveOrderId: data.curveOrderId,
        curveTaskId: data.curveTaskId
      }).then(response => {
        commit('SET_BUILD', response)
        data.callback()
      })
    },
    confirmData({ commit }, data) {
      confirmBuild({
        curveId: data.curveId,
        orderId: data.orderId,
        curveOrderId: data.curveOrderId,
        curveTaskId: data.curveTaskId
      }).then(response => {
        commit('UPDATE_STATUS', {
          curveId: data.curveId,
          change: { confirm: true }
        })
        data.callback()
      })
    },
    refundData({ commit }, data) {
      refundBuild({
        curveId: data.curveId,
        orderId: data.orderId,
        curveOrderId: data.curveOrderId,
        curveTaskId: data.curveTaskId
      }).then(response => {
        commit('UPDATE_STATUS', {
          curveId: data.curveId,
          change: { confirm: false }
        })
        data.callback()
      })
    },
    lockData({ commit }, data) {
      lockBuild({
        curveId: data.curveId,
        orderId: data.orderId,
        curveOrderId: data.curveOrderId,
        curveTaskId: data.curveTaskId
      }).then(response => {
        commit('UPDATE_STATUS', {
          curveId: data.curveId,
          change: { lock: data.lock }
        })
      })
    },
    updateVariation({ commit }, map) {
      commit('UPDATE_VARIATION', map)
    }
  }
}
