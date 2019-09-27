<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="所有人" name="all">
        <div style="margin-bottom: 20px">
          <el-button type="primary" @click="allotTask">任务分配</el-button>
          <el-button type="primary" @click="claimTask">任务认领</el-button>
          <el-button type="primary" @click="addBondsNonp">添加不估值</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="loadTable_all" />
          <div style="float:right">
            <el-input v-model="bondId" placeholder="输入资产根码后添加任务" style="width:200px" />
            <el-button type="primary" @click="addTask">添加任务</el-button>
            <el-button type="primary" @click="batchAddTask">批量添加</el-button>
            <el-button type="primary" @click="uploadScheme">上传估值方案</el-button>
            <el-button type="primary" @click="downloadScheme">下载估值方案</el-button>
          </div>
        </div>
        <el-table
          ref="refTaskTableAll"
          :data="valuationAllTask"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange_all"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="bondsConceptType"
            label="资产概念分类"
            show-overflow-tooltip
          />
          <el-table-column
            prop="approveStatus"
            label="审核状态"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              {{ $dft('APPROVE_STATUS', row.approveStatus) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="allPage.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="allPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="allPage.totalRecord"
          @size-change="tableSizeChange_all"
          @current-change="tableCurrentChange_all"
        />
      </el-tab-pane>

      <el-tab-pane label="我的任务" name="my">
        <div style="margin-bottom: 20px">
          <el-button type="primary" @click="schemeAdjust">方案调整</el-button>
          <el-button type="primary" @click="batchAdjust">批量调整</el-button>
          <el-button type="primary" @click="taskBack">任务退回</el-button>
          <el-button type="primary" @click="taskCommit">方案确认</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="loadTable_my" />
        </div>
        <el-table
          ref="refTaskTableMy"
          :data="valuationMyTask"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange_my"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="bondsId"
            label="资产编码"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bondsShortName"
            label="资产简称"
            show-overflow-tooltip
          />
        </el-table>
        <el-pagination
          :current-page="myPage.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="myPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="myPage.totalRecord"
          @size-change="tableSizeChange_my"
          @current-change="tableCurrentChange_my"
        />
      </el-tab-pane>
    </el-tabs>
    <BatchTaskForm />
  </div>
</template>

<script>
import BatchTaskForm from '@/views/valuation/scheme/batch-task-form.vue'
export default {
  name: 'ValuationTaskList',
  components: {
    BatchTaskForm
  },
  data() {
    return {
      activeName: 'all',
      bondId: '',
      valuationAllTask: [],
      valuationMyTask: [],
      allPage: {
        pageNumber: 1,
        pageSize: 10
      },
      myPage: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  beforeMount() {
    this.loadTable_all()
  },
  methods: {
    allotTask: function() {

    },
    claimTask: function() {

    },
    addBondsNonp: function() {

    },
    addTask: function() {

    },
    batchAddTask: function() {

    },
    uploadScheme: function() {

    },
    downloadScheme: function() {

    },
    schemeAdjust: function() {

    },
    batchAdjust: function() {

    },
    taskBack: function() {

    },
    taskCommit: function() {

    },
    loadTable_all: function() {
      // todo something
    },
    loadTable_my: function() {
      // todo something
    },
    handleSelectionChange_all: function() {
      alert('all')
    },
    tableSizeChange_all: function(pageSize) {
      this.allPage.pageSize = pageSize
      this.loadTable_all()
    },
    tableCurrentChange_all: function(currentPage) {
      this.allPage.pageNumber = currentPage
      this.loadTable_all()
    },
    handleSelectionChange_my: function() {
      alert('all')
    },
    tableSizeChange_my: function(pageSize) {
      this.allPage.pageSize = pageSize
      this.loadTable_my()
    },
    tableCurrentChange_my: function(currentPage) {
      this.allPage.pageNumber = currentPage
      this.loadTable_my()
    }
  }
}
</script>
