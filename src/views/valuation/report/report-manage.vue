<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-upload
        ref="uploadZone"
        class="upload-demo"
        style="display: inline-block;"
        action=""
        accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf"
        :multiple="false"
        :show-file-list="false"
        :limit="1"
        :http-request="toUpload"
      >
        <el-button type="primary">导入</el-button>
      </el-upload>
      <el-button type="primary" @click="batchDownload">批量下载</el-button>

    </div>
    <el-table
      ref="refReportList"
      style="width: 100%"
      :data="reportList"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="createdTs"
        label="上传日期"
        show-overflow-tooltip
      />
      <el-table-column
        prop="reportName"
        label="报告名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="approveStatus"
        label="状态"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('APPROVE_STATUS', row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            查看
          </el-button>
          <el-button
            v-if="isShowChangeStatusBtn(scope.row.busiStatus)"
            type="text"
            size="small"
            @click.native.prevent="changeStatus(scope.row.busiStatus, scope.row.id)"
          >
            {{ statusText(scope.row.busiStatus) }}
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDownload(scope.row.id)"
          >
            下载
          </el-button>
          <el-button
            v-if="scope.row.approveStatus==='02' || scope.row.approveStatus==='03'"
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="ReportFormVisible" width="60%" title="预览报告" :visible.sync="ReportFormVisible">
      <ReportForm
        ref="refRecCurveForm"
        :business-id="businessNo"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ReportFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ReportForm from '@/views/valuation/report/report-form.vue'
import { queryReportList, deleteReport, switchStatus, uploadReport } from '@/api/valuation/report.js'
import { basic_api_valuation } from '@/api/base-api'
import { downloadFile } from '@/utils/request-client'
export default {
  name: 'ReportList',
  components: {
    ReportForm
  },
  data() {
    return {
      ReportFormVisible: false,
      businessNo: '',
      file: {
        attach: ''
      },
      reportList: [],
      multipleSelection: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    statusText() {
      return function(status) {
        switch (status) {
          case '02':
            return '启用中'
          case '03':
            return '停用中'
        }
      }
    }
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      queryReportList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.reportList = dataList
        this.page = page
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toDetail(id) {
      this.businessNo = id
      this.ReportFormVisible = true
    },
    toDelete(id) {
      this.$confirm('确认删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteReport(id).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            showClose: true
          })
          this.loadTable()
        })
      }).catch(() => {
      })
    },
    toUpload(item) {
      this.file.attach = item.file
      const fd = new FormData()
      fd.append('attach', this.file.attach)
      uploadReport(fd).then(res => {
        this.$refs.uploadZone.clearFiles()
        this.$message.success('文件上传成功')
        this.loadTable()
      }).catch(() => {
        this.$message.error('上传失败，请联系管理员')
      })
    },
    toDownload(id) {
      downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/report/download', [id])
    },
    batchDownload() {
      const res = []
      this.multipleSelection.forEach(obj => {
        res.push(obj.id)
      })
      if (res.length === 0) {
        this.$message({
          message: '请选择至少一条数据进行操作！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/report/download', res)
      this.loadTable()
    },
    changeStatus(status, id) {
      if (status === '02') {
        switchStatus({ id: id, busiStatus: '03' }).then(response => {
          this.loadTable()
        })
      } else if (status === '03') {
        switchStatus({ id: id, busiStatus: '02' }).then(response => {
          this.loadTable()
        })
      }
    },
    isShowChangeStatusBtn(status) {
      return status === '02' || status === '03'
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.loadTable()
    }
  }

}
</script>

<style scoped>

</style>
