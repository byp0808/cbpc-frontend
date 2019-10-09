<template>
  <div class="app-container">
    <el-form ref="refForm" :model="formData">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="开始日期及批次期">
            <el-date-picker v-model="formData.startTime" type="date" placeholder="选择日期" />
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
        <el-col :span="8">
          <el-form-item label="结束日期及批次期">
            <el-date-picker v-model="formData.endTime" type="date" placeholder="选择日期" />
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
        <el-col :span="8">
          <el-form-item label="对应收益率曲线">
            <el-select v-model="formData.endTime" placeholder="请选择收益率曲线">
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
      </el-row>
    </el-form>
    <el-table :data="valuationList" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column
        type="selection"
        width="30"
      />
      <el-table-column
        prop="date"
        label="债券简称"
        width="100"
      />
      <el-table-column
        prop="name"
        label="债券代码"
        width="100"
      />
      <el-table-column
        prop="address"
        label="估值日期"
        width="150"
      />
      <el-table-column
        prop="address"
        label="估值批次"
        width="100"
      />
      <el-table-column
        prop="address"
        label="流通场所"
        width="150"
      />
      <el-table-column
        prop="address"
        label="代偿期"
        width="100"
      />
      <el-table-column
        prop="address"
        label="日间估价全价"
        width="180"
      />
      <el-table-column
        prop="address"
        label="日间应计利息"
        width="150"
      />
      <el-table-column
        prop="address"
        label="估价净价"
        width="180"
      />
      <el-table-column
        prop="address"
        label="估价收益率"
        width="150"
      />
      <el-table-column
        prop="address"
        label="加权平均结全价"
        width="180"
      />
      <el-table-column
        prop="address"
        label="修正久期"
        width="180"
      />
      <el-table-column
        prop="address"
        label="利率久期"
        width="180"
      />
      <el-table-column
        prop="address"
        label="利差久期"
        width="180"
      />
      <el-table-column
        prop="address"
        label="凸性"
        width="180"
      />
      <el-table-column
        prop="address"
        label="利率凸性"
        width="180"
      />
      <el-table-column
        prop="address"
        label="利差凸性"
        width="180"
      />
      <el-table-column
        prop="address"
        label="基点价值"
        width="180"
      />
      <el-table-column
        prop="address"
        label="利率基点价值"
        width="180"
      />
      <el-table-column
        prop="address"
        label="利差基点价值"
        width="180"
      />
      <el-table-column
        prop="address"
        label="均衡票面价格"
        width="180"
      />
      <el-table-column
        prop="address"
        label="均衡行权价格"
        width="180"
      />
      <el-table-column
        prop="address"
        label="可信度"
      />
    </el-table>
    <el-pagination
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
export default {
  name: 'QueryValuation',
  data() {
    return {
      formData: {
        startTime: '',
        endTime: '',
        bondsPublisher: ''
      },
      valuationList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
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
</style>
