<template>
  <div class="app-container">
    <div style="margin: 10px">
      <el-button type="primary" class="float-left" @click="addRule">新增规则</el-button>
      <el-button type="primary" class="float-left">规则重复性校验</el-button>
    </div>
    <div>
      <el-table ref="multipleTable" :data="taskRangeList" tooltip-effect="dark">
        <el-table-column align="center" label="选择" min-width="5%">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" class="textRadio">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="taskRangeName" label="规则描述" min-width="30%" show-overflow-tooltip />
        <el-table-column prop="filterId" label="规则详细" min-width="40%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ ruleDetail(scope.row.filterId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="复核状态" min-width="10%" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $dft('APPROVE_STATUS', scope.row.approveStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%" prop="busiStatus">
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="scope.row.approveStatus === '01'?true:false" @click="edit(scope.row.id)">设置
            </el-button>
            <el-button type="text" size="small" :disabled="scope.row.approveStatus === '01'?true:false" @click="deleteInfo(scope.row.id)">删除
            </el-button>
            <el-button v-if="scope.row.busiStatus==='02'" type="text" size="small" @click="stop(scope.row.id)">停用</el-button>
            <el-button v-else-if="scope.row.busiStatus==='03'" type="text" size="small" @click="start(scope.row.id)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        :current-page="page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div>
      <el-dialog v-if="ruleSetFormVisible" width="92%" title="设置任务分配规则" :visible.sync="ruleSetFormVisible">
        <RuleSetForm
          ref="refRuleSetForm"
          :business-id="taskRangeId"
          @saveCallBack="saveCallBack"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="ruleSetFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RuleSetForm from '@/views/valuation/task-allocation/rule-set-form.vue'
import { queryTaskRangeList, editBusiStatus, delTaskRange } from '@/api/valuation/task-allocation.js'

export default {
  name: 'RuleSetList',
  components: { RuleSetForm },
  data() {
    return {
      ruleSetFormVisible: false,
      taskRangeId: '',
      taskRangeList: [],
      bondFilterList: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
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
    }
  },
  beforeMount() {
    this.load()
  },
  methods: {
    load() {
      queryTaskRangeList({ page: this.page }).then(response => {
        const { taskRangeList, ruleDetail, page } = response
        this.taskRangeList = taskRangeList
        this.bondFilterList = ruleDetail
        this.page = page
      })
    },
    ruleDetail(bondFilterId) {
      const ruleList = this.$lodash.get(this.bondFilterList, bondFilterId)
      let ruleDetail = ''
      this.$lodash.forEach(ruleList, function(value, key) {
        ruleDetail += value.ruleCode + ' = ' + value.ruleValue
        if (key < ruleList.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    save() {
      this.$refs.refRuleSetForm.save()
    },
    saveCallBack() {
      this.ruleSetFormVisible = false
      this.load()
    },
    stop(id) {
      editBusiStatus({ id: id, busiStatus: '03' }).then(response => {
        this.load()
        this.$message({
          message: '已停用！',
          type: 'success',
          showClose: true
        })
      })
    },
    start(id) {
      editBusiStatus({ id: id, busiStatus: '02' }).then(response => {
        this.load()
        this.$message({
          message: '已启用！',
          type: 'success',
          showClose: true
        })
      })
    },
    addRule() {
      this.taskRangeId = ''
      this.ruleSetFormVisible = true
    },
    edit(id) {
      this.taskRangeId = id
      this.ruleSetFormVisible = true
    },
    deleteInfo(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTaskRange(id).then(response => {
          this.load()
          this.$message({
            message: '删除成功！',
            type: 'success',
            showClose: true
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.load()
    }
  }
}
</script>

<style scoped>

</style>
