<template>
  <div class="app-container">
    <TmpBondFilter
      ref="refTmpBondFilter"
      :filter-id="businessNo"
      :disabled="disabled"
    />
    <div class="button-box-fixed">
      <el-button type="primary" @click="reTmplFilter('02')">审核通过</el-button>
      <el-button type="primary" @click="reTmplFilter('03')">审核拒绝</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script>
import TmpBondFilter from '@/views/common/bond-filter/filter-tmpl.vue'
import { reviewTmplFilter } from '@/api/common/bond-filter-tmpl.js'
export default {
  name: 'TempFilterTask',
  components: {
    TmpBondFilter
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
    reTmplFilter(taskStatus) {
      if (!this.businessNo) {
        this.$message({
          message: '获取流程数据失败！',
          type: 'error',
          showClose: true
        })
      }
      var data = { businessNo: this.businessNo, taskStatus: taskStatus }
      reviewTmplFilter(data).then(response => {
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
