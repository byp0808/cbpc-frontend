<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-row>
        <el-col :span="11">
          <el-button type="primary" @click="allotTask">任务分配</el-button>
          <el-button type="primary" @click="getTask">任务认领</el-button>
          <el-button type="primary" @click="addBondsNonp">添加不估值</el-button>
          <el-button icon="el-icon-refresh" @click="refresh" />
        </el-col>
        <el-col :span="11" :offset="2">
          <el-input v-model="bondId" placeholder="输入资产根码后添加任务" clearable style="width:200px" />
          <el-button type="primary" @click="addTask">添加任务</el-button>
          <el-button type="primary" @click="batchAddTask">批量添加</el-button>
          <div style="margin-top:7px">
            <el-button type="primary" @click="uploadScheme">上传估值方案</el-button>
            <el-button type="primary">下载估值方案</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="assset">资产列表</div>
    <el-tabs v-model="activeElement" @tab-click="handleSelect">
      <!-- <el-tab-pane label="正常" name="normal" />
      <el-tab-pane label="违约" name="obey" />
      <el-tab-pane label="特殊" name="especical" />
      <el-tab-pane label="人工上传" name="upload" /> -->
      <el-tab-pane v-for="item in tabList" :key="item.scene" :label="tabName(item.scene)" :name="item.scene" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeElement === '01' || activeElement === '02' || activeElement === '03'" v-loading="tabLoading">
        <asset-list :all-list="allList" @selectionList="selectionList" />
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
      <div v-if="activeElement === '04'" v-loading="tabLoading">
        <people-upload :all-list="uploadList" @selectionList="selectionList" />
        <el-pagination
          align="center"
          :current-page="params.page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.page.totalRecord"
          style="margin-top:20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </transition>
    <el-dialog :visible.sync="allocationDialog" title="任务分配">
      <div>
        <el-form ref="taskDom" style="margin-left:50px" :rules="taskRule" :model="nameModel">
          <el-form-item label="任务分配人" prop="userId">
            <el-select v-model="nameModel.userId" filterable clearable placeholder="请选择任务分配人" @visible-change="nameChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.userName" :value="item.userId" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="15">
            <div class="dialog-footer">
              <el-button @click="allocationDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveName">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="noValuationDialog" title="添加不估值">
      <div>
        <el-date-picker v-model="valuation.starTime" type="date" placeholder="请选择开始日期" />
        <el-date-picker v-model="valuation.endTime" type="date" placeholder="请结束开始日期" style="margin-left:20px" />
        <el-row style="margin-top:30px">
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="noValuationDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveName">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="volumeAddDialog" :title="taskTitle">
      <div>
        <el-form style="margin-left:50px" :label-position="labelPosition" :model="volumeAdd">
          <el-form-item label="选择批次" :label-width="isBatch ? '': '95px'">
            <el-select v-model="volumeAdd.batchId" filterable placeholder="请选择批次" @change="batchChange">
              <el-option v-for="(item, index) in batchList" :key="index" :label="item.name" :value="item.batchId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isBatch" label="选择文件">
            <el-upload
              ref="upload"
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
              <a ref="moduleDownload" style="display: none" href="/model/module.xlsx" download="估值添加债券模板" />
              模板文件下载</div>
          </el-form-item>
          <el-form-item label="选择调整原因">
            <el-select v-model="volumeAdd.cause" filterable placeholder="请选择原因" @change="batchChange">
              <el-option v-for="(name, key) in $dict('ADJUST_CAUSE')" :key="key" :label="name" :value="key" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="volumeAddDialog = false">取 消</el-button>
              <el-button v-loading="fileLoading" type="primary" @click="saveBatch">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadMethodDialog" title="估值方案上传">
      <div>
        <el-form style="margin-left:50px">
          <el-form-item label="选择批次">
            <el-select v-model="upLoadValution.batch" filterable clearable placeholder="请选择批次" @change="batchChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              ref="upload1"
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
              <a ref="moduleDownload" style="display: none" href="/model/voluation.xlsx" download="估值点差上传汇总文件" />
              模板文件下载</div>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="uploadMethodDialog = false">取 消</el-button>
              <el-button v-loading="methodUpload" type="primary" @click="saveValuation">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="remaindDialog">
      <div v-if="isBatch" class="content">{{ message }}{{ failMessage }}</div>
      <div v-else class="content">{{ message }}</div>
      <el-row style="margin-top:10px">
        <el-col :span="8" :offset="17">
          <div v-if="code === 'YBL100001001' || code === 'YBL100001002' " class="dialog-footer">
            <el-button @click="cancle">否</el-button>
            <el-button type="primary" @click="saveFirst('01')">是</el-button>
          </div>
        </el-col>
        <el-col :span="14" :offset="10">
          <div v-if="code === 'YBL100001003' " class="dialog-footer">
            <el-button @click="cancle">不迁移</el-button>
            <el-button type="primary" @click="saveFirst('01')">迁移并保留</el-button>
            <el-button type="primary" @click="saveFirst('02')">迁移不保留</el-button>
          </div>
        </el-col>
        <el-col :span="10" :offset="15">
          <div v-if="code === 'YBL100001004' " class="dialog-footer">
            <el-button @click="cancle">取消</el-button>
            <el-button v-if="isBatch" type="primary" @click="saveBatchFirst('01')">忽略并导入</el-button>
            <el-button v-else type="primary" @click="saveFirst('01')">忽略并导入</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import AssetList from '@/views/valuation/scheme/asset-list.vue'
