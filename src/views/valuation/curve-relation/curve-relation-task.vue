<template>
  <div class="app-container">
    //展示信息
    <div class="button-box-fixed">
      <el-button type="primary" @click="taskSubmit('02')">审核通过</el-button>
      <el-button type="primary" @click="taskSubmit('03')">审核拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import { queryCurveRelation, taskSubmit } from '@/api/valuation/curve-relation.js'
export default {
  name: 'RecCureTask',
  components: {
  },
  data() {
    return {
      businessNo: '',
      data: {},
      option: '',
      disabled: true
    }
  },
  beforeMount() {
    this.businessNo = this.$store.state.task.businessNo
    // 获取曲线关系详细信息
    queryCurveRelation({ id: this.businessNo }).then(response => {
      const { data } = response
      this.curveList = data
    })
  },
  mounted() {
    this.$store.commit('task/clear')
  },
  methods: {
    taskSubmit(status) {
      taskSubmit({
        businessNo: this.businessNo,
        taskStatus: status,
        taskOpinions: '',
        taskType: '02'
      }).then(response => {
        this.$message({
          message: '提交成功！',
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
