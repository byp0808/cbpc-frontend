<template>
  <div class="app-container">
    <recCurveForm
      ref="refApprovalDialog"
      :business-id="businessNo"
      :disabled="disabled"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="taskSubmit">审核通过</el-button>
      <el-button type="primary" @click="save">审核拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import recCurveForm from '@/views/valuation/rec-cure/rec-curve-form.vue'
import { taskSubmit } from '@/api/valuation/rec-curve.js'
export default {
  name: 'RecCureTask',
  components: {
    recCurveForm
  },
  data() {
    return {
      businessNo: '',
      disabled: true
    }
  },
  beforeMount() {
    this.businessNo = this.$store.state.task.businessNo
  },
  mounted() {
    this.$store.commit('task/clear')
  },
  methods: {
    taskSubmit() {
      taskSubmit({
        businessNo: this.businessNo,
        taskStatus: '02',
        taskOpinions: '同意，可以通过',
        taskType: '01'
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
