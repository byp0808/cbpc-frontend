<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增规则</el-button>
    </div>
    <el-table
      ref="refDateSetTable"
      :data="dateSetList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="ruleName"
        label="规则名称"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        prop="ruleDesc"
        label="规则说明"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ ruleDetail(scope.row.filterId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="firstDateType"
        label="首次估值日"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateSetFormat(scope.row) }}</span>
        </template>
      </el-table-column>
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
        width="240"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            :disabled="!(scope.row.approveStatus!=='01')"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            设置
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
    <el-dialog v-if="dateSetFormVisible" width="92%" title="首次估值日设置" :visible.sync="dateSetFormVisible">
      <DateSetForm
        ref="DateSetForm"
        :date-set-data="dateSetData"
        :business-id="dateSetId"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dateSetFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DateSetForm from '@/views/valuation/date-set/date-set-form.vue'
import { queryDateSetList, deleteDateSet, switchStatus } from '@/api/valuation/date-set.js'
export default {
  name: 'DateSetList',
  components: {
    DateSetForm
  },
  data() {
    return {
      dateSetFormVisible: false,
      dateSetId: '',
      dateSetList: [],
      bondFilterList: [],
      dateSetData: {},
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
    dateSetFormat() {
      return function(row) {
        let type = ''
        if (row.firstDateType === '03') {
          type += '上市日或起息日+' + row.delayDays + '天优先'
        } else {
          type = this.$dft('FIRST_DATE_TYPE', row.firstDateType)
        }

        return type
      }
    },
    ruleDetail() {
      return function(filterId) {
        const ruleList = this.$lodash.get(this.bondFilterList, filterId)
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
      queryDateSetList({ page: this.page }).then(response => {
        const { dateSets, ruleDetail, page } = response
        this.page = page
        this.dateSetList = dateSets
        this.bondFilterList = ruleDetail
      })
    },
    save() {
      this.$refs.DateSetForm.save()
    },
    toDetail(id) {
      this.dateSetId = id
      this.dateSetFormVisible = true
    },
    toDelete(id) {
      this.$confirm('确认删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteDateSet(id).then(response => {
          this.$message({
            message: '提交复核成功！',
            type: 'success',
            showClose: true
          })
          this.loadTable()
        })
      }).catch(() => {
      })
    },
    toAdd() {
      this.dateSetId = ''
      this.$store.commit('dateSet/setDateSetInfo', {})
      this.dateSetFormVisible = true
    },
    saveCallBack() {
      this.dateSetFormVisible = false
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
        this.$confirm('数据已经停用，确定启用吗？', '提示', {
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
