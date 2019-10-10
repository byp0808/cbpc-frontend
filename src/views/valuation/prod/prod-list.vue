<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增产品</el-button>
    </div>
    <el-table
      :data="prodList"
      style="width: 100%"
      empty-text="空"
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
        <template v-if="row.listingDate" slot-scope="{row}">
          {{ $moment(row.listingDate).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="delistingDate"
        label="产品退市日期"
      >
        <template v-if="row.delistingDate" slot-scope="{row}">
          {{ $moment(row.delistingDate).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="busiStatus"
        label="产品状态"
      >
        <template slot-scope="{row}">
          {{$dft('BUSI_STATUS', row.busiStatus)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="approveStatus"
        label="审批状态"
      >
        <template slot-scope="{row}">
          {{$dft('APPROVE_STATUS', row.approveStatus)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="toDetail(row.id)">查看</el-button>
          <el-button type="text" size="small" @click="toEdit(row.id)">编辑</el-button>
          <el-button v-if="!row.approveStatus" type="text" size="small" @click="toDelete(row.id)">删除</el-button>
          <el-button v-if="row.relationId" type="text" size="small" @click="toEdit(row.relationId)">进入草稿箱</el-button>
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
import { prodList, delProd } from '@/api/valuation/prod.js'
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
    this.queryList()
  },
  methods: {
    toAdd() {
      this.$store.commit('valuationProd/clear')
      this.$router.push({ name: 'ValuationProdForm' })
    },
    toEdit(prodId) {
      this.$store.commit('valuationProd/setProdId', prodId)
      this.$router.push({ name: 'ValuationProdForm' })
    },
    toDetail(prodId) {
      this.$store.commit('valuationProd/setProdId', prodId)
      this.$router.push({ name: 'ValuationProdDetail' })
    },
    toDelete(prodId) {
      this.$confirm('是否要删除估值产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProd(prodId).then(response => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.queryList()
        })
      })
    },
    queryList() {
      prodList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.prodList = dataList
        this.page = page
      })
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.queryList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.queryList()
    }
  }
}
</script>

<style scoped>

</style>
