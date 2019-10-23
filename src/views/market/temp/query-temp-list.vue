<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增</el-button>
      <el-button type="primary" class="float-left" @click="copyAdd">复制新增</el-button>
    </div>
    <el-table
      ref="refMarketTempTable"
      border
      :data="marketTempList"
      tooltip-effect="dark"
      style="width: 1286px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="选择" style="width: 100px">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.row.id" class="textRadio" @change="clickRow(scope.row.id)">&nbsp;</el-radio>
        </template>
      </el-table-column>
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
        prop="address"
        label="操作"
        width="400"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail('EDIT', scope.row.id)"
          >
            设置
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail('VIEW', scope.row.id)"
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
    <el-dialog v-if="marketTempFormVisible" width="80%" top="5vh" :visible.sync="marketTempFormVisible" :close="closeDialog">
      <marketTempForm
        ref="MarketTempForm"
        :market-temp-data="marketTempData"
        :business-id="marketTempId"
        :op-type="opType"
        :is-copy="isCopy"
        @saveCallBack="saveCallBack"
        @closeDialog="closeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import MarketTempForm from '@/views/market/temp/query-temp-form.vue'
import { queryTempList, deletemarketTemp } from '@/api/market/market-temp.js'
export default {
  name: 'MarketTempList',
  components: {
    MarketTempForm
  },
  data() {
    return {
      marketTempFormVisible: false,
      marketTempId: '',
      radio: '',
      opType: '',
      isCopy: false,
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
    clickRow(id) {
      // console.log(id)
      this.marketTempId = id
    },
    loadTable() {
      queryTempList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.page = page
        this.marketTempList = dataList
      })
    },
    closeDialog() {
      this.marketTempFormVisible = false
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
    toDetail(opType, id) {
      // console.log(id)
      this.opType = opType
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
        await deletemarketTemp(id)
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
      this.opType = 'EDIT'
      this.$store.commit('marketTemp/setMarketTempInfo', {})
      this.marketTempFormVisible = true
    },
    copyAdd() {
      if (this.marketTempId === '') {
        this.$message({
          type: 'warning',
          message: '请选中要复制的行情模板'
        })
      } else {
        this.disabled = false
        this.isCopy = true
        this.marketTempFormVisible = true
      }
    },
    saveCallBack() {
      this.marketTempFormVisible = false
      this.loadTable()
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
