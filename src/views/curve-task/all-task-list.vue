<template>
  <div class="margin-top">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>曲线任务列表</span>
      </div>
      <el-form ref="task" :model="task" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="曲线名称" prop="search_curveName_LIKE">
              <el-input
                v-model="task.search_curveName_LIKE"
                class="inline-input"
                placeholder="请输入曲线名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
            <el-button v-elepermission="['updateAssign']" type="primary" @click="openDialog(null, true)">批量替换责任人</el-button>
            <el-upload
              style="display: inline-block; float: right"
              action=""
              :multiple="false"
              name="attach"
              :http-request="upload"
              :show-file-list="false"
              :accept="'excel'"
            >
              <el-button v-elepermission="['uploadSolutions']" type="primary">上传曲线方案</el-button>
            </el-upload>
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
            <span>{{ $dft('CURVE_PRODUCT_STATUS', row.curveStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次">
          <template slot-scope="{ row }">
            <span>{{ row.curveOrderName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="曲线编制状态">
          <template slot-scope="{ row }">
            <span>{{ $dft('CURVE_BUILD_STATUS', row.curveBuildStatusIn) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="责任人">
          <template slot-scope="{ row }">
            <span>{{ row.assignName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编制方法" width="80">
          <template slot-scope="{ row }">
            <span v-if="row.authWay == 1">手动</span>
            <span v-if="row.authWay == 2">自动</span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="60">
          <template slot-scope="{ row }">
            <span v-if="row.priority == 1">高</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button v-if="row.curveBuildStatusIn === '1'" type="primary" size="mini" @click="openDialog(row)">
              分配
            </el-button>
            <el-button v-else-if="row.curveBuildStatusIn === '2'" v-elepermission="['distributeTask']" type="primary" size="mini" @click="openDialog(row)">
              重新分配
            </el-button>
            <el-button v-if="0 + row.curveBuildStatusIn > 0 && 0 + row.curveBuildStatusIn < 3" v-elepermission="['claimTask']" type="primary" size="mini" :disabled="row.assignName?true:false" @click="claim(row)">
              认领
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </el-card>
    <el-dialog title="分配责任人" :visible.sync="dialogFormVisible">
      <el-form :model="person">
        <el-form-item label="责任人" prop="username">
          <el-autocomplete
            v-model="person.username"
            class="inline-input"
            :value-key="'label'"
            :fetch-suggestions="queryPersonSearch"
            placeholder="请输入责任人"
            :trigger-on-focus="false"
            @select="handlePersonSelect"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="distribute">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectCurve, selectCurveTask, updateCurveTask, selectPerson, chaimCurveTask } from '@/api/curve/curve-task'
import Pagination from '@/components/Pagination'
import { upload } from '@/utils/file-request'
import { basic_api_curve } from '@/api/base-api'
import elepermission from '@/directive/elepermission'

export default {
  name: 'AllTaskList',
  components: { Pagination },
  directives: { elepermission },
  data() {
    return {
      task: {
        search_curveName_LIKE: '',
        search_curveId_EQ: ''
      },
      uploadUrl: `${basic_api_curve}/curve/uploadCurveSolutions`,
      person: {
        username: '',
        userId: ''
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
      selectCurveTask(Object.assign(this.task, { page: this.listQuery })).then(response => {
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
    queryPersonSearch(queryString, cb) {
      const data = queryString ? { userName: queryString, orgFlag: 'Y' } : {}
      selectPerson(data).then(response => {
        this.results = response.map(i => {
          return { value: i.userId, label: i.userName }
        })
        // 调用 callback 返回建议列表的数据
        cb(this.results)
      })
    },
    handlePersonSelect(item) {
      this.person.userId = item.value
    },
    openDialog(item, val) {
      this.isMultiple = val || false
      if (!this.isMultiple) this.selection = item
      if (this.isMultiple && this.multipleSelection.length < 1) {
        this.$message({
          message: '你没有选中任何记录，请先选择',
          center: true,
          type: 'warning'
        })
        return
      }
      this.dialogFormVisible = true
    },
    distribute() {
      let flag = false
      const ids = []
      this.results.map(v => {
        if (this.person.username === v.label) {
          flag = true
          return
        }
      })
      if (flag === false) {
        this.$message.error('没有查到对应的责任人信息!')
      }
      if (flag) {
        if (this.isMultiple) {
          this.multipleSelection.map(i => {
            ids.push(i.id)
          })
        } else {
          ids.push(this.selection.id)
        }
        updateCurveTask({ ids, assign: this.person.userId, assignName: this.person.username }).then(() => {
          this.$message.success('保存成功')
          this.dialogFormVisible = false
          this.getList()
        })
      }
    },
    claim(item) {
      chaimCurveTask(item.id).then(() => {
        this.$message.success('认领成功')
        this.getList()
      })
    },
    upload(param) {
      const data = new FormData()
      data.append('files', param.file)
      upload({
        url: this.uploadUrl,
        data: data
      })
        .then(() => {
          this.$message({
            showClose: true,
            message: '上传成功。',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message.error('上传失败，请联系管理员')
        })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 0;
}
</style>
