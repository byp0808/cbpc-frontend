<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增强制推荐规则</el-button>
    </div>
    <el-table
      ref="refRecCureTable"
      :data="mandatoryList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="id"
        label="规则ID"
        show-overflow-tooltip
        width="145"
      />
      <el-table-column
        prop="ruleName"
        label="规则描述"
        show-overflow-tooltip
        width="165"
      />
      <el-table-column
        prop="bondFilterId"
        label="资产规划"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ ruleDetail(scope.row.bondFilterId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="recoDirection"
        label="强制推荐方向"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('RECO_DIRECTION', row.recoDirection) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="approveStatus"
        label="审核状态"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('APPROVE_STATUS', row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="240"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.approveStatus==='02'"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            规则调整
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
    <el-dialog v-if="recCurveFormVisible" width="92%" title="新增估值强制推荐规则" :visible.sync="recCurveFormVisible">
      <RecMandatoryForm
        ref="RecMandatoryForm"
        :rec-mandatory-data="recMandatoryData"
        :business-id="mandatoryId"
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
import RecMandatoryForm from '@/views/valuation/rec-mandatory/rec-mandatory-form.vue'
import { queryMandatoryList, deleteRecMandatory, switchStatus } from '@/api/valuation/rec-mandatory.js'
export default {
  name: 'RecMandatoryList',
  components: {
    RecMandatoryForm
  },
  data() {
    return {
      recCurveFormVisible: false,
      mandatoryId: '',
      mandatoryList: [],
      bondFilterList: [],
      recMandatoryData: {},
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
            return '启用中'
          case '03':
            return '停用中'
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
      queryMandatoryList({ page: this.page }).then(response => {
        const { recForces, ruleDetail, page } = response
        this.page = page
        this.mandatoryList = recForces
        this.bondFilterList = ruleDetail
      })
    },
    save() {
      this.$refs.RecMandatoryForm.save()
    },
    toDetail(id) {
      this.mandatoryId = id
      this.recCurveFormVisible = true
    },
    toDelete(id) {
      this.$confirm('确认删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteRecMandatory(id).then(response => {
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
      this.mandatoryId = ''
      this.$store.commit('recMandatory/setRecMandatoryInfo', {})
      this.recCurveFormVisible = true
    },
    saveCallBack() {
      this.recCurveFormVisible = false
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
