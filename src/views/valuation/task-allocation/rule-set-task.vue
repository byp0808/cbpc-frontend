<template>
  <div class="app-container">
    <RuleSetForm
      ref="refRuleSetForm"
      :disabled="disabled"
      :business-id="businessNo"
    />
    <div class="button-box-fixed">
      <el-button :disabled="taskStatus!=='01'" type="primary" @click="taskSubmit('02')">审核通过</el-button>
      <el-button :disabled="taskStatus!=='01'" type="primary" @click="taskSubmit('03')">审核拒绝</el-button>
      <el-button @click="backPage">取 消</el-button>
    </div>
  </div>
</template>

<script>
import RuleSetForm from '@/views/valuation/task-allocation/rule-set-form.vue'
import { ruleSetTaskSubmit } from '@/api/valuation/task-allocation.js'
export default {
  name: 'RuleSetTask',
  components: {
    RuleSetForm
  },
  data() {
    return {
      businessNo: '',
      businessName: '',
      disabled: true
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
    this.businessName = this.$store.state.task.businessName
  },
  created() {
    if (this.$store.state.task.auditStatus) {
      this.taskSubmit(this.$store.state.task.auditStatus)
    }
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
      ruleSetTaskSubmit({
        businessNo: this.businessNo,
        taskStatus: status,
        taskOpinions: '',
        taskType: '02',
        businessName: this.businessName
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
