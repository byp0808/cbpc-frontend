<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :model="data" label-width="80px">
        <el-form-item label="目标曲线：">
          <el-input v-model="targetCurve" />
        </el-form-item>
        <el-form-item label="相对曲线：">
          <el-input v-model="relativeCurve" />
        </el-form-item>
        <el-form-item label="所属部门：">
          <el-input v-model="data.affiDept" />
        </el-form-item>
        <el-form-item label="审批意见：">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div class="button-box-fixed">
      <el-button type="primary" @click="taskSubmit('02')">审核通过</el-button>
      <el-button type="primary" @click="taskSubmit('03')">审核拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import { queryCurveRelation, taskSubmit, getCurve } from '@/api/valuation/curve-relation.js'
export default {
  name: 'RecCureTask',
  components: {
  },
  data() {
    return {
      businessNo: '',
      data: {},
      targetCurve: '',
      relativeCurve: '',
      option: '',
      disabled: true
    }
  },
  beforeMount() {
    this.businessNo = this.$store.state.task.businessNo
    // 获取曲线关系详细信息
    queryCurveRelation({ id: this.businessNo }).then(response => {
      const { data } = response
      this.data = data
      getCurve({ id: data.curveId }).then(response => {
        const { productName } = response
        this.targetCurve = productName
      })
      getCurve({ id: data.relativeCurveId }).then(response => {
        const { productName } = response
        this.relativeCurve = productName
      })
    })
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
        taskType: '02'
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
