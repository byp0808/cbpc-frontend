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
        prop="black"
        label="例外(不包括)"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ blackDetail(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="whilte"
        label="例外(包括)"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ whiteDetail(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="备注"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status"
        label="状态"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ $dft("APPROVE_STATUS", scope.row.status) }}
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
            @click.native.prevent="toDetail(scope.row.tempId, scope.row.tempName, true)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.status === '01'"
            @click.native.prevent="toDetail(scope.row.tempId, scope.row.tempName,false)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.status === '01'"
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
        <span>备注</span>
        <el-input placeholder="用来定义不同估值产品内包含的债券范围，不同产品的债券范围不能重合" style="width:500px;" />
        <span>债券集合=筛选结果+白名单</span>
        <el-button @click="bondFilterVisible = false">取消</el-button>
        <el-button type="primary" @childFn="setTempName" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TmpBondFilter from '@/views/common/bond-filter/filter-tmpl.vue'
import { queryAllTempLists, deleteByTempId } from '@/api/common/bond-filter-tmpl.js'
import { getStandard } from '@/api/valuation/prod.js'
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
      editable: false,
      bondTempFilters: {
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      },
      multipleSelection: '',
      ruleListAll: []
    }
  },
  computed: {
  },
  beforeMount() {
    this.loadTable()
    this.getAllParas()
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
    getAllParas() {
      getStandard({ paraType: 'BONND_FILTER_INDEX' }).then(response => {
        const { data } = response
        console.log(data)
        this.ruleListAll = response
      })
    },
    setTempName(message) {
      this.tempName = message
    },
    save() {
      if (this.disabled) {
        this.bondFilterVisible = false
        return
      }
      this.$confirm('是否保存模板', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.editable) {
          this.$refs.refTmpBondFilter.save(this.tempId)
        } else {
          this.$refs.refTmpBondFilter.save(null)
        }
        this.bondFilterVisible = false
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
    getRuleName(ruleCode) {
      const index = this.$lodash.findIndex(this.ruleListAll, { paraName: ruleCode })
      if (index < 0) {
        console.log('ERROR:getRuleName:' + ruleCode)
      } else {
        return this.ruleListAll[index].paraValue
      }
    },
    ruleDetail(index) {
      const list = this.bondTempFilters.dataList[index].rules
      let ruleDetail = ''
      for (const index2 in list) {
        ruleDetail += this.getRuleName(list[index2].ruleCode) + ' = ' + list[index2].ruleValue
        if (index2 < list.length - 1) {
          ruleDetail += ', '
        }
      }
      return ruleDetail
    },
    whiteDetail(index) {
      const list = this.bondTempFilters.dataList[index].white
      let ruleDetail = ''
      this.$lodash.forEach(list, function(value, key) {
        ruleDetail += value.csin
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
        ruleDetail += value.csin
        if (key < list.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    toDetail(id, name, disabled) {
      this.tempId = id
      this.disabled = disabled
      this.tempName = name
      this.editable = !disabled
      this.bondFilterVisible = true
    },
    toAdd() {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: 'error',
          message: '不可选择多个模板复制新增'
        })
        return false
      }
      this.bondFilterVisible = true
      this.disabled = false
    },
    toAddNew() {
      this.tempId = null
      this.disabled = false
      // this.$refs.refTblBondFilter.clearSelection()
      this.bondFilterVisible = true
    },
    saveCallBack() {
      console.log('saveCallBack')
      this.bondFilterVisible = false
      this.loadTable()
    },
    handleSelectionChange(row) {
      this.multipleSelection = row
      if (row[0]) {
        console.log(row[0])
        this.tempId = row[0].tempId
        this.tempName = row[0].tempName
      }
    }
  }
}
</script>

<style scoped>

</style>
