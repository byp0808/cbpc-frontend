<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" :disabled="computeDisabled" @click="toCompute()">开始计算</el-button>
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      完成曲线计算率
      <div class="bar" style="display: inline-block;width:100px">
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="percentage"
          status="success"
          :show-text="true"
          style="color:black"
        />
      </div>
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="toCheck()">查看质检报告</el-button>
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="toAddCurveProduct('ADD')">曲线发布</el-button>
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="checkCoupon()">检查曲线样本券</el-button>
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="deployCoupon()">曲线样本券发布</el-button>
    </el-row>
    <el-row
      v-if="curveOrderVisible"
      style="margin: 20px 0;"
      :visible.sync="curveOrderVisible"
    >
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="曲线名称">
          <el-input v-model="queryForm.curveName" placeholder="曲线名称" />
        </el-form-item>
        <el-form-item label="曲线编制方式">
          <el-select v-model="queryForm.buildType" placeholder="曲线编制方式">
            <el-option
              v-for="(name, key) in $dict('BUILD_TYPE')"
              :key="key"
              :label="name"
              :value="key"
            />
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="曲线编制状态">
          <el-select v-model="queryForm.buildStatus" placeholder="曲线编制状态">
            <el-option
              v-for="(name, key) in $dict('CURVE_BUILD_STATUS')"
              :key="key"
              :label="name"
              :value="key"
            />
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="check">复核</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      v-if="curveOrderVisible"
      ref="refCurveOrderList"
      :visible.sync="curveOrderVisible"
      :data="curveOrderList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="curvePrdCode" label="曲线编码" width="140" />
      <el-table-column prop="curveName" label="曲线名称" width="200" show-overflow-tooltip />
      <el-table-column prop="curveBuildType" label="曲线类型" width="150" show-overflow-tooltip>
        <template>
          到期
        </template>
      </el-table-column>
      <el-table-column prop="buildType" label="曲线编制方式" width="150`" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $dft("BUILD_TYPE", row.buildType) }}
        </template>
      </el-table-column>
      <el-table-column prop="buildStatus" label="曲线编制状态" width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $dft("CURVE_BUILD_STATUS", row.buildStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="assign" label="责任人" width="140" show-overflow-tooltip />
    </el-table>
    <el-pagination
      v-if="curveOrderVisible"
      :visible.sync="curveOrderVisible"
      :current-page="page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 檢查曲綫樣本券列表 -->
    <CurveCheckCouponCompute
      v-if="checkCouponVisible"
      ref="refCurveCheckCouponCompute"
      :order-id="orderId"
      :visible.sync="checkCouponVisible"
    />
  </div>
</template>
<script>
import { calculatCompletionRate, queryCurveOrderComputeList, toCompletotionRate, deployAndCheckCurve, checkCurveSample, checkOrDeployComp } from '@/api/curve/curve-order-compute.js'
import CurveCheckCouponCompute from '@/views/curve/compute/curve-checkCoupon-compute.vue'

export default {
  components: {
    CurveCheckCouponCompute
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['orderId', 'orderInfo'],
  data() {
    return {
      computeDisabled: false, // 计算按钮是否允许操作
      multipleSelection: [],
      percentage: 0,
      queryForm: {
        curveName: '',
        buildType: '1',
        buildStatus: ''
      },
      curveOrderList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      curveOrderVisible: true,
      checkCouponVisible: false
    }
  },
  computed: {},
  beforeMount() {
    console.info('curve-order-compute.vue.===beforeMount===')
    console.info('orderId:' + this.orderId)

    // 初始化批次计算列表
    this.initOrderTable()
  },
  created() {
    this.getCurveOrderComputeList()
    this.calculatCompletionRate()
  },
  methods: {
    // 初始化批次计算列表
    initOrderTable() {

    },
    handleSelectionChange(items) {
      this.multipleSelection = items
    },
    // 查询
    query() {
      this.getCurveOrderComputeList()
      this.calculatCompletionRate()
    },
    getCurveOrderComputeList() {
      var data = {
        curveName: this.queryForm.curveName,
        buildStatus: this.queryForm.buildStatus,
        buildType: this.queryForm.buildType,
        orderId: this.orderId,
        page: this.page
      }
      queryCurveOrderComputeList(data).then(response => {
        this.curveOrderList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    // 计算曲线收益完成率
    calculatCompletionRate() {
      console.info('==calculatCompletionRate===')
      var data = {
        orderId: this.orderId,
        page: this.page
      }
      calculatCompletionRate(data).then(response => {
        if (typeof (response) !== 'undefined') {
          this.percentage = Number(response)
        }
        setTimeout(1.5 * 1000)
      })
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getCurveOrderComputeList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getCurveOrderComputeList()
    },
    // 计算
    async toCompute() {
      this.curveOrderVisible = true
      this.checkCouponVisible = false
      var items = this.multipleSelection
      if (!items || items.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择记录'
        })
        return false
      }
      var curveTaskId = []
      for (let i = 0; i < items.length; i++) {
        const buildStatus = items[i].buildStatus
        if (buildStatus !== '3' && buildStatus !== '4') {
          this.$message({
            type: 'error',
            message: '曲线[' + items[i].curveName + ']编制状态非已确认、已计算，不能进行计算'
          })
          return false
        }
        curveTaskId.push(items[i].curveTaskId)
      }
      var data = {
        curveTaskId: curveTaskId.join(','),
        orderId: this.orderId
      }

      this.computeDisabled = true
      await toCompletotionRate(data).then(response => {
        var result = response
        if (result.showMessage) {
          this.$message({
            message: '操作成功！' + result.showMessage,
            type: 'success',
            showClose: true
          })
        } else {
          this.$message({
            message: '操作成功！',
            type: 'success',
            showClose: true
          })
        }
        this.computeDisabled = false
        this.getCurveOrderComputeList()
        this.calculatCompletionRate()
      }).catch((err) => {
        console.log(err)
        this.computeDisabled = false
      })
      this.computeDisabled = false
    },
    // 曲线发布
    toAddCurveProduct() {
      if (this.checkCouponVisible) {
        this.curveOrderVisible = true
        this.checkCouponVisible = false
      } else {
        this.curveOrderVisible = true
        this.checkCouponVisible = false
        // 获取已经勾选的行
        // eslint-disable-next-line no-unused-vars
        var selection = this.$refs.refCurveOrderList.selection
        if (selection.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择需要发布的曲线'
          })
          return false
        }
        for (var i = 0; i < selection.length; i++) {
          if (selection[i].buildStatus !== '6') {
            this.$message({
              type: 'error',
              message: '请选择状态为已复核的数据'
            })
            return false
          }
        }

        // 曲线发布
        this.$confirm('是否确认发布', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          var data = {
            action: '7',
            computes: selection
          }
          deployAndCheckCurve(data).then(response => {
            this.$message({
              type: 'success',
              message: '曲线发布成功！'
            })
            this.query()
            setTimeout(1.5 * 1000)
          })
        }).catch(() => {
          console.info('cancle')
        })
      }
    },
    // 批量复核
    check() {
      // 获取已经勾选的行
      // eslint-disable-next-line no-unused-vars
      var selection = this.$refs.refCurveOrderList.selection
      if (selection.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择需要复核的曲线'
        })
        return false
      }
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].buildStatus !== '4') {
          this.$message({
            type: 'error',
            message: '请选择状态为已计算的数据'
          })
          return false
        }
      }
      // 曲线复核
      this.$confirm('是否确认复核', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        var data = {
          action: '6',
          computes: selection
        }
        deployAndCheckCurve(data).then(response => {
          this.$message({
            type: 'success',
            message: '曲线复核成功！'
          })
          this.query()
          setTimeout(1.5 * 1000)
        })
      }).catch(() => {
        console.info('cancle')
      })
    },
    // 检查样本券
    checkCoupon() {
      // 当前页面不是样本券页面，跳转前判断是否勾选曲线
      if (!this.checkCouponVisible) {
        this.curveOrderVisible = false
        this.checkCouponVisible = true

        var selection = this.$refs.refCurveOrderList.selection
        if (selection.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择需要检查的曲线'
          })
          return false
        }
        for (const item of selection) {
          if (item.buildStatus !== '7') {
            this.$message({
              type: 'error',
              message: '只能选择已发布的曲线'
            })
            return false
          }
        }
        var data = {
          action: '3',
          computes: selection
        }
        checkCurveSample(data).then(response => {
          setTimeout(1.5 * 1000)
        })
      }
      this.curveOrderVisible = false
      this.checkCouponVisible = true
    },
    // 跳转质检页面
    toCheck() {
      this.$store.commit('curveOrderCompute/setOrderId', this.orderId)
      this.$router.push({ name: 'CurveOrderCheckIndex' })
    },
    // 发布样本券
    deployCoupon() {
      var selection = this.$refs.refCurveOrderList.selection
      var data = {
        action: '3',
        computes: selection
      }
      if (selection.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择需要发布的曲线'
        })
        return false
      }
      checkOrDeployComp(data).then(response => {
        setTimeout(1.5 * 1000)
      })
    }
  }
}
</script>
<style>
  .el-tabs__content {
    display: none;
  }
</style>
