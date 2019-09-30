<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in orderList" :label="item.orderName" :name="item.id" />
    </el-tabs>

    <el-form v-for="item in orderSetList" v-show="activeName === item.orderId" :inline="true" label-width="250px">
      <el-form-item label="利率类曲线收益率波动偏差阈值">
        <el-col :span="15">
          <el-input v-model="item.key1" type="nubmer" />
        </el-col>
        <el-col :span="5">
          BP
        </el-col>
      </el-form-item>
      <el-form-item label="利率类曲线收益率波动偏差阈值">
        <el-col :span="15">
          <el-input v-model="item.key2" type="nubmer" />
        </el-col>
        <el-co :span="5">
          %
        </el-co>
      </el-form-item>
      <el-form-item label="信用类曲线收益率波动偏差阈值">
        <el-col :span="15">
          <el-input v-model="item.key1" type="nubmer" />
        </el-col>
        <el-col :span="5">
          BP
        </el-col>
      </el-form-item>
      <el-form-item label="信用类曲线收益率波动偏差阈值">
        <el-col :span="15">
          <el-input v-model="item.key4" type="nubmer" />
        </el-col>
        <el-col :span="5">
          %
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { optioins } from '@/api/curve/code-type.js'

export default {
  name: 'CurveOrderCheckSetForm',
  props: ['orderList'],
  data() {
    return {
      activeName: '',
      orderSetList: [], // 所有批次设置信息
      form: {}
    }
  },
  beforeMount() {
    console.info('curve-order-check-set-form.vue beforeMount:')
    this.orderSetList = [
      {orderId:'ORDER_ID_1',key1:11,key2:2,key3:3,key4:4},
      {orderId:'ORDER_ID_2',key1:21,key2:2,key3:3,key4:4},
      {orderId:'ORDER_ID_3',key1:31,key2:2,key3:3,key4:4},
      {orderId:'ORDER_ID_4',key1:41,key2:2,key3:3,key4:4},
    ]
    if (this.orderList && this.orderList.length > 0){
      this.activeName = this.orderList[0].id
    }
  },
  methods: {
    // tab点击事件
    handleClick(tab, event) {
      console.log(tab, event)
      console.info('curve-order-check-set-form.vue handleClick:')
    }
  }
}
</script>

<style scoped>

</style>