import PeopleUpload from '@/views/valuation/scheme/people-upload.vue'
import { getAllTableList, getUserName, addBatchTask, addOneTask, getTask, saveTask } from '@/api/valuation/task.js'
import { basic_api_valuation } from '../../../api/base-api'
export default {
  name: 'SchemeAllList',
  components: {
    AssetList,
    PeopleUpload
  },
  data() {
    return {
      activeElement: '01',
      uploadUrl: `${process.env.VUE_APP_BASE_API}${basic_api_valuation}/bonds-nonp/batch-in`,
      labelPosition: 'right',
      allocationDialog: false,
      noValuationDialog: false,
      volumeAddDialog: false,
      uploadMethodDialog: false,
      tabLoading: false,
      fileLoading: false,
      methodUpload: false,
      isBatch: false,
      remaindDialog: false,
      message: '',
      code: '',
      failMessage: '',
      taskTitle: '',
      excelFile: '',
      peopleName: '',
      allList: [],
      selection: [],
      causeList: [],
      taskRule: {
        userId: [{ required: true, message: '请选择任务分配人', trigger: 'change' }]
      },
      nameModel: {
        userId: ''
      },
      batchList: [
        {
          batchId: '11',
          name: '批次1'
        }, {
          batchId: '22',
          name: '批次2'
        }
      ],
      uploadList: [],
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
      valuation: {
        starTime: '',
        endTime: ''
      },
      volumeAdd: {
        cause: '08',
        batchId: '2222'
      },
      upLoadValution: {
        batch: '',
        excelFile1: ''
      },
      nameList: [],
      bondId: '',
      valuationAllTask: [],
      valuationMyTask: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        },
        tab: '01',
        scene: '01'
      }
    }
  },
  created() {
    this.loadTable_all()
    getAllTableList({ tab: '01' }).then(res => {
      this.tabList = res
    })
  },
  methods: {
    loadTable_all() {
      this.tabLoading = true
      getAllTableList(this.params).then(res => {
        this.tabLoading = false
        this.allList = res[0].datalist
        this.uploadList = res[0].manualList
        this.params.page = res[0].page
        console.log('res', res[0])
      }).catch(error => {
        console.log(error)
        this.tabLoading = false
      })
    },
    selectionList(data) {
      this.selection = data
    },
    getTask() {
      console.log('data', this.selection)
      if (this.selection.length === 0) {
        return this.$message.warning('请选择任务')
      } else {
        getTask(this.selection).then(res => {
          this.$message({
            message: '任务认领成功',
            type: 'success'
          })
          this.loadTable_all()
        })
      }
    },

    tabName(param) {
      switch (param) {
        case '01': return '正常'
        case '02': return '违约'
        case '03': return '特殊'
        case '04': return '人工上传'
      }
    },
    refresh() {
      this.loadTable_all()
    },
    handleSelect(e) {
      this.params.scene = e.name
      this.loadTable_all()
    },
    nameChange() {

    },
    batchChange(e) {
      console.log('er', e)
      this.volumeAdd.batchId = e
    },
    resetTaskDialog() {
      this.volumeAdd.batchId = this.batchList[0].batchId
      this.volumeAdd.cause = '08'
      this.excelFile = null
      // this.volumeAdd = { cause: '08' }
      if (this.$refs.upload) this.$refs.upload.clearFiles()
    },
    saveBatchFirst(type) {
      this.volumeAdd.busiCode = type
      const fd = new FormData()
      fd.append('attach', this.excelFile)
      fd.append('batchId', this.volumeAdd.batchId)
      fd.append('cause', this.volumeAdd.cause)
      addBatchTask(fd).then(res => {
        this.remaindDialog = false
        this.volumeAddDialog = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loadTable_all()
      })
    },
    saveFirst(type) {
      console.log('ty', type)
      this.volumeAdd.busiCode = type
      addOneTask(this.volumeAdd).then(res => {
        this.remaindDialog = false
        this.volumeAddDialog = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loadTable_all()
      })
    },
    cancle() {
      this.remaindDialog = false
      this.volumeAddDialog = false
    },
    saveBatch() {
      if (!this.volumeAdd.batchId) {
        return this.$message.info('请选择批次')
      }
      if (!this.volumeAdd.cause) {
        return this.$message.info('请选择调整原因')
      }
      if (this.isBatch) {
        if (!this.excelFile) {
          return this.$message('别着急, 您的文件还没有上传哦')
        }
        const fd = new FormData()
        fd.append('data.attach', this.excelFile)
        fd.append('data.batchId', this.volumeAdd.batchId)
        fd.append('data.cause', this.volumeAdd.cause)
        console.log('fd', fd.getAll('attach'))
        addBatchTask(fd).then(res => {
          console.log('22', res)
          if (res) {
            if (res.respCode === 'YBL100001004') {
              this.remaindDialog = true
              this.code = res.respCode
              this.message = res.respMsg
              this.failMessage = res.failData
            } else {
              this.volumeAddDialog = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.loadTable_all()
            }
          }
        }).catch(message => {
          this.$message.error(`${message}`)
        })
      } else {
        if (!this.bondId) {
          this.$message.error('请输入资产编码')
          return
        }
        delete this.volumeAdd.attach
        delete this.volumeAdd.busiCode
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
            this.loadTable_all()
          }
        })
      }
    },
    addTask() {
      this.isBatch = false
      this.volumeAddDialog = true
      this.taskTitle = '添加任务'
      this.resetTaskDialog()
    },
    downLoadMode() {
      this.$refs.moduleDownload.click()
    },
    saveValuation() {

    },
    handleExceed() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    memSuccess(item) {
      console.log('item', item)
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.excelFile = item.file
    },
    memSuccess1(item) {
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.upLoadValution.excelFile = item.file
    },
    handleExceed1() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    allotTask() {
      this.allocationDialog = true
      this.nameModel.userId = ''
      getUserName('00001').then(res => {
        this.nameList = res
      })
    },
    saveName() {
      if (this.selection.length === 0) {
        return this.$message.warning('请选择任务')
      }
      this.nameModel.ids = this.selection
      this.$refs['taskDom'].validate((val) => {
        if (val) {
          saveTask(this.nameModel).then(res => {
            this.allocationDialog = false
            this.$message({
              message: '任务分配成功',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    },
    claimTask: function() {

    },
    addBondsNonp() {
      this.valuation.starTime = new Date()
      this.noValuationDialog = true
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

    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.loadTable_all()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.loadTable_all()
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
