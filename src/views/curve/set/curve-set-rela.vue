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
          <span class="link-type" @click="curveSetRelaEdit(scope.$index, curveSetRelaList, 'VIEW')">详情</span>
        </template>
      </el-table-column>
      <el-table-column label="复核状态" width="150px" align="center">
        <template slot-scope="{row}">
          {{ $dft("APPROVE_STATUS", row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">编辑</el-button>
          <el-button v-else type="text" size="big" @click="curveSetRelaEdit(scope.$index, curveSetRelaList, 'EDIT')">
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
    <el-dialog v-if="dialogFormVisible" title="曲线间关系模板" :visible.sync="dialogFormVisible" width="90%" :close-on-click-modal="false">
      <CurveSetRelaForm
        ref="refCurveSetRelaForm"
        :temp-main-id="tempMainId"
        :op-type="opType"
        @saveCallBack="saveCallBack"
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
      opType: '',
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
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getCurveSetRelaList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getCurveSetRelaList()
    },
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
      this.opType = 'ADD'
      this.tempMainId = ''
      // this.$router.push({ name: 'CurveSetRelaForm' })
    },
    // dto列表修改操作
    curveSetRelaEdit(index, rows, opType) {
      this.opType = opType
      this.temp = rows[index]
      this.tempMainId = this.temp.tempMainId

      this.dialogFormVisible = true
      // this.$store.commit('curveSetRela/setTempMainId', this.temp.tempMainId)
      // this.$store.commit('curveSetRela/setOpType', 'EDIT')
      // this.$router.push({ name: 'CurveSetRelaForm' })
    },
    // dto列表删除
    curveSetRelaDel(index, rows) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        delcurveSetRela(rows[index]).then(response => {
          rows.splice(index, 1)
          this.$message({
            message: '操作成功！',
            type: 'success',
            showClose: true
          })
        })
      }).catch(() => {
        console.info('cancle')
      })
    },
    disableEdit() {
      this.$message({
        type: 'warning',
        message: '不能操作待审核状态的数据'
      })
    },
    storageCurveSetRela() {
      console.info('保存关系信息')
      // saveAll
      this.$refs.refCurveSetRelaForm.saveAll()
    },
    saveCallBack() {
      console.info('保存成功，回调函数，刷新页面')
      this.dialogFormVisible = false
      this.getCurveSetRelaList()
    }
  }
}
</script>

<style scoped>

</style>
