export default {
  namespaced: true,
  state: {
    businessNo: '',
    auditStatus: '',
    taskStatus: ''
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
    clear(state) {
      state.businessNo = ''
      state.auditStatus = ''
    }
  },
  actions: {}
}
