<template>
  <div class="app-container">
    <BondsNonpForm
      ref="refApprovalDialog"
      :business-id="businessNo"
      :disabled="disabled"
      :csin-disabled="disabled"
    />
    <div class="button-box-fixed">
      <el-button :disabled="taskStatus!=='01'" type="primary" @click="taskSubmit('02')">审批通过</el-button>
      <el-button :disabled="taskStatus!=='01'" type="primary" @click="taskSubmit('03')">审批拒绝</el-button>
      <el-button @click="$router.go(-1)">取 消</el-button>
    </div>
  </div>
</template>

<script>
import BondsNonpForm from '@/views/valuation/bonds-nonp/bonds-nonp-form.vue'
import { taskSubmit } from '@/api/valuation/bonds-nonp.js'
export default {
  name: 'BondsNonpTask',
  components: {
    BondsNonpForm
  },
  data() {
    return {
      businessNo: '',
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
        taskType: '01'
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
