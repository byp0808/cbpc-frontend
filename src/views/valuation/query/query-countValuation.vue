<template>
  <div class="app-container">
    <el-form ref="refForm" :model="formData" :label-position="labelPosition">
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
            <el-select v-model="formData.line" placeholder="请选择" clearable style="width:60%">
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
            <el-input v-model="formData.test" style="width:60%" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发行人">
            <el-input v-model="formData.test" style="width:60%" clearable />
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
      </el-row>
    </el-form>
    <el-tabs v-model="activeElement" @tab-click="handleSelect">
      <el-tab-pane label="点差方案" name="01" />
      <el-tab-pane label="人工估值" name="02" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeElement === '01'" v-loading="tabLoading">
        <method-list :all-list="allList" @selectionList="selectionList" />
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
      <div v-if="activeElement === '02'" v-loading="tabLoading">
        <people-list :all-list="peopleList" @selectionList="selectionList" />
        <el-pagination
          align="center"
          :current-page="page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.totalRecord"
          style="margin-top:20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </transition>
    <el-button type="primary" @click="download"><i class="el-icon-download el-icon--left">下载</i></el-button>
  </div>
</template>

<script>
import MethodList from '@/views/valuation/query/method-list.vue'
import PeopleList from '@/views/valuation/query/people-list.vue'
export default {
  name: 'QueryCountValuation',
  components: {
    MethodList,
    PeopleList
  },
  data() {
    return {
      labelPosition: 'right',
      activeElement: '01',
      tabLoading: false,
      allList: [],
      peopleList: [],
      formData: {
        startTime: '',
        endTime: '',
        bondsPublisher: ''
      },
      interestLine: [
        {
          label: '曲线1',
          value: '10'
        }
      ],
      valuationList: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    handleSelect(e) {
    },
    selectionList(data) {

    },
    resetForm() {
      this.$refs['refForm'].resetFields()
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
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
