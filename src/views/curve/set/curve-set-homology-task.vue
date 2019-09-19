<template>
    <div class="app-container">
        <Homology
                ref="Homology"
                :business-id="businessNo"
                :disabled="disabled"
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
  import { finishCurveInfo} from '@/api/curve/curve-product-list.js'
  export default {
    name: 'CurveSetHomologyTask',
    components: {
      Homology
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
      finishHomology(taskStatus) {
        if (!this.businessNo) {
          this.$message({
            message: '获取流程数据失败！',
            type: 'error',
            showClose: true
          })
        }
        var data = { curveId: this.businessNo, approveStatus: taskStatus }
        finishCurveInfo(data).then(response => {
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
