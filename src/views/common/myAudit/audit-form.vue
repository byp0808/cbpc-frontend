<template>
  <div class="box">
    <div class="top-container">
      <el-row style="margin-bottom:15px;">
        <el-col :span="3" style="margin-top:10px">申请时间范围:</el-col>
        <el-col :span="20">
          <el-button v-for="(item,index) in dateList" :key="index" :class="isActive === item.value ? 'haveBorder': 'noBorder'" @click="selectDate(item)">{{ item.name }}</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:15px;">
        <el-col :span="3" style="margin-top:10px">审核状态:</el-col>
        <el-col :span="20">
          <!-- <el-button>不限</el-button>
          <el-button>审核通过</el-button>
          <el-button>未审核</el-button>
          <el-button>审核不通过</el-button> -->
          <div v-if="activeName === '01'">
            <el-button
              v-for="(item,index) in auditStatus"
              :key="index"
              :class="auditActive === item.value ? 'haveBorder': 'noBorder'"
              @click="selectStatus(item)"
            >{{ item.name }}</el-button>
          </div>
          <div v-else>
            <el-button
              v-for="(item,index) in reviewStatus"
              :key="index"
              :class="auditActive === item.value ? 'haveBorder': 'noBorder'"
              @click="selectStatus(item)"
            >{{ item.name }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="allList"
      style="width: 100%"
      max-height="400"
      :header-cell-style="{background:'#f6f6f6'}"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="申请人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件明细" align="center" width="160px">
        <template slot-scope="scope">
          <!-- <el-button type="text">{{ scope.row.taskName }}</el-button> -->
          <span style="color:#09f;font-size:14px;cursor: pointer;" class="detail" @click="toAudit(scope.row.businessNo, scope.row.taskStatus, scope.row.businessRouter)">{{ scope.row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span> {{ $dft('APPROVE_STATUS', scope.row.taskStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button :type="scope.row.taskStatus === '01'? 'primary' : 'info'" size="small" :disabled="scope.row.taskStatus !== '01'" @click="audit(scope.row.businessNo, '02', scope.row.businessRouter)">通过</el-button>
          <el-button :type="scope.row.taskStatus === '01'? 'danger' : 'info'" size="small" :disabled="scope.row.taskStatus !== '01'" @click="audit(scope.row.businessNo, '03', scope.row.businessRouter)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        style="margin-top:20px"
        align="center"
        :current-page="params.page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="params.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="params.page.totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { queryTasks } from '@/api/common/task.js'
export default {
  name: 'AuditForm',
  components: {

  },
  props: {
    activeName: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      isActive: '',
      auditActive: '',
      taskRangeId: '',
      selectionList: [],
      dateList: [
        { name: '不限', value: '' },
        { name: '一周内', value: 'weeks_1' },
        { name: '两周内', value: 'weeks_2' },
        { name: '一个月内', value: 'months_1' },
        { name: '三个月内', value: 'months_3' },
        { name: '六个月内', value: 'months_6' }
      ],
      auditStatus: [
        { name: '不限', value: '' },
        { name: '审核通过', value: '02' },
        { name: '未审核', value: '01' },
        { name: '审核不通过', value: '03' }
      ],
      reviewStatus: [
        { name: '不限', value: '' },
        { name: '待通过', value: '01' },
        { name: '复核不通过', value: '03' },
        { name: '复核通过', value: '02' }
      ],
      allList: [],
      // page: {
      //   pageNumber: 1,
      //   pageSize: 10,
      //   totalRecord: 0
      // },
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      }
    }
  },
  watch: {
    activeName: {
      handler(newVal, oldVal) {
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.params.search_taskType_EQ = this.activeName
      if (this.isActive) {
        const dates = this.isActive.split('_')
        if (dates.length > 1) {
          this.params.search_startTime_EQ = this.$moment(new Date()).add(dates[1], dates[0]).format('YYYY-MM-DD HH:mm:SS')
        }
      } else {
        delete this.params.search_startTime_EQ
      }
      if (this.auditActive) {
        this.params.search_taskStatus_EQ = this.auditActive
      } else {
        delete this.params.search_taskStatus_EQ
      }
      queryTasks(this.params).then(
        response => {
          const { dataList, page } = response
          this.allList = dataList
          this.params.page = page
        }
      )
    },
    toAudit(businessNo, taskStatus, router) {
      this.$store.commit('task/setBusinessNo', businessNo)
      this.$store.commit('task/setTaskStatus', taskStatus)
      this.$router.push({ name: router })
    },
    audit(businessNo, auditStatus, router) {
      this.$store.commit('task/setBusinessNo', businessNo)
      this.$store.commit('task/setAuditStatus', auditStatus)
      this.$router.push({ name: router })
    },
    selectDate(e) {
      console.log('e', e)
      this.isActive = e.value
      this.getList()
    },
    selectStatus(e) {
      this.auditActive = e.value
      this.getList()
    },
    handleSelectionChange(val) {
    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
 .box {
     margin-top: 10px;
 }
 .top-container {
// .el-button {
//     border:none;
//     &:focus {
//         border: 1px solid #ccc;
//         background: none;
//     }
// }
 .haveBorder {
     border: 1px solid #ccc;
 }
 .noBorder {
     border:none;
 }
 .detail {
   cursor: pointer;
 }
 }

</style>
