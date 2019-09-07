<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAddCurveProduct">新增</el-button>
      <el-button type="primary" @click="toggleSelection()">复制新增</el-button>
      <el-button type="primary" @click="toAddCurveProduct('EDIT')">编辑</el-button>
      <el-button type="primary" @click="toAddCurveProduct('VIEW')">查看产品</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="productList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="curveId"
        label="产品编号"
        width="120"
      />
      <el-table-column
        prop="productName"
        label="产品名称"
        width="140"
      />
      <el-table-column
        prop="productLine"
        label="产品线"
        width="100"
      />
      <el-table-column
        prop="productGroup"
        label="产品组"
        width="100"
      />
      <el-table-column
        prop="basePrdCode"
        label="基础产品"
        width="100"
      />
      <el-table-column
        prop="curveStartTime"
        label="产品上市日期"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="curveEndTime"
        label="产品退市日期"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="prdStatus"
        label="产品状态"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="approveStatus"
        label="审批状态"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        label="产品明细"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="操作"
        width="100"
        show-overflow-tooltip
      />
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
    <el-dialog :lock-scroll="lockScroll" width="40%" title="新增产品" :visible.sync="addCurveProductFormVisible">
      <CurveProductForm
        ref="refCurveProductForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCurveProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProduct">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :lock-scroll="lockScroll" width="92%" title="新增曲线样本券产品" :visible.sync="addCurveSampleFormVisible">
      <CurveSampleForm
        ref="refCurveSampleForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCurveSampleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCureSample">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :lock-scroll="lockScroll" width="92%" title="曲线样本券产品" :visible.sync="viewCurveSampleFormVisible">
      <CurveSampleForm
        ref="refCurveSampleForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewCurveSampleFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CurveProductForm from '@/views/curve/product/curve-product-form.vue'
import CurveSampleForm from '@/views/curve/sample/curve-sample-form.vue'
import { queryCurveProductList } from '@/api/curve/curve-product-list.js'
import { getCurveSample } from '@/api/curve/curve-sample.js'
export default {
  name: 'CurveList', // 曲线样本券列表
  components: {
    CurveProductForm,
    CurveSampleForm
  },
  data() {
    return {
      baseProduct: '',
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
      // 曲线样本券产品查看
      viewCurveSampleFormVisible: false,
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
      this.productList.page = 1
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
        const { datalist, page } = response
        this.productList.dataList = datalist
        this.productList.page = page
      })
    },
    // 打开新增产品页面
    toAddCurveProduct(type) {
      if (!type) {
        this.addCurveProductFormVisible = true
      } else if (type == 'EDIT') {
        // 编辑
        if (!this.multipleSelection || this.multipleSelection.length == 0) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            showClose: true,
            duration: 2000
          })
          return
        } else if (this.multipleSelection.length > 1) {
          this.$message({
            message: '只能选择一条记录',
            type: 'warning',
            showClose: true,
            duration: 2000
          })
          return
        }
        var item = this.multipleSelection[0]
        // 样本券
        if (item.prdType == 'CURVE_SAMPLE') {
          // 查询记录后展现
          getCurveSample(item.rowNo).then(response => {
            console.info('getCurveSample:' + JSON.stringify(response))
            var data = response
            this.$store.commit('curveProduct/setCurveSampleFilterInfo', {
              curveSample: data
              // curveSelected: data.curvePrdCode,
              // baseProduct: data.basePrdCode,
              // curveSampleId: data.id,
            })

            this.addCurveSampleFormVisible = true
          })
        }
      } else if (type == 'VIEW') {
        // 编辑
        if (!this.multipleSelection || this.multipleSelection.length == 0) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            showClose: true,
            duration: 2000
          })
          return
        } else if (this.multipleSelection.length > 1) {
          this.$message({
            message: '只能选择一条记录',
            type: 'warning',
            showClose: true,
            duration: 2000
          })
          return
        }
        var item = this.multipleSelection[0]
        // 样本券
        if (item.prdType == 'CURVE_SAMPLE') {
          // 查询记录后展现
          getCurveSample(item.rowNo).then(response => {
            console.info('getCurveSample:' + JSON.stringify(response))
            var data = response
            this.$store.commit('curveProduct/setCurveSampleFilterInfo', {
              curveSample: data,
              disabled: 'disabled'
            })
            this.viewCurveSampleFormVisible = true
          })
        }
      }
    },
    // 保存产品
    saveProduct() {
      // 如果就曲线样本，则跳转筛选器
      var data = this.$refs.refCurveProductForm.save()
      console.info('data:' + JSON.stringify(data))

      // 收益率曲线样本券，打开筛选器
      if (data.product == '0018') {
        this.addCurveProductFormVisible = false
        this.addCurveSampleFormVisible = true
        this.$store.commit('curveProduct/setCurveSampleFilterInfo', {
          curveSelected: '',
          baseProduct: data.product,
          curveSampleId: ''
        })
      }
    },
    // 保存曲线样本券
    saveCureSample() {
      console.info('saveCureSample:')
      var data = this.$refs.refCurveSampleForm.save()
    }
  }
}
</script>

<style scoped>

</style>
