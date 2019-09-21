import { queryTaskList } from '@/api/common/task.js'
import { queryMsgList } from '@/api/common/home-page.js'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    todoInfo: {
      dataList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    },
    message: {
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      msgList: []
    }
  },
  mutations: {
    setTodoList(state, todoList) {
      state.todoInfo.dataList = todoList
    },
    setPage(state, page) {
      state.todoInfo.page = page
    },
    setMessage(state, { msgList, page }) {
      state.message.page = page
      state.message.msgList = msgList
    },
    updateMsgStatus(status, row) {
      const index = _.findIndex(status.message.msgList, { id: row.id })
      status.message.msgList[index] = row
    }
  },
  actions: {
    queryTaskList({ commit, state }) {
      queryTaskList({ page: state.todoInfo.page }).then(response => {
        const { dataList, page } = response
        commit('setTodoList', dataList)
        commit('setPage', page)
      })
    },
    queryMsgList({ commit, state }, { pageSize, pageNumber }) {
      const page = state.message.page
      if (pageSize) page.pageSize = pageSize
      if (pageNumber) page.pageNumber = pageNumber
      queryMsgList({ page: state.message.page }).then(response => {
        const { dataList, page } = response
        commit('setMessage', { msgList: dataList, page: page })
      })
    }
  }
}
