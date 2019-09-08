import { queryTaskList } from '@/api/common/task.js'
export default {
  namespaced: true,
  state: {
    todoInfo: {
      dataList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  mutations: {
    setTodoList(state, todoList) {
      state.todoInfo.dataList = todoList
    },
    setPage(state, page) {
      state.todoInfo.page = page
    }
  },
  actions: {
    queryTaskList({ commit, state }) {
      queryTaskList({ page: state.todoInfo.page }).then(response => {
        const { datalist, page } = response
        commit('setTodoList', datalist)
        commit('setPage', page)
      })
    }
  }
}
