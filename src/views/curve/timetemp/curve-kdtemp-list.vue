<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" class="float-left" @click="toAdd">新增规则</el-button>
      <el-button type="primary" class="float-left" @click="copyAdd">复制新增</el-button>
    </div>
    <el-table
      ref="refKdTempTable"
      border
      :data="kdTempList"
      tooltip-effect="dark"
      style="width: 1286px"
      @selection-change="handleSelectionChange"
      @row-click="clickRow"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="tempName"
        label="规则名称"
        show-overflow-tooltip
        width="330"
      />
      <el-table-column
        prop="standSlip"
        label="规则详细"
        show-overflow-tooltip
        width="600"
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
        width="200"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.approveStatus === '01' || (scope.row.busiStatus === '04' && scope.row.approveStatus === '01' )"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            设置
          </el-button>
          <el-button
            :disabled="scope.row.approveStatus === '01' || (scope.row.busiStatus === '04' && scope.row.approveStatus === '01' )"
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
            {{ statusText(scope.row.busiStatus) }}
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
    <el-dialog v-if="kdTempFormVisible" width="70%" title="关键期限模板设置" :visible.sync="kdTempFormVisible">
      <kdTempForm
        ref="KdTempForm"
        :kd-temp-data="kdTempData"
        :business-id="kdTempId"
        :is-copy="isCopy"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="kdTempFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save('KdTempForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import KdTempForm from '@/views/curve/timetemp/curve-kdtemp-form.vue'
import { querykdTempList, deletekdTemp } from '@/api/curve/curve-kdtemp-list.js'
export default {
  name: 'KdTempList',
  components: {
    KdTempForm
  },
  data() {
    return {
      kdTempFormVisible: false,
      isCopy: false,
      flag: false,
      kdTempId: '',
      tmpKdTempId: '',
      kdTempList: [],
      kdTempData: {},
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
    clickRow(row) {
      if (this.tmpKdTempId === '') {
        this.tmpKdTempId = row.id
      }
      this.kdTempId = row.id
      this.flag = !this.flag
      this.$refs.refKdTempTable.toggleRowSelection(row, this.flag)
      if (this.tmpKdTempId !== row.id) {
        this.$refs.refKdTempTable.clearSelection()
        this.$refs.refKdTempTable.toggleRowSelection(row, true)
        this.tmpKdTempId = row.id
      }
    },
    loadTable() {
      querykdTempList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.page = page
        this.kdTempList = dataList
      })
    },
    checkStatus(approveStatus) {
      if (approveStatus === '01') {
        return false
      }
      return true
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.refKdTempTable.clearSelection()
        this.$refs.refKdTempTable.toggleRowSelection(val[1], true)
      } else if (val.length === 0) {
        this.kdTempId = ''
      } else {
        this.kdTempId = val[0].id
      }
    },
    save(formName) {
      this.kdTempId = ''
      this.$refs.KdTempForm.save(formName)
    },
    cancel() {
      this.$store.commit('kdTemp/setkdTempInfo', {})
      this.kdTempFormVisible = false
    },
    toDetail(id) {
      // console.log("toDetail")
      this.kdTempId = id
      this.isCopy = false
      this.kdTempFormVisible = true
    },
    toDelete(id) {
      // console.log(id)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async() => {
        await deletekdTemp(id)
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
      this.kdTempId = ''
      this.$store.commit('kdTemp/setkdTempInfo', {})
      this.kdTempFormVisible = true
    },
    copyAdd() {
      if (this.kdTempId === '') {
        this.$message({
          type: 'warning',
          message: '请选中要复制的关键期限模板'
        })
      } else {
        this.disabled = false
        this.isCopy = true
        this.kdTempFormVisible = true
      }
    },
    saveCallBack() {
      this.kdTempFormVisible = false
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
