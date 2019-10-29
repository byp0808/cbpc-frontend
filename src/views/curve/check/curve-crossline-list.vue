<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="curveCrossLineList.showDataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!--el-table-column prop="postCode" label="邮政编码" width="140" show-overflow-tooltip />
      <el-table-column prop="postCode" label="曲线名称" width="140" show-overflow-tooltip /-->
      <el-table-column v-for="(item,index) in titleProperties" :key="item" :prop="item" :label="titleDes[index]" width="140">
        <template slot-scope="scope">
          <span :class="getTextClass(scope.row[item])">{{ scope.row[item] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="curveCrossLineList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="curveCrossLineList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="curveCrossLineList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>

import { qryCurveCrsQcRpt } from '@/api/curve/curve-quality.js'

export default {
  name: 'CurveList',
  components: {

  },
  filters: {
    // showCodeLabel: showCodeLabel
  }, // 曲线样本券列表
  props: ['taskDay', 'orderId', 'curveId'],
  data() {
    return {
      postCode: '',
      // curveCrossLineTitle: [],
      titleProperties: [],
      titleDes: [],
      curveCrossLineList: {
        dataList: [],
        showDataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      lockScroll: true,
      multipleSelection: '' // 选择记录
    }
  },
  computed: {

  },
  beforeMount() {
    this.queryCurveCrossLineList()
  },
  methods: {
    handleFilter() {
      this.queryCurveCrossLineList()
    },
    handleSizeChange(pageSize) {
      this.curveCrossLineList.page.pageSize = pageSize
      this.queryCurveCrossLineList()
    },
    handleCurrentChange(currentPage) {
      this.curveCrossLineList.page.pageNumber = currentPage
      this.queryCurveCrossLineList()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    getTextClass(value) {
      if (value && !isNaN(value) && parseFloat(value) > 0) {
        return 'red'
      }
    },
    queryCurveCrossLineList() {
      qryCurveCrsQcRpt({ page: this.curveCrossLineList.page, batchId: this.orderId, compDate: this.taskDay }).then(response => {
        console.info('queryCurveCrossLineList.queryCurveCrossLineList...')
        this.titleProperties.length = 0
        this.titleDes.length = 0
        const { tableHead, dataList, page } = response
        this.curveCrossLineList.dataList = dataList
        this.curveCrossLineList.page = page
        // this.curveCrossLineTitle = tableHead
        if (tableHead) {
          for (const index in tableHead) {
            const column = tableHead[index]
            this.titleProperties.push(column['columName'])
            this.titleDes.push(column['columComment'])
          }
        }
        this.handlePage()
      })
    },
    handlePage() { // 处理分页
      const totalRecord = this.curveCrossLineList.dataList.length
      const pageSize = this.curveCrossLineList.page.pageSize
      const pageNumber = this.curveCrossLineList.page.pageNumber
      this.curveCrossLineList.page.totalRecord = totalRecord
      this.curveCrossLineList.showDataList = this.curveCrossLineList.dataList.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)
    }
  }
}
</script>

<style scoped>

</style>
