<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本资料" name="01">
        <basic-form />
      </el-tab-pane>
      <el-tab-pane label="同一发行人" name="02">
        <same-people />
      </el-tab-pane>
      <el-tab-pane label="财务信息" name="03">
        <financial-form />
      </el-tab-pane>
      <el-tab-pane label="市场行情" name="04">
        <financial-form />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BasicForm from '@/views/valuation/scheme/basic-information.vue'
import SamePeople from '@/views/valuation/scheme/same-people.vue'
import FinancialForm from '@/views/valuation/scheme/financial-state.vue'
export default {
  name: 'ValuationTaskList',
  components: {
    BasicForm,
    SamePeople,
    FinancialForm
  },
  data() {
    return {
      activeName: '01',
      bondId: '',
      valuationAllTask: [],
      valuationMyTask: [],
      myList: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        },
        tab: '01',
        scene: '01'
      }
    }
  },
  created() {
  },
  methods: {
    handleClick(e) {
      if (e.name === '04') {
        this.$router.push('/market/secondary-market-list')
      }
    }
  }
}
</script>
