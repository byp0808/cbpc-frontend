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
          <el-option v-for="item in orderList" :label="item.orderName" :key="item.id" :value="item.orderName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="indexQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="总览" name="zl"></el-tab-pane>
        <el-tab-pane label="全面性检查" name="qmxjc"></el-tab-pane>
        <el-tab-pane label="波动偏差" name="bdpc"></el-tab-pane>
        <el-tab-pane label="曲线跨线" name="qxkx"></el-tab-pane>
        <el-tab-pane label="曲线倒挂" name="qxdg"></el-tab-pane>
        <el-tab-pane label="容错" name="rc"></el-tab-pane>
    </el-tabs>
    <el-card v-if="activeName === 'zl'" class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3>总览</h3>
      </div>
    </el-card>
    <el-card v-if="activeName === 'qmxjc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>全面性检查</h3>
      </div>

    </el-card>
    <el-card v-if="activeName === 'bdpc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>波动偏差</h3>
      </div>

    </el-card>
    <el-card v-if="activeName === 'qxkx'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>曲线跨线</h3>
      </div>
    </el-card>
    <el-card v-if="activeName === 'qxdg'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>曲线倒挂</h3>
      </div>
    </el-card>
    <el-card v-if="activeName === 'rc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>容错</h3>
      </div>
    </el-card>
  </div>
</template>

<script>

import { getOrderList } from '@/api/curve/curve-product-order.js'
export default {
  name: 'CurveOrderCheckIndex',
  components: {
  },
  props: ['orderId','taskDay'],
  data() {
    return {
      disabled: false,
      orderList: [], // 批次列表
      queryForm: {
        taskDay: null,
        orderId: ''
      },
      activeName:''
    }
  },
  computed: {
  },
  watch:{

  },
  beforeMount() {
    console.info('beforeMount:' + this.orderId + ',taskDay:' + this.taskDay)
    if (!this.taskDay) {
      this.taskDay = new Date()
    }
    if (!this.orderId) {
      this.orderId = 'ORDER_ID_1'
    }
    this.queryForm.taskDay = this.taskDay
    this.queryForm.orderId = this.orderId;
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
