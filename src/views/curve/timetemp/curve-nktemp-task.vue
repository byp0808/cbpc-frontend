<template>
  <div class="app-container">
    <NkTempForm
      ref="refApprovalDialog"
      :business-id="businessNo"
      :disabled="disabled"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="taskSubmit('02')">审批通过</el-button>
      <el-button type="primary" @click="taskSubmit('03')">审批拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import NkTempForm from '@/views/curve/timetemp/curve-nktemp-form.vue'
import { taskSubmit } from '@/api/curve/curve-nktemp-list.js'
export default {
  name: 'NkTempTask',
  components: {
    NkTempForm
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
        this.$store.dispatch('homePage/queryTaskList')
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<style scoped>

</style>
