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
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="prdCode"
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
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
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
    <el-dialog :lock-scroll="lockScroll" width="40%" title="新增产品" :visible.sync="addCurveProductFormVisible">
      <CurveProductForm
        ref="refCurveProductForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCurveProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProduct">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :lock-scroll="lockScroll" width="92%" title="曲线样本券" :visible.sync="addCurveSampleFormVisible">
      <CurveSampleForm
        ref="refCurveSampleForm"
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
import CurveSampleForm from '@/views/curve/sample/curve-sample-form.vue'
import { queryCurveProductList } from '@/api/curve/curve-product-list.js'
import { getCurveSample, delCurveSample } from '@/api/curve/curve-sample.js'
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
      // 曲线样本券保存按钮
      saveCureSampleBtnVisible: true,
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
    toAddCurveProduct(type, prdType, rowId) {
      this.saveCureSampleBtnVisible = true

      if (type == 'ADD') {
        this.addCurveProductFormVisible = true
      } else if (type == 'COPY') {
        if (this.multipleSelection.length != 1) {
          this.$message({
            type: 'error',
            message: '仅能选择一条记录'
          })
          return false
        }
        var item = this.multipleSelection[0]
        if (item.prdType == 'CURVE_SAMPLE') {
          // 查询记录后展现
          getCurveSample(item.rowNo).then(response => {
            console.info('COPY:getCurveSample:' + JSON.stringify(response))
            var data = response
            this.$store.commit('curveProduct/setCurveSampleFilterInfo', {
              curveSample: data,
              editType: 'COPY'
            })
            this.addCurveSampleFormVisible = true
          })
        } else {
          this.$message({
            type: 'warning',
            message: '此产品复制暂未开放'
          })
        }
      } else if (type == 'EDIT') {
        // 样本券
        if (prdType == 'CURVE_SAMPLE') {
          // 查询记录后展现
          getCurveSample(rowId).then(response => {
            console.info('EDIT:getCurveSample:' + JSON.stringify(response))
            var data = response
            this.$store.commit('curveProduct/setCurveSampleFilterInfo', {
              curveSample: data
            })
            this.addCurveSampleFormVisible = true
          })
        } else {
          this.$message({
            type: 'info',
            message: '编辑暂未开放'
          })
        }
      } else if (type == 'VIEW') {
        this.saveCureSampleBtnVisible = false
        // 样本券
        if (prdType == 'CURVE_SAMPLE') {
          // 查询记录后展现
          getCurveSample(rowId).then(response => {
            console.info('VIEW:getCurveSample:' + JSON.stringify(response))
            var data = response
            this.$store.commit('curveProduct/setCurveSampleFilterInfo', {
              curveSample: data,
              disabled: 'disabled'
            })
            this.addCurveSampleFormVisible = true
          })
        } else {
          this.$message({
            type: 'info',
            message: '查看暂未开放'
          })
        }
      } else if (type == 'DEL') {

      }
    },
    // 删除样本券
    handleDelete({ $index, row }) {
      // 样本券
      if (row.prdType != 'CURVE_SAMPLE') {
        this.$message({
          type: 'info',
          message: '删除暂未开放'
        })
        return false
      }
      this.$confirm('是否删除该样本券?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delCurveSample(row.rowNo)
        this.queryCurveProductList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(err => { console.error(err) })
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
          curveSample: {
            curvePrdCode: '',
            basePrdCode: data.product
          }
        })
      }
    },
    // 保存曲线样本券
    saveCureSample() {
      console.info('saveCureSample:')
      var data = this.$refs.refCurveSampleForm.save()
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
