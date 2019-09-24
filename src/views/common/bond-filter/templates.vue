<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAddNew">新增规则</el-button>
      <el-button type="primary" @click="toAdd">复制新增</el-button>
    </div>
    <el-table
      ref="refTblBondFilter"
      :data="bondTempFilters"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="id"
        label="模板ID"
        width="100"
      />
      <el-table-column
        prop="filterName"
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
        prop="blacklist"
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
      />
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
            @click.native.prevent="toDetail(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="mvToBlackList(scope.$index, bondListAll)"
          >
            停用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="bondFilterVisible" width="92%" title="新增债券筛选器模板" :visible.sync="bondFilterVisible">
      <TmpBondFilter
        ref="refTmpBondFilter"
        :filter-id="tempNo"
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
import { queryAllTempLists } from '@/api/common/bond-filter-tmpl.js'
export default {
  name: 'TEMPLATES',
  components: {
    TmpBondFilter
  },
  data() {
    return {
      bondFilterVisible: false,
      tempNo: '',
      filterName: '',
      bondTempFilters: [],
      blackList: [],
      whiteList: [],
      ruleList: []
    }
  },
  computed: {
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      queryAllTempLists().then(response => {
        const { datalist } = response
        this.bondTempFilters = datalist
      })
    },
    save() {
      this.$prompt('请输入模板名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.filterName
      }).then(({ value }) => {
        this.$refs.refTmpBondFilter.save(value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '保存失败'
        })
      })
    },
    ruleDetail(index) {
      const list = this.bondTempFilters[index].rules
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
      const list = this.bondTempFilters[index].white
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
      const list = this.bondTempFilters[index].black
      let ruleDetail = ''
      this.$lodash.forEach(list, function(value, key) {
        ruleDetail += value.bondNo
        if (key < list.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    toDetail(id) {
      console.log('toDetail' + id)
      this.tempNo = id
      this.bondFilterVisible = true
    },
    toAdd() {
      this.bondFilterVisible = true
    },
    toAddNew() {
      this.tempNo = null
      this.$refs.refTblBondFilter.clearSelection()
      this.bondFilterVisible = true
    },
    saveCallBack() {
      this.bondFilterVisible = false
      this.loadTable()
    },
    handleSelectionChange(row) {
      this.tempNo = row.map(i => {
        return i.filterId
      })
      this.filterName = row.map(i => {
        return i.filterName
      })
      console.log(this.filterName)
    }
  }
}
</script>

<style scoped>

</style>
