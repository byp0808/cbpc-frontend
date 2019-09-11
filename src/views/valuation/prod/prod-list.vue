<template>
  <div class="app-container">
    <el-table
      :data="prodList"
      style="width: 100%"
    >
      <el-table-column
        prop="prodName"
        label="产品名称"
        width="180"
      />
      <el-table-column
        prop="prodBasic"
        label="基础产品"
        width="180"
      />
      <el-table-column
        prop="listingDate"
        label="产品上市日期"
      >
        <template slot-scope="{row}">
          {{ $moment(row.listingDate).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="delistingDate"
        label="产品退市日期"
      >
        <template slot-scope="{row}">
          {{ $moment(row.delistingDate).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="busiStatus"
        label="产品状态"
      />
      <el-table-column
        prop="approveStatus"
        label="审批状态"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleClick(row)">查看</el-button>
          <el-button type="text" size="small" @click="toEdit(row.id)">编辑</el-button>
        </template>
      </el-table-column>
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
      this.page = page
    })
  },
  methods: {
    toEdit(prodId) {
      this.$store.commit('valuationProd/setProdId', prodId)
      this.$router.push({ name: 'ValuationProdForm' })
    },
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
