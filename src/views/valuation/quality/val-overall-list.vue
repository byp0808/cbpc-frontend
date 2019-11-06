<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="overallList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="bondNm" label="债券简称" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bondNm }}
        </template>
      </el-table-column>
      <el-table-column prop="csin" label="债券代码" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.csin }}
        </template>
      </el-table-column>
      <el-table-column prop="market" label="流通场所" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("EXCHNG", scope.row.market) }}
        </template>
      </el-table-column>
      <el-table-column prop="bondNature" label="债券性质" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("ASSET_DTL_CATEG_CODE", scope.row.bondNature) }}
        </template>
      </el-table-column>
      <el-table-column prop="residualMaturity" label="待偿期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.residualMaturity }}
        </template>
      </el-table-column>
      <el-table-column prop="qcKind" label="质检类别" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.qcKind }}
        </template>
      </el-table-column>
      <el-table-column prop="excptRsn" label="异常原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.excptRsn }}
        </template>
      </el-table-column>
      <el-table-column prop="bondId" label="操作" width="100" show-overflow-tooltip>
        <template v-if="scope.row.bckTskIncd=='0'" slot-scope="scope">
          <el-button type="text" size="big" @click="fallbackSingle(scope.$index, overallList.dataList)">退回计算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="overallList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="overallList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="overallList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryOverallQcRpt, fallbackSingle } from '@/api/valuation/val-quality.js'
import { addOneTask } from '@/api/valuation/task.js'

export default {
  name: 'ValOverallList', // 质检总览
  props: { 'taskDay': {}, 'orderId': {}},
  data() {
    return {
      overallList: {
        compDate: '',
        batchId: '',
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      lockScroll: true,
      multipleSelection: '' // 选择记录
    }
  },
  methods: {
    handleFilter() {
      this.overallList.page.pageNumber = 1
      this.qryOverallQcRpt()
    },
    handleSizeChange(pageSize) {
      this.overallList.page.pageSize = pageSize
      this.qryOverallQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.overallList.page.pageNumber = currentPage
      this.qryOverallQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryOverallQcRpt() {
      this.overallList.compDate = this.taskDay
      this.overallList.batchId = this.orderId
      qryOverallQcRpt(this.overallList).then(response => {
        console.info('qryOverallQcRpt.qryOverallQcRpt...')
        const { dataList, page } = response
        this.overallList.dataList = dataList
        this.overallList.page = page
      })
    },
    fallbackSingle(index, rows) {
      this.$confirm('是否确认退回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (this.overallList.batchId === 'init_batch') {
          var addTaskData = {
            tab: '01',
            assetCode: rows[index].csin,
            batchId: this.overallList.batchId
          }
          addOneTask(addTaskData).then(response => {
            this.$message({
              type: 'success',
              message: '操作成功',
              showClose: true
            })
            var fallbackData = {
              batchId: this.overallList.batchId,
              compDate: this.overallList.compDate,
              bondId: rows[index].bondId
            }
            fallbackSingle(fallbackData)
          })
        } else {
          var fallbackData = {
            batchId: this.overallList.batchId,
            compDate: this.overallList.compDate,
            bondId: rows[index].bondId
          }
          fallbackSingle(fallbackData).then(response => {
            this.$message({
              type: 'success',
              message: '操作成功',
              showClose: true
            })
          })
        }
        this.qryOverallQcRpt()
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        console.info('cancle')
      })
    }
  }
}
</script>

<style scoped>
</style>
