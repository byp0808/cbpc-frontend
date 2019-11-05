<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增规则</el-button>
      <el-button type="primary" @click="toggleSelection()">复制新增</el-button>
    </div>
    <el-table
      ref="refRecCureTable"
      :data="recCurveList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column align="center" label="选择" min-width="15%">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.row.id" class="textRadio">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="ruleName"
        label="规则名称"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        prop="bondFilterId"
        label="规则说明"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ ruleDetail(scope.row.bondFilterId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="curveId"
        label="估值曲线"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ curveName(scope.row.curveId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="approveStatus"
        label="状态"
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
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            :disabled="!(scope.row.approveStatus!=='01')"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            :disabled="!(scope.row.approveStatus==='02' || scope.row.approveStatus==='03')"
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            :disabled="!isShowChangeStatusBtn(scope.row.busiStatus, scope.row.approveStatus)"
            type="text"
            size="small"
            @click.native.prevent="changeStatus(scope.row.busiStatus, scope.row.id)"
          >
            {{ statusText(scope.row.busiStatus) }}
          </el-button>
          <el-button
            v-if="scope.row.relationId"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.relationId)"
          >
            草稿
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
    <el-dialog v-if="recCurveFormVisible" width="92%" title="设置估值曲线推荐规则" :visible.sync="recCurveFormVisible">
      <RecCurveForm
        ref="refRecCurveForm"
        :rec-curve-data="recCurveData"
        :business-id="recCureId"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="recCurveFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RecCurveForm from '@/views/valuation/rec-cure/rec-curve-form.vue'
import { queryRecCurveList, deleteRecCurve, switchStatus } from '@/api/valuation/rec-curve.js'
export default {
  name: 'RecCurveList',
  components: {
    RecCurveForm
  },
  data() {
    return {
      recCurveFormVisible: false,
      recCureId: '',
      recCurveList: [],
      curveList: [],
      bondFilterList: [],
      recCurveData: {},
      radio: '',
      isCopy: false, // 复制新增
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    statusText() {
      return function(status) {
        switch (status) {
          case '02':
            return '停用'
          case '03':
            return '启用'
        }
      }
    },
    curveName() {
      return function(curveId) {
        const index = this.$lodash.findIndex(this.curveList, { curveId: curveId })
        if (index >= 0) {
          return this.$lodash.get(this.curveList, [index, 'curveName'])
        }
      }
    },
    ruleDetail() {
      return function(bondFilterId) {
        const ruleList = this.$lodash.get(this.bondFilterList, bondFilterId)
        let ruleDetail = ''
        this.$lodash.forEach(ruleList, function(value, key) {
          ruleDetail += value.ruleCode + ' = ' + value.ruleValue
          if (key < ruleList.length - 1) {
            ruleDetail += ', '
          }
        })
        return ruleDetail
      }
    }
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      queryRecCurveList({ page: this.page }).then(response => {
        const { valuationCurves, curveList, ruleDetail, page } = response
        this.recCurveList = valuationCurves
        this.curveList = curveList
        this.bondFilterList = ruleDetail
        this.page = page
      })
    },
    save() {
      this.$refs.refRecCurveForm.save()
    },
    toDetail(id) {
      this.isCopy = false
      this.recCureId = id
      this.recCurveFormVisible = true
    },
    toDelete(id) {
      this.$confirm('确认删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteRecCurve(id).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            showClose: true
          })
          this.loadTable()
        })
      }).catch(() => {
      })
    },
    toAdd() {
      this.recCureId = ''
      this.$store.commit('recCurve/setRecCurveInfo', {})
      this.recCurveFormVisible = true
    },
    toCopy() {
      this.$store.dispatch('recCurve/copyCurveInfo')
      this.recCurveFormVisible = true
    },
    saveCallBack() {
      this.recCurveFormVisible = false
      this.loadTable()
    },
    changeStatus(status, id) {
      if (status === '02') {
        this.$confirm('规则正在启用中，确定停用吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            switchStatus({ id: id, busiStatus: '03' }).then(response => {
              this.$message.success('提交复核成功')
              this.loadTable()
            })
          })
      } else if (status === '03') {
        this.$confirm('规则已经停用，确定启用吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            switchStatus({ id: id, busiStatus: '02' }).then(response => {
              this.$message.success('提交复核成功')
              this.loadTable()
            })
          })
      }
    },
    toggleSelection() {
      if (this.radio === '') {
        this.$message({
          type: 'warning',
          message: '请选中要复制的曲线关系规则'
        })
      } else {
        this.disabled = false
        this.isCopy = true
        this.recCureId = this.radio
        this.recCurveFormVisible = true
      }
    },
    isShowChangeStatusBtn(busiStatus, approveStatus) {
      return approveStatus !== '01' && (busiStatus === '02' || busiStatus === '03')
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
