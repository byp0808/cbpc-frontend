<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增</el-button>
    </div>
    <el-table
      ref="refMarketTempTable"
      border
      :data="marketTempList"
      tooltip-effect="dark"
      style="width: 1286px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="选择"
        type="selection"
        width="55"
      />
      <el-table-column
        prop="tempName"
        label="行情展示模板名称"
        show-overflow-tooltip
        width="530"
      />
      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
        width="300"
      />
      <el-table-column
        prop="approveStatus"
        label="审核状态"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('APPROVE_STATUS', row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="300"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkStatus(scope.row.approveStatus)"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            设置
          </el-button>
          <el-button
            v-if="checkStatus(scope.row.approveStatus)"
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="isShowChangeStatusBtn(scope.row.busiStatus)"
            type="text"
            size="small"
          >
            查看
          </el-button>
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
    <el-dialog v-if="marketTempFormVisible" width="80%" top="5vh" :visible.sync="marketTempFormVisible">
      <marketTempForm
        ref="MarketTempForm"
        :kd-temp-data="marketTempData"
        :business-id="marketTempId"
        @saveCallBack="saveCallBack"
      />
    </el-dialog>
  </div>
</template>

<script>
import MarketTempForm from '@/views/market/temp/query-temp-form.vue'
export default {
  name: 'MarketTempList',
  components: {
    MarketTempForm
  },
  data() {
    return {
      marketTempFormVisible: false,
      marketTempId: '',
      marketTempList: [],
      marketTempData: {},
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      multipleSelection: []
    }
  },
  computed: {
    statusText() {
      return function(status) {
        switch (status) {
          case '02':
            return '启用中'
          case '03':
            return '停用中'
        }
      }
    }
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
    },
    checkStatus(approveStatus) {
      if (approveStatus === '01') {
        return false
      }
      return true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    save(formName) {
      this.marketTempId = ''
      this.$refs.MarketTempForm.save(formName)
    },
    cancel() {
      this.$store.commit('marketTemp/setMarketTempInfo', {})
      this.marketTempFormVisible = false
    },
    toDetail(id) {
      this.marketTempId = id
      this.marketTempFormVisible = true
    },
    toDelete(id) {
      // console.log(id)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async() => {
        // await deletemarketTemp(id)
        this.loadTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    toAdd() {
      // console.log('toAdd')
      this.marketTempId = ''
      this.$store.commit('marketTemp/setMarketTempInfo', {})
      this.marketTempFormVisible = true
    },
    saveCallBack() {
      this.marketTempFormVisible = false
      this.loadTable()
    },
    isShowChangeStatusBtn(status) {
      return status === '02' || status === '03'
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.loadTable()
    }
  }
}
</script>

<style scoped>

</style>
