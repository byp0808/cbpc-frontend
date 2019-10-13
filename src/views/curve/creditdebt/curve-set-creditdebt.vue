<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="curveHomologyCreate">
        新增规则
      </el-button>
    </div>

    <el-table :data="initCaseList" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="曲线名称">
        <template slot-scope="scope">
          <span>{{ scope.row.ccdcCurvePrdInfo.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="初始化方案" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="curveHomologyDtoEdit(scope.$index, initCaseList)">详情</span>
        </template>
      </el-table-column>
      <el-table-column label="复核状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.approveStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="big" @click="curveHomologyDtoEdit(scope.$index, initCaseList)">
            修改
          </el-button>
          <el-button type="text" size="big" @click="curveHomologyDtoDel(scope.$index, initCaseList)">
            删除
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
    <el-dialog :visible.sync="dialogFormVisible" width="90%">
      <Creditdebt
        ref="creditdebt"
        :temp="temp"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="storageCurveHomology()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInitPageList,
  delInitList
} from '@/api/curve/curve-product-list.js'
import Creditdebt from '@/views/curve/creditdebt/creditdebt.vue'

export default {
  name: 'CurvecurveHomology',
  components: {
    Creditdebt
  },
  data() {
    return {
      initCaseList: [],
      temp: {
        curveId: '',
        approveStatus: '',
        productName: '',
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
    this.getinitCaseList()
  },
  methods: {
    // 查询初始化方案列表
    getinitCaseList() {
      getInitPageList({ page: this.page }).then(response => {
        this.initCaseList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },

    // 新建规则
    curveHomologyCreate() {
      this.temp = []
      this.dialogFormVisible = true
      this.$refs.creditdebt.jinZhiXuanZe = false
      this.$refs.creditdebt.curveHomologyShow = true
      this.$refs.creditdebt.curveHomologyXing = true
      this.$refs.creditdebt.bankMessage = []
      this.$refs.creditdebt.bankMessage2 = []
    },
    // 列表修改操作
    curveHomologyDtoEdit(index, rows) {
      this.temp = rows[index]
      this.dialogFormVisible = true
      this.$refs.creditdebt.jinZhiXuanZe = true
      this.$refs.creditdebt.curveHomologyShow = false
      this.$refs.creditdebt.curveHomologyXing = false
    },
    // 列表删除
    curveHomologyDtoDel(index, rows) {
      delInitList(rows[index]).then(response => {
        rows.splice(index, 1)
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    storageCurveHomology() {
      debugger
      var data = this.$refs.creditdebt.obtainCurveHomology()
      if (!data.standSlipList) {
        alert('请选择曲线！')
        return
      }
      // storageHomology(data).then(response => {
      //   this.initCaseList.unshift(this.temp)
      //   this.dialogFormVisible = false
      //   this.$message({
      //     message: '操作成功！',
      //     type: 'success',
      //     showClose: true
      //   })
      // })
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getinitCaseList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getinitCaseList()
    }
  }
}
</script>

<style scoped>

</style>
