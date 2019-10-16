<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="curveRelaTempCreate">
        新增规则
      </el-button>
    </div>

    <el-table :data="curveSetRelaList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="曲线名称" width="400px">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线间关系" width="290px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="curveSetRelaEdit(scope.$index, curveSetRelaList)">详情</span>
        </template>
      </el-table-column>
      <el-table-column label="复核状态" width="150px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.approveStatus==='01'">待审核</span>
          <span v-else-if="scope.row.approveStatus==='02'">审核通过</span>
          <span v-else>审批不通过</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">编辑</el-button>
          <el-button v-else type="text" size="big" @click="curveSetRelaEdit(scope.$index, curveSetRelaList)">
            编辑
          </el-button>
          <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">删除</el-button>
          <el-button v-else type="text" size="big" @click="curveSetRelaDel(scope.$index, curveSetRelaList)">删除
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
    <el-dialog :visible.sync="dialogFormVisible" width="80%">
      <CurveSetRelaForm
        ref="curveSetRela"
        :temp-main-id="tempMainId"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="storageCurveSetRela()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryCurveSetRela,
  saveRelaTempMain,
  delcurveSetRela
} from '@/api/curve/curve-set-rela.js'
import CurveSetRelaForm from '@/views/curve/set/curve-set-rela-form.vue'

export default {
  name: 'CurveSetRela',
  components: {
    CurveSetRelaForm
  },
  data() {
    return {
      curveSetRelaList: [],
      tempMainId: '',
      temp: {
        curveId: '',
        approveStatus: '',
        lastUpdBy: '',
        lastUpdTs: ''
      },
      dialogFormVisible: false,
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getCurveSetRelaList()
  },
  methods: {
    // 查询dto列表
    getCurveSetRelaList() {
      queryCurveSetRela({ page: this.page }).then(response => {
        this.curveSetRelaList = response.dataList
        this.page = response.page
        setTimeout(1.5 * 1000)
      })
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    // 新建规则
    curveRelaTempCreate() {
      this.temp = []
      this.dialogFormVisible = true
    },
    // dto列表修改操作
    curveSetRelaEdit(index, rows) {
      this.temp = rows[index]
      this.tempMainId = this.temp.tempMainId
      this.dialogFormVisible = true
    },
    // dto列表删除
    curveSetRelaDel(index, rows) {
      delcurveSetRela(rows[index]).then(response => {
        rows.splice(index, 1)
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    disableEdit() {
      this.$message({
        type: 'warning',
        message: '不能操作待审核状态的数据'
      })
    },
    storageCurveSetRela() {
      console.info(this.$refs.curveSetRela.tmp_tempInfo)
      var tmp_tempInfo = this.$refs.curveSetRela.tmp_tempInfo
      var tempList = this.$refs.curveSetRela.tempList
      if (tmp_tempInfo.length <= 0) {
        this.$message({
          type: 'warning',
          message: '无可提交数据'
        })
        return
      }
      if (tempList.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择曲线关系模板'
        })
        return
      }
      saveRelaTempMain(tmp_tempInfo).then(response => {
        // this.curveCurveSetRelaList.unshift(this.temp)
        this.dialogFormVisible = false
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getCurveSetRelaList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getCurveSetRelaList()
    }
  }
}
</script>

<style scoped>

</style>
