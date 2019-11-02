<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" class="float-left" @click="toAdd">新增规则</el-button>
      <el-button type="primary" class="float-left" @click="copyAdd">复制新增</el-button>
    </div>
    <el-table
      ref="refNkTempTable"
      :data="nkTempList"
      tooltip-effect="dark"
      style="width: 1286px"
      border
      @selection-change="handleSelectionChange"
      @row-click="clickRow"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="tempName"
        label="远期NK值规则名称"
        show-overflow-tooltip
        width="330"
      />
      <el-table-column
        prop="nkValues"
        label="规则详细"
        show-overflow-tooltip
        width="600"
      />
      <el-table-column
        prop="approveStatus"
        label="复核状态"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('REVIEW_STATUS', row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.approveStatus === '01' || (scope.row.busiStatus === '04' && scope.row.approveStatus === '01' )"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            :disabled="scope.row.approveStatus === '01' || (scope.row.busiStatus === '04' && scope.row.approveStatus === '01' )"
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            删除
          </el-button>
          <!--          <el-button-->
          <!--            v-if="isShowChangeStatusBtn(scope.row.busiStatus)"-->
          <!--            type="text"-->
          <!--            size="small"-->
          <!--          >-->
          <!--            {{ statusText(scope.row.busiStatus) }}-->
          <!--          </el-button>-->
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
    <el-dialog v-if="nkTempFormVisible" width="70%" title="远期期限模板设置" :visible.sync="nkTempFormVisible">
      <nkTempForm
        ref="NkTempForm"
        :nk-temp-data="nkTempData"
        :business-id="nkTempId"
        :is-copy="isCopy"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="nkTempFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save('NkTempForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NkTempForm from '@/views/curve/timetemp/curve-nktemp-form.vue'
import { querynkTempList, deletenkTemp } from '@/api/curve/curve-nktemp-list.js'
export default {
  name: 'NkTempList',
  components: {
    NkTempForm
  },
  data() {
    return {
      nkTempFormVisible: false,
      isCopy: false,
      flag: false,
      nkTempId: '',
      copynkTempId: '',
      tmpNkTempId: '',
      nkTempList: [],
      nkTempData: {},
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
      if (this.tmpNkTempId === '') {
        this.tmpNkTempId = row.id
      }
      this.nkTempId = row.id
      this.flag = !this.flag
      this.$refs.refNkTempTable.toggleRowSelection(row, this.flag)
      if (this.tmpNkTempId !== row.id) {
        this.$refs.refNkTempTable.clearSelection()
        this.$refs.refNkTempTable.toggleRowSelection(row, true)
        this.tmpNkTempId = row.id
      }
      this.copynkTempId = this.nkTempId
    },
    loadTable() {
      querynkTempList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.page = page
        this.nkTempList = dataList
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
        this.$refs.refNkTempTable.clearSelection()
        this.$refs.refNkTempTable.toggleRowSelection(val[1], true)
      } else if (val.length === 0) {
        this.nkTempId = ''
        this.copynkTempId = ''
      } else {
        this.nkTempId = val[0].id
      }
    },
    save(formName) {
      this.nkTempId = ''
      this.$refs.NkTempForm.save(formName)
    },
    cancel() {
      this.$store.commit('nkTemp/setnkTempInfo', {})
      this.nkTempFormVisible = false
    },
    toDetail(id) {
      // console.log("toDetail")
      this.nkTempId = id
      this.isCopy = false
      this.nkTempFormVisible = true
    },
    toDelete(id) {
      // console.log(id)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async() => {
        await deletenkTemp(id)
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
      this.nkTempId = ''
      this.$store.commit('nkTemp/setnkTempInfo', {})
      this.nkTempFormVisible = true
    },
    copyAdd() {
      this.nkTempId = this.copynkTempId
      if (this.nkTempId === '') {
        this.$message({
          type: 'warning',
          message: '请选中要复制的远期期限模板'
        })
      } else {
        this.disabled = false
        this.isCopy = true
        this.nkTempFormVisible = true
      }
    },
    saveCallBack() {
      this.nkTempFormVisible = false
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
