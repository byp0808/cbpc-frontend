<template>
  <div class="app-container">
    <CurveSampleForm
      ref="refApprovalCurveSampleDialog"
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
import CurveSampleForm from '@/views/curve/sample/curve-sample-form.vue'
import { submitTask } from '@/api/curve/curve-sample.js'
export default {
  name: 'CureSampleTask',
  components: {
    CurveSampleForm
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
    save() {
      if (!this.businessNo) {
        this.$message({
          message: '获取流程数据失败！',
          type: 'error',
          showClose: true
        })
      }
      var data = { businessNo: this.businessNo, taskStatus: '03' }
      submitTask(data).then(response => {
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
      })
      this.$store.dispatch('homePage/queryTaskList')
      this.$router.push({ path: '/' })
    },
    taskSubmit() {
      if (!this.businessNo) {
        this.$message({
          message: '获取流程数据失败！',
          type: 'error',
          showClose: true
        })
      }
      var data = { businessNo: this.businessNo, taskStatus: '02' }
      submitTask(data).then(response => {
        this.$message({
          message: '操作成功！',
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
