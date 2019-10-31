export default {
  namespaced: true,
  state: {
    businessNo: '',
    auditStatus: '',
    taskStatus: '',
    taskName: ''
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
    setTaskName(state, taskName) {
      state.taskName = taskName
    },
    clear(state) {
      state.businessNo = ''
      state.auditStatus = ''
      state.taskName = ''
    }
  },
  actions: {}
}
