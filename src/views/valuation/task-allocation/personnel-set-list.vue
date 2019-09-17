<template>
  <div class="app-container">
    <div style="margin: 10px">
      <el-button type="primary" class="float-left" @click="personnelFormVisible=true">新增人员设置</el-button>
    </div>
    <div>
      <el-table ref="multipleTable" :data="personnelList" tooltip-effect="dark">
        <el-table-column align="center" label="选择" min-width="5%">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id" class="textRadio">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="taskRangeName" label="规则名称" min-width="35%" show-overflow-tooltip />
        <el-table-column prop="userId" label="分配人员" min-width="35%" show-overflow-tooltip />
        <el-table-column prop="approveStatus" label="复核状态" min-width="10%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.approveStatus==='01'">待审核</span>
            <span v-else-if="scope.row.approveStatus==='02'">审核通过</span>
            <span v-else>审批不通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%" prop="busiStatus">
          <template slot-scope="scope">
            <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">设置</el-button>
            <el-button v-else type="text" size="small" @click="edit(scope.row.id,scope.row.curveId,scope.row.relativeCurveId)">设置</el-button>
            <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">删除</el-button>
            <el-button v-else type="text" size="small" @click="delCurveRelation(scope.row.id)">删除</el-button>
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
      <el-dialog v-if="personnelFormVisible" width="600px" title="新增人员设置" :visible.sync="personnelFormVisible">
        <PersonnelSetForm />
        <div slot="footer" class="dialog-footer">
          <el-button @click="personnelFormVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import PersonnelSetForm from '@/views/valuation/task-allocation/personnel-set-form'
export default {
  name: 'PersonnelSetList',
  components: { PersonnelSetForm },
  data() {
    return {
      personnelFormVisible: false,
      personnelList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  methods: {
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
