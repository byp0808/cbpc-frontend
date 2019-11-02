<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-row>
        <el-col :xl="8" :lg="10">
          <el-button type="primary" @click="allotTask">任务分配</el-button>
          <el-button v-loading="taskLoading" type="primary" @click="getTask">任务认领</el-button>
          <el-button type="primary" @click="addBondsNonp">添加不估值</el-button>
          <el-button icon="el-icon-refresh" @click="refresh" />
        </el-col>
        <el-col :xl="16" :lg="14">
          <!-- <el-input v-model="bondId" placeholder="输入资产编码后添加任务" clearable style="width:200px" /> -->
          <el-autocomplete v-model="bondId" placeholder="输入资产编码后添加任务" clearable :fetch-suggestions="querySearch" @select="handleSelectInput" />
          <el-button type="primary" @click="addTask">添加任务</el-button>
          <el-button type="primary" @click="batchAddTask">批量添加</el-button>
          <!-- <div style="margin-top:7px"> -->
          <el-button type="primary" @click="uploadScheme">上传估值方案</el-button>
          <el-button type="primary" @click="downScheme">下载估值方案</el-button>
          <!-- </div> -->
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
      <div v-if="activeElement === '01'" v-loading="tabLoading">
        <asset-list ref="assetList" :all-list="allList" :is-my="isMy" @taskList="taskLists" />
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
      <div v-if="activeElement === '02'" v-loading="tabLoading">
        <obey-list :all-list="allList" :is-my="isMy" :active-name="activeElement" @taskList="taskLists" />
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
      <div v-if="activeElement === '03'" v-loading="tabLoading">
        <obey-list :all-list="allList" :is-my="isMy" :active-name="activeElement" @taskList="taskLists" />
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
        <people-upload :all-list="uploadList" :is-my="isMy" @taskList="taskLists" />
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
          <el-form-item label="任务调整人" prop="userId">
            <el-select v-model="nameModel.userId" filterable clearable placeholder="请选择任务调整人" @visible-change="nameChange">
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
    <el-dialog v-loading="bondLoading" :visible.sync="noValuationDialog" title="添加不估值" width="1100px" @close="cancleValuation">
      <div>
        <!-- <el-date-picker v-model="valuation.starTime" type="date" placeholder="请选择开始日期" />
        <el-date-picker v-model="valuation.endTime" type="date" placeholder="请结束开始日期" style="margin-left:20px" />
        <el-row style="margin-top:30px">
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="noValuationDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveName">确 定</el-button>
            </div>
          </el-col>
        </el-row> -->
        <el-card class="box-card">
          <div slot="header" class="clearfix card-head">
            <h3 style="margin: 0">基本信息</h3>
          </div>
          <el-form ref="bondsNonpInfo" status-icon :model="bondsNonpInfo" :rules="rules" label-width="150px">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item label="ID">
                    <el-input v-model="bondsNonpInfo.id" disabled />
                  </el-form-item>
                  <el-form-item label="资产概念分类">
                    <el-input v-model="bondsNonpInfo.bondsConceptType" disabled />
                  </el-form-item>
                  <el-form-item
                    prop="bondId"
                    label="资产编码"
                  >
                    <el-input v-model="bondsNonpInfo.bondId" disabled placeholder="请输入资产编码" clearable />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item label="最后操作人">
                    <el-input v-model="bondsNonpInfo.lastUpdBy" disabled />
                  </el-form-item>
                  <el-form-item label="资产简称">
                    <el-input v-model="bondsNonpInfo.bondsShortName" disabled />
                  </el-form-item>
                  <el-form-item label="流通场所" prop="marketId">
                    <el-select v-model="bondsNonpInfo.marketId" disabled multiple style="width: 100%">
                      <el-option
                        v-for="(item, index) in filtedMarket"
                        :key="index"
                        :label="item.name"
                        :value="item.key"
                        :disabled="item.disabled"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item label="最后操作时间">
                    <el-input v-model="bondsNonpInfo.lastUpdTs" disabled />
                  </el-form-item>
                  <el-form-item label="发行人">
                    <el-input v-model="bondsNonpInfo.bondsIssuer" disabled />
                  </el-form-item>
                  <el-form-item
                    label="有效期（天）"
                    prop="indate"
                  >
                    <el-input
                      v-model.number="bondsNonpInfo.indate"
                      placeholder="请输入有效期"
                      clearable
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <el-form-item label="不参与原因">
                    <el-input v-model="bondsNonpInfo.cause" type="textarea" placeholder="请输入不参与原因" maxlength="500" show-word-limit />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-row style="margin-top:30px">
          <el-col :span="6" :offset="19">
            <div class="dialog-footer">
              <el-button @click="cancleValuation">取 消</el-button>
              <el-button type="primary" @click="saveNovaluation">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="volumeAddDialog" :title="taskTitle">
      <div>
        <el-form style="margin-left:50px" :label-position="labelPosition" :model="volumeAdd">
          <el-form-item label="选择批次" :label-width="isBatch ? '': '95px'">
            <el-select v-model="volumeAdd.batchId" filterable placeholder="请选择批次">
              <el-option v-for="(item, index) in batchList" :key="index" :label="item.name" :value="item.batchId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isBatch" label="选择文件">
            <el-upload
              ref="upload"
              class="upload-demo"
              action=""
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :limit="1"
              drag
              :on-exceed="handleExceed"
              :http-request="memSuccess"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div class="downLoad" @click="downLoadMode">
              <a ref="moduleDownload" style="display: none" href="/model/bondTemplate.xlsx" download="估值添加债券模板" />
              模板文件下载</div>
          </el-form-item>
          <el-form-item label="选择调整原因">
            <el-select v-model="volumeAdd.cause" filterable placeholder="请选择原因">
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
            <el-select v-model="upLoadValution.batchId" filterable clearable placeholder="请选择批次">
              <el-option v-for="(item, index) in batchList" :key="index" :label="item.name" :value="item.batchId" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              ref="upload1"
              class="upload-demo"
              action=""
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :limit="1"
              drag
              :on-exceed="handleExceed1"
              :http-request="memSuccess1"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div class="downLoad" @click="downLoadBond">
              <a ref="DomDownload" style="display: none" href="/model/valuationScheme.xlsx" download="估值方案模板" />
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
    <el-dialog :visible="confirmDialog.a" @close="confirmDialog.a = false">
      <div>{{ resMsg }}</div>
      <el-row style="margin-top:20px">
        <el-col :span="2" :offset="21">
          <el-button type="primary" @click="taskconfirm('S101', 'a')">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible="confirmDialog.b" @close="confirmDialog.b = false">
      <div>{{ resMsg }}</div>
      <el-row style="margin-top:20px">
        <el-col :span="8" :offset="16">
          <el-button @click="taskconfirm('S201', 'b')">不认领</el-button>
          <el-button type="primary" @click="taskconfirm('S202', 'b')">仍然认领</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible="confirmDialog.c" @close="confirmDialog.c = false">
      <div>{{ resMsg }}</div>
      <el-row style="margin-top:20px">
        <el-col :span="12" :offset="12">
          <el-button @click="taskconfirm('S301','c')">不认领</el-button>
          <el-button type="primary" @click="taskconfirm('S302', 'c')">认领并保留</el-button>
          <el-button type="primary" @click="taskconfirm('S303', 'c')">认领不保留</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible="confirmDialog.d" @close="confirmDialog.d = false">
      <div>{{ resMsg }}</div>
      <el-row style="margin-top:20px">
        <el-col :span="8" :offset="16">
          <el-button @click="confirmDialog.d = false">取消</el-button>
          <el-button type="primary" @click="taskconfirm('S101', 'd')">忽略并导入</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import AssetList from '@/views/valuation/scheme/asset-list.vue'
