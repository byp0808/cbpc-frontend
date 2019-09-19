export default {
  namespaced: true,
  state: {
    taskRangeId: ''
  },
  mutations: {
    setTaskRangeId(state, { taskRangeId }) {
      state.taskRangeId = taskRangeId
    },
    clear(state) {
      state.taskRangeId = ''
    }
  },
  actions: {}
}
