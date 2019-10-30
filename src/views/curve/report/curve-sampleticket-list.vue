<template>
  <div class="app-container">
    <el-form ref="sampleTiketForm" :model="sampleBondsList" label-width="130px">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="开始时间及批次">
              <el-date-picker v-model="queryForm.taskDayStart" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="结束时间及批次">
              <el-date-picker v-model="queryForm.taskDayEnd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <el-form-item label="批次">
            <el-select v-model="queryForm.orderId" placeholder="请选择批次">
              <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="债券代码">
              <el-input v-model="queryForm.bondId" placeholder="请输入内容" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="债券简称">
            <el-input v-model="queryForm.bondName" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="编制方法">
            <el-select v-model="queryForm.buildType" placeholder="请选择编制方法">
              <el-option
                v-for="(name, key) in $dict('BUILD_TYPE')"
                :key="key"
                :label="name"
                :value="key"
              />
              <el-option label="全部" value="" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作人">
            <el-autocomplete
              v-model="queryForm.optUserName"
              class="inline-input"
              :value-key="'label'"
              :fetch-suggestions="queryPersonSearch"
              placeholder="请输入操作人"
              :trigger-on-focus="false"
              @select="handlePersonSelect"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="sampleBondsList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="sampleBond.curveName" label="曲线名称" width="120" />
      <el-table-column prop="sampleBond.bondName" label="债券简称" width="140" show-overflow-tooltip />
      <el-table-column prop="sampleBond.bondId" label="债券代码" width="100" show-overflow-tooltip />
      <el-table-column prop="sampleBond.valDate" label="估值日期" width="100" show-overflow-tooltip />
      <el-table-column prop="sampleBond.valOrderId" label="估值批次" width="140" show-overflow-tooltip />
      <el-table-column prop="sampleBond.marketId" label="流通场所" width="120" show-overflow-tooltip />
      <el-table-column prop="indexResult.residualMaturity" label="代偿期" width="100" />
      <el-table-column prop="indexResult.fullPriceInterDay" label="日间估价全价（元）" width="150" />
      <el-table-column prop="indexResult.accruedInterestInterDay" label="日间应计利息（元）" width="150" />
      <el-table-column prop="indexResult.netPrice" label="估价净价（元）" width="120" />
      <el-table-column prop="indexResult.yield" label="估价收益率（%）" width="140" />
      <el-table-column prop="indexResult.modifiedDuration" label="估价修正久期" width="120" />
      <el-table-column prop="indexResult.Convexity" label="估价凸性" width="80" />
      <el-table-column prop="indexResult.BPValue" label="估价基点价值" width="120" />
      <el-table-column prop="indexResult.spreadDuration" label="估价利差久期" width="120" />
      <el-table-column prop="indexResult.spreadConvexity" label="估价利差凸性" width="120" />
      <el-table-column prop="indexResult.averageSettlementFullPrice" label="加权平均结算全价（元）" width="180" />
      <el-table-column prop="indexResult.averageSettlementNetPrice" label="加权平均结算净价（元）" width="180" />
      <el-table-column prop="indexResult.averageSettlementYield" label="加权平均结算收益率（%）" width="200" />
      <el-table-column prop="indexResult.averageSettlementModifiedDuration" label="加权平均结算价修正久期" width="180" />
      <el-table-column prop="indexResult.averageSettlementConvexity" label="加权平均结算价凸性" width="180" />
      <el-table-column prop="indexResult.averageSettlementBPValue" label="加权平均结算价基点价值" width="180" />
      <el-table-column prop="indexResult.averageSettlementSpreadDuration" label="加权平均结算价利差久期" width="180" />
      <el-table-column prop="indexResult.averageSettlementSpreadConvexity" label="加权平均结算价利差凸性" width="180" />
      <el-table-column prop="indexResult.rateDuration" label="估价利率久期" width="120" />
      <el-table-column prop="indexResult.rateConvexity" label="估价利率凸性" width="120" />
      <el-table-column prop="indexResult.averageSettlementRateDuration" label="加权平均结算价利率久期" width="180" />
      <el-table-column prop="indexResult.averageSettlementRateConvexity" label="加权平均结算价利率凸性" width="180" />
      <el-table-column prop="indexResult.fullPriceEndDay" label="日终估价全价(元）" width="150" />
      <el-table-column prop="indexResult.accruedInterestEndDay" label="日终应计利息(元)" width="150" />
      <el-table-column prop="" label="剩余本金" width="100" />
      <el-table-column prop="indexResult.spreadYield" label="点差收益率(%)" width="150" />
      <el-table-column prop="indexResult.equilibriumCouponRate" label="估算的行权后票面利率(%)" width="200" />
      <el-table-column prop="indexResult.reliability" label="可信度" width="100" />
    </el-table>
    <el-pagination
      :current-page="sampleBondsList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="sampleBondsList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="sampleBondsList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>

