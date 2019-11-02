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
          <span>{{ scope.row.curveName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="初始化方案" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="curveHomologyDtoEdit(scope.$index, scope.row, 'VIEW')">详情</span>
        </template>
      </el-table-column>
      <el-table-column label="复核状态" align="center">
        <template slot-scope="{row}">
          {{ $dft("REVIEW_STATUS", row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" :disabled="true">编辑</el-button>
          <el-button v-else type="text" size="big" @click="curveHomologyDtoEdit(scope.$index, scope.row, 'EDIT')">
            编辑
          </el-button>
          <el-button v-if="scope.row.approveStatus==='01'" type="text" size="small" :disabled="true">删除</el-button>
          <el-button v-else type="text" size="big" @click="curveHomologyDtoDel(scope.$index, scope.row)">
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
    <el-dialog v-if="dialogFormVisible" title="信用债初始化方案" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="90%">
      <CurveSetInitForm
        ref="refCurveSetInitForm"
        :init-id="initId"
        :op-type="opType"
        :creat-index-id="creatIndexId"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="opType !== 'VIEW'" type="primary" @click="storageInit()">
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
import CurveSetInitForm from '@/views/curve/set/curve-set-init-form.vue'

export default {
  name: 'CurvecurveHomology',
  components: {
    CurveSetInitForm
  },
  data() {
    return {
      initCaseList: [],
      initId: '',
      dialogFormVisible: false,
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      creatIndexId: '',
      opType: ''
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
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getinitCaseList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getinitCaseList()
    },
    // 新建规则
    curveHomologyCreate() {
      this.creatIndexId = 'creat'
      this.opType = 'ADD'
      this.dialogFormVisible = true
    },
    // 列表修改操作
    curveHomologyDtoEdit(index, item, opType) {
      this.initId = item.id
      this.opType = opType
      this.creatIndexId = 'change'
      this.dialogFormVisible = true
    },
    // 列表删除
    curveHomologyDtoDel(index, item) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        console.info('====delInitList====')
        console.info('delInitList:' + item.id)
        delInitList(item.id).then(response => {
          this.initCaseList.splice(index, 1)
          this.$message({
            message: '发起删除流程成功！',
            type: 'success',
            showClose: true
          })
        })
      }).catch(() => {
        console.info('cancle')
      })
    },
    storageInit() {
      this.$refs.refCurveSetInitForm.save()
    },
    saveCallBack() {
      console.info('saveCallBack...')
      this.dialogFormVisible = false
      this.getinitCaseList()
    }
  }
}
</script>

<style scoped>

</style>
