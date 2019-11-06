<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="overallList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="curveId" label="曲线编号" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveId }}
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="曲线名称" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column prop="curvePubType" label="曲线类型" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("CURVE_BUILD_TYPE", scope.row.curvePubType) }}
        </template>
      </el-table-column>
      <el-table-column prop="compDate" label="发布日期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.compDate }}
        </template>
      </el-table-column>
      <el-table-column prop="batchId" label="发布批次" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.batchId }}
        </template>
      </el-table-column>
      <el-table-column prop="rateType" label="利率类型" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("RATE_TYPE", scope.row.rateType) }}
        </template>
      </el-table-column>
      <el-table-column prop="interestDueFreq" label="付息频率" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("INTEREST_DUE_FREQ", scope.row.interestDueFreq) }}
        </template>
      </el-table-column>
      <el-table-column prop="curveBuildStatus" label="曲线编制状态" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("CURVE_BUILD_STATUS", scope.row.curveBuildStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="assignName" label="责任人" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.assignName }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="原因" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" size="big" @click="singleRoute(scope.$index, overallList.dataList)">{{ scope.row.reason }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="curveId" label="操作" width="100" show-overflow-tooltip>
        <template v-if="scope.row.curveBuildStatus=='4' || scope.row.curveBuildStatus=='5'" slot-scope="scope">
          <el-button type="text" size="big" @click="fallbackContact(scope.$index, overallList.dataList)">退回至责任人</el-button>
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
    <div style="margin-bottom: 90px">
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <ul>
            <li>
              <span>已计算：{{ overallNum.numOfComputed }} 条</span>
            </li>
            <li>
              <span>其他：{{ overallNum.numOfUnComputed }} 条</span>
            </li>
            <li>
              <span>--------------------</span>
            </li>
            <li>
              <span>总数：{{ overallNum.numOfCurveTotal }}条</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="8" />
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <ul>
            <li>
              <span>较前一日日终曲线条数：{{ overallNum.numOfYsChg }}条</span>
            </li>
            <li>
              <span>较上批次曲线条数：{{ overallNum.numOfLsChg }} 条</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <ul>
            <li>
              <span>全面性检查：{{ overallNum.numOfComprehensiveQc }}条</span>
            </li>
            <li>
              <span>曲线跨线：{{ overallNum.numOfCrsQc }} 条</span>
            </li>
            <li>
              <span>曲线倒挂：{{ overallNum.numOfRvsQc }}条</span>
            </li>
            <li>
              <span>波动异常：{{ overallNum.numOfShkQc }}条</span>
            </li>
            <li>
              <span>----------------------------------------</span>
            </li>
            <li>
              <span>错误报告总数总数：{{ overallNum.numOfCurveQc }}条</span>
            </li>
          </ul>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { qryCurveOverallQcRpt, qryCurveOverallNum, fallbackContact } from '@/api/curve/curve-quality.js'

export default {
  name: 'CurveQualityOverallList', // 质检总览
  props: ['taskDay', 'orderId'],
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
      overallNum: {},
      lockScroll: true,
      multipleSelection: '' // 选择记录
    }
  },
  methods: {
    handleFilter() {
      this.overallList.page.pageNumber = 1
      this.qryCurveOverallQcRpt()
      this.qryCurveOverallNum()
    },
    handleSizeChange(pageSize) {
      this.overallList.page.pageSize = pageSize
      this.qryCurveOverallQcRpt()
      this.qryCurveOverallNum()
    },
    handleCurrentChange(currentPage) {
      this.overallList.page.pageNumber = currentPage
      this.qryCurveOverallQcRpt()
      this.qryCurveOverallNum()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    qryCurveOverallQcRpt() {
      this.overallList.compDate = this.taskDay
      this.overallList.batchId = this.orderId
      qryCurveOverallQcRpt(this.overallList).then(response => {
        console.info('qryCurveOverallQcRpt.qryCurveOverallQcRpt...')
        const { dataList, page } = response
        this.overallList.dataList = dataList
        this.overallList.page = page
      })
    },
    qryCurveOverallNum() {
      this.overallList.compDate = this.taskDay
      this.overallList.batchId = this.orderId
      qryCurveOverallNum(this.overallList).then(response => {
        console.info('qryCurveOverallNum.qryCurveOverallNum...')
        this.overallNum = response
      })
    },
    fallbackContact(index, rows) {
      this.$confirm('是否确认退回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        var data = {
          taskPKId: rows[index].taskPKId
        }
        fallbackContact(data).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功',
            showClose: true
          })
          this.qryCurveOverallQcRpt()
          this.qryCurveOverallNum()
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      }).catch(() => {
        console.info('cancle')
      })
    },
    singleRoute(index, rows) {
      let activeName = 'zl'
      if (rows[index].reason === '跨线检查') {
        activeName = 'qxkx'
      } else if (rows[index].reason === '倒挂检查') {
        activeName = 'qxdg'
      } else if (rows[index].reason === '波动性检查') {
        activeName = 'bdpc'
      } else if (rows[index].reason === '全面性检查') {
        activeName = 'qmxjc'
      } else if (rows[index].reason === '容错') {
        activeName = 'rc'
      } else {
        activeName = 'zl'
      }
      console.info('singleRouteCallback.reason:' + rows[index].reason)
      console.info('singleRouteCallback.activeName:' + activeName)
      console.info('singleRouteCallback.curveId:' + rows[index].curveId)
      this.$emit('singleRouteCallback', rows[index].curveId, activeName)
    }

  }
}
</script>

<style scoped>
</style>
