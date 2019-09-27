<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAddNew">新增规则</el-button>
      <el-button type="primary" @click="toAdd">复制新增</el-button>
    </div>
    <el-table
      ref="refTblBondFilter"
      :data="bondTempFilters.dataList"
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
        label="模板名称"
        width="100"
      />
      <el-table-column
        prop="rules"
        label="筛选规则 "
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ ruleDetail(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="whilte"
        label="白名单"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ whiteDetail(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="black"
        label="黑名单"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ blackDetail(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ $dft("APPROVE_SATAUS", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.tempId, true)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.tempId, false)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.tempId,scope.row.tempName)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="bondTempFilters.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="bondTempFilters.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="bondTempFilters.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="bondFilterVisible" width="92%" title="新增债券筛选器模板" :visible.sync="bondFilterVisible">
      <TmpBondFilter
        ref="refTmpBondFilter"
        :filter-id="tempId"
        :disabled="disabled"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="bondFilterVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TmpBondFilter from '@/views/common/bond-filter/filter-tmpl.vue'
import { queryAllTempLists, deleteByTempId } from '@/api/common/bond-filter-tmpl.js'
export default {
  name: 'TEMPLATES',
  components: {
    TmpBondFilter
  },
  data() {
    return {
      bondFilterVisible: false,
      tempId: '',
      disabled: '',
      tempName: '',
      bondTempFilters: {
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      }
    }
  },
  computed: {
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.bondTempFilters.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.bondTempFilters.page.pageNumber = currentPage
      this.loadTable()
    },

    loadTable() {
      queryAllTempLists({ page: this.bondTempFilters.page }).then(response => {
        const { dataList, page } = response
        this.bondTempFilters.dataList = dataList
        this.bondTempFilters.page = page
      })
    },
    save() {
      if (this.disabled) {
        this.bondFilterVisible = false
        return
      }
      this.$prompt('请输入模板名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.tempName
      }).then(({ value }) => {
        this.$refs.refTmpBondFilter.save(value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '保存失败'
        })
      })
    },
    toDelete(tempId, tempName) {
      this.$prompt('确定删除如下模板信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: tempName
      }).then(async() => {
        await deleteByTempId(tempId)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.loadTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        })
      })
    },
    ruleDetail(index) {
      console.log(this.bondTempFilters.dataList[index].rules)
      const list = this.bondTempFilters.dataList[index].rules
      let ruleDetail = ''
      this.$lodash.forEach(list, function(value, key) {
        ruleDetail += value.ruleCode + ' = ' + value.ruleValue
        if (key < list.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    whiteDetail(index) {
      const list = this.bondTempFilters.dataList[index].white
      let ruleDetail = ''
      this.$lodash.forEach(list, function(value, key) {
        ruleDetail += value.bondNo
        if (key < list.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    blackDetail(index) {
      const list = this.bondTempFilters.dataList[index].black
      let ruleDetail = ''
      this.$lodash.forEach(list, function(value, key) {
        ruleDetail += value.bondNo
        if (key < list.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    toDetail(id, disabled) {
      console.log('toDetail' + id + disabled)
      this.tempId = id
      this.disabled = disabled
      this.bondFilterVisible = true
    },
    toAdd() {
      this.bondFilterVisible = true
    },
    toAddNew() {
      this.tempId = null
      this.$refs.refTblBondFilter.clearSelection()
      this.bondFilterVisible = true
    },
    saveCallBack() {
      this.bondFilterVisible = false
      this.loadTable()
    },
    handleSelectionChange(row) {
      this.tempId = row.map(i => {
        return i.tempId
      })
      this.tempName = row.map(i => {
        return i.tempName
      })
      console.log(this.tempId)
      console.log(this.tempName)
    }
  }
}
</script>

<style scoped>

</style>
