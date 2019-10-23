<template>
  <div class="app-container" style="margin: 0;padding-left:0;padding-right:0">
    <el-row :gutter="24">
      <el-col :span="7">
        <el-button type="primary" style="margin-top: 10px" :disabled="disabled" @click="loadAll">刷新</el-button>
        <el-table
          ref="orderTable"
          :data="orderList"
          tooltip-effect="dark"
          style="width: 100%"
          :disabled="disabled"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30" />
          <el-table-column prop="orderName" label="批次名称" width="200" show-overflow-tooltip />
          <el-table-column prop="compTimeStr" label="批次发布时间段" width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.compTime }}~{{ scope.row.remindTime }}
            </template>
          </el-table-column>
        </el-table>
        <div class="text-center">
          <el-button type="primary" style="margin-top: 10px" :disabled="disabled" @click="applyOrder">应用所选批次</el-button>
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
              :order-name="tabItem.title"
              :order-index="index"
              :disabled="disabled"
              :curve-prd-kd-list="tabItem.curvePrdOrderKtList"
              :curve-prd-order-auto-list="tabItem.curvePrdOrderAutoList"
              :auto-prd-order-kts="tabItem.autoPrdOrderKts"
              :prd-order-auto-kds="tabItem.prdOrderAutoKds"
              :product-info="productInfo"
              @locaLastOrder="locaLastOrder"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { queryCurvePrdKd } from '@/api/curve/curve-product-list.js'
import { getOrderList, getProductOrderList, queryCurvePrdOrderKtList, queryProductOrderAutoList, savePrdOrder, queryAutoPrdOrderKts, queryPrdOrderAutoKts } from '@/api/curve/curve-product-order.js'
import CurveProductDefOrderDetailForm from '@/views/curve/product/curve-product-def-order-detail.vue'

