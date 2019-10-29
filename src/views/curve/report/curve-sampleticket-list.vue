<template>
  <div class="app-container">
    <el-form ref="sampleTiketForm" :model="sampleBondsList" label-width="130px">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="开始时间及批次">
              <el-date-picker v-model="queryForm.search_taskDay_GTE" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="结束时间及批次">
              <el-date-picker v-model="queryForm.search_taskDay_LTE" type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" style="width:200px" />
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
            <el-select v-model="buildMethod" placeholder="请选择编制方法">
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
            <el-input v-model="operMan" placeholder="请输入内容" />
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
      <el-table-column prop="bondFullInfo.valAssetCode" label="债券代码" width="100" show-overflow-tooltip />
      <el-table-column prop="productGroup" label="估值日期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveStartTime == null ? '' : $moment(scope.row.curveStartTime).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="basePrdCode" label="估值批次" width="140" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.exchng" label="流通场所" width="120" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.mtrty" label="待偿期(年)" width="100" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="日间估价全价" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="日间应计利息" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="估价净价" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="估价收益率" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="加权平均结算价" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="修正久期" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="利率久期" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="凸性" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="利率凸性" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="利差凸性" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="基点价值" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="利率基点价值" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="利差基点价值" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="均衡票面价格" show-overflow-tooltip />
      <el-table-column prop="bondFullInfo.prdStatus" label="可信度" show-overflow-tooltip />
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
