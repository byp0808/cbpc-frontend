import { taskScheme } from '@/api/valuation/scheme.js'
export default {
  namespaced: true,
  state: {
    schemeInfo: {
      bondId: '',
      curveId: '',
      valuScene: '01',
      marketGrade: '',
      cdsPremAdjType: '01',
      cdsPremAdjWay: '01',
      recoDire: '01'
    }
  },
  mutations: {
    setSchemeInfo(state, schemeInfo) {
      state.schemeInfo = schemeInfo
    },
    clearSchemeInfo(state) {
      state.bondFilterId = {
        bondId: '',
        curveId: '',
        valuScene: '01',
        marketGrade: '',
        cdsPremAdjType: '01',
        cdsPremAdjWay: '01',
        recoDire: '01'
      }
    }
  },
  actions: {
    initScheme({ commit }, taskInfo) {
      taskScheme(taskInfo.taskId).then(response => {
        commit('setSchemeInfo', response)
      })
    }
  }
}
