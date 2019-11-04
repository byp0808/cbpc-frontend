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
    },
    defaultSchemeInfo: {
      bondId: '',
      curveId: '',
      valuScene: '01',
      marketGrade: '',
      cdsPremAdjType: '01',
      cdsPremAdjWay: '01',
      recoDire: '01'
    },
    marketInfo: {
      dPrice: '',
      ttmValue: '',
      cPrice: '',
      yield: '',
      ttmType: ''
    },
    dialogInfo: {
      closeDialog: false
    },
    adjustList: []
  },
  mutations: {
    setSchemeInfo(state, schemeInfo) {
      state.schemeInfo = schemeInfo
    },
    setCloseDialog(state, dialogInfo) {
      state.dialogInfo = dialogInfo
    },
    setDefaultSchemeInfo(state, defaultSchemeInfo) {
      state.defaultSchemeInfo = defaultSchemeInfo
    },
    setMarketInfo(state, marketInfo) {
      state.marketInfo = marketInfo
    },
    setAdjustList(state, adjustList) {
      state.adjustList = adjustList
    },
    clearSchemeInfo(state) {
      state.schemeInfo = state.defaultSchemeInfo
    },
    clearMarketInfo(state) {
      state.marketInfo = {
        dPrice: '',
        ttmValue: '',
        cPrice: '',
        yield: ''
      }
    },
    clearAdjustList(state) {
      state.adjustList = []
    }
  },
  actions: {
    initScheme({ commit }, taskInfo) {
      taskScheme(taskInfo.taskId).then(response => {
        commit('setSchemeInfo', response)
        commit('setDefaultSchemeInfo', response)
      })
    }
  }
}
