<template>
  <div class="app-container">
    <DateSetForm
      ref="refApprovalDialog"
      :business-id="businessNo"
      :disabled="disabled"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="taskSubmit('02')">审批通过</el-button>
      <el-button type="primary" @click="taskSubmit('03')">审批拒绝</el-button>
      <el-button @click="backPage">取 消</el-button>
    </div>
  </div>
</template>

<script>
import DateSetForm from '@/views/valuation/date-set/date-set-form.vue'
import { taskSubmit } from '@/api/valuation/date-set.js'
export default {
  name: 'DateSetTask',
  components: {
    DateSetForm
  },
  data() {
    return {
      businessNo: '',
      taskName: '',
      disabled: true
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
      this.$router.push({ path: '/' })
    },
    taskSubmit(status) {
      taskSubmit({
        businessNo: this.businessNo,
        taskStatus: status,
        taskOpinions: '',
        taskType: '02',
        taskName: this.taskName
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
