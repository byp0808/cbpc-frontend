export default {
  namespaced: true,
  state: {
    businessNo: '',
    auditStatus: '',
    taskStatus: '',
    businessName: ''
  },
  mutations: {
    setBusinessNo(state, businessNo) {
      state.businessNo = businessNo
    },
    setAuditStatus(state, auditStatus) {
      state.auditStatus = auditStatus
    },
    setTaskStatus(state, taskStatus) {
      state.taskStatus = taskStatus
    },
    setBusinessName(state, businessName) {
      state.businessName = businessName
    },
    clear(state) {
      state.businessNo = ''
      state.auditStatus = ''
      state.taskName = ''
    }
  },
  actions: {}
}
