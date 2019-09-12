import { queryBasicProdIndex, queryValuationWay, queryBatches } from '@/api/valuation/prod.js'
export default {
  namespaced: true,
  state: {
    prodId: '',
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
    clear(state) {
      state.prodId = ''
      state.prodInfo = {}
      state.prodIndices.basicIndices = []
      state.prodIndices.basicIndicesResult = []
      state.prodIndices.compIndices = []
      state.prodIndices.compIndicesResult = []
      state.valuationWay.dataList = []
      state.valuationWay.results = []
      state.batchIndices.batches = []
      state.batchIndices.batchesChoice = []
      state.batchIndices.batchProdIndices = []
      state.confirm = {}
    },
    setProdId(state, prodId) {
      state.prodId = prodId
    },
    setProdInfo(state, prodInfo) {
      state.prodInfo = prodInfo
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
    loadProdIndices({ commit }, disable) {
      queryBasicProdIndex().then(response => {
        const { basicIndices, compIndices } = response
        for (const basicIndex in basicIndices) {
          basicIndices[basicIndex].disabled = disable
        }
        for (const compIndex in compIndices) {
          compIndices[compIndex].disabled = disable
        }

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
