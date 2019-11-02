<template>
  <div class="app-container">
    <el-form ref="refForm" :model="formData">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="开始日期及批次期" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="getStartBatchs"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="startBatch">
            <el-select v-model="formData.startBatch" placeholder="选择批次">
              <el-option
                v-for="item in startBatchs"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="付息方式" prop="payingInterest">
            <el-select v-model="formData.payingInterest" multiple placeholder="选择付息方式">
              <el-option
                v-for="item in payingInterests"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="债券简称" prop="bondShort">
            <el-input v-model="formData.bondShort" style="width: 72%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="结束日期及批次期" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="getEndBatchs"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="endBatch">
            <el-select v-model="formData.endBatch" placeholder="选择批次">
              <el-option
                v-for="item in endBatchs"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="债券品种" prop="bondQuality">
            <el-select v-model="formData.bondQuality" multiple placeholder="选择债券品种">
              <el-option
                v-for="item in bondQualitys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="债券代码" prop="CSIN">
            <el-input v-model="formData.csin" style="width: 72%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="对应收益率曲线" prop="yieldCurve">
            <el-select v-model="formData.yieldCurve" multiple placeholder="选择收益率曲线">
              <el-option
                v-for="item in yieldCurves"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="流通场所" prop="market">
            <el-select v-model="formData.market" multiple placeholder="选择流通场所">
              <el-option
                v-for="item in markets"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发行人" prop="publisher">
            <el-input v-model="formData.publisher" style="width: 72%" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" @click="load">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :loading="loading" @click="download">
            <i class="el-icon-download el-icon--left">下载</i>
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="valuationResultList"
      style="width: 100%"
      :header-cell-style="{background:'#f6f6f6'}"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        type="selection"
        width="30"
      />
      <el-table-column
        fixed="left"
        prop="bondShort"
        label="债券简称"
        width="100"
      />
      <el-table-column
        fixed="left"
        prop="csin"
        label="债券代码"
        width="100"
      />
      <el-table-column
        align="center"
        prop="cptDate"
        label="估值日期"
        width="180"
      />
      <el-table-column
        prop="batchId"
        label="估值批次"
        width="100"
      />
      <el-table-column
        prop="marketId"
        label="流通场所"
        width="150"
      />
      <el-table-column
        prop="indexResult.residualMaturity"
        label="代偿期"
        width="100"
      />
      <el-table-column
        prop="indexResult.fullPriceInterDay"
        label="日间估价全价（元）"
        width="180"
      />
      <el-table-column
        prop="indexResult.accruedInterestInterDay"
        label="日间应计利息（元）"
        width="150"
      />
      <el-table-column
        prop="indexResult.netPrice"
        label="估价净价（元）"
        width="180"
      />
      <el-table-column
        prop="indexResult.yield"
        label="估价收益率（%）"
        width="150"
      />
      <el-table-column
        prop="indexResult.modifiedDuration"
        label="估价修正久期"
        width="180"
      />
      <el-table-column
        prop="indexResult.Convexity"
        label="估价凸性"
        width="180"
      />
      <el-table-column
        prop="indexResult.BPValue"
        label="估价基点价值"
        width="180"
      />
      <el-table-column
        prop="indexResult.spreadDuration"
        label="估价利差久期"
        width="180"
      />
      <el-table-column
        prop="indexResult.spreadConvexity"
        label="估价利差凸性"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementFullPrice"
        label="加权平均结算全价（元）"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementNetPrice"
        label="加权平均结算净价（元）"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementYield"
        label="加权平均结算收益率（%）"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementModifiedDuration"
        label="加权平均结算价修正久期"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementConvexity"
        label="加权平均结算价凸性"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementBPValue"
        label="加权平均结算价基点价值"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementSpreadDuration"
        label="加权平均结算价利差久期"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementSpreadConvexity"
        label="加权平均结算价利差凸性"
        width="180"
      />
      <el-table-column
        prop="indexResult.rateDuration"
        label="估价利率久期"
        width="180"
      />
      <el-table-column
        prop="indexResult.rateConvexity"
        label="估价利率凸性"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementRateDuration"
        label="加权平均结算价利率久期"
        width="180"
      />
      <el-table-column
        prop="indexResult.averageSettlementRateConvexity"
        label="加权平均结算价利率凸性"
        width="180"
      />
      <el-table-column
        prop="indexResult.fullPriceEndDay"
        label="日终估价全价(元）"
        width="180"
      />
      <el-table-column
        prop="indexResult.accruedInterestEndDay"
        label="日终应计利息(元)"
        width="180"
      />
      <el-table-column
        prop=""
        label="剩余本金"
        width="180"
      />
      <el-table-column
        prop="indexResult.spreadYield"
        label="点差收益率(%)"
        width="180"
      />
      <el-table-column
        prop="indexResult.equilibriumCouponRate"
        label="估算的行权后票面利率(%)"
        width="180"
      />
      <el-table-column
        prop="indexResult.reliability"
        label="可信度"
        width="150"
      />
    </el-table>
    <el-pagination
      align="center"
      :current-page="formData.page.pageNumber"
      :page-sizes="[5,10, 20, 30, 40, 50]"
      :page-size="formData.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="formData.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { queryValuation, getTaskBatchList } from '@/api/valuation/query.js'
