<template>
  <div class="app-container">
    <CurveSetInitForm
      ref="refCurveSetRelaForm"
      :business-id="businessNo"
      disabled="true"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="finishCurveInfo('02')">审核通过</el-button>
      <el-button type="primary" @click="finishCurveInfo('03')">审核拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import CurveSetInitForm from '@/views/curve/set/curve-set-init-form.vue'
import { submitTask } from '@/api/curve/curve-set-init.js'
export default {
  name: 'CurveSetInitTask',
  components: {
    CurveSetInitForm
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
    finishCurveInfo(taskStatus) {
      if (!this.businessNo) {
        this.$message({
          message: '获取流程数据失败！',
          type: 'error',
          showClose: true
        })
      }
      var data = { businessNo: this.businessNo, taskStatus: taskStatus }
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
