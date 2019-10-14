<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-row>
        <el-col :span="12" class="scroll-box">
          <el-button type="primary">方案调整</el-button>
          <template>
            <el-dropdown split-button type="primary" @command="batchAdjust">
              批量调整
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">批量调整曲线</el-dropdown-item>
                <el-dropdown-item command="b">批量调整隐含评级</el-dropdown-item>
                <el-dropdown-item command="c">批量调整信用点差</el-dropdown-item>
                <el-dropdown-item command="d">批量调整其他点差</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <el-button type="primary" @click="backTask">任务退回</el-button>
          <el-button type="primary">方案确认</el-button>
          <el-button icon="el-icon-refresh" @click="refrech" />
        </el-col>
        <!-- <el-col :span="11" :offset="1" class="scroll-box">
          <el-input v-model="bondId" placeholder="输入资产根码后添加任务" style="width:200px" />
          <el-button type="primary" @click="addTask">添加任务</el-button>
          <el-button type="primary" @click="batchAddTask">批量添加</el-button>
          <el-button type="primary" @click="uploadScheme">批量上传人工估值</el-button>
          <el-button type="primary" @click="marketAdjust">盯市券点差调整</el-button>
        </el-col> -->
        <el-col :span="11" :offset="1" class="scroll-box">
          <el-input v-model="bondId" placeholder="输入资产根码后添加任务" style="width:200px" />
          <el-button type="primary" @click="addTask">添加任务</el-button>
          <el-button type="primary" @click="batchAddTask">批量添加</el-button>
          <div style="margin-top:7px">
            <el-button type="primary" @click="uploadScheme">批量上传人工估值</el-button>
            <el-button type="primary" @click="marketAdjust">盯市券点差调整</el-button>
          </div>
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
          <el-form-item label="选择批次" :label-width="isBatch ? '': '105px'" prop="batchId">
            <el-select v-model="volumeAdd.batchId" filterable clearable placeholder="请选择批次" @visible-change="batchChange">
              <el-option v-for="(item, index) in batchList" :key="index" :label="item.name" :value="item.batchId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isBatch" label="选择文件" prop="attach">
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
            </div>
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
    <el-dialog :visible.sync="marketDialog" width="450px">
      <el-row style="margin-top:50px">
        <el-col :span="8" :offset="8">
          <el-button @click="interestAdjust">利率债点差调整</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:80px;margin-bottom:80px">
        <el-col :span="8" :offset="8">
          <el-button @click="creditAdjust">信用债点差调整</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="interestDialog" title="利率债点差调整">
      <el-table
        :data="interestList"
        style="width: 100%"
        max-height="280"
        :header-cell-style="{background:'#f6f6f6'}"
        tooltip-effect="dark"
        border
        fit
        highlight-current-row
        @selection-change="handleInterestChange"
      >
        <el-table-column label="作业线名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="全选" type="selection" />
      </el-table>
      <el-form ref="interestDom" style="margin-top:20px" :rules="interestRule" :model="interestObj">
        <el-form-item label="交易量" required>
          <!-- <el-row> -->
          <el-col :span="9">
            <el-form-item prop="starNumber">
              <el-input v-model="interestObj.starNumber" type="number" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="padding-left:20px">至</el-col>
          <el-col :span="9">
            <el-form-item prop="endNumber">
              <el-input v-model="interestObj.endNumber" type="number" clearable />
            </el-form-item>
          </el-col>
          <!-- </el-row> -->
        </el-form-item>
        <el-form-item label="参考基准线时间" prop="baseTime">
          <el-time-select
            v-model="interestObj.baseTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:59'
            }"
            placeholder="请选择基准时间"
          />
        </el-form-item>
        <el-form-item label="点差补0的券" prop="addZero">
          <!-- <el-input v-model="interestObj.addZero" style="width:50%" />
          <div class="icon-box" @click="addZero">
            <i class="el-icon-circle-plus-outline" />
          </div> -->
          <el-upload
            style="display: inline-block;"
            action=""
            :multiple="false"
            name="attach"
            :http-request="upload"
            :show-file-list="false"
            :accept="'excel'"
          >
            <div class="icon-box">
              <el-button class="el-icon-circle-plus-outline" />
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="12" :offset="11">
          <el-button type="primary" @click="countDiff">计算点差</el-button>
          <el-button type="primary" @click="lookDiff">查看点差</el-button>
          <el-button @click="interestDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="creditDialog" title="信用债点差调整">
      <el-table
        :data="creditList"
        style="width: 100%"
        max-height="280"
        :header-cell-style="{background:'#f6f6f6'}"
        tooltip-effect="dark"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="作业线名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="全选" type="selection" />
      </el-table>
      <el-form ref="creditDom" style="margin-top:20px" :rules="creditRule" :model="creditObj" :label-position="labelPosition">
        <el-form-item label="交易量" required>
          <el-col :span="9">
            <el-form-item prop="starNumber">
              <el-input v-model="creditObj.starNumber" type="number" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="padding-left:20px">至</el-col>
          <el-col :span="9">
            <el-form-item prop="endNumber">
              <el-input v-model="creditObj.endNumber" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-for="item in compareList" :key="item.name" :label="item.name" label-width="260px" required>
          <el-col :span="11">
            <el-form-item :prop="item.symbol">
              <el-select v-model="item.symbol" placeholder="请选择" clearable>
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :prop="item.number">
              <el-input v-model="item.number" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="big-box">
        <!-- <div v-for="(i,index) in compareList" :key="index" class="bot-box">
          <div class="left-box">{{ i.name }}</div>
          <div class="input-box">
            <el-select v-model="i.symbol" placeholder="请选择">
              <el-option
                v-for="item in compare"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="input-box">
            <el-input v-model="i.number" type="number" clearable />
          </div>
        </div> -->
        <!-- <el-form :label-position="labelPosition">

        </el-form> -->
      </div>
      <el-row style="margin-top:20px">
        <el-col :span="23" :offset="1">
          <el-button type="primary" @click="countOpposite">计算对敲</el-button>
          <el-button type="primary" @click="lookOpposite">查看对敲</el-button>
          <el-button type="primary" @click="countDiff">计算点差</el-button>
          <el-button type="primary" @click="lookDiff">查看点差</el-button>
          <el-button @click="creditDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="adjustDialog" title="利率债点差调整" width="1200px">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane v-for="item in tabPaneList" :key="item.name" :label="item.label" :name="item.name">
          <transition name="el-fade-in-linear">
            <adjust-form :is-look="isLook" :active-name="activeName" />
          </transition>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="oppositeDialog" title="对敲人工识别" width="1000px">
      <opposite-form :is-opposite="islookOpposite" />
    </el-dialog>
    <el-dialog :visible.sync="batchAdjustDialog.a" title="批量调整目标估值曲线">
      <el-form-item label="目标估值曲线">
        <el-select v-model="valuationScheme.curveId" placeholder="请选择">
          <el-option
            v-for="curve in curveList"
            :key="curve.id"
            :label="curve.name"
            :value="curve.id"
          />
        </el-select>
      </el-form-item>
    </el-dialog>
    <el-dialog :visible.sync="batchAdjustDialog.b" title="批量调整隐含评级" />
    <el-dialog :visible.sync="batchAdjustDialog.c" title="批量调整目标信用点差" />
    <el-dialog :visible.sync="batchAdjustDialog.d" title="批量调整目标流动性点差" />
  </div>
