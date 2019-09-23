<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增规则</el-button>
    </div>
    <el-table
      ref="refKdTempTable"
      :data="kdTempList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
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
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
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
            v-if="isShowChangeStatusBtn(scope.row.busiStatus)"
            type="text"
            size="small"
            @click.native.prevent="changeStatus(scope.row.busiStatus, scope.row.id)"
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
import { querykdTempList, deletekdTemp, switchStatus } from '@/api/curve/curve-kdtemp-list.js'
export default {
  name: 'KdTempList',
  components: {
    KdTempForm
  },
  data() {
    return {
      kdTempFormVisible: false,
      kdTempId: '',
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
    loadTable() {
      querykdTempList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.page = page
        this.kdTempList = dataList
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    save() {
      this.$refs.KdTempForm.save()
    },
    cancel() {
      this.$store.commit('kdTemp/setkdTempInfo', {})
      this.kdTempFormVisible = false
    },
    toDetail(id) {
      this.kdTempId = id
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
      this.$store.commit('kdTemp/setkdTempInfo', {})
      this.kdTempFormVisible = true
    },
    saveCallBack() {
      this.kdTempFormVisible = false
      this.loadTable()
    },
    changeStatus(status, id) {
      if (status === '02') {
        switchStatus({ id: id, busiStatus: '03' }).then(response => {
          this.loadTable()
        })
      } else if (status === '03') {
        switchStatus({ id: id, busiStatus: '02' }).then(response => {
          this.loadTable()
        })
      }
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
