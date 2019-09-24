<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" @click="toAddCurveProduct('ADD')">开始计算</el-button>
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      完成曲线计算率
      <div class="bar" style="display: inline-block;width:100px">
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="50"
          status="success"
          :show-text="true"
        />
      </div>
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="toAddCurveProduct('ADD')">查看质检报告</el-button>
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="toAddCurveProduct('ADD')">曲线发布</el-button>
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="toAddCurveProduct('ADD')">检查曲线样本券</el-button>
      <i class="el-icon-caret-right" />
      <el-button type="primary" @click="toAddCurveProduct('ADD')">曲线样本券发布</el-button>
    </el-row>
    <el-row style="margin: 20px 0;">
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
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      ref="refCurveOrderList"
      :data="curveOrderList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="curvePrdCode" label="曲线编码" width="140" />
      <el-table-column prop="curveName" label="曲线名称" width="200" show-overflow-tooltip />
      <el-table-column prop="productLine" label="曲线类型" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productLine }}
        </template>
      </el-table-column>
      <el-table-column prop="productLine" label="曲线编制方式" width="150`" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productLine }}
        </template>
      </el-table-column>
      <el-table-column prop="productLine" label="曲线编制方式" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productLine }}
        </template>
      </el-table-column>
      <el-table-column prop="productLine" label="曲线编制状态" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.productLine }}
        </template>
      </el-table-column>
      <el-table-column prop="curveName" label="责任人" width="140" show-overflow-tooltip />
    </el-table>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getOrderList } from '@/api/curve/curve-product-order.js'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['orderId', 'orderInfo'],
  data() {
    return {
      queryForm: {
        curveName: '',
        buildType: '1',
        buildStatus: ''
      },
      curveOrderList: []
    }
  },
  computed: {},
  beforeMount() {
    console.info('curve-order-compute.vue.===beforeMount===')
    console.info('orderId:' + this.orderId)

    // 初始化批次计算列表
    this.initOrderTable()
  },
  methods: {
    // 初始化批次计算列表
    initOrderTable() {

    },
    handleSelectionChange() {

    },
    // 查询
    query() {

    }
  }
}
</script>
<style>
  .el-tabs__content {
    display: none;
  }
</style>
