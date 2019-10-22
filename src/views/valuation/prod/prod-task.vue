<template>
  <div class="">
    <ValuationProdDetail
      :business-no="businessNo"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="taskSubmit('02')">审核通过</el-button>
      <el-button type="primary" @click="taskSubmit('03')">审核拒绝</el-button>
      <el-button @click="$router.go(-1)">取 消</el-button>
    </div>
  </div>
</template>

<script>
import ValuationProdDetail from '@/views/valuation/prod/prod-detail.vue'
import { taskAudit } from '@/api/valuation/prod.js'
export default {
  name: 'ValuationProdTask',
  components: {
    ValuationProdDetail
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
  created() {
    if (this.$store.state.task.auditStatus) {
      this.taskSubmit(this.$store.state.task.auditStatus)
    }
  },
  mounted() {
    this.$store.commit('task/clear')
  },
  methods: {
    taskSubmit(status) {
      this.$confirm(`是否确定${status === '02' ? '同意' : '拒绝'}该产品的审批`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskAudit({
          businessNo: this.businessNo,
          taskStatus: status,
          taskOpinions: '',
          taskType: '01'
        }).then(response => {
          this.$message({
            message: '提交成功！',
            type: 'success',
            showClose: true
          })
          if (this.$store.state.task.auditStatus) {
            this.$router.push({ name: 'audit' })
            this.$router.go(-1)
          } else {
            this.$store.dispatch('homePage/queryTaskList')
            this.$router.push({ path: '/' })
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