</template>

<script>
import AssetList from '@/views/valuation/scheme/asset-list.vue'
import PeopleUpload from '@/views/valuation/scheme/people-upload.vue'
import AdjustForm from '@/views/valuation/scheme/adjustCount-form.vue'
import OppositeForm from '@/views/valuation/scheme/opposite-form.vue'
import { getAllTableList, returnTask, addOneTask, addBatchTask } from '@/api/valuation/task.js'
// import { uploadFile } from '@/utils/request-client'
// import { basic_api_valuation } from '@/api/base-api'
export default {
  name: 'SchemeMyList',
  components: {
    // BatchTaskForm,
    AssetList,
    PeopleUpload,
    AdjustForm,
    OppositeForm
  },
  data() {
    return {
      activeElement: '01',
      activeName: '01',
      labelPosition: 'left',
      isLook: false,
      isOpposite: false,
      volumeAddDialog: false,
      uploadMethodDialog: false,
      oppositeDialog: false,
      tableLoading: false,
      isBatch: false,
      remaindDialog: false,
      marketDialog: false,
      creditDialog: false,
      interestDialog: false,
      adjustDialog: false,
      islookOpposite: false,
      message: '',
      code: '',
      failMessage: '',
      myList: [],
      interestList: [],
      adjustList: [],
      creditList: [
        { remark: '01' },
        { remark: '01' },
        { remark: '01' },
        { remark: '01' },
        { remark: '01' }

      ],
      interestObj: {},
      creditObj: {},
      compareObj: {},
      taskTitle: '',
      uploadList: [],
      selection: [],
      selectCreditList: [],
      selectInterestList: [],
      compare: [
        {
          label: '大于',
          value: '01'
        }, {
          label: '大于等于',
          value: '02'
        }, {
          label: '等于',
          value: '03'
        }, {
          label: '小于',
          value: '04'
        }, {
          label: '小于等于',
          value: '05'
        }
      ],
      exchangeObj: {},
      compareList: [
        { name: '本日经纪成交与市场收益率偏差(BP)', number: '' },
        { name: '昨日经纪成交与市场收益率偏差(BP)', number: '' },
        { name: '线的调整幅度与日间单券偏差只差(BP)', number: '' },
        { name: '同业存单可靠成交（报价）待偿期', number: '' },
        { name: '同业存单成交（报价）估值偏离', number: '' },
        { name: '同业存单成交（报价）连续阈值', number: '' },
        { name: '同业存单发行人成交（报价）历史总分', number: '' }

      ],
      extends: '',
      volumeAdd: {
        cause: '08',
        batchId: '2222',
        attach: ''
      },
      interestRule: {
        starNumber: [{ required: true, message: '请输入最小数量', trigger: 'blur' }],
        endNumber: [{ required: true, message: '请输入最大数量', trigger: 'blur' }],
        baseTime: [{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }],
        addZero: [{ required: true, message: '请上传点差补0的券', trigger: 'blur' }]
      },
      creditRule: {
        starNumber: [{ required: true, message: '请输入最小数量', trigger: 'blur' }],
        endNumber: [{ required: true, message: '请输入最大数量', trigger: 'blur' }]
      },
      rules: {
        batchId: [{ required: true, message: '请选择批次', trigger: 'change' }],
        cause: [{ required: true, message: '请选择调整原因', trigger: 'change' }]
        // dataFile: [{ required: true, message: '请选择上传文件', trigger: 'blur' }]
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
      tabPaneList: [
        {
          label: 'All',
          name: '01'
        }, {
          label: '自动计算',
          name: '02'
        }, {
          label: '人工',
          name: '03'
        }, {
          label: '待确认',
          name: '04'
        }
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
      },
      valuationScheme: {
        curveId: '',
        marketGrade: '',
        cdsPremAdjType: '',
        cdsPremAdjWay: '',
        recoDire: '',
        relaSpread: '',
        flAdjValue: '',
        otAdjValue: '',
        spreadValue: ''
      },
      batchAdjustDialog: {
        a: false,
        b: false,
        c: false,
        d: false
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
    marketAdjust() {
      this.marketDialog = true
    },
    interestAdjust() {
      this.interestDialog = true
      this.interestObj = {}
    },
    creditAdjust() {
      this.creditDialog = true
      this.creditObj = {}
      if (this.creditList.length > 4) {
        this.creditList = this.creditList.slice(0, 4)
        this.creditList.push({ remark: '......' })
      }
    },
    handleSelectionChange(val) {
      this.selectCreditList = val
    },
    handleInterestChange(val) {
      this.selectInterestList = val
    },
    addZero() {

    },
    tabClick(e) {
      this.activeName = e.name
    },
    countDiff() {
      this.isLook = false
      this.adjustDialog = true
    },
    lookDiff() {
      this.isLook = true
      this.adjustDialog = true
    },
    countOpposite() {
      this.islookOpposite = false
      this.oppositeDialog = true
    },
    lookOpposite() {
      this.islookOpposite = true
      this.oppositeDialog = true
    },
    upload() {

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
      console.log('000', this.selection)
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
      this.volumeAdd.batchId = this.batchList[0].batchId
      this.volumeAdd.attach = null
      this.volumeAdd.cause = '08'
      if (this.$refs.upload) this.$refs.upload.clearFiles()
    },
    saveBatchFirst(type) {
      this.volumeAdd.busiCode = type
      const fd = new FormData()
      fd.append('attach', this.volumeAdd.attach)
      fd.append('batchId', this.volumeAdd.batchId)
      fd.append('cause', this.volumeAdd.cause)
      addBatchTask(fd).then(res => {
        this.remaindDialog = false
        this.volumeAddDialog = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loadTable()
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
            if (!this.volumeAdd.attach) {
              return this.$message('别着急, 您的文件还没有上传哦')
            }
            var fd = new FormData()
            fd.append('attach', this.volumeAdd.attach)
            fd.append('batchId', this.volumeAdd.batchId)
            fd.append('cause', this.volumeAdd.cause)
            addBatchTask(fd).then(res => {
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
                  this.loadTable()
                }
              }
            }).catch(err => {
              this.$message.error(`${err}`)
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
      this.volumeAdd.attach = item.file
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
    batchAdjust: function(command) {
      this.batchAdjustDialog[command] = true
    },
    taskBack: function() {

    },
    taskCommit: function() {

    }
  }
}
</script>
<style lang="scss" scoped>
//  .scroll-box {
//      white-space: nowrap;
//      overflow-x: scroll;
//      height: 60px;
//  }
 .assset {
     font-weight: 700;
     font-size: 16px;
 }
 .card {
     height: 100%;
 }
 .icon-box {
   font-size: 25px;
   display: inline-block;
   padding-left: 10px;
 }
  .content {
   font-size: 18px;
   margin-top: -15px;
 }

 .bot-box {
   display: flex;
  //  justify-content: space-between;
   height: 30px;
   align-items: center;
   margin: 10px 0;
   .left-box {
     flex-wrap: nowrap;
     flex: 2;
   }
   .input-box {
     flex: 1;
     margin: 0 5px;
   }
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
