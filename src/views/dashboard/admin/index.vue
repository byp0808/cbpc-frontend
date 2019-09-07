<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="、github-corner" />-->

    <!--<panel-group @handleSetLineChartData="handleSetLineChartData" />-->

    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--<line-chart :chart-data="lineChartData" />-->
    <!--</el-row>-->

    <!--<el-row :gutter="32">-->
    <!--<el-col :xs="24" :sm="24" :lg="8">-->
    <!--<div class="chart-wrapper">-->
    <!--<raddar-chart />-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="24" :lg="8">-->
    <!--<div class="chart-wrapper">-->
    <!--<pie-chart />-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="24" :lg="8">-->
    <!--<div class="chart-wrapper">-->
    <!--<bar-chart />-->
    <!--</div>-->
    <!--</el-col>-->
    <!--</el-row>-->

    <!--<el-row :gutter="8">-->
    <!--<el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
    <!--<transaction-table />-->
    <!--</el-col>-->
    <!--<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--<todo-list />-->
    <!--</el-col>-->
    <!--<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--<box-card />-->
    <!--</el-col>-->
    <!--</el-row>-->
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="grid-content bg-purple" />
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-table
            :data="todoInfo.dataList"
            style="width: 100%"
          >
            <el-table-column
              prop="businessName"
              label="业务名称"
              width="180"
            />
            <el-table-column
              prop="taskName"
              label="任务名称"
              width="180"
            />
            <el-table-column
              prop="taskStartUserName"
              label="发起人"
            />
            <el-table-column
              prop="createTs"
              label="发起时间"
            />
            <el-table-column
              prop="address"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="toApproval(scope.row.businessNo)"
                >
                  审核
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="todoInfo.page.pageNumber"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="todoInfo.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="todoInfo.page.totalPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog v-if="approval.recCurveFormVisible" fullscreen="" title="新增估值曲线推荐规则" :visible.sync="approval.recCurveFormVisible">
      <approvalDialog
        ref="refApprovalDialog"
        :business-id="approval.businessNo"
        :disabled="approval.isDisabled"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="approval.recCurveFormVisible">取 消</el-button>
        <el-button type="primary" @click="taskSubmit">审核通过</el-button>
        <el-button type="primary" @click="save">审核拒绝</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
// import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import { queryTaskList, taskSubmit } from '@/api/common/task.js'
var approvalDialog = () => import('@/views/valuation/rec-cure/rec-curve-form.vue')
// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145]
//   },
//   messages: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130]
//   },
//   purchases: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130]
//   },
//   shoppings: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130]
//   }
// }

export default {
  name: 'DashboardAdmin',
  components: {
    approvalDialog
    // GithubCorner,
    // PanelGroup,
    // LineChart,
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      // lineChartData: lineChartData.newVisitis,
      approval: {
        recCurveFormVisible: false,
        businessNo: '',
        isDisabled: true
      },

      todoInfo: {
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      }

    }
  },
  beforeMount() {
    this.queryTaskList()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.todoInfo.page.pageSize = pageSize
      this.queryTaskList()
    },
    handleCurrentChange(currentPage) {
      this.todoInfo.page.pageNumber = currentPage
      this.queryTaskList()
    },
    queryTaskList() {
      queryTaskList({ page: this.todoInfo.page }).then(response => {
        const { datalist, page } = response
        this.todoInfo.dataList = datalist
        this.todoInfo.page = page
      })
    },
    toApproval(businessNo) {
      this.approval.recCurveFormVisible = true
      this.approval.businessNo = businessNo
    },
    taskSubmit() {
      taskSubmit({
        businessNo: this.approval.businessNo,
        taskStatus: '02',
        taskOpinions: '同意，可以通过',
        taskType: '01'
      }).then(response => {
        this.$message({
          message: '提交成功！',
          type: 'success',
          showClose: true
        })
        this.approval.recCurveFormVisible = false
        this.queryTaskList()
      })
    }
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type]
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
