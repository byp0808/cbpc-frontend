<template>
    <div class="app-container">
        <Refer
                ref="Refer"
                :temp="temp"
                :disabled="disabled"
        />
        <div class="button-box-fixed">
            <el-button type="primary" @click="finishRefer('02')">审核通过</el-button>
            <el-button type="primary" @click="finishRefer('03')">审核拒绝</el-button>
            <el-button>取 消</el-button>
        </div>
    </div>
</template>

<script>
  import Refer from '@/views/curve/set/refer.vue'
  import {queryCurveReferDto,finishRefer} from '@/api/curve/curve-product-list.js'
  export default {
    name: 'CurveSetReferTask',
    components: {
      Refer
    },
    data() {
      return {
        businessNo: '',
        temp: {
          curveId: '',
          approveStatus: '01',
          lastUpdBy: '',
          lastUpdTs: '',
        },
        disabled: true
      }
    },
    beforeMount() {
      this.businessNo = this.$store.state.task.businessNo
      this.temp.curveId = this.businessNo
      this.getCurveReferDtoList({
        curveId: this.temp.curveId,
        approveStatus: '01'
      })
      console.info('beforeMount.businessNo:' + this.businessNo)
    },
    mounted() {
      this.$store.commit('task/clear')
    },
    methods: {
      getCurveReferDtoList() {
        queryCurveReferDto().then(response => {
          debugger
          this.temp.lastUpdBy = response.dataList[0].lastUpdBy
          this.temp.lastUpdTs = response.dataList[0].lastUpdTs
          setTimeout(1.5 * 1000)
        })
      },
      finishRefer(taskStatus) {
        if (!this.businessNo) {
          this.$message({
            message: '获取流程数据失败！',
            type: 'error',
            showClose: true
          })
        }
        var data = { businessNo: this.businessNo, taskStatus: taskStatus }
        finishRefer(data).then(response => {
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
