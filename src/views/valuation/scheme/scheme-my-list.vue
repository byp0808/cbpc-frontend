<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-row>
        <el-col :span="11" class="scroll-box">
          <el-button type="primary">方案调整</el-button>
          <el-button type="primary">批量调整</el-button>
          <el-button type="primary" @click="backTask">任务退回</el-button>
          <el-button type="primary">方案确认</el-button>
          <el-button icon="el-icon-refresh" @click="refrech" />
        </el-col>
        <el-col :span="11" :offset="2" class="scroll-box">
          <el-input v-model="bondId" placeholder="输入资产根码后添加任务" style="width:200px" />
          <el-button type="primary" @click="addTask">添加任务</el-button>
          <el-button type="primary" @click="batchAddTask">批量添加</el-button>
          <el-button type="primary" @click="uploadScheme">批量上传人工估值</el-button>
          <!-- <el-button type="primary" @click="downloadScheme">盯市券点差调整</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="assset">资产列表</div>
    <!-- <el-menu :default-active="activeElement" class="el-menu-demo" mode="horizontal" @select="handleSelect" active-text-color="#5E8BD8" text-color="#333">
        <el-menu-item index="normal">正常</el-menu-item>
        <el-menu-item index="obey">违约</el-menu-item>
        <el-menu-item index="especical">特殊</el-menu-item>
        <el-menu-item index="upload">人工上传</el-menu-item>
      </el-menu> -->
    <el-tabs v-model="activeElement" @tab-click="handleSelect">
      <el-tab-pane v-for="item in tabList" :key="item.scene" :label="tabName(item.scene)" :name="item.scene" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeElement === '01' || activeElement === '02' || activeElement === '03'" v-loading="tableLoading">
        <asset-list :all-list="myList" @selectionList="selectionList" />
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
      <div v-if="activeElement === '04'" v-loading="tableLoading">
        <people-upload :all-list="uploadList" @selectionList="selectionList" />
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
    </transition>
    <el-dialog :visible.sync="volumeAddDialog" :title="taskTitle">
      <div>
        <el-form ref="ruleForm" style="margin-left:50px" :model="volumeAdd" :rules="rules">
          <el-form-item label="选择批次" :label-width="isBatch ? '': '95px'" prop="batchId">
            <el-select v-model="volumeAdd.batchId" filterable clearable placeholder="请选择批次" @visible-change="batchChange">
              <el-option v-for="(item, index) in batchList" :key="index" :label="item.name" :value="item.batchId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isBatch" label="选择文件" prop="dataFile">
            <el-upload
              class="upload-demo"
              action=""
              :limit="1"
              drag
              :on-exceed="handleExceed"
              :http-request="memSuccess"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div class="downLoad" @click="downLoadMode">
              <a ref="moduleDownload" style="display: none" href="/model/module.xlsx" download="模板文件" />
              模板文件下载</div>
          </el-form-item>
          <el-form-item label="选择调整原因" prop="cause">
            <el-select v-model="volumeAdd.cause" filterable clearable placeholder="请选择批次" @visible-change="batchChange">
              <el-option v-for="(name, key) in $dict('ADJUST_CAUSE')" :key="key" :label="name" :value="key" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="volumeAddDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveBatch">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadMethodDialog" title="人工估值上传">
      <div>
        <el-form style="margin-left:50px">
          <el-form-item label="选择批次">
            <el-select v-model="upLoadValution.batch" filterable clearable placeholder="请选择批次" @visible-change="batchChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              class="upload-demo"
              action=""
              :limit="1"
              drag
              :on-exceed="handleExceed1"
              :http-request="memSuccess1"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div class="downLoad" @click="downLoadMode">
              <a ref="moduleDownload" style="display: none" href="/model/module.xlsx" download="模板文件" />
              模板文件下载</div>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="uploadMethodDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveValuation">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="remaindDialog">
      <div class="content">{{ message }}</div>
      <el-row>
        <el-col :span="8" :offset="17">
          <div v-if="code === 'YBL100001001' || code === 'YBL100001002' " class="dialog-footer">
            <el-button @click="cancle">否</el-button>
            <el-button type="primary" @click="saveFirst">是</el-button>
          </div>
        </el-col>
        <el-col :span="14" :offset="10" style="margin-top:10px">
          <div v-if="code === 'YBL100001003' " class="dialog-footer">
            <el-button @click="cancle">不迁移</el-button>
            <el-button type="primary" @click="saveFirst">迁移并保留</el-button>
            <el-button type="primary" @click="saveSecond">迁移不保留</el-button>
          </div>
        </el-col>
        <el-col :span="8" :offset="17">
          <div v-if="code === 'YBL100001004' " class="dialog-footer">
            <el-button @click="cancle">取消</el-button>
            <el-button type="primary" @click="saveFirst">忽略并导入</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import AssetList from '@/views/valuation/scheme/asset-list.vue'
