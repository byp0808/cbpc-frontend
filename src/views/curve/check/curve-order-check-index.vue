<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="批次报告">
        <el-date-picker
          v-model="queryForm.taskDay"
          align="right"
          type="date"
          placeholder="选择日期"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="批次">
        <el-select v-model="queryForm.orderId" placeholder="活动区域" :disabled="disabled">
          <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.orderName" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="indexQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="总览" name="zl" />
      <el-tab-pane label="全面性检查" name="qmxjc" />
      <el-tab-pane label="波动偏差" name="bdpc" />
      <el-tab-pane label="曲线跨线" name="qxkx" />
      <el-tab-pane label="曲线倒挂" name="qxdg" />
      <el-tab-pane label="容错" name="rc" />
    </el-tabs>
    <el-card v-if="activeName === 'zl'" class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3>总览</h3>
      </div>
      <CurveQualityOverallList ref="refCurveQualityOverallList" />
    </el-card>
    <el-card v-if="activeName === 'qmxjc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>全面性检查</h3>
      </div>
      <CurveComprehensiveQcRpt ref="refCurveComprehensiveQcRpt" />
    </el-card>
    <el-card v-if="activeName === 'bdpc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>波动偏差</h3>
      </div>
      <CurveShkQcRpt ref="refCurveShkQcRpt" />
    </el-card>
    <el-card v-if="activeName === 'qxkx'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>曲线跨线</h3>
      </div>
      <CurveCrsQcRpt ref="refCurveCrsQcRpt" />
    </el-card>
    <el-card v-if="activeName === 'qxdg'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>曲线倒挂</h3>
      </div>
      <CurveRvsQcRpt ref="refCurveRvsQcRpt" />
    </el-card>
    <el-card v-if="activeName === 'rc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>容错</h3>
      </div>
    </el-card>
  </div>
</template>

<script>
import CurveQualityOverallList from '@/views/curve/check/curve-quality-overall-list.vue'
import CurveComprehensiveQcRpt from '@/views/curve/check/curve-quality-comprehensive-list.vue'
import CurveShkQcRpt from '@/views/curve/check/curve-quality-shk-list.vue'
import CurveRvsQcRpt from '@/views/curve/check/curve-quality-rvs-list.vue'
import CurveCrsQcRpt from '@/views/curve/check/curve-quality-crs-list.vue'
import { getOrderList } from '@/api/curve/curve-product-order.js'
export default {
  name: 'CurveOrderCheckIndex',
  components: {
    CurveQualityOverallList,
    CurveComprehensiveQcRpt,
    CurveShkQcRpt,
    CurveRvsQcRpt,
    CurveCrsQcRpt
  },
  props: ['orderId', 'taskDay'],
  data() {
    return {
      disabled: false,
      orderList: [], // 批次列表
      queryForm: {
        taskDay: null,
        orderId: ''
      },
      activeName: 'zl'
    }
  },
  computed: {
  },
  watch: {

  },
  beforeMount() {
    console.info('beforeMount:' + this.orderId + ',taskDay:' + this.taskDay)
    var taskDay = this.taskDay
    var orderId = this.orderId
    if (!taskDay) {
      taskDay = new Date()
    }
    if (!orderId) {
      orderId = 'ORDER_ID_1'
    }
    this.queryForm.taskDay = taskDay
    this.queryForm.orderId = orderId
    // 加载批次
    this.orderList = getOrderList()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 主页面查询方法
    // 根据
    indexQuery() {

    }
  }
}
</script>

<style>

</style>
