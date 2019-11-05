<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in orderList" :key="item.id" :label="item.orderName" :name="item.id" />
    </el-tabs>

    <el-form :inline="true" label-width="250px">
      <el-form-item label="估值净价波动阈值">
        <el-col :span="8">
          <el-select v-model="orderSet.valNetPrcShkYuanLogic">
            <el-option v-for="item in logicList" :key="item.logicCd" :label="item.logicName" :value="item.logicCd" />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-input v-model="orderSet.valNetPrcShkYuan" />
        </el-col>
        <el-col :span="3">
          元
        </el-col>
      </el-form-item>
      <el-form-item label="估值净价波动百分比阈值">
        <el-col :span="8">
          <el-select v-model="orderSet.valNetPrcShkPercentLogic">
            <el-option v-for="item in logicList" :key="item.logicCd" :label="item.logicName" :value="item.logicCd" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="orderSet.valNetPrcShkPercent" />
        </el-col>
        <el-col :span="3">
          %
        </el-col>
      </el-form-item>
      <el-form-item label="估值收益率波动BP阈值">
        <el-col :span="8">
          <el-select v-model="orderSet.valYieldShkBpLogic">
            <el-option v-for="item in logicList" :key="item.logicCd" :label="item.logicName" :value="item.logicCd" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="orderSet.valYieldShkBp" />
        </el-col>
        <el-col :span="3">
          BP
        </el-col>
      </el-form-item>
      <el-form-item label="估值收益率波动百分比阈值">
        <el-col :span="8">
          <el-select v-model="orderSet.valYieldShkPercentLogic">
            <el-option v-for="item in logicList" :key="item.logicCd" :label="item.logicName" :value="item.logicCd" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="orderSet.valYieldShkPercent" />
        </el-col>
        <el-col :span="3">
          %
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { qryValQcParm, setValQcParm } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValParamSetForm',
  props: ['orderList'],
  data() {
    return {
      activeName: '',
      orderSet: {
        batchId: '',
        valNetPrcShkBp: '',
        valNetPrcShkBpLogic: '',
        valNetPrcShkPercent: '',
        valNetPrcShkPercentLogic: '',
        valYieldShkBp: '',
        valYieldShkBpLogic: '',
        valYieldShkPercent: '',
        valYieldShkPercentLogic: ''
      }, // 批次设置信息
      logicList: [
        { logicName: '>', logicCd: 'GT' },
        { logicName: '>=', logicCd: 'GE' }
      ],
      form: {}
    }
  },
  beforeMount() {
    console.info('val-param-set-form.vue beforeMount:')
    if (this.orderList && this.orderList.length > 0) {
      this.activeName = this.orderList[0].id
    }
    this.qryValQcParm()
  },
  methods: {
    // tab点击事件
    handleClick(tab, event) {
      console.log(tab, event)
      console.info('val-param-set-form.vue handleClick:')
      // this.activeName = this.orderList[0].id
      this.qryValQcParm()
    },

    qryValQcParm() {
      const requestData = {
        batchId: this.activeName
      }
      qryValQcParm(requestData).then(response => {
        console.info('qryValQcParm.qryValQcParm...')
        this.orderSet = response
      })
    },

    setValQcParm() {
      setValQcParm(this.orderSet).then(response => {
        console.info('setValQcParm.setValQcParm...')
      })
    }
  }
}
</script>

<style scoped>

</style>
