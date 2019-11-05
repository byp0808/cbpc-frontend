<template>
  <div class="app-container">
    <el-form ref="refForm" :model="formData">
      <el-row>
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
        <el-col :span="7">
          <el-form-item label="对应收益率曲线" prop="yieldCurve">
            <el-select v-model="formData.yieldCurve" multiple placeholder="请选择" clearable style="margin-left:12px">
              <el-option
                v-for="item in yieldCurves"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="债券代码" prop="CSIN">
            <el-input v-model="formData.csin" style="width:60%" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="结束日期及批次期" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              clearable
              @change="getEndBatchs"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="endBatch">
            <el-select v-model="formData.endBatch" placeholder="请选择">
              <el-option
                v-for="item in endBatchs"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="估值方法" prop="valuationMetnod">
            <el-select v-model="formData.valuationMethod" multiple placeholder="请选择" clearable style="width:60%" :disabled="disable">
              <el-option
                v-for="item in valuationMetnods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="债券简称" prop="bondShort">
            <el-input v-model="formData.bondShort" style="width:60%" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="债券品种" prop="bondQuality">
            <el-input v-model="formData.bondQuality" style="width:60%" clearable :disabled="disable" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发行人" prop="publisher">
            <el-input v-model="formData.publisher" style="width:60%" clearable :disabled="disable" />
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
    <el-tabs v-model="activeElement" @tab-click="handleSelect">
      <el-tab-pane label="点差方案" name="01">
        <MethodList />
      </el-tab-pane>
      <el-tab-pane label="人工估值" name="02">
        <PeopleList />
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-pagination
        style="margin-top:20px"
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
  </div>
</template>

<script>
import MethodList from '@/views/valuation/query/method-list.vue'
import PeopleList from '@/views/valuation/query/people-list.vue'
import { queryValuationScheme, queryPeopleValuation, getTaskBatchList } from '@/api/valuation/query.js'
import { basic_api_valuation } from '@/api/base-api'
import { downloadFile } from '@/utils/file-request'
export default {
  name: 'QueryCountValuation',
  components: {
    MethodList,
    PeopleList
  },
  data() {
    return {
      loading: false,
      activeElement: '01',
      disable: false,
      // 表单数据
      formData: {
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        startBatch: '', // 开始批次
        endBatch: '', // 结束批次
        bondShort: '', // 债券简称
        csin: '', // 债券代码
        bondQuality: '', // 债券品种
        yieldCurve: [], // 收益率曲线
        valuationMethod: [], // 估值方法
        publisher: '', // 发行人\
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
      // 收益率曲线
      yieldCurves: [
        { value: '1', label: '中债收益率' },
        { value: '2', label: '其他收益率' }
      ],
      // 估值方法
      valuationMetnods: [
        { value: '01', label: 'DCF' },
        { value: '02', label: '清算法' },
        { value: '03', label: '本金法' }
      ]
    }
  },
  beforeMount() {
    this.load()
  },
  methods: {
    load() {
      this.activeElement === '01' ? this.loadMethodList() : this.loadPeopleList()
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
    // 加载点差方案列表
    loadMethodList() {
      queryValuationScheme(this.formData).then(response => {
        const { dataList, page } = response
        this.$store.commit('queryValuationScheme/setValuationSchemeList', dataList)
        this.formData.page = page
      })
    },
    // 加载人工估值列表
    loadPeopleList() {
      queryPeopleValuation(this.formData).then(response => {
        const { dataList, page } = response
        this.$store.commit('queryValuationScheme/setPeopleValuationList', dataList)
        this.formData.page = page
      })
    },
    handleSelect(e) {
      this.disable = this.activeElement !== '01'
      this.resetForm()
      this.load()
    },
    resetForm() {
      this.$refs['refForm'].resetFields()
    },
    download() {
      const that = this
      this.loading = true
      // 模拟网络延时使按钮处于加载状态
      window.setTimeout(function() {
        that.loading = false
      }, 1500)
      this.activeElement === '01'
        ? downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/query/download-valuation-scheme')
        : downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/query/download-people-valuation')
    },
    handleSizeChange(pageSize) {
      this.formData.page.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(currentPage) {
      this.formData.page.pageNumber = currentPage
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
