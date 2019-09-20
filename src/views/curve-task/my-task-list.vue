<template>
  <div class="margin-top">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的曲线任务</span>
      </div>
      <el-form ref="task" :model="task" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="曲线名称" prop="search_curveName_LIKE">
              <el-autocomplete
                v-model="task.search_curveName_LIKE"
                class="inline-input"
                :value-key="'label'"
                :fetch-suggestions="querySearch"
                placeholder="请输入曲线名称"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-button-group>
              <el-button type="primary" icon="el-icon-refresh" @click="getList" />
              <el-button type="primary" @click="refund(null, true)">批量退回</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table v-loading="listLoading" :data="list" size="mini" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="39" />
        <el-table-column label="曲线名称" width="200">
          <template slot-scope="{ row }">
            <span>{{ row.curveName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="曲线产品状态">
          <template slot-scope="{ row }">
            <span>{{ row.curveStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次">
          <template slot-scope="{ row }">
            <span>{{ row.curveOrderName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="曲线编制状态">
          <template slot-scope="{ row }">
            <DictColumn :dict-name="'curveBuild'" :column-data="row.curveBuildStatus" />
          </template>
        </el-table-column>
        <el-table-column label="责任人">
          <template slot-scope="{ row }">
            <span>{{ row.assignName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编制方法" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.curveBuildType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="60">
          <template slot-scope="{ row }">
            <!--            <DictColumn :name="PRIORITY" :data="row.priority" />-->
            <span>{{ row.priority }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button v-if="0 + row.curveBuildStatus > 1 && 0 + row.curveBuildStatus < 4" type="primary" size="mini" @click="refund(row)">
              退回
            </el-button>
            <el-button type="primary" size="mini" @click="openBuild(row)">
              编制
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { selectCurve, selectCurveTask, refundCurveTask } from '@/api/curve/curve'
import Pagination from '@/components/Pagination'
import openWindow from '@/utils/open-window'
import DictColumn from './components/DictColumn'
export default {
  name: 'MyTaskList',
  components: { Pagination, DictColumn },
  data() {
    return {
      task: {
        search_curveName_LIKE: '',
        search_curveId_EQ: ''
      },
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 20
      },
      selection: [],
      isMultiple: false,
      multipleSelection: [],
      dialogFormVisible: false,
      curveList: [],
      personList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getCurveList()
  },
  methods: {
    getList() {
      this.listLoading = true
      selectCurveTask({ data: this.task, page: this.listQuery }).then(response => {
        this.list = response.dataList
        this.total = response.page.totalRecord
        this.listLoading = false
      })
    },
    getCurveList() {
      selectCurve({ page: { pageNumber: 1, pageSize: 10 }}).then(response => {
        this.curveList = response.dataList.map(i => {
          return { value: i.curveId, label: i.productName }
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    querySearch(queryString, cb) {
      const data = queryString ? { search_curveName_LIKE: queryString } : {}
      selectCurve({ data: data, page: { pageNumber: 1, pageSize: 10 }}).then(response => {
        const results = response.dataList.map(i => {
          return { value: i.curveId, label: i.productName }
        })
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },
    handleSelect(item) {
      this.task.search_curveId_EQ = item.value
    },
    refund(item, val) {
      this.isMultiple = val || false
      const ids = []
      if (this.isMultiple) {
        if (this.multipleSelection.length < 1) {
          this.$message({
            message: '你没有选中任何记录，请先选择',
            center: true,
            type: 'warning'
          })
          return
        }
        this.multipleSelection.map(i => {
          ids.push(i.id)
        })
      } else {
        ids.push(item.id)
      }
      refundCurveTask({ ids, assign: null, assignName: null }).then(() => {
        this.getList()
      })
    },
    openBuild(item) {
      openWindow('http://localhost:9527/#/curve-market', '曲线行情', 540, 540)
      openWindow('http://localhost:9527/#/build-curve', '编制曲线方案', 540, 540)
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 0;
}
</style>