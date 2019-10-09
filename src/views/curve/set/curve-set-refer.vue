<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="curveReferCreate">
        新增规则
      </el-button>
    </div>

    <el-table :data="curveReferDtoList" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="曲线名称" width="370px">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同调曲线" width="290px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="curveReferDtoEdit(scope.$index, curveReferDtoList)">详情</span>
        </template>
      </el-table-column>
      <el-table-column label="复核状态" width="149px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.approveStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="big" @click="curveReferDtoEdit(scope.$index, curveReferDtoList)">
            修改
          </el-button>
          <el-button type="text" size="big" @click="curveReferDtoDel(scope.$index, curveReferDtoList)">
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

    <el-dialog :visible.sync="dialogFormVisible" width="50%">
      <Refer
        ref="refer"
        :temp="temp"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="storageCurveRefer()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryCurveReferDto,
  storageRefer,
  delCurveReferDto
} from '@/api/curve/curve-product-list.js'
import Refer from '@/views/curve/set/refer.vue'
export default {
  name: 'CurvecurveRefer',
  components: {
    Refer
  },
  data() {
    return {
      curveReferDtoList: [],
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
    this.getCurveReferDtoList()
  },
  methods: {
    // 查询dto列表
    getCurveReferDtoList() {
      queryCurveReferDto({ page: this.page }).then(response => {
        this.curveReferDtoList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },

    // 新建规则
    curveReferCreate() {
      this.temp = []
      this.dialogFormVisible = true
    },
    // dto列表修改操作
    curveReferDtoEdit(index, rows) {
      this.temp = rows[index]
      this.dialogFormVisible = true
    },
    // dto列表删除
    curveReferDtoDel(index, rows) {
      delCurveReferDto(rows[index]).then(response => {
        rows.splice(index, 1)
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    storageCurveRefer() {
      var data = this.$refs.refer.obtainCurveRefer()
      if (!data.curveReferList) {
        alert('请选择同调曲线！')
        return
      }
      storageRefer(data).then(response => {
        this.curveReferDtoList.unshift(this.temp)
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
      this.getCurveReferDtoList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getCurveReferDtoList()
    }
  }
}
</script>

<style scoped>

</style>
