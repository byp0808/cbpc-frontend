<template>
  <div class="app-container">
    <AllTaskList
      ref="Rule"
      :relld="businessNo"
      :disabled="disabled"
      op-type="VIEW"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="finishUpdateRule('02')">审核通过</el-button>
      <el-button type="primary" @click="finishUpdateRule('03')">审核拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import AllTaskList from '@/views/curve-task/task-temp-rules.vue'
import { finishUpdateRule } from '@/api/curve/curve-product-list.js'
export default {
  name: 'CurveRuleTask',
  components: {
    AllTaskList
  },
  data() {
    return {
      businessNo: '',
      disabled: true
    }
  },
  beforeMount() {
    this.businessNo = this.$store.state.task.businessNo
    console.info('beforeMount.businessNo:' + this.businessNo)
  },
  mounted() {
    this.$store.commit('task/clear')
  },
  methods: {
    finishUpdateRule(taskStatus) {
      if (!this.businessNo) {
        this.$message({
          message: '获取流程数据失败！',
          type: 'error',
          showClose: true
        })
      }
      debugger
      var data = { businessNo: this.businessNo, taskStatus: taskStatus }
      finishUpdateRule(data).then(response => {
        this.$message({
          message: '审核流程通过！',
          type: 'success',
          showClose: true
        })
        this.$store.dispatch('homePage/queryTaskList')
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<style scoped>

</style>
