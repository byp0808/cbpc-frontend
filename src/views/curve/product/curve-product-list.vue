<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-button type="primary" style="margin-right: 10px" @click="toAddCurveProduct('ADD')">新增</el-button>
        <el-button v-if="false" type="primary" @click="toAddCurveProduct('COPY')">复制新增</el-button>
        <el-form-item label="曲线产品名称">
          <el-input v-model="queryForm.productName" placeholder="曲线产品名称" />
        </el-form-item>
        <el-form-item label="曲线编码">
          <el-input v-model="queryForm.prdCode" placeholder="曲线编码" />
        </el-form-item>
        <el-form-item label="上市日">
          <el-col :span="11">
            <el-form-item prop="curveStartTime1">
              <el-date-picker v-model="queryForm.curveStartTime1" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="curveStartTime2">
              <el-date-picker v-model="queryForm.curveStartTime2" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="productList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="prdCode" label="产品编号" width="150" />
      <el-table-column prop="productName" label="产品名称" width="180" show-overflow-tooltip />
      <el-table-column prop="productLine" label="产品线" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productLine }}
        </template>
      </el-table-column>
      <el-table-column prop="productGroup" label="产品组" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productGroup }}
        </template>
      </el-table-column>
      <el-table-column prop="basePrdCode" label="基础产品" width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $dft("BASE_PRD_CODE", row.basePrdCode) }}
        </template>
      </el-table-column>
      <el-table-column prop="curveStartTime" label="上市日" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveStartTime == null ? '' : $moment(scope.row.curveStartTime).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="curveEndTime" label="停产日" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.curveEndTime == null ? '' : $moment(scope.row.curveEndTime).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="prdStatus" label="产品状态" width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $dft("CURVE_PRODUCT_STATUS", row.prdStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="approveStatus" label="审批状态" width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $dft("APPROVE_STATUS", row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.approveStatus === '01' || scope.row.relId != null || (scope.row.dataStatus === '04' && scope.row.approveStatus === '01' )"
            @click.native.prevent="toAddCurveProduct('EDIT',scope.row.prdType,scope.row.rowNo)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toAddCurveProduct('VIEW',scope.row.prdType,scope.row.rowNo)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.approveStatus === '01' || scope.row.approveStatus === '02' || scope.row.relId != null || (scope.row.dataStatus === '04' && scope.row.approveStatus === '01' )"
            @click.native.prevent="handleDelete(scope)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="productList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="productList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="productList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="addCurveProductFormVisible" :lock-scroll="lockScroll" :close-on-click-modal="false" width="40%" title="新增产品" :visible.sync="addCurveProductFormVisible">
      <CurveProductForm
        ref="refCurveProductForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCurveProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProduct">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="addCurveProductDefFormVisible"
      width="90%"
      title="曲线产品"
      :close-on-click-modal="false"
      :visible.sync="addCurveProductDefFormVisible"
    >
      <CurveProductDefForm
        ref="refCurveProductDefForm"
        :lock-scroll="lockScroll"
        :product-id="productId"
        :base-prd-code="basePrdCode"
        :op-type="opType"
        @confirmCurveInfoCallBack="confirmCurveInfoCallBack"
      />
    </el-dialog>
    <el-dialog v-if="addCurveSampleFormVisible" :lock-scroll="lockScroll" :close-on-click-modal="false" width="92%" title="曲线样本券" :visible.sync="addCurveSampleFormVisible">
      <CurveSampleForm
        ref="refCurveSampleForm"
        :product-id="productId"
        :base-prd-code="basePrdCode"
        :op-type="opType"
        @saveCureSampleCallBack="saveCureSampleCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCurveSampleFormVisible = false">取 消</el-button>
        <el-button v-if="saveCureSampleBtnVisible" type="primary" @click="saveCureSample">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CurveProductForm from '@/views/curve/product/curve-product-form.vue'
import CurveProductDefForm from '@/views/curve/product/curve-product-def-form.vue'
import CurveSampleForm from '@/views/curve/sample/curve-sample-form.vue'
import { queryCurveProductList, delCurveProduct } from '@/api/curve/curve-product-list.js'
import { delCurveSample } from '@/api/curve/curve-sample.js'
import { showCodeLabel } from '@/api/curve/code-type.js'

export default {
  name: 'CurveList', // 曲线样本券列表
  components: {
    CurveProductForm,
    CurveSampleForm,
    CurveProductDefForm
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  data() {
    return {
      productId: '',
      opType: '',
      basePrdCode: '', // 新增时基础产品
      productList: {
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      lockScroll: true,
      // 新增产品
      addCurveProductFormVisible: false,
      // 新增曲线样本券
      addCurveSampleFormVisible: false,
      // 曲线产品定义
      addCurveProductDefFormVisible: false,
      multipleSelection: '', // 选择记录
      queryForm: {
        productName: '',
        prdCode: '',
        curveStartTime1: '',
        curveStartTime2: ''
      }
    }
  },
  computed: {
    curveProductList() {
      const dataList = queryCurveProductList()
      if (dataList && dataList.data) {
        return dataList.data
      }
      return dataList
    }
  },
  beforeMount() {
    this.queryCurveProductList()
  },
  methods: {
    handleFilter() {
      this.productList.page.pageNumber = 1
      this.queryCurveProductList()
    },
    handleSizeChange(pageSize) {
      this.productList.page.pageSize = pageSize
      this.queryCurveProductList()
    },
    handleCurrentChange(currentPage) {
      this.productList.page.pageNumber = currentPage
      this.queryCurveProductList()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    queryCurveProductList() {
      var curveStartTime1
      var curveStartTime2
      if (this.queryForm.curveStartTime1) {
        curveStartTime1 = this.switchTimeFormat(this.queryForm.curveStartTime1)
      } else {
        curveStartTime1 = ''
      }
      if (this.queryForm.curveStartTime2) {
        curveStartTime2 = this.switchTimeFormat(this.queryForm.curveStartTime2)
      } else {
        curveStartTime2 = ''
      }
      var data = {
        productName: this.queryForm.productName,
        prdCode: this.queryForm.prdCode,
        curveStartTime1: curveStartTime1,
        curveStartTime2: curveStartTime2,
        page: this.productList.page
      }
      queryCurveProductList(data).then(response => {
        console.info('queryCurveProductList.queryCurveProductList...')
        const { dataList, page } = response
        this.productList.dataList = dataList
        this.productList.page = page
      })
    },
    // 打开新增产品页面
    toAddCurveProduct(opType, prdType, rowId) {
      this.saveCureSampleBtnVisible = true
      // 产品ID
      this.productId = ''
      // 操作类型
      this.opType = opType

      if (opType === 'COPY') {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'error',
            message: '仅能选择一条记录'
          })
          return false
        }
        var item = this.multipleSelection[0]
        if (item.prdType === 'CURVE_SAMPLE') {
          // 产品ID
          this.productId = item.rowNo
          this.addCurveSampleFormVisible = true
        } else {
          // 产品ID
          this.productId = item.rowNo
          this.addCurveProductDefFormVisible = true
        }
      } else if (opType === 'EDIT' || opType === 'VIEW') {
        if (prdType === 'CURVE_SAMPLE') {
          // 产品ID
          this.productId = rowId
          this.addCurveSampleFormVisible = true
        } else {
          // 产品ID
          this.productId = rowId
          this.addCurveProductDefFormVisible = true
        }
      } else if (opType === 'ADD') {
        this.addCurveProductFormVisible = true
      }
    },
    // 删除
    handleDelete({ $index, row }) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async() => {
        if (row.prdType !== 'CURVE_SAMPLE') {
          await delCurveProduct(row.rowNo)
          this.queryCurveProductList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          await delCurveSample(row.rowNo)
          this.queryCurveProductList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(err => { console.error(err) })
    },
    // 保存产品
    saveProduct() {
      // 如果就曲线样本，则跳转筛选器
      var data = this.$refs.refCurveProductForm.save()
      console.info('saveProduct.data:' + JSON.stringify(data))
      if (!data.product) {
        this.$message({
          type: 'error',
          message: '基础产品必选!'
        })
        return false
      }

      // 产品选择框隐藏
      this.addCurveProductFormVisible = false

      // 基础产品
      this.basePrdCode = data.product

      // 收益率曲线样本券，打开筛选器
      if (data.product === '0018') {
        this.addCurveSampleFormVisible = true
      } else {
        // 显示曲线产品定义框
        this.addCurveProductDefFormVisible = true
      }
    },
    // 保存曲线样本券
    saveCureSample() {
      console.info('saveCureSample:')
      this.$refs.refCurveSampleForm.save()
    },
    // 保存曲线样本券回调
    saveCureSampleCallBack() {
      console.info('saveCureSampleCallBack')
      this.addCurveSampleFormVisible = false
      this.queryCurveProductList()
    },
    // 产品宝确认回调
    confirmCurveInfoCallBack() {
      console.info('confirmCurveInfoCallBack')
      this.addCurveProductDefFormVisible = false
      this.queryCurveProductList()
    },
    switchTimeFormat(time) {
      const dateTime = new Date(time)
      const year = dateTime.getFullYear()
      const month = dateTime.getMonth() + 1
      const date = dateTime.getDate()
      const hour = dateTime.getHours()
      const minute = dateTime.getMinutes()
      const second = dateTime.getSeconds()
      return year + '-' + this.addZero(month) + '-' + this.addZero(date) + ' ' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second)
    },
    addZero(v) {
      return v < 10 ? '0' + v : v
    }
  }
}
</script>

<style scoped>

</style>
