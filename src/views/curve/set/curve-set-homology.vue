<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="curveHomologyCreate">
        新增规则
      </el-button>
    </div>

    <el-table :data="curveHomologyDtoList" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="曲线名称" width="400px">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同调曲线" width="290px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="curveHomologyDtoEdit(scope.$index, 'VIEW')">详情</span>
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
          <el-button v-else type="text" size="big" @click="curveHomologyDtoEdit(scope.$index, 'EDIT')">
            编辑
          </el-button>
          <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" @click="disableEdit">删除</el-button>
          <el-button v-else type="text" size="big" @click="curveHomologyDtoDel(scope.$index, curveHomologyDtoList)">删除
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
    <el-dialog
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <Homology
        ref="homology"
        :homologyId="selectHomologyId"
        :op-type="opType"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="opType !== 'VIEW'" type="primary" @click="storageCurveHomology()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  querycurveHomologyDto,
  storageHomology,
  delcurveHomologyDto
} from '@/api/curve/curve-product-list.js'
import Homology from '@/views/curve/set/homology.vue'

export default {
  name: 'CurvecurveHomology',
  components: {
    Homology
  },
  data() {
    return {
      curveHomologyDtoList: [],
      opType: '',
      selectHomologyId: '', // 选择的主表ID
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
  beforeMount() {
    this.getCurveHomologyDtoList()
  },
  methods: {
    // 查询dto列表
    getCurveHomologyDtoList() {
      querycurveHomologyDto({ page: this.page }).then(response => {
        this.curveHomologyDtoList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },

    // 新建规则
    curveHomologyCreate() {
      this.temp = []
      this.selectHomologyId = ''
      this.dialogFormVisible = true
      this.opType = 'ADD'
    },
    // dto列表修改操作
    curveHomologyDtoEdit(index, opType) {
      this.opType = opType
      this.temp = this.curveHomologyDtoList[index]
      this.selectHomologyId = this.temp.homologyId
      this.dialogFormVisible = true
    },
    // dto列表删除
    curveHomologyDtoDel(index, rows) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        delcurveHomologyDto(rows[index]).then(response => {
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
        message: '不能操作待审核的数据'
      })
    },
    storageCurveHomology() {
      var data = this.$refs.homology.obtainCurveHomology()
      if (!data.curveHomologyList) {
        alert('请选择同调曲线！')
        return
      }
      console.info('data:' + JSON.stringify(data))
      storageHomology(data).then(response => {
        this.getCurveHomologyDtoList()
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
      this.getCurveHomologyDtoList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getCurveHomologyDtoList()
    }
  }
}
</script>

<style scoped>

</style>
