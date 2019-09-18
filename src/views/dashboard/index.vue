<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole" />-->
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card margin-top calendar-job">
          <div slot="header" class="clearfix card-head">
            <h3>工作日历</h3>
          </div>
          <el-row>
            <el-col :span="20">
              <div class="grid-content bg-purple">
                <v-calendar :attributes="calendar.attributes" class="custom-calendar" @update:fromPage="onPageUpdate">
                  <div slot="day-content" slot-scope="{ day }" class="flex flex-col h-full z-10 overflow-hidden" style="">
                    <span class="day-label text-sm text-gray-900" style="width: 100%;display: block">{{ day.day }}</span>
                    <div class="flex-grow overflow-y-scroll">
                      <el-tag v-for=" (m, index) in calendar.workday[day.day]" :key="day.day + index" hit size="small" :type="getTagType(index)">{{ getSubName(m) }}</el-tag>
                    </div>
                  </div>
                </v-calendar>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-setting" @click="openMyCalendarSetting" />
              <ul>
                <li v-for=" (m, index) in calendar.my" :key="index">
                  <el-tag hit :type="getTagType(index)" size="small">{{ getSubName(m) }}</el-tag>
                  <span class="remark">{{ getCalendarName(m) }}</span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card margin-top">
          <div slot="header" class="clearfix card-head">
            <h3>待办任务列表</h3>
          </div>
          <div class="grid-content bg-purple">
            <el-table
              :data="todoInfo.dataList"
              style="width: 100%"
            >
              <el-table-column
                prop="businessName"
                label="业务名称"
                width="170"
              />
              <el-table-column
                prop="taskName"
                label="任务名称"
                width="170"
              />
              <el-table-column
                prop="taskStartUserName"
                label="发起人"
              />
              <el-table-column
                prop="createdTs"
                label="发起时间"
                width="160"
              />
              <el-table-column
                prop="address"
                label="操作"
                width="60"
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
              :total="todoInfo.page.totalRecord"
              @size-change="handleSizeChange"
              @current-change="handleCutags-viewrrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-if="calendar.visible" title="日历设置" :visible.sync="calendar.visible">
      <el-row :gutter="20">
        <el-col :span="18" :offset="6">
          <div class="grid-content bg-purple">
            <el-transfer
              v-model="calendar.result"
              :data="calendar.sys"
              :titles="['系统日历', '我的日历']"
              :props="{
                key: 'code',
                label: 'name'
              }"
            />
          </div>
        </el-col>
      </el-row>
      <div class="margin-top text-center">
        <el-button type="primary" @click="saveMyCalendar">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCalendarList, saveMyCalendar } from '@/api/common/home-page.js'
// import adminDashboard from './admin'
// import editorDashboard from './editor'
export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      calendar: {
        workday: {},
        visible: false,
        dateNow: '',
        sys: [],
        result: [],
        my: [],
        attributes: [
          {
            key: 'today',
            dates: new Date()
          }
        ]
      }
      // currentRole: 'adminDashboard'
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
  },
  methods: {
    queryCalendarList() {
      const that = this
      queryCalendarList(this.dateNow).then(response => {
        const { doneList, undoList, dayInfo } = response
        that.calendar.sys = undoList
        that.calendar.my = doneList
        that.calendar.result = doneList
        that.calendar.workday = dayInfo
      })
    },
    onPageUpdate(page) {
      const m = this.$moment().set('year', page.year).set('month', page.month - 1).format('YYYYMM')
      this.dateNow = m
      this.queryCalendarList()
    },
    openMyCalendarSetting() {
      this.calendar.visible = true
      this.calendar.result = this.calendar.my
    },
    saveMyCalendar() {
      const that = this
      saveMyCalendar({
        yearMonth: this.dateNow,
        calTypes: this.calendar.result
      }).then(response => {
        that.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.calendar.visible = false
        that.queryCalendarList()
      })
    },
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
    },
    getCalendarName(code) {
      const index = this.$lodash.findIndex(this.calendar.sys, { code: code })
      if (index >= 0) {
        return this.calendar.sys[index].name
      }
      return code
    },
    getSubName(code) {
      const name = this.getCalendarName(code)
      return name.substring(0, 1)
    },
    getTagType(index) {
      const type = ['', 'success', 'warning', 'danger']
      return type[index % 4]
    }
  }
}
</script>

<style lang="scss">
::-webkit-scrollbar {display:none}
.custom-calendar {
  &.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 90px;
    --day-height: 90px;
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;
    border-radius: 0;
    .vc-header {
      background-color: #f1f5f8;
      padding: 10px 0;
    }
    .vc-weeks{
      padding: 0;
    }
    .vc-weekday {
      background-color: var(--weekday-bg);
      border-bottom: var(--weekday-border);
      border-top: var(--weekday-border);
      padding: 5px 0;
    }
    .vc-day {
      padding: 0 5px 3px 5px;
      text-align: left;
      height: var(--day-height);
      min-width: var(--day-width);
      background-color: #fff;
      width: 92px;
      .el-tag--small {
        line-height: 22px;
        padding: 0 5px;
      }
      .el-tag {
        /*line-height: 26px;*/
        margin: {right: 3px};
        border: {
          width: 1px;
        };
      }
      &:not(.on-right) {
        border-right: var(--day-border);
      }
      &:not(.on-bottom) {
        border-bottom: var(--day-border);
      }
      &.weekday-7, &.weekday-1 {
        background-color: #eff8ff;
      }
      &.is-today {
        background-color: #eff8ff;
      }
    }
  }
}
.overflow-y-scroll {
  overflow-y: scroll;
}
.overflow-x-auto {
  overflow-x: auto;
}
.flex-grow {
  flex-grow: 1;
}
.z-10 {
  z-index: 10;
}
.overflow-hidden {
  overflow: hidden;
}
.h-full {
  height: 100%;
}
.flex-col {
  flex-direction: column;
}
.flex {
  display: flex;
}
.remark {
  padding: 0 5px;
  font: {
    size: 13px;
  };
  color: #909399;
}
.calendar-job {
  ul {
    margin: {
      left: 0;
    };
    padding: {
      left: 0;
    };
    li {
      padding: 2px 0;
      list-style: none;
    }
  }
}

</style>