// import { optioins } from '@/api/curve/code-type.js'
import { queryCurveSampleBondsList } from '@/api/curve/curve-sampleticket-list.js'
import { getOrderListOptions } from '@/api/curve/curve-product-order.js'
import { selectPerson } from '@/api/curve/curve-task'

export default {
  name: 'CurveList', // 曲线样本券列表
  components: {

  },
  filters: {
    // showCodeLabel: showCodeLabel
  },
  data() {
    return {
      queryForm: {},
      startDate: '',
      endDate: '',
      bondsId: '',
      orderId: '',
      bondsIdList: [],
      orderList: [],
      bondsName: '',
      buildMethod: '',
      operMan: '',
      sampleBondsList: {
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
  computed: {
    operManList() { // 操作人初始化
      // var operMan = [{ value: 'abc', label: 'abc' }]
      return ''
    }
  },
  watch: {
    startDate(newValue, oldValue) {
      console.info('productLine.newValue:' + newValue + ',oldValue:' + oldValue)
      this.bondsId = ''
      // 获取批次号
      this.getBondsId(newValue)

      if (this.bondsIdList.length > 0) {
        this.bondsId = this.bondsIdList[0].value
      }
    },
    endDate(newValue, oldValue) {
      console.info('productGroup.newValue:' + newValue + ',oldValue:' + oldValue)
      // 获取批次号
      this.getBondsId(newValue)

      if (this.bondsIdList.length > 0) {
        this.bondsId = this.bondsIdList[0].value
      }
    }
  },
  beforeMount() {
    this.orderList = []
    getOrderListOptions(this.orderList)

    this.queryCurveSampleBondsList()
  },
  methods: {
    handlePersonSelect(item) {
      this.queryForm.optUserId = item.value
    },
    queryPersonSearch(queryString, cb) {
      const data = queryString ? { userName: queryString } : {}
      this.queryForm.optUserId = ''
      selectPerson(data).then(response => {
        this.results = response.map(i => {
          return { value: i.userId, label: i.userName }
        })
        console.log(this.results)
        // 调用 callback 返回建议列表的数据
        cb(this.results)
      })
    },
    handleFilter() {
      this.sampleBondsList.page.pageNumber = 1
      this.queryCurveSampleBondsList()
    },
    handleSizeChange(pageSize) {
      this.sampleBondsList.page.pageSize = pageSize
      this.queryCurveSampleBondsList()
    },
    handleCurrentChange(currentPage) {
      this.sampleBondsList.page.pageNumber = currentPage
      this.queryCurveSampleBondsList()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    getBondsId(newValue) {
      this.bondsIdList = [{ value: 'a', label: '123' }]
    },
    queryCurveSampleBondsList() {
      var data = _.assign({}, this.queryForm)
      data.page = this.sampleBondsList.page
      queryCurveSampleBondsList(data).then(response => {
        console.info('queryCurveSampleBondsList.queryCurveSampleBondsList...')

        const { dataList, page } = response
        this.sampleBondsList.dataList = dataList
        this.sampleBondsList.page = page
      })
    }
  }
}
</script>

<style scoped>

</style>
