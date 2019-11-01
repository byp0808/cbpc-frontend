<template>
  <div class="margin-top">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>曲线任务分配规则</span>
      </div>
      <el-form ref="task" :model="task" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="曲线名称" prop="search_productName_LIKE">
              <el-input
                v-model="task.search_productName_LIKE"
                class="inline-input"
                placeholder="请输入曲线名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次" prop="search_orderName_LIKE">
              <el-autocomplete
                v-model="task.search_orderName_LIKE"
                class="inline-input"
                :value-key="'label'"
                :fetch-suggestions="querySearch"
                placeholder="请输入批次名称"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人" prop="search_assignName_LIKE">
              <el-autocomplete
                v-model="task.search_assignName_LIKE"
                class="inline-input"
                :value-key="'label'"
                :fetch-suggestions="queryPersonSearch"
                placeholder="请输入责任人"
                :trigger-on-focus="false"
                @select="handlePersonSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="10">
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
            <el-button type="primary" style="margin-right: 9px" @click="download">下载分配规则</el-button>
            <el-upload
              style="display: inline-block;"
              action=""
              :multiple="false"
              name="attach"
              :http-request="upload"
              :show-file-list="false"
              :accept="'excel'"
            >
              <el-button type="primary" style="margin-right: 9px">导入分配规则</el-button>
            </el-upload>
            <el-button type="primary" @click="openDialog(null, true)">批量保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table v-loading="listLoading" :data="list" size="mini" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="39" />
        <el-table-column label="曲线名称" width="200">
          <template slot-scope="{ row }">
            <span>{{ row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="曲线产品状态">
          <template slot-scope="{ row }">
            <span>{{ $dft('CURVE_PRODUCT_STATUS', row.prdStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次">
          <template slot-scope="{ row }">
            <span>{{ row.orderName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次状态">
          <template slot-scope="{ row }">
            <span>{{ makeValid(row.validFlag) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批状态">
          <template slot-scope="{ row }">
            <span>{{ $dft('APPROVE_STATUS', row.approveStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="责任人">
          <template slot-scope="{ row }">
            <span>{{ row.assignName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="openDialog(row)">
              修改
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
            @select="handlePersonSelect2"
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
import { queryCurveTempTaskRules, queryOrder, selectPerson, updateTaskRules } from '@/api/curve/curve-task'
import { basic_api_curve } from '@/api/base-api'
import { downloadFile, upload } from '@/utils/file-request'

export default {
  name: 'Rule',
  props: ['relld', 'opType'],
  data() {
    return {
      task: {
        search_productName_LIKE: '',
        search_orderName_LIKE: '',
        search_curveOrderId_EQ: '',
        search_assignName_LIKE: '',
        search_assign_EQ: ''
      },
      flag: false,
      order: {
        options: []
      },
      uploadUrl: `${basic_api_curve}/curve/importCurveTasks`,
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
    // this.getCurveList()
  },
  methods: {
    getList() {
      console.log('===11111111111111===relld:' + this.relld)
      this.listLoading = true
      queryCurveTempTaskRules({ relld: this.relld }).then(response => {
        this.list = response.dataList
        this.listLoading = false
      })
    },
    makeValid(value) {
      const dict = { Y: '启用', N: '禁用' }
      return dict[value]
    },
    handleSelect() {

    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    querySearch(queryString, cb) {
      const data = queryString ? { search_orderName_LIKE: queryString } : {}
      queryOrder(Object.assign(data, { page: { pageNumber: 1, pageSize: 10 }})).then(response => {
        const results = response.dataList.map(i => {
          return { value: i.orderId, label: i.orderName }
        })
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },

    queryPersonSearch(queryString, cb) {
      const data = queryString ? { userName: queryString, orgFlag: 'Y' } : {}
      selectPerson(data).then(response => {
        this.results = response.map(i => {
          return { value: i.userId, label: i.userName }
        })
        console.log(this.results)
        // 调用 callback 返回建议列表的数据
        cb(this.results)
      })
    },
    handlePersonSelect(item) {
      this.task.search_assign_EQ = item.value
    },
    handlePersonSelect2(item) {
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
      this.flag = false
      const data = []
      this.results.map(v => {
        if (this.person.username !== v.label) {
          this.$message.warning('没有查到对应的责任人信息')
          this.flag = true
          return
        }
      })
      if (!this.flag) {
        if (this.isMultiple) {
          this.multipleSelection.map(i => {
            data.push(Object.assign(i, { assign: this.person.userId, assignName: this.person.username }))
          })
        } else {
          const i = Object.assign({}, this.selection, { assign: this.person.userId, assignName: this.person.username })
          data.push(i)
        }
        updateTaskRules(data).then(() => {
          this.$message.success('保存成功')
          this.dialogFormVisible = false
          this.getList()
        })
      }
    },
    download() {
      downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_curve}` + '/curve/exportCurveTasks', this.task)
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

</style>
