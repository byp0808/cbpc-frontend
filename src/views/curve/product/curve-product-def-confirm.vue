<template>
  <div class="app-container" style="margin: 0;padding-left:0;padding-right:0">
    <el-row>
      <el-col :span="6">
        <el-row
          v-for="(item) in productOrderListLocal"
          :key="item.curveOrderId"
        >
          <el-row class="prd-order-top">
            <el-col :span="6" class="prd-order-name">
              {{ getOrderName(item.orderId) }}
            </el-col>
<!--            <el-col v-if="item.curveSampleNumberVisible" :span="6" class="prd-order-name-sample">-->
<!--              <span>曲线样本券数量: {{ item.curveSampleNumber }}</span>-->
<!--            </el-col>-->
          </el-row>
          <el-button v-if="item.viewCurveSampleVisible" type="primary" size="mini" round :disabled="disabled" @click="showCurveInfo(item)">查看曲线性质</el-button>
        </el-row>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <label v-if="this.curveSampleNumberVisible">曲线样本券数量：{{ this.curveSampleNumber }}</label>
        </div>
        <el-table :data="tableData" style="width: 100%" v-if="this.curveSampleNumberVisible">
          <el-table-column prop="bondNo" label="资产编码" width="180" />
          <el-table-column prop="bondName" label="资产简称" width="180" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getOrderList, getProductOrderList, viewCurveProperty } from '@/api/curve/curve-product-order.js'

export default {
  name: 'CurveProductDefConfirm',
  components: {
  },
  props: ['productId', 'disabled'],
  data() {
    return {
      productIdLocal: '',
      lockScroll: true,
      productOrderList: [], // 当前产品设置批次列表
      productOrderListLocal: [], // 当前产品设置批次列表
      orderList: [], // 批次模板列表
      temp: '',
      curveSampleNumber: '',
      curveSampleNumberVisible: false,
      tableData: []
    }
  },
  computed: {
  },
  beforeMount() {
    this.productIdLocal = this.productId
    // this.productIdLocal = '4028b8816d18e4c2016d1915bdc70004'
    console.info('curve-product-def-confirm.productId:' + this.productIdLocal)
    // 初始化
    this.init()
  },
  methods: {
    getOrderName(id) {
      var list = this.orderList
      var label = id
      for (const index in list) {
        const item = list[index]
        if (id === item.id) {
          return item.orderName
        }
      }
      return label
    },
    async init() {
      // 加载批次
      // 加载批次
      this.orderList = []
      var dataList = []
      await getOrderList({ 'basePrd': '02' }).then(response => {
        dataList = response
      })
      if (dataList && dataList.length > 0) {
        for (var i = 0; i < dataList.length; i++) {
          var item = dataList[i]
          this.orderList.push({ id: item.id, orderName: item.orderName, compTime: item.compTime, pubTime: item.pubTime })
        }
      }

      // 查询产品已经关联批次
      await getProductOrderList({ curveId: this.productIdLocal }).then(response => {
        this.productOrderList = response

        if (this.productOrderList && this.productOrderList.length > 0) {
          for (let i = 0; i < this.productOrderList.length; i++) {
            var item = this.productOrderList[i]
            var viewCurveSampleVisible = false
            if (item.publishType) {
              viewCurveSampleVisible = true
            } else {
              viewCurveSampleVisible = false
            }
            this.productOrderListLocal.push({
              index: i,
              orderId: item.orderId,
              curveId: item.curveId,
              curveOrderId: item.curveOrderId,
              viewCurveSampleVisible: viewCurveSampleVisible,
              curveSampleNumber: ''
            })
          }
        }
      })
    },
    // 显示曲线性质
    showCurveInfo(item) {
      const curveId = item.curveId
      const curveOrderId = item.curveOrderId
      console.info(curveId, curveOrderId)
      this.curveSampleNumberVisible = true
      var data = {
        curveId: curveId
      }
      viewCurveProperty(data).then(response => {
        this.tableData = response.data.dataList
        this.curveSampleNumber = response.data.length
        setTimeout(1.5 * 1000)
      })
    }
  }
}
</script>

<style scoped>
.prd-order-item{

}
.prd-order-name, .prd-order-name-sample{
  float: left;
  line-height: 40px;
}
</style>
