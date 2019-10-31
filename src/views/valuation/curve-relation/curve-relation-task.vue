<template>
  <div class="app-container">
    <AddRulesForm
      ref="recAddRulesForm"
      :disabled="disabled"
      :relation-id="businessNo"
      :is-copy="isCopy"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="taskSubmit('02')">审核通过</el-button>
      <el-button type="primary" @click="taskSubmit('03')">审核拒绝</el-button>
      <el-button @click="backPage">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { taskSubmit } from '@/api/valuation/curve-relation.js'
import AddRulesForm from '@/views/valuation/curve-relation/curve-relation-form.vue'
export default {
  name: 'RecCureTask',
  components: {
    AddRulesForm
  },
  data() {
    return {
      businessNo: '',
      data: {},
      isCopy: false,
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
        taskName: this.$store.state.task.taskName
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
