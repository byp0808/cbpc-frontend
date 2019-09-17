<template>
  <div class="app-container">
    <div style="margin: 10px">
      <el-button type="primary" class="float-left" @click="ruleSetFormVisible=true">新增规则</el-button>
      <el-button type="primary" class="float-left">规则重复性校验</el-button>
    </div>
    <div>

      <el-table ref="multipleTable" :data="taskRangeList" tooltip-effect="dark">
        <el-table-column align="center" label="选择" min-width="5%">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" class="textRadio">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="taskRangeName" label="规则描述" min-width="35%" show-overflow-tooltip />
        <el-table-column prop="bondFilterId" label="规则详细" min-width="35%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ ruleDetail(scope.row.bondFilterId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="复核状态" min-width="10%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.approveStatus==='01'">待审核</span>
            <span v-else-if="scope.row.approveStatus==='02'">审核通过</span>
            <span v-else>审批不通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%" prop="busiStatus">
          <template slot-scope="scope">
            <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">设置
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
              @click="edit(scope.row.id,scope.row.curveId,scope.row.relativeCurveId)"
            >设置
            </el-button>
            <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">删除
            </el-button>
            <el-button v-else type="text" size="small" @click="delCurveRelation(scope.row.id)">删除</el-button>
            <el-button v-if="scope.row.busiStatus==='02'" type="text" size="small" @click="stop(scope.row.id)">停用
            </el-button>
            <el-button v-else-if="scope.row.busiStatus==='03'" type="text" size="small" @click="start(scope.row.id)">
              启用
            </el-button>
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
      <el-dialog v-if="ruleSetFormVisible" width="92%" title="新增任务分配规则" :visible.sync="ruleSetFormVisible">
        <RuleSetForm
          ref="refRuleSetForm"
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
import { queryTaskRangeList } from '@/api/valuation/task-allocation.js'

export default {
  name: 'RuleSetList',
  components: { RuleSetForm },
  data() {
    return {
      ruleSetFormVisible: false,
      taskRangeList: [],
      bondFilterList: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  beforeMount() {
    queryTaskRangeList({ page: this.page }).then(response => {
      const { taskRangeList, ruleDetail, page } = response
      this.taskRangeList = taskRangeList
      this.bondFilterList = ruleDetail
      this.page = page
    })
  },
  methods: {
    load() {
      queryTaskRangeList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.taskRangeList = dataList
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
    disableEdit() {
      this.$message({
        message: '不能操作待审核状态的数据！',
        type: 'warning',
        showClose: true
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
