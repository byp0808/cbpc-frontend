<template>
  <div class="app-container">
    <el-form ref="refForm" :model="formData">
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始日期及批次期">
            <el-date-picker v-model="formData.startTime" type="date" placeholder="选择日期" clearable />
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
        <el-col :span="7">
          <el-form-item label="对应收益率曲线">
            <el-select v-model="formData.line" placeholder="请选择" clearable style="margin-left:12px">
              <el-option
                v-for="item in interestLine"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="债券代码">
            <el-input v-model="formData.test" style="width:60%" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="结束日期及批次期">
            <el-date-picker v-model="formData.endTime" type="date" placeholder="选择日期" clearable />
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
        <el-col :span="7">
          <el-form-item label="估值方法">
            <el-select v-model="formData.line" placeholder="请选择" clearable style="width:60%" :disabled="disable">
              <el-option
                v-for="item in interestLine"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="债券简称">
            <el-input v-model="formData.test" style="width:60%" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="债券品种">
            <el-input v-model="formData.test" style="width:60%" clearable :disabled="disable" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发行人">
            <el-input v-model="formData.test" style="width:60%" clearable :disabled="disable" />
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
import MethodList from '@/views/valuation/query/method-list.vue'
import PeopleList from '@/views/valuation/query/people-list.vue'
import { queryValuationScheme } from '@/api/valuation/query.js'
import { basic_api_valuation } from '@/api/base-api'
import { downloadFile } from '@/utils/request-client'
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
      formData: {
        startTime: '',
        endTime: '',
        bondsPublisher: ''
      },
      // 收益率曲线
      interestLine: [
        { label: '曲线1', value: '10' }
      ],
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
      this.activeElement === '01' ? this.loadMethodList() : this.loadPeopleList()
    },
    // 加载点差方案列表
    loadMethodList() {
      queryValuationScheme().then(response => {
        const { dataList } = response
        this.$store.commit('queryValuationScheme/setValuationSchemeList', dataList)
      })
    },
    // 加载人工估值列表
    loadPeopleList() {
      queryValuationScheme().then(response => {
        const { dataList } = response
        this.$store.commit('queryValuationScheme/setPeopleValuationList', dataList)
      })
    },
    handleSelect(e) {
      this.disable = this.activeElement !== '01'
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
      downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/query/download-valuation-scheme')
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
