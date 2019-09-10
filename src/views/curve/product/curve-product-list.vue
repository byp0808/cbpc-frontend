<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAddCurveProduct('ADD')">新增</el-button>
      <el-button type="primary" @click="toAddCurveProduct('COPY')">复制新增</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="productList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="prdCode" label="产品编号" width="120" />
      <el-table-column prop="productName" label="产品名称" width="140"  show-overflow-tooltip />
      <el-table-column prop="productLine" label="产品线" width="100"  show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productLine | showCodeLabel('PRODUCT_LINE') }}
        </template>
      </el-table-column>
      <el-table-column prop="productGroup" label="产品组" width="100"  show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productGroup | showCodeLabel('PRODUCT_GROUP') }}
        </template>
      </el-table-column>
      <el-table-column prop="basePrdCode" label="基础产品" width="100"  show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.basePrdCode | showCodeLabel('BASE_PRD_CODE') }}
        </template>
      </el-table-column>
      <el-table-column prop="curveStartTime" label="产品上市日期" width="120" show-overflow-tooltip />
      <el-table-column prop="curveEndTime" label="产品退市日期" width="120" show-overflow-tooltip />
      <el-table-column prop="prdStatus" label="产品状态" width="100" show-overflow-tooltip />
      <el-table-column prop="approveStatus" label="审批状态" width="100" show-overflow-tooltip />
      <el-table-column prop="remark" label="产品明细" width="100" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.dataStatus === '01' || scope.row.relId != null "
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
            :disabled="scope.row.dataStatus == '01' || scope.row.relId != null "
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
      :total="productList.page.totalPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :lock-scroll="lockScroll" width="40%" title="新增产品" v-if="addCurveProductFormVisible" :visible.sync="addCurveProductFormVisible">
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
      :visible.sync="addCurveProductDefFormVisible"
    >
      <CurveProductDefForm
        ref="refCurveProductDefForm"
        :lock-scroll="lockScroll"
        :product-id="productId"
        :base-prd-code="basePrdCode"
        :op-type="opType"
      />
    </el-dialog>
    <el-dialog v-if="addCurveSampleFormVisible" :lock-scroll="lockScroll" width="92%" title="曲线样本券" :visible.sync="addCurveSampleFormVisible">
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
      multipleSelection: '' // 选择记录
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
      queryCurveProductList({ page: this.productList.page }).then(response => {
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
          this.$message({
            type: 'warning',
            message: '此产品复制暂未开放'
          })
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
    }
  }
}
</script>

<style scoped>

</style>
