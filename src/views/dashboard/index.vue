<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole" />-->
    <el-row :gutter="10">
      <el-col :span="sidebar.opened? 13 : 12">
        <el-card style="margin-top:15px">
          <div class="title">
            <span style="padding-right:20px;color:#09f;font-size:24px"><svg-icon icon-class="computer" /></span>
            收益率曲线任务 <span class="line">/</span> 债券估值任务
            <span style="padding-left:30px">4 / 10</span>
          </div>
        </el-card>
        <el-card class="box-card margin-top calendar-job">
          <div slot="header" class="clearfix card-head">
            <h3>工作日历</h3>
          </div>
          <el-row :gutter="10">
            <div style="width: 520px;display: inline-block;vertical-align:top;">
              <div class="grid-content bg-purple" style="">
                <v-calendar :attributes="calendar.attributes" class="custom-calendar" @update:fromPage="onPageUpdate">
                  <div slot="day-content" slot-scope="{ day }" class="flex flex-col h-full z-10 overflow-hidden" style="">
                    <span class="day-label text-sm text-gray-900" style="width: 100%;display: block">{{ day.day }}</span>
                    <div class="flex-grow overflow-y-scroll">
                      <el-tag v-for=" (m, index) in calendar.workday[day.day]" :key="day.day + index" hit size="small" :type="getTagType(index)">{{ getSubName(m) }}</el-tag>
                    </div>
                  </div>
                </v-calendar>
              </div>
            </div>
            <div style="display: inline-block; vertical-align:top; margin-left: 10px;">
              <el-button type="primary" icon="el-icon-setting" @click="openMyCalendarSetting" />
              <ul style="margin-top:50px">
                <li v-for=" (m, index) in calendar.my" :key="index" style="margin-top:15px">
                  <el-tag hit :type="getTagType(index)" size="mini">{{ getSubName(m) }}</el-tag>
                  <span class="remark">{{ getCalendarName(m) }}</span>
                </li>
              </ul>
            </div>
          </el-row>
        </el-card>
        <el-card class="box-card margin-top">
          <div slot="header" class="head-title">
            <h3>待办任务列表</h3>
            <div class="lookMore" @click="lookMore">更多</div>
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
                    @click.native.prevent="toApproval(scope.row.businessNo,scope.row.taskName, scope.row.businessRouter)"
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
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="sidebar.opened? 11 : 12">
        <el-card class="box-card margin-top calendar-job">
          <div slot="header" class="clearfix card-head">
            <h3>我的消息</h3>
          </div>
          <el-table
            ref="msgTable"
            :data="msg.msgList"
            style="width: 100%"
            @expand-change="readMsg"
          >
            <el-table-column type="expand" class="expend">
              <template slot-scope="{ $index }">
                <el-form label-position="left" class="table-expand">
                  <el-form-item label="标题">
                    <span>{{ msg.msgList[$index].msgTitle }}</span>
                  </el-form-item>
                  <el-form-item label="消息内容">
                    <span>{{ msg.msgList[$index].msgContent }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="msgTitle"
              label="标题"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="msgTypeSub"
              label="类型"
              width="70"
            >
              <template slot-scope="{ row }">
                <el-tag size="mini" type="">{{ $dft("MSG_TYPE", row.msgTypeSub) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="msgContent"
              label="内容"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="msgFrom"
              label="发布人"
            />
            <el-table-column
              prop="status"
              label="状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <el-tag v-if="row.status === '1'" size="mini" type="danger">{{ $dft("MSG_STATUS", row.status) }}</el-tag>
                <el-tag v-if="row.status === '2'" size="mini" type="success">{{ $dft("MSG_STATUS", row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="sendTime"
              label="发布时间"
              :show-overflow-tooltip="true"
            />
          </el-table>
          <el-pagination
            align="center"
            style="margin-top:15px"
            :current-page="msg.page.pageNumber"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="msg.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="msg.page.totalRecord"
            @size-change="handleSizeChangeMsg"
            @current-change="handleCurrentChangeMsg"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10">
      <el-col :span="14">
        <el-card class="box-card margin-top">
          <div slot="header" class="head-title">
            <h3>待办任务列表</h3>
            <div class="lookMore" @click="lookMore">更多</div>
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
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row> -->
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
// import VCalendar from 'v-calendar'
import { mapGetters } from 'vuex'
import { queryCalendarList, saveMyCalendar, readMsg } from '@/api/common/home-page.js'
// import adminDashboard from './admin'
// import editorDashboard from './editor'
export default {
  name: 'Dashboard',
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
      },
      message: {
        visible: false,
        detail: {}
      }
      // currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'sidebar'
    ]),
    todoInfo: {
      get() {
        return this.$store.state.homePage.todoInfo
      }
    },
    msg: {
      get() {
        return this.$store.state.homePage.message
      }
    }
  },
  beforeMount() {
    this.queryTaskList()
    this.$store.dispatch('homePage/queryMsgList', {})
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
    lookMore() {
      // this.$router.push('commons/audit-index')
      this.$router.push({ name: 'auditAll' })
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
    },
    toApproval(businessNo, taskName, router) {
      this.$store.commit('task/setBusinessNo', businessNo)
      this.$store.commit('task/setTaskStatus', '01')
      this.$store.commit('task/setTaskName', taskName)
      this.$router.push({ name: router })
    },
    getCalendarName(code) {
      const index = this.$lodash.findIndex(this.calendar.sys, { code: code })
      if (index >= 0) {
        return this.calendar.sys[index].name
      }
      return code
    },
    readMsg(row, expandedRows) {
      if (expandedRows.length > 1) {
        this.$refs.msgTable.toggleRowExpansion(expandedRows[0], false)
      }
      if (row.status === '1') {
        readMsg({ id: row.id }).then(response => {
          this.$store.commit('homePage/updateMsgStatus', response)
          this.$refs.msgTable.toggleRowExpansion(response, true)
        })
      }
    },
    getSubName(code) {
      const name = this.getCalendarName(code)
      return name.substring(0, 1)
    },
    getTagType(index) {
      const type = ['', 'success', 'warning', 'danger']
      return type[index % 4]
    },
    handleSizeChangeMsg(pageSize) {
      this.msg.page.pageSize = pageSize
      this.$store.dispatch('homePage/queryMsgList', { pageSize: pageSize })
    },
    handleCurrentChangeMsg(currentPage) {
      this.msg.page.pageNumber = currentPage
      this.$store.dispatch('homePage/queryMsgList', { pageNumber: currentPage })
    }
  }
}
</script>

<style lang="scss">
.custom-calendar {
  &.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 70px;
    --day-height: 76px;
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
      width: 74px;
      ::-webkit-scrollbar {display:none}
      .el-tag--small {
        line-height: 16px;
        padding: 0 2px 0 2px;
        height: 20px;
      }
      .el-tag {
        /*line-height: 26px;*/
        margin: {left: 1.5px; right: 1.5px};
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
.title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #fff;
  font-size: 20px;
  .line {
    font-weight: 500;
    font-size: 22px;
  }
}
//  .icon-box {
//     padding-right: 20px;
//     color: #00f;
//   }
.overflow-y-scroll {
  overflow-y: scroll;
}
.overflow-x-auto {
  overflow-x: auto;
}
.head-title {
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  .lookMore {
     &:hover {
       cursor: pointer;
     }
  }
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
  // padding: 0 2px;
  font: {
    size: 12px;
  };
  color: #909399;
}
.scroll-box {
  overflow-x: scroll;
   // &::-webkit-scrollbar {
  //   width: 2px;
  //   background: #ccc;
  // }
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
