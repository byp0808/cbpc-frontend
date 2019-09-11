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
              :order-data="tabItem.orderData"
              :curve-prd-kd-list="tabItem.curvePrdKdList"
              :curve-prd-order-auto-list="tabItem.curvePrdOrderAutoList"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrderList, getProductOrderList, queryProdcutKdList, queryProductOrderAutoList } from '@/api/curve/curve-product-order.js'
import CurveProductDefOrderDetailForm from '@/views/curve/product/curve-product-def-order-detail.vue'

export default {
  name: 'CurveProductDefOrderForm',
  components: {
    CurveProductDefOrderDetailForm
  },
  props: ['productId', 'opType'],
  data() {
    return {
      productIdLocal: '',
      disabled: false,
      lockScroll: true,
      multipleSelection: [''], // 已勾选
      orderList: [], // 公共-批次列表
      productOrderId: [], // 当前已经关联的批次号
      productOrderList: [], // 产品已经关联批次列表
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 1,
      curvePrdOrderAutoList: {},
      curvePrdKdList: {}
    }
  },
  computed: {
  },
  beforeMount() {
    this.productIdLocal = this.productId;
    this.productIdLocal = 'd7810466a01646a082e206087c96e15c'
    console.info('curve-product-def-order.vue.beforeMount:' + this.productIdLocal)
    this.init()
  },
  methods: {
    // 加载批次所有数据
    async init() {
      // 查询产品已经关联批次
      await getProductOrderList({ productId: this.productIdLocal }).then(response => {
        this.productOrderList = response
      })
      // 查询产品批次-自动编制-已关联批次权重信息
      await queryProductOrderAutoList({ cerverId: this.productIdLocal }).then(response => {
        this.curvePrdOrderAutoList = response
      })
      // 查询产品批次-发布关键期限
      await queryProdcutKdList({ cerverId: this.productIdLocal }).then(response => {
        this.curvePrdKdList = response
      })

      // 加载批次列表
      this.loadOrderList()
    },
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
      for (const index in this.multipleSelection) {
        const item = this.multipleSelection[index]
        const newTabName = item.id
        if (index == 0) {
          firstTab = newTabName
        }
        // 判断是否存在newTabName
        const title = item.orderName

        // 获取批次信息
        const orderData = this.getProductOrderInfo(newTabName)
        // 产品批次-关键期限
        const curvePrdKdList = this.getCurvePrdKdList(newTabName)
        // 产品批次-自动编制列表
        const curvePrdOrderAutoList = this.getCurvePrdOrderAutoList(newTabName)
        this.editableTabs.push({
          title: title,
          name: newTabName,
          orderData: orderData,
          curvePrdKdList: curvePrdKdList,
          curvePrdOrderAutoList: curvePrdOrderAutoList
        })
      }
      // 默认选中第一个
      this.editableTabsValue = firstTab
    },
    // 从已关联的列表中获取信息
    getProductOrderInfo(orderId) {
      console.info('getProductOrderInfo:' + orderId)
      for (const index in this.productOrderList) {
        const item = this.productOrderList[index]
        if (orderId === item.orderId) {
          return item
        }
      }
      return {}
    },
    // 从已关联的列表中获取信息
    getCurvePrdKdList(orderId) {
      var list = []
      for (var i = 0 ; this.curvePrdKdList.length ; i ++) {
        var item = this.curvePrdKdList[i]
        if (item.curveOrderId === orderId) {
          list.push(item)
        }
      }
      return list
    },
    // 曲线产品批次自动编制触发条件
    getCurvePrdOrderAutoList(orderId) {
      var list = []
      for (const index in this.curvePrdOrderAutoList) {
        const item = this.curvePrdOrderAutoList[index]
        if (orderId === item.orderId) {
          list.push(item)
        }
      }
      return list
    }
  }
}
</script>

<style scoped>

</style>