import { basic_api_valuation } from '@/api/base-api'
import { downloadFile } from '@/utils/file-request'
export default {
  name: 'QueryValuation',
  data() {
    return {
      loading: false, // 下载按钮是否是加载状态
      // 表单数据
      formData: {
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        startBatch: '', // 开始批次
        endBatch: '', // 结束批次
        payingInterest: [], // 付息方式
        bondShort: '', // 债券简称
        csin: '', // 债券代码
        bondQuality: [], // 债券品种
        yieldCurve: [], // 收益率曲线
        market: [], // 流通场所
        publisher: '', // 发行人
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      },
      // 开始批次
      startBatchs: [],
      // 结束批次
      endBatchs: [],
      // 付息方式
      payingInterests: [
        { value: '1', label: '一年一次' },
        { value: '2', label: '一年两次' },
        { value: '3', label: '一年四次' },
        { value: '4', label: '十年十二次' }
      ],
      // 债券品种
      bondQualitys: [
        { value: '1', label: '国债' },
        { value: '2', label: '地方债' }
      ],
      // 收益率曲线
      yieldCurves: [
        { value: '1', label: '中债收益率' },
        { value: '2', label: '其他收益率' }
      ],
      // 流通场所
      markets: [
        { value: '01', label: '香港' },
        { value: '02', label: '美国' },
        { value: '03', label: '交易所' },
        { value: '04', label: '银行间' }
      ],
      // 查询到所有数据（未分页）
      // allValuationResultList: [],
      // 页面表格数据（分页后）
      valuationResultList: []
    }
  },
  beforeMount() {
    this.load()
  },
  methods: {
    load() {
      queryValuation(this.formData).then(response => {
        const { dataList, page } = response
        this.valuationResultList = dataList
        this.formData.page = page
        // this.pageData()
      })
    },
    getStartBatchs() {
      getTaskBatchList(this.formData.startDate).then(response => {
        this.startBatchs = response
      })
    },
    getEndBatchs() {
      getTaskBatchList(this.formData.endDate).then(response => {
        this.endBatchs = response
      })
    },
    // 前端分页
    // pageData() {
    //   this.page.totalRecord = this.allValuationResultList.length
    //   const start = (this.page.pageNumber - 1) * this.page.pageSize
    //   const end = start + this.page.pageSize
    //   this.valuationResultList = this.allValuationResultList.slice(start, end)
    // },
    resetForm() {
      this.$refs['refForm'].resetFields()
    },
    download() {
      const that = this
      this.loading = true
      window.setTimeout(function() {
        that.loading = false
      }, 1800)
      downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/query/download-query-valuation')
    },
    handleSizeChange(pageSize) {
      this.formData.page.pageSize = pageSize
      this.load()
      // this.pageData()
    },
    handleCurrentChange(currentPage) {
      this.formData.page.pageNumber = currentPage
      this.load()
      // this.pageData()
    }
  }
}
</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
