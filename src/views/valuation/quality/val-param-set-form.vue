<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in orderList" :key="item.id" :label="item.orderName" :name="item.id" />
    </el-tabs>

    <el-form :inline="true" label-width="250px">
      <el-form-item label="估值净价波动阈值(元)">
        <el-col :span="15">
          <el-input v-model="orderSet.valNetPrcShkYuan" type="nubmer" />
        </el-col>
        <el-col :span="5">
          BP
        </el-col>
      </el-form-item>
      <el-form-item label="估值净价波动百分比阈值">
        <el-col :span="15">
          <el-input v-model="orderSet.valNetPrcShkPercent" type="nubmer" />
        </el-col>
        <el-co :span="5">
          %
        </el-co>
      </el-form-item>
      <el-form-item label="估值收益率波动BP阈值">
        <el-col :span="15">
          <el-input v-model="orderSet.valYieldShkBp" type="nubmer" />
        </el-col>
        <el-col :span="5">
          BP
        </el-col>
      </el-form-item>
      <el-form-item label="估值收益率波动百分比阈值">
        <el-col :span="15">
          <el-input v-model="orderSet.valYieldShkPercent" type="nubmer" />
        </el-col>
        <el-col :span="5">
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
  props: {
    orderList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      activeName: '',
      orderSet: {
        batchId: '',
        valNetPrcShkBp: '',
        valNetPrcShkPercent: '',
        valYieldShkBp: '',
        valYieldShkPercent: ''
      }, // 批次设置信息
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
      this.activeName = this.orderList[0].id
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
