import { queryBasicProdIndex, queryValuationWay, queryBatches } from '@/api/valuation/prod.js'
export default {
  namespaced: true,
  state: {
    prodId: '',
    parentFilterId: '',
    prodBasicInfo: {
      prdBaseId: '',
      prdGrpId: '',
      prdLineId: ''
    },
    prodInfo: {
      prodStatus: '',
      currency: []
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
      state.prodInfo = {
        prodStatus: '',
        currency: []
      }
      state.prodIndices.basicIndices = []
      state.prodIndices.basicIndicesResult = []
      state.prodIndices.compIndices = []
      state.prodIndices.compIndicesResult = []
      state.valuationWay.dataList = []
      state.valuationWay.results = []
      state.batchIndices.batches = []
      state.batchIndices.batchesChoice = []
      state.batchIndices.batchProdIndices = {}
      state.confirm = {}
    },
    setProdId(state, prodId) {
      state.prodId = prodId
    },
    setParentFilterId(state, parentFilterId) {
      state.parentFilterId = parentFilterId
    },
    setProdInfo(state, prodInfo) {
      state.prodInfo = prodInfo
    },
    setProdBasicInfo(state, prodBasicInfo) {
      state.prodBasicInfo = prodBasicInfo
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
    setBatchProdIndices(state, prodIndices) {
      state.batchIndices.batchProdIndices = prodIndices
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
      queryBatches({ basePrd: '01' }).then(response => {
        // const { datalist } = response
        commit('setBatchIndices', { batches: response })
      })
    }
  }
}
