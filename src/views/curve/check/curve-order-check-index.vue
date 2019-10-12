<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="批次报告">
        <el-date-picker
          v-model="queryForm.taskDay"
          align="right"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="批次">
        <el-select v-model="queryForm.orderId" placeholder="批次" :disabled="disabled">
          <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="indexQuery">查询</el-button>
      </el-form-item>
      <el-form-item class="icon-btn">
        <i class="el-icon-download" title="下载" @click="download" />
        <i class="el-icon-setting" title="偏差值设置" @click="orderSet" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="总览" name="zl" />
      <el-tab-pane label="全面性检查" name="qmxjc" />
      <el-tab-pane label="波动偏差" name="bdpc" />
      <el-tab-pane label="曲线跨线" name="qxkx" />
      <el-tab-pane label="曲线倒挂" name="qxdg" />
      <el-tab-pane label="容错" name="rc" />
    </el-tabs>
    <el-card v-if="activeName === 'zl'" class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3>总览</h3>
      </div>
      <CurveQualityOverallList ref="zl" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'qmxjc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>全面性检查</h3>
      </div>
      <CurveComprehensiveQcRpt ref="qmxjc" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'bdpc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>波动偏差</h3>
      </div>
      <CurveShkQcRpt ref="bdpc" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'qxkx'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>曲线跨线</h3>
      </div>
      <CurveCrsQcRpt ref="qxkx" :task-day="taskDayStr" :order-id="queryForm.orderId" :query-form="queryForm" />
    </el-card>
    <el-card v-if="activeName === 'qxdg'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>曲线倒挂</h3>
      </div>
      <CurveRvsQcRpt ref="qxdg" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'rc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>容错</h3>
      </div>
      <CurveFTQcRpt ref="rc" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>

    <el-dialog v-if="orderSetFormVisible" :lock-scroll="lockScroll" width="40%" title="设置曲线质检波动偏差值" :visible.sync="orderSetFormVisible">
      <CurveOrderCheckSetForm
        ref="refCurveOrderCheckSetForm"
        :order-list="orderList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderSetFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrderSet">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CurveQualityOverallList from '@/views/curve/check/curve-quality-overall-list.vue'
import CurveComprehensiveQcRpt from '@/views/curve/check/curve-quality-comprehensive-list.vue'
import CurveShkQcRpt from '@/views/curve/check/curve-quality-shk-list.vue'
import CurveRvsQcRpt from '@/views/curve/check/curve-quality-rvs-list.vue'
import CurveCrsQcRpt from '@/views/curve/check/curve-crossline-list.vue'
import CurveFTQcRpt from '@/views/curve/check/curve-quality-ft-list.vue'
import { getCurveTaskOrderOptions } from '@/api/curve/curve-order-compute.js'
import { dwnlCurveQcRpt } from '@/api/curve/curve-quality.js'
import CurveOrderCheckSetForm from '@/views/curve/check/curve-order-check-set-form.vue'
import { formatTimeToStr } from '@/utils/date.js'

export default {
  name: 'CurveOrderCheckIndex',
  components: {
    CurveQualityOverallList,
    CurveComprehensiveQcRpt,
    CurveShkQcRpt,
    CurveRvsQcRpt,
    CurveCrsQcRpt,
    CurveFTQcRpt,
    CurveOrderCheckSetForm
  },
  props: ['orderId', 'taskDay'],
  data() {
    return {
      lockScroll: true,
      disabled: false,
      orderSetFormVisible: false, // 曲线质检波动偏差值设置界面
      orderList: [], // 批次列表
      queryForm: {
        taskDay: null,
        orderId: ''
      },
      dwnlForm: {
        compDate: '20190918',
        batchId: 'B0002'
      },
      activeName: 'zl'
    }
  },
  computed: {
    taskDayStr() {
      var date = this.queryForm.taskDay
      if (date) {
        return this.$moment(date).format('YYYY-MM-DD')
      }
      return ''
    }
  },
  watch: {
    'queryForm.taskDay'(newValue, oldValue) {
      console.info('queryForm.taskDay.newValue:' + newValue)
      this.init()
    }
  },
  beforeMount() {
    console.info('beforeMount:' + this.orderId + ',taskDay:' + this.taskDay)
    var taskDay = this.taskDay
    if (!taskDay) {
      taskDay = new Date()
    }
    this.queryForm.taskDay = taskDay
    // 加载批次
    this.init()
  },
  methods: {
    async init() {
      // 加载批次
      this.orderList = []
      const data = {
        taskDay: formatTimeToStr(this.queryForm.taskDay, 'yyyy-MM-dd')
      }
      this.queryForm.orderId = ''
      await getCurveTaskOrderOptions(this.orderList, data)
      if (this.orderList && this.orderList.length > 0) {
        // 默认显示第一条
        this.queryForm.orderId = this.orderList[0].id
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 下载
    download() {
      console.info('download')
      dwnlCurveQcRpt(this.dwnlForm)
    },
    // 曲线质检波动偏差值设置
    orderSet() {
      console.info('orderSet')
      this.orderSetFormVisible = true
    },
    // 设置保存
    saveOrderSet() {
      console.info('saveOrderSet')
      this.orderSetFormVisible = false
    },
    // 主页面查询方法
    // 根据 activeName 调用各个页面查询方法
    indexQuery() {
      console.info('indexQuery.activeName:' + this.activeName)
      if (!this.queryForm.orderId) {
        this.$message({
          type: 'error',
          message: '请选择批次'
        })
        return false
      }
      this.$refs[this.activeName].handleFilter()
      // 总览 zl
      // if (this.activeName === 'zl') {
      //   this.$refs.zl.handleFilter()
      // } else if (this.activeName === 'qmxjc') {
      //   this.$refs.zl.handleFilter()
      // } else if (this.activeName === 'bdpc') {
      //   this.$refs.zl.handleFilter()
      // } else if (this.activeName === 'qxkx') {
      //   this.$refs.zl.handleFilter()
      // } else if (this.activeName === 'qxdg') {
      //   this.$refs.zl.handleFilter()
      // } else if (this.activeName === 'rc') {
      //   this.$refs.zl.handleFilter()
      // }
    }
  }
}
</script>

<style>
  .icon-btn{
    float: right;
  }
  .icon-btn .el-form-item__content{
    font-size: 24px;
  }
  .icon-btn i:hover{
    cursor: pointer;
  }
</style>