export default {
  name: 'CurveProductDefOrderForm',
  components: {
    CurveProductDefOrderDetailForm
  },
  props: ['productId', 'opType', 'disabled', 'productInfo'],
  data() {
    return {
      productIdLocal: '',
      lockScroll: true,
      multipleSelection: [''], // 已勾选
      orderList: [], // 公共-批次列表
      productOrderId: [], // 当前已经关联的批次号
      productOrderList: [], // 产品已经关联批次列表
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 1,
      curvePrdOrderAutoList: {},
      curvePrdKdList: {}, // 产品关键期限
      curvePrdOrderKtList: {}, // 产品批次关键期限
      autoPrdOrderKts: [], // 产品-自动编制-关联曲线对应的产品关键期限
      prdOrderAutoKds: [], // 产品-自动编制-当前曲线关键期限
      temp: ''
    }
  },
  computed: {
  },
  beforeMount() {
    this.loadAll()
  },
  methods: {
    loadAll() {
      this.productIdLocal = this.productId
      // this.productIdLocal = '4028b8816d18e4c2016d1915bdc70004'
      console.info('curve-product-def-order.vue.beforeMount:' + this.productIdLocal)
      this.productInfo
      this.init()
    },
    // 加载批次所有数据
    async init() {
      // 查询产品关键期限，如果选择批次未生成生成相应 产品批次关键期限 信息，则默认取产品关键期限
      await queryCurvePrdKd({ curveId: this.productIdLocal }).then(response => {
        this.curvePrdKdList = response.dataList
      })

      // 查询产品已经关联批次
      await getProductOrderList({ curveId: this.productIdLocal }).then(response => {
        this.productOrderList = response
      })
      // 查询产品批次-自动编制-已关联批次权重信息
      await queryProductOrderAutoList({ curveId: this.productIdLocal }).then(response => {
        this.curvePrdOrderAutoList = response
      })
      // 查询产品批次-发布关键期限
      await queryCurvePrdOrderKtList({ curveId: this.productIdLocal }).then(response => {
        this.curvePrdOrderKtList = response
      })

      // 查询产品-自动编制-关联曲线对应的产品关键期限
      await queryAutoPrdOrderKts({ curveId: this.productIdLocal }).then(response => {
        this.autoPrdOrderKts = response
      })
      // 根据曲线编号，查询当前曲线所有批次自动编制关键期限列表
      await queryPrdOrderAutoKts({ curveId: this.productIdLocal }).then(response => {
        this.prdOrderAutoKds = response
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
    async loadOrderList() {
      console.info('loadOrderList')
      // 获取已经关联批次ID
      this.productOrderId = this.getProductOrderIds()

      // 加载批次
      this.orderList = []
      var dataList = []
      await getOrderList({ 'basePrd': '02' }).then(response => {
        dataList = response
      })
      if (dataList && dataList.length > 0) {
        for (var i = 0; i < dataList.length; i++) {
          var item = dataList[i]
          this.orderList.push({ id: item.orderNo, orderName: item.orderName, compTime: item.compTime, pubTime: item.pubTime, remindTime: item.remindTime })
        }
      }

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
        if (index === '0') {
          firstTab = newTabName
        }
        // 判断是否存在newTabName
        const title = item.orderName

        // 获取批次信息
        const orderData = this.getProductOrderInfo(newTabName)
        orderData.orderId = item.id
        orderData.orderName = item.orderName

        // 产品批次-关键期限
        const curvePrdOrderKtList = this.getcurvePrdOrderKtList(newTabName)
        // 产品批次-自动编制列表
        const curvePrdOrderAutoList = this.getCurvePrdOrderAutoList(newTabName)
        // 产品批次-自动编制-已经勾选保存关键期限
        const prdOrderAutoKds = this.getPrdOrderAutoKds(newTabName)
        this.editableTabs.push({
          title: title,
          name: newTabName,
          orderData: orderData,
          curvePrdOrderKtList: curvePrdOrderKtList,
          curvePrdOrderAutoList: curvePrdOrderAutoList,
          prdOrderAutoKds: prdOrderAutoKds
        })
      }
      // 默认选中第一个
      this.editableTabsValue = firstTab
    },
    // 产品批次-自动编制-已经勾选保存关键期限
    getPrdOrderAutoKds(orderId) {
      var list = []
      for (var i = 0; i < this.prdOrderAutoKds.length; i++) {
        var item = this.prdOrderAutoKds[i]
        if (item.orderId === orderId) {
          list.push(item)
        }
      }
      return list
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
      var item = {
        curveOrderId: 'TEMP_' + orderId, // 临时ID
        orderId: orderId,
        model: '1', // 模型
        buildType: '2', // 编制方式
        computedType: '2', // 计算方式
        publishType: '2', // 编制方式
        publishSampleFlag: 'N', // 是否发布样本券
        validFlag: 'Y', // 默认生效
        abc: ''
      }
      this.productOrderList.push(item)
      return item
    },
    // 从已关联的列表中获取信息
    getcurvePrdOrderKtList(orderId) {
      var list = []
      for (var i = 0; i < this.curvePrdOrderKtList.length; i++) {
        var item = this.curvePrdOrderKtList[i]
        if (item.orderId === orderId) {
          list.push(item)
        }
      }

      // 如果产品批次关键期限中没有相应记录，则从产品关键期限列表中获取
      if (list.length === 0) {
        // list = this.curvePrdKdList  // 不能直接赋值，只能拷贝
        // eslint-disable-next-line no-undef
        list = _.cloneDeep(this.curvePrdKdList)
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
    },
    // 验证批次信息
    validateCurvePrdOrder(info) {
      var msg = []
      if (!info) {
        msg.push('批次信息不能为空;')
        return msg
      }

      if (!info.model) {
        msg.push('批次所需模型不能为空')
      }
      if (!info.buildType) {
        msg.push('编辑方式不能为空')
      }
      if (!info.computedType) {
        msg.push('批次所需计算方式不能为空')
      }
      if (!info.publishType) {
        msg.push('批次所需发布方式不能为空')
      }
      if (!info.curvePubType) {
        msg.push('曲线发布类型不能为空')
      }
      if (!info.publishSampleFlag) {
        msg.push('是否发布样本券不能为空')
      }
      if (!info.publishStepSize) {
        msg.push('发布步长不能为空')
      }
      if (!info.interestDueFreq) {
        msg.push('付息频率不能为空')
      }
      if (info.orderClosedFlag === '1' && (info.orderClosedSt || info.orderClosedEt)) {
        msg.push('批次关闭的生效时间,开始和结束时间都不可为空')
      }
      return msg.join('、')
    },
    // 保存
    async saveOrder() {
      // 获取所有tab列表
      console.info('orderInfo')
      console.info(this.productOrderList)
      // 从  取关键期限
      const list = this.$refs.refCurveProductDefOrderDetailForm
      const orders = []
      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          const curvePrdOrder = item.getCurvePrdOrder()
          const prdKtList = item.getPrdKtList()
          const prdOrderAutoList = item.getPrdOrderAutoList()
          const prdOrderAutoKtList = item.getPrdOrderAutoKtListSelected()
          const orderName = curvePrdOrder.orderName

          // 验证批次信息
          const msg = this.validateCurvePrdOrder(curvePrdOrder)
          if (msg) {
            this.$message({
              type: 'warning',
              duration: 10000,
              showClose: true,
              message: '批次【' + orderName + '】数据校验异常:' + msg
            })
            return false
          }
          // 验证发布关键期限
          if (!prdKtList || prdKtList.length <= 0) {
            this.$message({
              type: 'warning',
              duration: 10000,
              showClose: true,
              message: '批次【' + orderName + '】发布关键期限为空'
            })
            return false
          }
          // 校验数据
          orders.push(
            {
              curvePrdOrder: curvePrdOrder,
              prdKtList: prdKtList,
              prdOrderAutoList: prdOrderAutoList,
              prdOrderAutoKtList: prdOrderAutoKtList
            }
          )
        }
      } else {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '未设置批次信息'
        })
        return false
      }

      var result = false
      if (!this.productIdLocal) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '未获取到产品ID'
        })
        return false
      }
      await savePrdOrder({ curveId: this.productIdLocal, orders: orders }).then(response => {
        console.info(response)
        this.$emit('saveOrderCallBack')
        // 保存最新信息
        result = true
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
        return result
      })
      return result
    },
    // 加载上一次数据
    locaLastOrder(index) {
      console.info('locaLastOrder,加载上一次数据:' + index)
      if (index <= 0) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '没有上一批次信息'
        })
        return false
      }
      const list = this.$refs.refCurveProductDefOrderDetailForm
      if (list && list.length > 0) {
        const src = list[index - 1]
        const target = list[index]
        const srcOrder = src.getCurvePrdOrder()
        const targetOrder = target.getCurvePrdOrder()

        // 拷贝
        targetOrder.model = srcOrder.model
        targetOrder.buildType = srcOrder.buildType
        targetOrder.computedType = srcOrder.computedType
        targetOrder.publishType = srcOrder.publishType
        targetOrder.curvePubType = srcOrder.curvePubType
        targetOrder.publishSampleFlag = srcOrder.publishSampleFlag
        targetOrder.publishStepSize = srcOrder.publishStepSize
        targetOrder.interestDueFreq = srcOrder.interestDueFreq
        targetOrder.orderClosedFlag = srcOrder.orderClosedFlag
        targetOrder.orderClosedSt = srcOrder.orderClosedSt
        targetOrder.orderClosedEt = srcOrder.orderClosedEt
        targetOrder.orderKeyTermNo = srcOrder.orderKeyTermNo
        targetOrder.orderAutoBuildRule = srcOrder.orderAutoBuildRule

        targetOrder.interestDueFreqSelected = srcOrder.interestDueFreqSelected
        targetOrder.curvePubTypeSelected = srcOrder.curvePubTypeSelected
        targetOrder.publishStepSizeSelected = srcOrder.publishStepSizeSelected

        // 重置多选框
        target.setCurvePrdOrder()
      }
    }
  }
}
</script>

<style scoped>

</style>
