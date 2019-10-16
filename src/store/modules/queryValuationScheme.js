export default {
  namespaced: true,
  state: {
    // 估值点差方案列表
    valuationSchemeList: [],
    // 人工估值列表
    peopleValuationList: []
  },
  mutations: {
    setValuationSchemeList(state, dataList) {
      state.valuationSchemeList = dataList
    },
    setPeopleValuationList(state, dataList) {
      state.peopleValuationList = dataList
    }
  },
  actions: {}
}
