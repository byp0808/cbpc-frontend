<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAddProduct('ADD')">新增</el-button>
      <el-button v-if="false" type="primary" @click="toAddProduct('COPY')">复制新增</el-button>
      <el-input v-model="input" placeholder="请输入查询内容" style="width: 15%" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" @click="download">下载详情</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="productList.dataList.filter(data => !input || data.prdId.toLowerCase().includes(input.toLowerCase()) ||data.prdName.toLowerCase().includes(input.toLowerCase())) "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="prdId" label="产品编号" width="120" />
      <el-table-column prop="prdName" label="产品名称" width="140" show-overflow-tooltip />
      <el-table-column prop="prdLineId" label="产品线" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("PRODUCT_LINE", scope.row.prdLineId) }}
        </template>
      </el-table-column>
      <el-table-column prop="prdGrpId" label="产品组" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("PRODUCT_GROUP", scope.row.prdGrpId) }}
        </template>
      </el-table-column>
      <el-table-column prop="prdBaseId" label="基础产品" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("BASE_PRD_CODE", scope.row.prdBaseId) }}
        </template>
      </el-table-column>
      <el-table-column prop="prdStartDate" label="产品上市日期" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.prdStartDate == null ? '' : $moment(scope.row.prdStartDate).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="prdEndDate" label="产品退市日期" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.prdEndDate == null ? '' : $moment(scope.row.prdEndDate).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="prdStatus" label="产品状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("CURVE_PRODUCT_STATUS", scope.row.prdStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="approveStatus" label="审批状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft("APPROVE_STATUS", scope.row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.relationId === null "
            type="text"
            size="small"
            @click.native.prevent="toAddProduct('VIEW',scope.row.prdType,scope.row.rowNo)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.relationId != null "
            type="text"
            size="small"
            :visible.sync="scope.row.relationId === null "
            @click.native.prevent="toAddProduct('VIEW',scope.row.prdType,scope.row.rowNo)"
          >
            查看修改前
          </el-button>
          <el-button
            v-if="scope.row.relationId != null "
            type="text"
            size="small"
            @click.native.prevent="toAddProduct('VIEW',scope.row.prdType,scope.row.relationId)"
          >
            修改后
          </el-button>
          <el-button
            v-if="scope.row.relationId === null "
            type="text"
            size="small"
            :disabled="scope.row.approveStatus === '01' || scope.row.relationId != null || (scope.row.dataStatus === '04' && scope.row.approveStatus === '01' )"
            @click.native.prevent="toAddProduct('EDIT',scope.row.prdType,scope.row.rowNo)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.relationId === null "
            type="text"
            size="small"
            :disabled="scope.row.approveStatus === '01' || scope.row.relationId != null || (scope.row.dataStatus === '04' && scope.row.approveStatus === '01' )"
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
    <el-dialog v-if="addProductFormVisible" :lock-scroll="lockScroll" width="40%" title="新增产品" :visible.sync="addProductFormVisible">
      <CurveProductForm
        ref="refCurveProductForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addProductFormVisible = false">取 消</el-button>
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
        @confirmCurveInfoCallBack="confirmCurveInfoCallBack"
      />
    </el-dialog>
    <el-dialog
      v-if="addValuationProductDefFormVisible"
      width="90%"
      title="估值产品"
      :visible.sync="addValuationProductDefFormVisible"
    >
      <ValuationProdForm
        ref="refValuationProductDefForm"
        :lock-scroll="lockScroll"
        :product-id="productId"
        :base-prd-code="basePrdCode"
        :op-type="opType"
        @confirmValuationInfoCallBack="confirmValuationInfoCallBack"
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
import ValuationProdForm from '@/views/valuation/prod/prod-detail.vue'
import { queryALlProductList, queryProdByID, dwnlProducts } from '@/api/common/prod-list.js'

import { delCurveSample } from '@/api/curve/curve-sample.js'
import { showCodeLabel } from '@/api/curve/code-type.js'

export default {
  name: 'ProdList', // 产品列表
  components: {
    CurveProductForm,
    CurveSampleForm,
    CurveProductDefForm,
    ValuationProdForm
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  data() {
    return {
      input: '',
      productId: '',
      opType: '',
      basePrdCode: '', // 新增时基础产品
      productList: {
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      },
      lockScroll: true,
      // 新增产品
      addProductFormVisible: false,
      // 新增曲线样本券
      addCurveSampleFormVisible: false,
      // 曲线产品定义
      addCurveProductDefFormVisible: false,
      addValuationProductDefFormVisible: false,
      multipleSelection: '' // 选择记录
    }
  },
  computed: {
  },
  beforeMount() {
    this.queryProductList()
  },
  methods: {
    handleFilter() {
      this.productList.page.pageNumber = 1
      this.queryLikedProductList()
    },
    handleSizeChange(pageSize) {
      this.productList.page.pageSize = pageSize
      this.queryProductList()
    },
    handleCurrentChange(currentPage) {
      this.productList.page.pageNumber = currentPage
      this.queryProductList()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    queryProductList() {
      queryALlProductList({ page: this.productList.page }).then(response => {
        const { dataList, page } = response
        this.productList.dataList = dataList
        this.productList.page = page
      })
    },
    queryLikedProductList() {
      queryProdByID({ page: this.productList.page, TEMP_NAME: this.input }).then(response => {
        console.info('queryProductList.queryProductList...')
        const { dataList, page } = response
        this.productList.dataList = dataList
        this.productList.page = page
      })
    },
    // 打开新增产品页面
    toAddProduct(opType, prdType, rowId) {
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
        } else if (item.prdType === 'CURVE') {
          // 产品ID
          this.productId = item.rowNo
          this.addCurveProductDefFormVisible = true
        } else {
          this.productId = item.rowNo
          this.addValuationProductDefFormVisible = true
        }
      } else if (opType === 'EDIT' || opType === 'VIEW') {
        if (prdType === 'CURVE_SAMPLE') {
          this.productId = rowId
          this.addCurveSampleFormVisible = true
        } else if (prdType === 'CURVE') {
          this.productId = rowId
          this.addCurveProductDefFormVisible = true
        } else {
          this.productId = rowId
          this.addValuationProductDefFormVisible = true
        }
      } else if (opType === 'ADD') {
        this.addProductFormVisible = true
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
          // await delCurveProduct(row.rowNo)
          this.queryProductList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          await delCurveSample(row.rowNo)
          this.queryProductList()
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
      this.addProductFormVisible = false

      // 基础产品
      this.basePrdCode = data.product

      // 收益率曲线样本券，打开筛选器
      if (data.product === '0018') {
        this.addCurveSampleFormVisible = true
      } else if (data.product === '0001') {
        this.addValuationProductDefFormVisible = true
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
      this.queryProductList()
    },
    // 产品宝确认回调
    confirmCurveInfoCallBack() {
      console.info('confirmCurveInfoCallBack')
      this.addCurveProductDefFormVisible = false
      this.queryProductList()
    },
    // 产品宝确认回调
    confirmValuationInfoCallBack() {
      console.info('confirmValuationInfoCallBack')
      this.addValuationProductDefFormVisible = false
      this.queryProductList()
    },
    download() {
      dwnlProducts()
    }
  }
}
</script>

<style scoped>

</style>
