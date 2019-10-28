<template>
  <div class="box">
    <el-form>
      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-date-picker
              v-model="selectDate.starDate"
              :picker-options="limitStar"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1" style="color:#999;margin-top:10px;margin-left:10px">至</el-col>
        <el-col :span="5">
          <el-form-item>
            <el-date-picker
              v-model="selectDate.endDate"
              :picker-options="limitEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="bondSearch">查询</el-button>
          <el-button v-loading="downLoading" type="primary" @click="downLoad">下载</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="tabLoading"
      :data="adjustList"
      style="width: 100%"
      max-height="500"
      :header-cell-style="{background:'#f6f6f6'}"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="全选" type="selection" />
      <el-table-column label="业务日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时刻" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流通场所" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marketGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场隐含评级" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.marketGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值方法" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标曲线" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标信用点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标流动性点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.valuationScheme }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标其他点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.otAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点差类型" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cdsPremAdjWay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后操作人" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.lastUpdBy }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        style="margin-top:20px"
        align="center"
        :current-page="page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { history } from '@/api/valuation/scheme.js'
export default {
  name: 'SchemeMethod',
  components: {

  },
  props: {
  },
  data() {
    return {
      tabLoading: false,
      downLoading: false,
      selectDate: {},
      adjustList: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      },
      limitStar: {
        disabledDate: (time) => {
          if (this.selectDate.endDate) {
            return new Date(this.selectDate.endDate).getTime() < time.getTime()
          }
        }
      },
      limitEnd: {
        disabledDate: (time) => {
          if (this.selectDate.starDate) {
            return new Date(this.selectDate.starDate).getTime() > time.getTime()
          }
        }
      }
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    getAllList(param) {
      console.log(param)
      if (param) {
        param.page = this.page
      } else {
        param = { page: this.page }
      }
      history(param).then(response => {
        const { dataList, page } = response
        this.adjustList = dataList
        this.page = page
      })
    },
    causeFilter(params) {
      switch (params) {
        case '01': return '新券'
        case '02': return '评级下降'
        case '03': return '盯市'
        case '04': return '信用事件'
        case '05': return '客户投诉'
        case '06': return '评级上升'
        case '07': return '巡检'
        case '08': return '其他'
      }
    },
    bondSearch() {
      console.log('dd', this.selectDate)
      const { starDate, endDate } = this.selectDate
      this.getAllList({
        search_startDate_EQ: starDate,
        search_endDate_EQ: endDate
      })
    },
    downLoad() {
    //   this.downLoading = true
    //  import('@/vendor/Export2Excel').then(excel => {
    //    const tHeader = ['公司名称', '付款单位', '银行账号', '开户行', '订单金额', '结算金额', '总场次', '手续费', '对账手机号', '结算时间', '摘要']
    //    const filterVal = [
    //      'tenantName',
    //      'accountName',
    //      'accountNo',
    //      'bankName',
    //      'totalAmount',
    //      'settleAmount',
    //      'timesCount',
    //      'rateAmount',
    //      'mobile',
    //      'settleDate',
    //      'tips'
    //    ]
    //    const data = this.formatJson(filterVal, this.adjustList)
    //    excel.export_json_to_excel(tHeader, data, '商户结算付款明细表')
    //    this.downLoading = false
    //  })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleSelectionChange(val) {
      console.log('val', val)
      this.selectionList = val
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getAllList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getAllList()
    }
  }
}
</script>

<style scoped>
 .box {
     margin-top: 10px;
 }
</style>