import ObeyList from '@/views/valuation/scheme/obey-list.vue'
import PeopleUpload from '@/views/valuation/scheme/people-upload.vue'
import { getAllTableList, getUserName, addBatchTask, addOneTask, getTask, saveTask, searchBond, saveBond, searchBondNum } from '@/api/valuation/task.js'
import { basic_api_valuation } from '../../../api/base-api'
import { upload } from '@/utils/file-request'
export default {
  name: 'SchemeAllList',
  components: {
    AssetList,
    PeopleUpload,
    ObeyList
  },
  data() {
    return {
      activeElement: '01',
      uploadUrl: `${basic_api_valuation}/task/batch-valu-scheme`,
      downloadUrl: `${process.env.VUE_APP_BASE_API}${basic_api_valuation}/bonds-nonp/batch-in`,
      labelPosition: 'right',
      allocationDialog: false,
      noValuationDialog: false,
      volumeAddDialog: false,
      uploadMethodDialog: false,
      tabLoading: false,
      fileLoading: false,
      taskLoading: false,
      methodUpload: false,
      isBatch: false,
      remaindDialog: false,
      isMy: false,
      message: '',
      code: '',
      bondsNonpInfo: {},
      failMessage: '',
      taskTitle: '',
      excelFile: '',
      peopleName: '',
      allList: [],
      selection: [],
      causeList: [],
      bondLoading: false,
      confirmDialog: {
        a: false,
        b: false,
        c: false,
        d: false
      },
      filtedMarket: [],
      rules: {
        bondId: [{ required: true, message: '请输入资产编码', trigger: 'blur' }],
        indate: [
          { required: true, message: '请输入有效期', trigger: 'blur' },
          { type: 'number', message: '请输入一个整数', trigger: 'blur' },
          { validator: this.validDayRange, trigger: 'blur' }
        ],
        marketId: [
          { required: true, message: '请选择流通场所', trigger: ['blur'] }
        ]
      },
      taskRule: {
        userId: [{ required: true, message: '请选择任务调整人', trigger: 'change' }]
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
        batchId: '11'
      },
      upLoadValution: {
        batchId: '11',
        excelFile: ''
      },
      nameList: [],
      bondId: '',
      valuationAllTask: [],
      valuationMyTask: [],
      taskList: [],
      marketLists: [],
      selectBondId: '',
      flag: false,
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        },
        tab: '01',
        scene: '01'
      },
      taskParams: {},
      resMsg: ''
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
    querySearch(query, call) {
      if (query) {
        searchBondNum(query).then(res => {
          console.log('sss', res)
          this.marketLists = res.map(v => {
            return { value: v.assetCode, label: v.bondShort }
          })
          call(this.marketLists)
        })
      }
    },
    handleSelectInput(e) {
      this.selectBondId = e.value
    },
    // selectionList(data) {
    //   this.selection = data
    // },
    validDayRange(rule, value, callback) {
      if (parseInt(value) < 1 || parseInt(value) > 999999) {
        callback(new Error('1天≤有效期≤999999天'))
      } else {
        callback()
      }
    },
    taskLists(data) {
      this.taskList = data
      console.log('dd', this.taskList)
    },
    getTask() {
      if (this.taskList.length === 0) {
        return this.$message.warning('请选择任务')
      } else {
        this.selectionCheck()
        this.taskLoading = true
        this.taskParams.ids = this.selection
        getTask(this.taskParams).then(res => {
          console.log('res', res)
          this.resMsg = res.respMsg
          if (res.respCode === '0') {
            this.$message({
              message: '任务认领成功',
              type: 'success'
            })
            this.taskLoading = false
            this.loadTable_all()
            this.taskList = []
            delete this.taskParams.busiCode
            // return true
          }
          if (res.respCode === 'YBL100001104-1') {
            this.confirmDialog.a = true
            this.taskLoading = false
          }
          if (res.respCode === 'YBL100001104-2') {
            this.confirmDialog.b = true
          }
          if (res.respCode === 'YBL100001104-3') {
            this.confirmDialog.c = true
            this.taskLoading = false
          }
          if (res.respCode === 'YBL100001015' || res.respCode === 'YBL100001016') {
            this.confirmDialog.d = true
            this.taskLoading = false
          }
        }).catch(() => {
          this.taskLoading = false
        })
      }
    },
    taskconfirm(e, dialog) {
      this.taskParams.busiCode = e
      this.getTask()
      this.confirmDialog[dialog] = false
      console.log('dialog', dialog)
    },
    tabName(param) {
      switch (param) {
        case '01': return '正常'
        case '02': return '违约'
        case '03': return '本金'
        case '04': return '人工上传'
      }
    },
    refresh() {
      this.loadTable_all()
    },
    handleSelect(e) {
      this.params.scene = e.name
      this.activeElement = e.name
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
      if (this.$refs.upload) this.$refs.upload.clearFiles()
    },
    resetBondDialog() { // 清空估值方案上传
      this.upLoadValution.batchId = this.batchList[0].batchId
      this.upLoadValution.excelFile = null
      if (this.$refs.upload1) this.$refs.upload1.clearFiles()
    },
    saveBatchFirst(type) {
      this.volumeAdd.busiCode = type
      const fd = new FormData()
      fd.append('data.attach', this.excelFile)
      fd.append('data.batchId', this.volumeAdd.batchId)
      fd.append('data.cause', this.volumeAdd.cause)
      fd.append('data.tab', '01')
      fd.append('data.busiCode', type)
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
      this.volumeAdd.tab = '01'
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
    cancleValuation() {
      this.noValuationDialog = false
      this.bondsNonpInfo = {}
    },
    saveNovaluation() {
      this.bondLoading = true
      const data = Object.assign({}, this.bondsNonpInfo)
      data.marketId = this.bondsNonpInfo.marketId.toString()
      this.$refs['bondsNonpInfo'].validate(val => {
        if (val) {
          saveBond(data).then(res => {
            this.bondLoading = false
            this.$message.success('保存成功')
            this.noValuationDialog = false
            this.bondsNonpInfo = {}
          }).catch(() => {
            this.bondLoading = false
            this.bondsNonpInfo = {}
          })
        }
      })
    },
    saveValuation() {
      if (!this.upLoadValution.batchId) {
        return this.$message.info('请选择批次')
      }
      if (!this.upLoadValution.excelFile) {
        return this.$message.warning('别着急, 您的文件还没有上传哦')
      }
      const fd = new FormData()
      fd.append('data.attach', this.upLoadValution.excelFile)
      fd.append('data.batchId', this.upLoadValution.batchId)
      fd.append('data.tab', '01')
      upload({
        url: this.uploadUrl,
        data: fd
      }).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.methodUpload = false
        this.uploadMethodDialog = false
        this.loadTable_all()
      })
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
        fd.append('data.tab', '01')
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
        // if (!this.bondId) {
        //   this.$message.error('请输入资产编码')
        //   return
        // }
        delete this.volumeAdd.attach
        delete this.volumeAdd.busiCode
        this.volumeAdd.assetCode = this.bondId
        this.volumeAdd.tab = '01'
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
            this.bondId = ''
            this.loadTable_all()
          }
        })
      }
    },
    addTask() {
      if (!this.bondId) {
        return this.$message.warning('请输入资产编号')
      }
      this.marketLists.map(v => {
        if (v.value === this.bondId) {
          this.flag = true
        }
      })
      if (!this.flag) {
        return this.$message.warning('请输入正确的资产编号')
      }
      this.isBatch = false
      this.volumeAddDialog = true
      this.taskTitle = '添加任务'
      this.resetTaskDialog()
    },
    downLoadMode() {
      this.$refs.moduleDownload.click()
    },
    downLoadBond() {
      this.$refs.DomDownload.click()
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
      if (this.taskList.length === 0) {
        return this.$message.warning('请选择任务')
      }
      this.allocationDialog = true
      this.nameModel.userId = ''
      getUserName('00001').then(res => {
        this.nameList = res
      })
    },
    selectionCheck() { // 防止点击取消后还会被添加上
      this.selection = []
      this.taskList.map(v => {
        this.selection.push(v.id)
      })
      this.selection = Array.from(new Set(this.selection))
    },
    saveName() {
      this.selectionCheck()
      this.nameModel.ids = this.selection
      this.$refs['taskDom'].validate((val) => {
        if (val) {
          saveTask(this.nameModel).then(res => {
            this.allocationDialog = false
            this.$message({
              message: '任务分配成功',
              type: 'success'
            })
            this.taskList = []
            this.loadTable_all()
          })
        } else {
          return false
        }
      })
    },
    claimTask: function() {

    },
    addBondsNonp() {
      if (this.taskList.length > 1) {
        return this.$message.warning('最多选择一条任务')
      }
      if (this.taskList.length === 0) {
        return this.$message.warning('请选择任务')
      }
      const origin = this.$dict('MARKET')
      // 初始化流通场所
      for (const key in origin) {
        const res = { key: key, name: origin[key] }
        this.filtedMarket.push(res)
      }
      console.log('this.taskList', this.taskList)
      const bondId = this.taskList[0].bondId
      searchBond(bondId).then(res => {
        this.noValuationDialog = true
        this.bondsNonpInfo.bondId = res.bondId
        this.bondsNonpInfo.bondsShortName = res.bondsShortName
        this.bondsNonpInfo.bondsConceptType = res.bondsConceptType
        this.bondsNonpInfo.bondsIssuer = res.bondsIssuer
        this.bondsNonpInfo.marketId = res.marketIds
      })
    },
    batchAddTask() {
      this.isBatch = true
      this.volumeAddDialog = true
      this.taskTitle = '批量添加任务'
      this.resetTaskDialog()
    },
    uploadScheme() {
      this.resetBondDialog()
      this.uploadMethodDialog = true
    },
    downScheme() {
      // downloadFile(this.downloadUrl, this.params).then(res => {

      // })
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
  //  margin-top: -10px;
    &:hover {
     cursor: pointer;
   }
 }
</style>
