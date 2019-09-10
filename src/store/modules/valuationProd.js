import { queryBasicProdIndex, queryValuationWay, queryBatches } from '@/api/valuation/prod.js'
export default {
  namespaced: true,
  state: {
    prodInfo: {
    },
    bondFilter: {},
    prodIndices: {
      basicIndices: [],
      basicIndicesResult: [],
      compIndices: [],
      compIndicesResult: []
    },
    valuationWay: {
      dataList: [],
      results: []
    },
    batchIndices: {
      batches: [],
      batchesChoice: [],
      batchProdIndices: {}
    },
    confirm: {}
  },
  mutations: {
    setProdInfo(state, prodInfo) {
      state.setProdInfo = prodInfo
    },
    setProdIndices(state, { basicIndices, basicIndicesResult, compIndices, compIndicesResult }) {
      if (basicIndices) state.prodIndices.basicIndices = basicIndices
      if (basicIndicesResult) state.prodIndices.basicIndicesResult = basicIndicesResult
      if (compIndices) state.prodIndices.compIndices = compIndices
      if (compIndicesResult) state.prodIndices.compIndicesResult = compIndicesResult
    },
    setValuationWay(state, { dataList, results }) {
      if (dataList) state.valuationWay.dataList = dataList
      if (results) state.valuationWay.results = results
    },
    setBatchIndices(state, { batches, batchesChoice }) {
      if (batches) state.batchIndices.batches = batches
      if (batchesChoice) state.batchIndices.batchesChoice = batchesChoice
    },
    setBatchProdIndices(state, { batchId, prodIndices }) {
      state.batchIndices.batchProdIndices[batchId] = prodIndices
    }
  },
  actions: {
    loadProdIndices({ commit }) {
      queryBasicProdIndex().then(response => {
        const { basicIndices, compIndices } = response
        commit('setProdIndices', { basicIndices: basicIndices, compIndices: compIndices })
      })
    },
    loadValuationWay({ commit }) {
      queryValuationWay().then(response => {
        const { datalist } = response
        commit('setValuationWay', { dataList: datalist })
      })
    },
    loadBatches({ commit }) {
      queryBatches().then(response => {
        const { datalist } = response
        commit('setBatchIndices', { batches: datalist })
      })
    }
  }
}
