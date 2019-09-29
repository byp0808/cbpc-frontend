<template>
  <div class="app-container">
    <el-form ref="sampleTiketForm" :model="sampleBondsList" label-width="130px">
      <el-row :gutter="15">
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="开始时间及批次">
              <el-date-picker v-model="sampleBondsParam.startDate" type="date" placeholder="选择日期" style="width:200px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="结束时间及批次">
              <el-date-picker v-model="sampleBondsParam.endDate" type="date" placeholder="选择日期" style="width:200px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="债券代码">
              <el-input v-model="sampleBondsParam.bondsId" placeholder="请输入内容" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="债券简称">
              <el-input v-model="sampleBondsParam.bondsName" placeholder="请输入内容" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="编制方法">
            <el-select v-model="sampleBondsParam.buildMethod" placeholder="请选择编制方法">
              <el-option v-for="item in buildMethodList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="操作人">
            <el-select v-model="sampleBondsParam.operMan" placeholder="请选择操作人">
              <el-option v-for="item in operManList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

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
      <el-table-column prop="productName" label="曲线名称" width="120" />
      <el-table-column prop="productName" label="债券简称" width="140" show-overflow-tooltip />
      <el-table-column prop="productLine" label="债券代码" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productLine }}
        </template>
      </el-table-column>
      <el-table-column prop="productGroup" label="估值日期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveStartTime == null ? '' : $moment(scope.row.curveStartTime).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="basePrdCode" label="估值批次" width="140" show-overflow-tooltip />
      <el-table-column prop="curveStartTime" label="流通场所" width="120" show-overflow-tooltip />
      <el-table-column prop="curveEndTime" label="待偿期(年)" width="100" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="日间估价全价" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="日间应计利息" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="估价净价" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="估价收益率" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="加权平均结算价" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="修正久期" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="利率久期" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="凸性" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="利率凸性" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="利差凸性" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="基点价值" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="利率基点价值" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="利差基点价值" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="均衡票面价格" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="可信度" show-overflow-tooltip />
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

export default {
  name: 'CurveList', // 曲线样本券列表
  components: {

  },
  filters: {
    // showCodeLabel: showCodeLabel
  },
  data() {
    return {
      sampleBondsParam: {
        startDate: '',
        endDate: '',
        bondsId: '',
        bondsName: '',
        buildMethod: '',
        operMan: ''
      },
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
    buildMethodList() { // 编制方法初始化
      // var buildMethod = [{ value: 'abc', label: 'hahaha' }]
      // options();
      return ''
    },
    operManList() { // 操作人初始化
      // var operMan = [{ value: 'abc', label: 'abc' }]
      return ''
    }
  },
  beforeMount() {
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
    queryCurveSampleBondsList() {
      queryCurveSampleBondsList({ page: this.sampleBondsList.page, sampleBondsParam: this.sampleBondsParam }).then(response => {
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
