<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole" />-->
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
                  @click.native.prevent="toApproval(scope.row.businessNo, scope.row.businessRouter)"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      // currentRole: 'adminDashboard'
      // approval: {
      //   recCurveFormVisible: false,
      //   businessNo: '',
      //   isDisabled: true
      // }
      // todoInfo: {
      //   dataList: [],
      //   page: {
      //     pageNumber: 1,
      //     pageSize: 10
      //   }
      // }
    }
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
      this.$store.dispatch('homePage/queryTaskList')
      // queryTaskList().then(response => {
      //   const { datalist, page } = response
      //   this.todoInfo.dataList = datalist
      //   this.todoInfo.page = page
      // })
    },
    toApproval(businessNo, router) {
      this.$store.commit('task/setBusinessNo', businessNo)
      this.$router.push({ name: router })
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    todoInfo: {
      get() {
        return this.$store.state.homePage.todoInfo
      }
    }
  },
  beforeMount() {
    this.queryTaskList()
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
