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
      max-height="300"
      :header-cell-style="{background:'#f6f6f6'}"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="申请人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.taskStartUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件明细" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">{{ scope.row.taskName }}</el-button>
          <!-- <a style="border-bottom:1px solid #333">{{ scope.row.info }}</a> -->
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maketId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span> {{ $dft('APPROVE_STATUS', scope.row.approveStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button :type="scope.row.approveStatus === '01'? 'primary' : 'info'" size="small" :disabled="scope.row.approveStatus === '01'? false: true">通过</el-button>
          <el-button :type="scope.row.approveStatus === '01'? 'danger' : 'info'" size="small" :disabled="scope.row.approveStatus === '01'? false: true">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        style="margin-top:20px"
        align="center"
        :current-page="page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { queryTaskList } from '@/api/common/home-page.js'
export default {
  name: 'AuditForm',
  components: {

  },
  props: {
    activeName: {
      type: String,
      default: function() {
        return '01'
      }
    }
  },
  data() {
    return {
      isActive: '01',
      auditActive: '01',
      taskRangeId: '',
      selectionList: [],
      dateList: [
        { name: '不限', value: '01' },
        { name: '一周内', value: '02' },
        { name: '两周内', value: '03' },
        { name: '一个月内', value: '04' },
        { name: '三个月内', value: '05' },
        { name: '六个月内', value: '06' }
      ],
      auditStatus: [
        { name: '不限', value: '01' },
        { name: '审核通过', value: '02' },
        { name: '未审核', value: '03' },
        { name: '审核不通过', value: '04' }
      ],
      reviewStatus: [
        { name: '不限', value: '01' },
        { name: '待通过', value: '02' },
        { name: '复核不通过', value: '03' },
        { name: '复核通过', value: '04' }
      ],
      allList: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
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
      queryTaskList({ search_taskType_EQ: this.activeName, page: this.page }).then(
        response => {
          const { dataList, page } = response
	        this.allList = dataList
	        this.page = page
        }
      )
    },
    selectDate(e) {
      console.log('e', e)
      this.isActive = e.value
    },
    selectStatus(e) {
      this.auditActive = e.value
    },
    handleSelectionChange(val) {
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
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
 }

</style>
