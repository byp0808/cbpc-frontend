<template>
  <div class="box">
    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label="债券代码查询">
            <el-select v-model="searchInfo.userId" filterable clearable placeholder="请选择债券代码" @visible-change="bondCodeChange">
              <el-option v-for="(item, index) in bondCodeList" :key="index" :label="item.userName" :value="item.userId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="债券发行人查询">
            <el-select v-model="searchInfo.userId" filterable clearable placeholder="请选择债券代码" @visible-change="bondManChange">
              <el-option v-for="(item, index) in bondManList" :key="index" :label="item.userName" :value="item.userId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="bondSearch">查询</el-button>
          <el-button :type="isLook? 'info' : 'primary'" :disabled="isLook" class="el-icon-download" :loading="downLoading" @click="downLoad" />
          <el-button :type="isLook? 'info' : 'primary'" :disabled="isLook" class="el-icon-plus" @click="addTask" />
          <el-button :type="isLook? 'info' : 'primary'" :disabled="isLook" class="el-icon-delete" @click="deleteRow" />
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
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券代码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待偿期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.residualMaturity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加权待偿期" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券发行人" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否即期估值" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值点差" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isCredit" label="当前收益率" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考调整幅度" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="今日调整幅度" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isCredit" label="明日调整幅度" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整后点差" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isCredit" label="调整后收益率" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
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
export default {
  name: 'AdjustForm',
  components: {

  },
  //   props: {
  //     adjustList: {
  //       type: Array,
  //       default: function() {
  //         return []
  //       }
  //     }
  //   },
  //   props: ['isLook'],
  props: {
    isLook: {
      type: Boolean,
      default: false
    },
    isCredit: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: String,
      default: '01'
    }
  },
  data() {
    return {
      tabLoading: false,
      downLoading: false,
      searchInfo: {},
      selectionList: [],
      bondCodeList: [],
      bondManList: [],
      adjustList: [
        { date: '0000' },
        { date: '0000' },
        { date: '0000' },
        { date: '0000' },
        { date: '0000' }

      ],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  watch: {
    activeName(val) {
      this.activeIndex = val
      console.log('this.activeIndex', this.activeIndex)
    }
  },
  created() {
    console.log('active', this.activeName)
    this.getAllList()
  },
  methods: {
    getAllList() {

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
    bondManChange() {

    },
    bondCodeChange() {

    },
    bondSearch() {

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
    addTask() {

    },
    deleteRow() {

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
