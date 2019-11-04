<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in orderList" :key="item.id" :label="item.orderName" :name="item.id" />
    </el-tabs>

    <el-form :inline="true" label-width="250px">
      <el-form-item label="利率类曲线收益率波动偏差阈值">
        <el-col :span="10">
          <el-input v-model="orderSet.curveCreditShkBp" type="number" />
        </el-col>
        <el-col :span="5">
          BP
        </el-col>
      </el-form-item>
      <el-form-item label="利率类曲线收益率波动偏差阈值">
        <el-col :span="10">
          <el-input v-model="orderSet.curveCreditShkPercent" type="number" />
        </el-col>
        <el-co :span="5">
          %
        </el-co>
      </el-form-item>
      <el-form-item label="信用类曲线收益率波动偏差阈值">
        <el-col :span="10">
          <el-input v-model="orderSet.curveRateShkBp" type="number" />
        </el-col>
        <el-col :span="5">
          BP
        </el-col>
      </el-form-item>
      <el-form-item label="信用类曲线收益率波动偏差阈值">
        <el-col :span="10">
          <el-input v-model="orderSet.curveRateShkPercent" type="number" />
        </el-col>
        <el-col :span="5">
          %
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { optioins } from '@/api/curve/code-type.js'
import { qryCurveQcParm, setCurveQcParm } from '@/api/curve/curve-quality.js'

export default {
  name: 'CurveOrderCheckSetForm',
  props: ['orderList'],
  data() {
    return {
      activeName: '',
      orderSet: {
        batchId: '',
        curveCreditShkBp: '',
        curveCreditShkPercent: '',
        curveRateShkBp: '',
        curveRateShkPercent: ''
      }, // 批次设置信息
      form: {}
    }
  },
  beforeMount() {
    console.info('curve-order-check-set-form.vue beforeMount:')
    if (this.orderList && this.orderList.length > 0) {
      this.activeName = this.orderList[0].id
    }
    this.qryCurveQcParm()
  },
  methods: {
    // tab点击事件
    handleClick(tab, event) {
      console.log(tab, event)
      console.info('curve-order-check-set-form.vue handleClick:')
      // this.activeName = this.orderList[0].id
      this.qryCurveQcParm()
    },

    qryCurveQcParm() {
      const requestData = {
        batchId: this.activeName
      }
      qryCurveQcParm(requestData).then(response => {
        console.info('qryCurveQcParm.qryCurveQcParm...')
        this.orderSet = response
      })
    },

    setCurveQcParm() {
      setCurveQcParm(this.orderSet).then(response => {
        console.info('setCurveQcParm.setCurveQcParm...')
      })
    }
  }
}
</script>

<style scoped>

</style>
