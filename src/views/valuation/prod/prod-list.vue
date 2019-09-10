<template>
  <div class="app-container">
    <el-table
      :data="prodList"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="产品名称"
        width="180"
      />
      <el-table-column
        prop="name"
        label="基础产品"
        width="180"
      />
      <el-table-column
        prop="address"
        label="产品上市日期"
      />
      <el-table-column
        prop="address"
        label="产品退市日期"
      />
      <el-table-column
        prop="address"
        label="产品状态"
      />
      <el-table-column
        prop="address"
        label="审批状态"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleClick(row)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { prodList } from '@/api/valuation/prod.js'
export default {
  name: 'ValuationProdList',
  data() {
    return {
      prodList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  beforeMount() {
    prodList({ page: this.page }).then(response => {
      const { dataList, page } = response
      this.prodList = dataList
    })
  },
  methods: {
    handleSizeChange(pageSize) {
      this.todoInfo.page.pageSize = pageSize
      this.queryTaskList()
    },
    handleCurrentChange(currentPage) {
      this.todoInfo.page.pageNumber = currentPage
      this.queryTaskList()
    }
  }
}
</script>

<style scoped>

</style>
