<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="批次报告">
        <el-date-picker
          v-model="queryForm.taskDay"
          align="right"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
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
      <el-form-item>
        <ValQcUploadForm ref="upload" :task-day="taskDayStr" :order-id="queryForm.orderId" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="总览" name="zl" />
      <el-tab-pane label="入库变动" name="rkbd" />
      <el-tab-pane label="净价波动" name="jjbd" />
      <el-tab-pane label="收益率波动" name="sylbd" />
      <el-tab-pane label="容错" name="rc" />
      <el-tab-pane label="应计利息报警" name="yjlxbj" />
      <el-tab-pane label="估值为0" name="gzwl" />
      <el-tab-pane label="成本法" name="cbf" />
      <el-tab-pane label="重复估值" name="cfgz" />
    </el-tabs>
    <el-card v-if="activeName === 'zl'" class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3>总览</h3>
      </div>
      <ValOverallList ref="zl" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'rkbd'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>入库变动</h3>
      </div>
      <ValNumChgList ref="rkbd" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'jjbd'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>净价波动</h3>
      </div>
      <ValNetPrcShkList ref="jjbd" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'sylbd'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>收益率波动</h3>
      </div>
      <ValYieldShkList ref="sylbd" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'rc'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>容错</h3>
      </div>
      <ValFTQList ref="rc" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'yjlxbj'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>应计利息报警</h3>
      </div>
      <ValAccIntrstAlertList ref="yjlxbj" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'gzwl'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>估值为0</h3>
      </div>
      <ValValList ref="gzwl" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'cbf'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>成本法</h3>
      </div>
      <ValNetPrcList ref="cbf" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>
    <el-card v-if="activeName === 'cfgz'" class="box-card ">
      <div slot="header" class="clearfix card-head">
        <h3>重复估值</h3>
      </div>
      <ReValList ref="cfgz" :task-day="taskDayStr" :order-id="queryForm.orderId" />
    </el-card>

    <el-dialog v-if="orderSetFormVisible" :lock-scroll="lockScroll" width="40%" title="设置估值质检参数" :visible.sync="orderSetFormVisible">
      <ValParamSetForm
        ref="refValParamSetForm"
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
import ValOverallList from '@/views/valuation/quality/val-overall-list.vue'
import ValNumChgList from '@/views/valuation/quality/val-num-chg-list.vue'
import ValNetPrcShkList from '@/views/valuation/quality/val-netprc-shk-list.vue'
import ValYieldShkList from '@/views/valuation/quality/val-yield-shk-list.vue'
import ValAccIntrstAlertList from '@/views/valuation/quality/val-intrst-alert-list.vue'
import ValFTQList from '@/views/valuation/quality/val-ftq-list.vue'
import ValNetPrcList from '@/views/valuation/quality/val-netprc-list.vue'
import ValValList from '@/views/valuation/quality/val-val-list.vue'
import ReValList from '@/views/valuation/quality/val-reval-list.vue'
import ValQcUploadForm from '@/views/valuation/quality/val-upload-excel.vue'
import ValParamSetForm from '@/views/valuation/quality/val-param-set-form.vue'
import { dwnlValQcRpt, uplValQcRpt, getValOrderList } from '@/api/valuation/val-quality.js'
import { formatTimeToStr } from '@/utils/date.js'

export default {
  name: 'ValQualityIndex',
  components: {
    ValOverallList,
    ValNumChgList,
    ValNetPrcShkList,
    ValYieldShkList,
    ValAccIntrstAlertList,
    ValFTQList,
    ValNetPrcList,
    ValValList,
    ReValList,
    ValQcUploadForm,
    ValParamSetForm
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    taskDay: {
      type: Date,
      default: () => (new Date())
    }
  },
  data() {
    return {
      lockScroll: true,
      disabled: false,
      orderSetFormVisible: false, // 估值质检参数设置界面
      orderList: [], // 批次列表
      queryForm: {
        taskDay: null,
        orderId: ''
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
    console.info('val-quality-index.vue beforeMount:' + this.orderId + ',taskDay:' + this.taskDay)
    var taskDay = this.taskDay
    if (!taskDay) {
      taskDay = new Date()
    }
    this.queryForm.taskDay = formatTimeToStr(taskDay, 'yyyy-MM-dd')
    // 加载批次
    this.init(true)
    console.info('orderList.length' + this.orderList.length)
  },
  methods: {
    async init() {
      // 加载批次
      // const data = {
      //   taskDay: formatTimeToStr(this.queryForm.taskDay, 'yyyy-MM-dd')
      // }
      this.orderList = []
      this.orderList.push({ id: 'initBatch', orderName: '初始化批次' })
      this.orderList.push({ id: 'PCID1', orderName: 'PCID1' })
      await this.getValOrderOptions(this.orderList)
      if (this.orderList && this.orderList.length > 0) {
        // 默认显示第一条
        if (this.queryForm.orderId) {
          var isIn = false
          for (let i = 0; i < this.orderList.length; i++) {
            const orderInfo = this.orderList[i]
            if (this.queryForm.orderId === orderInfo.id) {
              isIn = true
            }
          }
          if (!isIn) {
            this.queryForm.orderId = this.orderList[0].id
          }
        } else {
          this.queryForm.orderId = this.orderList[0].id
        }
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getValOrderOptions(orderList) {
      console.info('getValOrderOptions...')
      var dataList = []
      const data = { basePrd: '01' }
      await getValOrderList(data).then(response => {
        dataList = response
      })
      if (dataList && dataList.length > 0) {
        for (var i = 0; i < dataList.length; i++) {
          var item = dataList[i]
          orderList.push({ id: item.orderNo, orderName: item.orderName })
        }
      }
      return orderList
    },
    // 下载
    download() {
      console.info('download')
      const dwnlForm = {
        compDate: this.queryForm.taskDay,
        batchId: this.queryForm.orderId
      }
      dwnlValQcRpt(dwnlForm)
    },
    upload(param) {
      console.info('param' + param)
      const fd = new FormData()
      fd.append('batchId', this.queryForm.orderId)
      fd.append('compDate', this.queryForm.taskDay)
      fd.append('attach', param)
      uplValQcRpt(fd)
    //     .then(() => {
    //       this.$message({
    //         showClose: true,
    //         message: '上传成功。',
    //         type: 'success'
    //       })
    //     })
    //     .catch(() => {
    //       this.$message.error('只能上传.xls或.xlsx结尾的文件')
    //     })
    },
    // 估值质检参数设置
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
