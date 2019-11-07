<template>
  <div class="app-container">
    <ReportForm
      ref="refApprovalDialog"
      :business-id="businessNo"
    />
    <div class="button-box-fixed">
      <el-button :disabled="taskStatus!=='01'" type="primary" @click="taskSubmit('02')">复核通过</el-button>
      <el-button :disabled="taskStatus!=='01'" type="primary" @click="taskSubmit('03')">复核拒绝</el-button>
      <el-button @click="$router.go(-1)">取 消</el-button>
    </div>
  </div>
</template>

<script>
import ReportForm from '@/views/valuation/report/report-form.vue'
import { taskSubmit } from '@/api/valuation/report.js'
export default {
  name: 'ReportTask',
  components: {
    ReportForm
  },
  data() {
    return {
      businessNo: '',
      taskName: ''
    }
  },
  computed: {
    taskStatus: {
      get() {
        return this.$store.state.task.taskStatus
      }
    }
  },
  beforeMount() {
    this.businessNo = this.$store.state.task.businessNo
    this.taskName = this.$store.state.task.taskName
  },
  mounted() {
    this.$store.commit('task/clear')
  },
  methods: {
    backPage() {
      this.$store.dispatch('homePage/queryTaskList')
      // this.$router.push({ path: '/' })
      this.$router.go(-1)
    },
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
        this.backPage()
      })
    }
  }
}
</script>

<style scoped>

</style>