import PeopleUpload from '@/views/valuation/scheme/people-upload.vue'
import { getAllTableList, returnTask, addOneTask, addBatchTask } from '@/api/valuation/task.js'
// import { uploadFile } from '@/utils/request-client'
// import { basic_api_valuation } from '@/api/base-api'
export default {
  name: 'SchemeMyList',
  components: {
    // BatchTaskForm,
    AssetList,
    PeopleUpload
  },
  data() {
    return {
      activeElement: '01',
      volumeAddDialog: false,
      uploadMethodDialog: false,
      tableLoading: false,
      isBatch: false,
      remaindDialog: false,
      message: '',
      code: '',
      myList: [],
      taskTitle: '',
      uploadList: [],
      selection: [],
      extends: '',
      volumeAdd: {
        cause: '08',
        batchId: '2222'
      },
      rules: {
        batchId: [{ required: true, message: '请选择批次', trigger: 'change' }],
        cause: [{ required: true, message: '请选择调整原因', trigger: 'change' }],
        dataFile: [{ required: true, message: '请选择上传文件', trigger: 'blur' }]
      },
      batchList: [
        {
          batchId: '2222',
          name: '批次2'
        }
      ],
      excelFile: '',
      tabList: [
        // {
        //   label: '正常',
        //   scene: '01'
        // }, {
        //   label: '违约',
        //   scene: '02'
        // }, {
        //   label: '特殊',
        //   scene: '03'
        // }, {
        //   label: '人工上传',
        //   scene: '04'
        // }
      ],
      upLoadValution: {
        batch: '',
        excelFile1: ''
      },
      nameList: [
        {
          name: '美术课件',
          value: '1'
        }
      ],
      bondId: '',
      valuationAllTask: [],
      valuationMyTask: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        },
        tab: '02',
        scene: '01'
      }
    }
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.tableLoading = true
      getAllTableList(this.params).then(res => {
        this.tableLoading = false
        this.myList = res[0].datalist
        this.uploadList = res[0].manualList
        this.params.page = res[0].page
        console.log('res', res[0].datalist)
      }).catch(error => {
        console.log(error)
        this.tableLoading = false
      })
      getAllTableList({ tab: '02' }).then(res => {
        this.tabList = res
      })
    },
    selectionList(data) {
      this.selection = data
      console.log('00', data)
    },
    tabName(param) {
      switch (param) {
        case '01': return '正常'
        case '02': return '违约'
        case '03': return '特殊'
        case '04': return '人工上传'
      }
    },
    refrech() {
      this.loadTable()
    },
    handleSelect(e) {
      console.log('tab', e.name)
      this.params.scene = e.name
      this.loadTable()
    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.loadTable()
    },
    backTask() {
      if (this.selection.length === 0) {
        return this.$message({
          message: '请选择任务',
          type: 'warning'
        })
      }
      returnTask(this.selection).then(res => {
        this.$message({
          message: '任务退回成功',
          type: 'success'
        })
        this.loadTable()
      })
    },
    addTask() {
      this.isBatch = false
      this.volumeAddDialog = true
      this.taskTitle = '添加任务'
      this.resetTaskDialog()
    },
    nameChange() {

    },
    downLoadMode() {
      this.$refs.moduleDownload.click()
    },
    batchChange() {

    },
    saveValuation() {

    },
    resetTaskDialog() {
      this.volumeAdd.batchId = ''
      this.volumeAdd.dataFile = ''
      this.volumeAdd.cause = '08'
    },
    saveFirst() {
      this.volumeAdd.busiCode = '01'
      addOneTask(this.volumeAdd).then(res => {
        this.remaindDialog = false
        this.volumeAddDialog = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loadTable()
      })
    },
    saveSecond() {
      this.volumeAdd.busiCode = '02'
      addOneTask(this.volumeAdd).then(res => {
        this.remaindDialog = false
        this.volumeAddDialog = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loadTable()
      })
    },
    cancle() {
      this.remaindDialog = false
      this.volumeAddDialog = false
    },
    saveBatch() {
      this.$refs.ruleForm.validate(val => {
        if (val) {
          if (this.isBatch) {
            if (!this.excelFile) {
              return this.$message('别着急, 您的文件还没有上传哦')
            }
            var fd = new FormData()
            fd.append('dataFile', this.excelFile)
            fd.append('batchId', this.volumeAdd.batchId)
            fd.append('cause', this.volumeAdd.cause)
            addBatchTask(fd).then(res => {
              this.volumeAddDialog = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.loadTable()
            })
          } else {
            if (!this.bondId) {
              this.$message.error('请输入资产编码')
              return
            }
            delete this.volumeAdd.dataFile
            this.volumeAdd.csin = this.bondId
            addOneTask(this.volumeAdd).then(res => {
              if (res.code) {
                // this.volumeAddDialog = false
                this.remaindDialog = true
                this.code = res.code
                this.message = res.msg
              } else {
                this.volumeAddDialog = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.loadTable()
              }
            })
          }
        }
      })
    },
    handleExceed() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    memSuccess(item) {
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.excelFile = item.file
      console.log('file', item.file)
    },
    memSuccess1(item) {
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.upLoadValution.excelFile = item.file
    },
    handleExceed1() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    saveName() {

    },
    claimTask: function() {

    },
    batchAddTask() {
      this.isBatch = true
      this.volumeAddDialog = true
      this.taskTitle = '批量添加任务'
      this.resetTaskDialog()
    },
    uploadScheme() {
      this.uploadMethodDialog = true
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

    }
  }
}
</script>
<style lang="scss" scoped>
 .scroll-box {
     white-space: nowrap;
     overflow-x: scroll;
     height: 60px;
 }
 .assset {
     font-weight: 700;
     font-size: 16px;
 }
 .card {
     height: 100%;
 }
  .content {
   font-size: 18px;
   margin-top: -15px;
 }
 .downLoad {
   margin-left: 70px;
   color: #09f;
   margin-top: -10px;
    &:hover {
     cursor: pointer;
   }
 }
</style>
