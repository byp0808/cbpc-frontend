<template>
  <div class="app-container">
    <el-form ref="refForm" :model="formData">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开始日期及批次期">
            <el-date-picker v-model="formData.startTime" type="date" placeholder="选择日期" />
            <span>-</span>
            <el-select v-model="formData.batchId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="付息方式">
            <el-select v-model="formData.endTime" placeholder="请选择付息方式">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="债券简称">
            <el-input v-model="formData.test" style="width: 72%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="结束日期及批次期">
            <el-date-picker v-model="formData.endTime" type="date" placeholder="选择日期" />
            <span>-</span>
            <el-select v-model="formData.batchId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="债券品种">
            <el-select v-model="formData.endTime" placeholder="请选择债券品种">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="债券代码">
            <el-input v-model="formData.test" style="width: 72%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="对应收益率曲线">
            <el-select v-model="formData.yieldCurve" placeholder="请选择收益率曲线">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="流通场所">
            <el-select v-model="formData.endTime" placeholder="请选择流通场所">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发行人">
            <el-input v-model="formData.test" style="width: 72%" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary">查询</el-button>
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
        prop="bondId"
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
      :current-page="page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { queryValuation } from '@/api/valuation/query.js'
import { basic_api_valuation } from '@/api/base-api'
import { downloadFile } from '@/utils/request-client'
export default {
  name: 'QueryValuation',
  data() {
    return {
      options: [
        { value: '1', label: '8：00' },
        { value: '2', label: '9：00' }
      ],
      loading: false, // 下载按钮是否是加载状态
      formData: {
        startTime: '',
        endTime: '',
        bondsPublisher: '',
        yieldCurve: ''
      },
      valuationResultList: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  beforeMount() {
    this.load()
  },
  methods: {
    load() {
      queryValuation({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.valuationResultList = dataList
        this.page = page
      })
    },
    resetForm() {
      this.$refs['refForm'].resetFields()
    },
    download() {
      const that = this
      this.loading = true
      window.setTimeout(function() {
        that.loading = false
      }, 1500)
      downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/query/download-query-valuation')
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.load()
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
