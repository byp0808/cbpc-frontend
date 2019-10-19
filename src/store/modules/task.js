export default {
  namespaced: true,
  state: {
    businessNo: '',
    auditStatus: ''
  },
  mutations: {
    setBusinessNo(state, businessNo) {
      state.businessNo = businessNo
    },
    setAuditStatus(state, auditStatus) {
      state.auditStatus = auditStatus
    },
    clear(state) {
      state.businessNo = ''
      state.auditStatus = ''
    }
  },
  actions: {}
}
