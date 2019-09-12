<template>
  <div id="app-container">
    <div style="margin: 10px">
      <el-button type="primary" class="float-left" @click="add">新增规则</el-button>
      <el-button type="primary" class="float-left" @click="copyAdd">复制新增</el-button>
    </div>
    <div>
      <el-table ref="multipleTable" :data="curveRelationList" tooltip-effect="dark" @row-click="clickRow">
        <el-table-column align="center" label="选择" min-width="5%">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id" class="textRadio">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="curveId" label="估值曲线" min-width="35%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ curveName(scope.row.curveId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="relativeCurveId" label="相对曲线" min-width="35%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ curveName(scope.row.relativeCurveId) }}</span>
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
            <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">编辑</el-button>
            <el-button v-else type="text" size="small" @click="edit(scope.row.id,scope.row.curveId,scope.row.relativeCurveId)">编辑</el-button>
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
      <el-dialog lock-scroll="false" width="30%" title="设置目标曲线和相对曲线关系" :visible.sync="addRulesVisible">
        <AddRulesForm
          ref="recAddRulesForm"
          :relation-id="relationId"
          :target-value="targetValue"
          :relative-value="relativeValue"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRulesVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AddRulesForm from '@/views/valuation/curve-relation/curve-relation-form.vue'
import { queryCurveRelationList, editCurveRelationBusiStatus, getCurveList } from '@/api/valuation/curve-relation.js'
export default {
  name: 'CurveList',
  comments: {
    AddRulesForm
  },
  components: { AddRulesForm },
  data() {
    return {
      addRulesVisible: false,
      // 曲线关系列表
      curveRelationList: [{
        id: '1',
        curveId: '2',
        relativeCurveId: '1',
        approveStatus: '02',
        busiStatus: '02'
      }, {
        id: '2',
        curveId: '1',
        relativeCurveId: '2',
        approveStatus: '2',
        busiStatus: '05'
      }, {
        id: '2',
        curveId: '1',
        relativeCurveId: '2',
        approveStatus: '3',
        busiStatus: '05'
      }],
      // 曲线列表
      curveList: [{
        curveId: '1',
        productName: '测试1'
      }, {
        curveId: '2',
        productName: '测试2'
      }],
      relationId: '',
      multipleSelection: [],
      targetValue: '',
      relativeValue: '',
      radio: '',
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    // 通过码值匹配曲线名称
    curveName() {
      return function(curveId) {
        const index = this.$lodash.findIndex(this.curveList, { curveId: curveId })
        if (index >= 0) {
          return this.$lodash.get(this.curveList, [index, 'productName'])
        }
      }
    }
  },
  beforeMount() {
    queryCurveRelationList({ page: this.page }).then(response => {
      const { dataList, page } = response
      this.curveRelationList = dataList
      this.page = page
      // 加载曲线列表
      getCurveList().then(response => {
        const { dataList } = response
        this.curveList = dataList
      })
    })
  },
  methods: {
    clickRow(row) {
      this.radio = row.id
      this.$store.commit('valuationCurveRelation/setCopyRelation',
        { targetValue: row.curveId,
          relativeValue: row.relativeCurveId })
    },
    load() {
      queryCurveRelationList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.curveRelationList = dataList
        this.page = page
      })
    },
    // 保存 曲线关系规则
    save() {
      if (this.$refs.recAddRulesForm.verify() === true) {
        this.$refs.recAddRulesForm.save().then(
          this.load()
        )
        this.addRulesVisible = false
      }
    },
    // 删除曲线规则
    delCurveRelation(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editCurveRelationBusiStatus({ id: id, busiStatus: '05' })
        this.load()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 启用曲线关系规则
    start(id) {
      this.$confirm('确定要启用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editCurveRelationBusiStatus({ id: id, busiStatus: '02' }).then(
          this.load()
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 停用 曲线关系规则
    stop(id) {
      this.$confirm('确定要停用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editCurveRelationBusiStatus({ id: id, busiStatus: '03' })
        this.load()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    disableEdit() {
      this.$message({
        type: 'warning',
        message: '不能操作待审核状态的数据'
      })
    },
    add() {
      this.relationId = ''
      this.targetValue = ''
      this.relativeValue = ''
      this.addRulesVisible = true
    },
    copyAdd() {
      if (this.radio === '') {
        this.$message({
          type: 'warning',
          message: '请选中要复制的曲线关系规则'
        })
      } else {
        this.relationId = ''
        this.targetValue = this.$store.state.valuationCurveRelation.targetValue
        this.relativeValue = this.$store.state.valuationCurveRelation.relativeValue
        this.addRulesVisible = true
      }
    },
    edit(id, targetValue, relativeValue) {
      this.relationId = id
      this.targetValue = targetValue
      this.relativeValue = relativeValue
      this.addRulesVisible = true
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
  .float-left{
    float: left;
  }
  .float-right{
    float: right;
  }
</style>
