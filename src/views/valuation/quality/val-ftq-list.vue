<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="valFTQList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="csin" label="债券代码" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.csin }}
        </template>
      </el-table-column>
      <el-table-column prop="bondNm" label="债券简称" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.bondNm }}
        </template>
      </el-table-column>
      <el-table-column prop="market" label="场所编号" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.market }}
        </template>
      </el-table-column>
      <el-table-column prop="intrstAccDate" label="起息日" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.intrstAccDate }}
        </template>
      </el-table-column>
      <el-table-column prop="listedDate" label="上市日" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.listedDate }}
        </template>
      </el-table-column>
      <el-table-column prop="newOldBound" label="新老券标识" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.newOldBound }}
        </template>
      </el-table-column>
      <el-table-column prop="valRule" label="估值规则" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.valRule }}
        </template>
      </el-table-column>
      <el-table-column prop="excptRsn" label="异常原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.excptRsn }}
        </template>
      </el-table-column>
      <el-table-column prop="prssWay" label="处理方式" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.prssWay }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column prop="faultAcptPiont" label="容错功能点" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.faultAcptPiont }}
        </template>
      </el-table-column>
      <el-table-column prop="curveId" label="操作" width="100" show-overflow-tooltip>
        <template>
          <el-button type="text" size="big">退回单资产估值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="valFTQList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="valFTQList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="valFTQList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { qryValFTQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValFTQList', // 质检总览
  props: ['taskDay', 'orderId', 'bondId'],
  data() {
    return {
      valFTQList: {
        compDate: '',
        batchId: '',
        bondId: '',
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
  beforeMount() {
    this.qryValFTQcRpt()
  },
  methods: {
    handleFilter() {
      this.valFTQList.page.pageNumber = 1
      this.qryValFTQcRpt()
    },
    handleSizeChange(pageSize) {
      this.valFTQList.page.pageSize = pageSize
      this.qryValFTQcRpt()
    },
    handleCurrentChange(currentPage) {
      this.valFTQList.page.pageNumber = currentPage
      this.qryValFTQcRpt()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryValFTQcRpt() {
      this.valFTQList.compDate = this.taskDay
      this.valFTQList.batchId = this.orderId
      this.valFTQList.bondId = this.bondId
      qryValFTQcRpt(this.valFTQList).then(response => {
        console.info('qryValFTQcRpt.qryValFTQcRpt...')
        const { dataList, page } = response
        this.valFTQList.dataList = dataList
        this.valFTQList.page = page
      })
    }
  }
}
</script>

<style scoped>
</style>
