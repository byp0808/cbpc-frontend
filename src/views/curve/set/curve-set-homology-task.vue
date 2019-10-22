<template>
  <div class="app-container">
    <Homology
      ref="Homology"
      :temp="temp"
      :disabled="disabled"
      opType="VIEW"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="finishHomology('02')">审核通过</el-button>
      <el-button type="primary" @click="finishHomology('03')">审核拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import Homology from '@/views/curve/set/homology.vue'
import { querycurveHomologyDto, finishHomology } from '@/api/curve/curve-product-list.js'
export default {
  name: 'CurveSetHomologyTask',
  components: {
    Homology
  },
  data() {
    return {
      businessNo: '',
      temp: {
        curveId: '',
        approveStatus: '01',
        lastUpdBy: '',
        lastUpdTs: ''
      },
      disabled: true
    }
  },
  beforeMount() {
    this.businessNo = this.$store.state.task.businessNo
    this.temp.curveId = this.businessNo
    this.getCurveHomologyDtoList({
      curveId: this.temp.curveId,
      approveStatus: '01'
    })
    console.info('beforeMount.businessNo:' + this.businessNo)
  },
  mounted() {
    this.$store.commit('task/clear')
  },
  methods: {
    getCurveHomologyDtoList() {
      querycurveHomologyDto().then(response => {
        debugger
        this.temp.lastUpdBy = response.dataList[0].lastUpdBy
        this.temp.lastUpdTs = response.dataList[0].lastUpdTs
        setTimeout(1.5 * 1000)
      })
    },
    finishHomology(taskStatus) {
      if (!this.businessNo) {
        this.$message({
          message: '获取流程数据失败！',
          type: 'error',
          showClose: true
        })
      }
      debugger
      var data = { businessNo: this.businessNo, taskStatus: taskStatus }
      finishHomology(data).then(response => {
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
