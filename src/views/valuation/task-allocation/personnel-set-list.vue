<template>
  <div class="app-container">
    <div style="margin: 10px">
      <el-button type="primary" class="float-left" @click="add">新增任务规则</el-button>
    </div>
    <div>
      <el-table ref="multipleTable" :data="taskAllocationList" tooltip-effect="dark">
        <el-table-column prop="taskRangeId" align="center" label="选择" min-width="5%">
          <template slot-scope="scope">
            <el-radio :label="scope.row.taskRangeId" class="textRadio">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="taskRangeName" label="范围名称" min-width="35%" show-overflow-tooltip />
        <el-table-column prop="userId" label="分配人员" min-width="35%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ ruleDetail(scope.row.groupId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="复核状态" min-width="10%" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $dft('APPROVE_STATUS', scope.row.approveStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%" prop="busiStatus">
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="scope.row.approveStatus === '01'?true:false" @click="edit(scope.row.groupId)">设置</el-button>
            <el-button type="text" size="small" :disabled="scope.row.approveStatus === '01'?true:false" @click="delTaskAllocation(scope.row.groupId)">删除</el-button>
            <el-button v-if="scope.row.busiStatus==='02'" type="text" size="small" @click="stop(scope.row.groupId)">停用</el-button>
            <el-button v-else-if="scope.row.busiStatus==='03'" type="text" size="small" @click="start(scope.row.groupId)">启用</el-button>
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
      <el-dialog v-if="personnelFormVisible" width="600px" title="新增任务规则" :visible.sync="personnelFormVisible">
        <PersonnelSetForm
          ref="refPersonnelSetForm"
          :disabled="disabled"
          :group-id="groupId"
          @saveCallBack="saveCallBack"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="personnelFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import PersonnelSetForm from '@/views/valuation/task-allocation/personnel-set-form'
import { taskAllocationList, editTaskAllocation, delTaskAllocation, personnelList } from '@/api/valuation/task-allocation.js'
export default {
  name: 'PersonnelSetList',
  components: { PersonnelSetForm },
  data() {
    return {
      personnelFormVisible: false,
      taskAllocationList: [],
      personnelList: [],
      distRatioList: [], // 人员任务分配列表
      groupId: '',
      disabled: false,
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
    }
  },
  beforeMount() {
    this.load()
  },
  methods: {
    load() {
      personnelList('00001').then(response => {
        this.personnelList = response
      })
      taskAllocationList({ page: this.page }).then(response => {
        const { taskAllocationDtoList, distRatioDetail, page } = response
        this.taskAllocationList = taskAllocationDtoList
        this.distRatioList = distRatioDetail
        this.page = page
      })
    },
    disableEdit() {
      this.$message({
        message: '不能操作待审核状态的数据！',
        type: 'warning',
        showClose: true
      })
    },
    delTaskAllocation(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTaskAllocation({ groupId: id }).then(response => {
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
    start(id) {
      editTaskAllocation({ groupId: id, busiStatus: '02' }).then(response => {
        console.log(id)
        this.load()
        this.$message({
          message: '已启用！',
          type: 'success',
          showClose: true
        })
      })
    },
    stop(id) {
      editTaskAllocation({ groupId: id, busiStatus: '03' }).then(response => {
        this.load()
        this.$message({
          message: '已停用！',
          type: 'success',
          showClose: true
        })
      })
    },
    edit(id) {
      this.groupId = id
      this.disabled = false
      this.personnelFormVisible = true
    },
    add() {
      this.groupId = ''
      this.disabled = false
      this.personnelFormVisible = true
    },
    saveCallBack() {
      this.personnelFormVisible = false
      this.load()
    },
    ruleDetail(groupId) {
      const that = this
      const ruleList = this.$lodash.get(this.distRatioList, groupId)
      let ruleDetail = ''
      this.$lodash.forEach(ruleList, function(value, key) {
        ruleDetail += that.personnelList[that.$lodash.findIndex(that.personnelList, ['userId', value.userId])].userName + ':' + value.distRatio + '%'
        if (key < ruleList.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.load()
    },
    save() {
      this.$refs.refPersonnelSetForm.save()
    }
  }
}
</script>

<style scoped>

</style>
