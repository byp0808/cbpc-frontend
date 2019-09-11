<template>
  <div class="app-container" style="margin: 0;padding-left:0;padding-right:0">
    <el-row :gutter="24">
      <el-col :span="7">
        <el-table
          ref="orderTable"
          :data="orderList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30" />
          <el-table-column prop="orderName" label="批次名称" width="100" show-overflow-tooltip />
          <el-table-column prop="compTimeStr" label="批次发布时间段" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.compTimeStr }}~{{ scope.row.pubTimeStr }}
            </template>
          </el-table-column>
        </el-table>
        <div class="text-center">
          <el-button type="primary" style="margin-top: 10px" @click="applyOrder">应用所选批次</el-button>
        </div>
      </el-col>
      <el-col :span="17">
        <el-tabs v-model="editableTabsValue" type="card">
          <el-tab-pane
            v-for="(tabItem, index) in editableTabs"
            :key="tabItem.name"
            :label="tabItem.title"
            :name="tabItem.name"
          >
            <CurveProductDefOrderDetailForm
              ref="refCurveProductDefOrderDetailForm"
              :orderData="tabItem.orderData"
              :curvePrdKdList="tabItem.curvePrdKdList"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { optioins } from '@/api/curve/code-type.js'
import { getOrderList, getProductOrderList } from '@/api/curve/curve-product-order.js'
import { getProdcutKdList } from '@/api/curve/curve-product-list.js'
import CurveProductDefOrderDetailForm from '@/views/curve/product/curve-product-def-order-detail.vue'

export default {
  name: 'CurveProductDefOrderForm',
  components: {
    CurveProductDefOrderDetailForm
  },
  props: ['productId', 'opType'],
  data() {
    return {
      disabled: false,
      lockScroll: true,
      multipleSelection: [''], // 已勾选
      orderList: [], // 公共-批次列表
      productOrderId: [], // 当前已经关联的批次号
      productOrderList: [], // 产品已经关联批次列表
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 1 ,
      autoRuleCurveList: {},
      curvePrdKdList: {}
    }
  },
  computed: {
  },
  beforeMount() {
    console.info('curve-product-def-order.vue.beforeMount:')
    // 查询产品已经关联批次
    getProductOrderList({ productId: this.productId }).then(response => {
      console.info('curve-product-def-order.vue.beforeMount.getProductOrderList...')
      this.productOrderList = response
      // 加载批次列表
      this.loadOrderList()
    })
    console.info('this.productOrderList:' + this.productOrderList)
  },
  methods: {
    handleSelectionChange(items) {
      this.multipleSelection = items
    },
    getProductOrderIds() {
      var ids = []
      if (this.productOrderList.length > 0) {
        for (const index in this.productOrderList) {
          ids.push(this.productOrderList[index].orderId)
        }
      }
      return ids
    },
    loadOrderList() {
      console.info('loadOrderList')
      // 获取已经关联批次ID
      this.productOrderId = this.getProductOrderIds()
      // 加载批次
      this.orderList = getOrderList()

      this.$nextTick(() => {
        if (this.orderList && this.orderList.length > 0 && this.productOrderId && this.productOrderId.length > 0) {
          this.orderList.filter(item => {
            if (this.productOrderId.indexOf(item.id) > -1) {
              this.$refs.orderTable.toggleRowSelection(item, true) // 默认选中
            }
          })

          // 初始化TAB
          this.initTab()
        }
      })
    },
    // 应用所选批次
    applyOrder() {
      console.info('applyOrder====')
      this.initTab()
    },
    initTab() {
      // 获取所有选择的数据
      var firstTab = ''
      this.editableTabs = []
      for ( const index in this.multipleSelection) {
        const item = this.multipleSelection[index]
        const newTabName = item.id
        if ( index == 0 ) {
          firstTab = newTabName
        }
        // 判断是否存在newTabName
        const title = item.orderName
        const orderData = this.getProductOrderInfo(newTabName)
        const autoRuleCurveList = this.getAutoRuleCurveList(newTabName)
        const curvePrdKdList = this.getCurvePrdKdList(newTabName)
        this.editableTabs.push({
          title: title,
          name: newTabName,
          orderData: orderData,
          autoRuleCurveList: autoRuleCurveList,
          curvePrdKdList: curvePrdKdList
        })
      }
      // 默认选中第一个
      this.editableTabsValue = firstTab
    },
    // 从已关联的列表中获取信息
    getProductOrderInfo(orderId){
      console.info('getProductOrderInfo:' + orderId)
      for ( const index in this.productOrderList) {
        const item = this.productOrderList[index]
        if (orderId === item.orderId) {
          return item
        }
      }
      return {}
    },
    // 从已关联的列表中获取信息
    getAutoRuleCurveList(orderId){
      var item = this.autoRuleCurveList[orderId]
      if (!item) {
        this.autoRuleCurveList[orderId] = item;
      }
      return item
    },
    // 从已关联的列表中获取信息
    getCurvePrdKdList(orderId){
      var item = this.getCurvePrdKdList[orderId]
      if (!item) {
        this.getCurvePrdKdList[orderId] = item;
      }
      return item
    }
  }
}
</script>

<style scoped>

</style>
