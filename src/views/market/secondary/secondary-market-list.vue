<template>
  <div class="app-container">
    <div style="margin-top: -10px">
      <el-button
        icon="el-icon-arrow-down"
        style="margin-bottom: 10px;width: 100%;height: 15px;padding: 0;color: #fff;background: black;font-size: 15px"
        @click="drawerIsOpen = true"
      />
    </div>
    <div style="margin-bottom: 20px" align="right">
      <span>
        <el-select v-model="offerModuleId" filterable placeholder="报价展示模板" @visible-change="loadOfferModuleList">
          <el-option
            v-for="item in offerModuleList"
            :key="item.id"
            :label="item.tempName"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="offerToUse">应用</el-button>
      </span>
      <span>
        <el-select v-model="moduleId" filterable placeholder="成交展示模板" @visible-change="loadModuleList">
          <el-option
            v-for="item in moduleList"
            :key="item.id"
            :label="item.tempName"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="toUse">应用</el-button>
      </span>
    </div>
    <!--报价表格-->
    <div>
      <el-table
        ref="offerMarketListTable"
        v-loading="offerMarketLoading"
        :data="offerMarketList"
        tooltip-effect="dark"
        width="100%"
        height="400px"
        @header-click="offerHeaderScreening"
        @header-contextmenu="offerEditCurrentModule"
        @cell-dblclick="offerCellDblclick"
      >
        <el-table-column v-for="item in offerTableHeader" :key="item.colName" :prop="item.colName" :label="item.colChiName" align="center" width="180px">
          <template slot-scope="scope">
            <span :class="offerIsLight(scope.row,item)?'light':''">{{ codeFormatter(scope.row,item) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="offerPage.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="offerPage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="offerPage.totalRecord"
        @size-change="offerHandleSizeChange"
        @current-change="offerHandleCurrentChange"
      />
    </div>
    <hr style="color: #b7bfa5">
    <!--成交表格-->
    <div style="margin-top: 20px">
      <el-table
        ref="marketListTable"
        v-loading="marketLoading"
        :data="marketList"
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @header-click="headerScreening"
        @header-contextmenu="editCurrentModule"
        @cell-dblclick="cellDblclick"
      >
        <el-table-column
          v-for="item in tableHeader"
          :key="item.colName"
          :prop="item.colName"
          :label="item.colChiName"
          align="center"
          width="180px"
        >
          <template slot-scope="scope">
            <span :class="isLight(scope.row,item)?'light':''">{{ codeFormatter(scope.row,item) }}</span>
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
    </div>
    <el-dialog v-if="screeningFormVisible" width="45%" title="筛选" :visible.sync="screeningFormVisible">
      <!--日期类型-->
      <keep-alive>
        <ScreeningForm
          v-if="formType===1"
          ref="ScreeningForm"
          @dateCallBack="screeningCallBack"
        />
        <!--数字类型-->
        <ScreeningNumForm
          v-if="formType===2"
          ref="ScreeningNumForm"
          @dateCallBack="screeningCallBack"
        />
        <!--字符类型-->
        <ScreeningStringForm
          v-if="formType===3"
          ref="ScreeningStringForm"
          @dateCallBack="screeningCallBack"
        />
        <!--可选类-->
        <ScreeningCheckboxForm
          v-if="formType===4"
          ref="ScreeningCheckboxForm"
          :options-list="optionHeader"
          @dateCallBack="screeningCallBack"
        />
      </keep-alive>
      <el-form v-if="formType === 5" ref="specialForm" status-icon label-width="150px">
        <el-row :gutter="66" align="left">
          <div class="grid-content bg-purple">
            <el-form-item label="特殊条款">
              <el-checkbox-group v-model="specialChecked">
                <el-checkbox label="1">是否永续</el-checkbox><br>
                <el-checkbox label="2">是否私募</el-checkbox><br>
                <el-checkbox label="3">是否有担保</el-checkbox><br>
                <el-checkbox label="4">是否公开</el-checkbox><br>
                <el-checkbox label="5">是否休1</el-checkbox><br>
                <el-checkbox label="6">是否休2</el-checkbox><br>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="screening">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="updateFormVisible" width="40%" title="修改" :visible.sync="updateFormVisible">
      <!--修改单元格-->
      <el-form ref="updateForm" status-icon :model="updateForm" label-width="150px">
        <el-row :gutter="2" align="left">
          <div class="grid-content bg-purple">
            <el-form-item label="内容" align="left" prop="screeningString">
              <el-input v-model="updateForm.updateContent" placeholder="请输入修改内容" style="width: 200px" />
            </el-form-item>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateCancel">取 消</el-button>
        <el-button type="primary" @click="updateCell">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="drawerIsOpen" width="100%" :visible.sync="drawerIsOpen" style="margin-top: 0;padding-bottom: 0" top="0">
      <!--查询条件-->
      <el-form ref="queryForm" status-icon :model="queryForm" label-width="150px" :rules="queryFormRules">
        <el-form-item label="曲线编制类型">
          <el-select v-model="queryForm.curveType" :clearable="true" placeholder="请选择曲线编制类型">
            <el-option v-for="item in curveOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="曲线名称">
          <el-row>
            <el-col :span="6">
              <el-select
                v-model="queryForm.checkedCurveNames"
                multiple
                collapse-tags
                filterable
                placeholder="请选择曲线名称"
                @visible-change="getcurveNames"
              >
                <el-option
                  v-for="item in curveList"
                  :key="item.curveId"
                  :label="item.productName"
                  :value="item.productName"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="4">
                  <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                </el-col>
                <el-col :span="16">
                  <el-checkbox-group v-model="queryForm.checkedReferenceType" @change="handleCheckedReferenceTypeChange">
                    <el-checkbox v-for="referenceType in referenceTypes" :key="referenceType" :label="referenceType">{{ referenceType }}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="债券代码" prop="bondCode">
          <el-input v-model="queryForm.bondCode" placeholder="请输入债券代码" style="width: 200px" />
        </el-form-item>
        <el-form-item label="待偿期">
          <!--<el-input v-model="queryForm.period" placeholder="如[1,2]" style="width: 200px" />-->
          <el-row :gutter="22" s>
            <el-form-item prop="startPeriod" style="display: inline-block">
              <el-input v-model.number="queryForm.startPeriod" placeholder="开始" type="number" style="width: 90px" />&nbsp;~
            </el-form-item>
            <el-form-item prop="endPeriod" style="display: inline-block">
              <el-input v-model.number="queryForm.endPeriod" placeholder="结束" type="number" style="width: 90px" />&nbsp;年
            </el-form-item>
          </el-row>
        </el-form-item>
        <el-form-item label="发行人" prop="issuer">
          <el-input v-model="queryForm.issuer" placeholder="请输入发行人" style="width: 200px" />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="queryForm.updateTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryCell">查询</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="width: 100%">
        <div style="margin-bottom: -20px">
          <el-button icon="el-icon-arrow-up" style="margin-bottom: 0;width: 100%;height: 15px;padding: 0;color: #fff;background: black;font-size: 15px" @click="drawerIsOpen = false" />
        </div>
      </div>
    </el-dialog>
    <el-dialog v-if="editModuleIsOpen" width="50%" :visible.sync="editModuleIsOpen">
      <!--编辑模板-->
      <el-form ref="" status-icon :model="editModuleForm" label-width="150px">
        <el-form-item v-if="activeName === 'first'" label="模板名称" prop="moduleName">
          <el-input v-model="editModuleForm.moduleName" placeholder="" style="width: 300px" />
        </el-form-item>
        <el-form-item v-if="activeName === 'second'" label="模板名称" prop="offerModuleName">
          <el-input v-model="editModuleForm.offerModuleName" placeholder="" style="width: 300px" />
        </el-form-item>
        <el-form-item>
          <span style="color: #dddfdd">
            修改模板名称后保存，视为新模板
          </span>
        </el-form-item>
        <el-form-item>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="展示区域" name="first" :disabled="currentModuleId === ''">
              <el-table
                ref="editTable"
                :data="editTableHeaders"
                tooltip-effect="dark"
                style="width: 100%"
                :show-header="isShowHeader"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="colChiName" align="left" />
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-caret-top" style="font-size: 30px" @click="topMoved(scope.row)" />
                    <i class="el-icon-caret-bottom" style="font-size: 30px" @click="bottomMoved(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="报价展示区域" name="second" :disabled="offerCurrentModuleId === ''">
              <el-table
                ref="editOfferTable"
                :data="editOfferTableHeaders"
                tooltip-effect="dark"
                style="width: 100%"
                :show-header="isShowHeader"
                @selection-change="offerHandleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="colChiName" align="left" />
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-caret-top" style="font-size: 30px" @click="topMoved(scope.row)" />
                    <i class="el-icon-caret-bottom" style="font-size: 30px" @click="bottomMoved(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="width: 100%">
        <el-row>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6" align="center">
            <el-button type="primary" @click="saveEditCell">保存并应用</el-button>
          </el-col>
          <el-col :span="6" align="center">
            <el-button @click="editCancel">取 消</el-button>
          </el-col>
          <el-col :span="6" />
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ScreeningForm from '@/views/market/secondary/screening-form.vue'
import ScreeningNumForm from '@/views/market/secondary/screening-num-form.vue'
import ScreeningStringForm from '@/views/market/secondary/screening-string-form.vue'
import ScreeningCheckboxForm from '@/views/market/secondary/screening-checkbox-form.vue'
import { queryDefaultCols, queryMarketData, getTempList, getTempById, saveTempInfo, saveMarketData } from '@/api/market/market.js'
import { getCurveList } from '@/api/curve/curve-product-list.js'
import { optioins } from '@/api/curve/code-type.js'
export default {
  name: 'SecondaryMarketList',
  components: {
    ScreeningForm,
    ScreeningNumForm,
    ScreeningStringForm,
    ScreeningCheckboxForm
  },
  data() {
    return {
      optionHeader: [],
      // 特殊条款
      specialChecked: [],
      // 编辑模板弹框
      editModuleIsOpen: false,
      editModuleForm: {
        moduleName: '',
        offerModuleName: ''
      },
      activeName: 'first',
      multipleSelection: [],
      offerSelection: [],
      isShowHeader: false,
      editTableHeaders: [],
      editOfferTableHeaders: [],
      // 查询表单框
      queryForm: {
        checkedCurveNames: [],
        curveType: '',
        bondCode: '',
        // endPeriod: '',
        // startPeriod: '',
        issuer: '',
        updateTime: [],
        checkedReferenceType: ['曲线样本券', '估值进线规则']
      },
      queryFormRules: {
        startPeriod: [{ validator: (rule, value, callback) => {
          if (this.queryForm.endPeriod !== '' && value > this.queryForm.endPeriod && value !== '') {
            callback(new Error('需小于等于' + this.queryForm.endPeriod))
          } else {
            callback()
          }
        }, trigger: 'change' }],
        endPeriod: [{ validator: (rule, value, callback) => {
          if (this.queryForm.startPeriod !== '' && value < this.queryForm.startPeriod && value !== '') {
            callback(new Error('需大于等于' + this.queryForm.startPeriod))
          } else {
            callback()
          }
        }, trigger: 'change' }]
      },
      checkAll: true,
      referenceTypes: ['曲线样本券', '估值进线规则'],
      isIndeterminate: false,
      curveList: [],
      // 查询是否打开
      drawerIsOpen: false,
      // 当前表:1报价表，2成交表
      currentTable: 1,
      // 当前行
      currentRow: {},
      // 当前头
      currentHeader: {},
      formType: 0,
      screeningFormVisible: false,
      updateFormVisible: false,
      // 报价表
      offerMarketList: [],
      offerTableHeader: [],
      offerColData: [],
      offerPage: {
        pageNumber: 1,
        pageSize: 10
      },
      offerScreeningFormList: [],
      offerModuleId: '',
      offerCurrentModuleId: '',
      offerModuleList: [],
      offerMarketLoading: false,
      // 成交表
      updateForm: {
        updateContent: ''
      },
      marketList: [],
      tableHeader: [],
      colData: [],
      moduleList: [],
      moduleId: '',
      currentModuleId: '',
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      screeningFormList: [],
      marketLoading: false
    }
  },
  computed: {
    curveOptions() {
      return optioins(this, 'CURVE_BUILD_TYPE')
    }
  },
  beforeMount() {
    this.initTable()
  },
  methods: {
    // 初始化
    async initTable() {
      await this.initOfferTable()
      await this.initCJTable()
    },
    initOfferTable() {
      // 初始化报价表数据
      // 获取默认模板表头信息及行情列表信息
      this.offerMarketLoading = true
      // 查询默认表头
      const data = {
        dataMarket: '02',
        showArea: '01'
      }
      queryDefaultCols(data).then(response => {
        const { showCols, colData } = response
        // console.info(showCols)
        // console.info(colData)
        this.offerTableHeader = showCols
        this.offerColData = colData
      })
      // 获取满足条件的行情数据
      const data2 = {
        page: this.offerPage,
        dataMarket: '02',
        showArea: '01',
        queryForm: this.queryForm
      }
      queryMarketData(data2).then(response => {
        // console.info(response)
        if (typeof response.page !== 'undefined') {
          this.offerPage = response.page
        }
        this.offerMarketList = response.dataList
      })
      this.offerMarketLoading = false
    },
    initCJTable() {
      // 初始化成交表数据
      // 获取默认模板表头信息及行情列表信息
      this.marketLoading = true
      // 查询默认表头
      const data = {
        dataMarket: '02',
        showArea: '02'
      }
      queryDefaultCols(data).then(response => {
        const { showCols, colData } = response
        // console.info(showCols)
        // console.info(colData)
        this.tableHeader = showCols
        this.colData = colData
      })
      // 获取满足条件的行情数据
      const data2 = {
        page: this.page,
        dataMarket: '02',
        showArea: '02',
        queryForm: this.queryForm
      }
      queryMarketData(data2).then(response => {
        console.info(response)
        if (typeof response.page !== 'undefined') {
          this.page = response.page
        }
        this.marketList = response.dataList
      })
      this.marketLoading = false
    },

    // 报价
    offerLoadTable() {
      // 加载报价表数据
      // 获取行情列表信息
      this.offerMarketLoading = true
      this.searchParam = []
      // 处理筛选数据格式
      console.info(this.offerScreeningFormList)
      this.formatScreeningForm(this.offerScreeningFormList)
      // 获取满足条件的行情数据
      const data = {
        page: this.offerPage,
        dataMarket: '02',
        showArea: '01',
        tempId: this.offerCurrentModuleId,
        searchParam: this.searchParam,
        queryForm: this.queryForm,
        specialChecked: this.specialChecked
      }
      queryMarketData(data).then(response => {
        console.info(response)
        if (typeof response.page !== 'undefined') {
          this.offerPage = response.page
        }
        this.offerMarketList = response.dataList
      })
      this.offerMarketLoading = false
      this.searchParam = []
    },
    offerHeaderScreening(column) {
      // 报价表头点击事件
      // 清空筛选表单数据
      this.screeningFormReset()
      this.currentTable = 1
      const key = column.property
      this.currentHeader.key = key
      this.currentHeader.label = column.label
      if (key === 'specialProvisions') {
        this.formType = 5
      } else {
        // 默认该表头没有筛选过
        const form = this.offerScreeningFormList.filter(form => form.headerKey === this.currentHeader.key)
        console.info(form)
        if (form.length > 0) {
          // const form = this.screeningFormList[index].screeningForm
          this.screeningFormSet(JSON.parse(JSON.stringify(form[0].screeningForm)))
        }
        const tab = this.offerTableHeader.filter(tab => tab.colName === key)
        const type = tab[0].colType
        this.optionHeader = optioins(this, tab[0].realColName)
        // console.log('11', this.optionHeader)
        switch (type) {
          case 'DATE':// 日期型
            this.formType = 1
            break
          case 'NUMBER':// 数值型
            this.formType = 2
            break
          case 'STRING':// 字符型
            this.formType = 3
            break
          case 'EQSTRING':// 字符型（不能模糊查询）
            this.formType = 3
            break
          case 'OPTION':// 可选型
            this.formType = 4
            break
          default: // 自定义字段不予筛选
            this.formType = 0
            break
        }
      }
      this.screeningFormVisible = true
    },
    offerCellDblclick(row, column) {
      // 报价表格双击事件
      this.currentTable = 1
      const title = column.property
      const tabs = this.offerTableHeader.filter(tab => tab.colName === title)
      const tab = tabs[0]
      console.info(row[title])
      if (tab.modiFlag === 'Y') {
        this.currentRow = row
        this.currentHeader.key = column.property
        this.currentHeader.label = column.label
        this.updateFormVisible = true
      }
    },
    offerHandleSizeChange(pageSize) {
      this.offerPage.pageSize = pageSize
      this.offerLoadTable()
    },
    offerHandleCurrentChange(currentPage) {
      this.offerPage.pageNumber = currentPage
      this.offerLoadTable()
    },
    offerIsLight(row, header) {
      // 判断是否高亮
      if (typeof row.modifiedCols !== 'undefined') {
        const modifiedCols = row.modifiedCols
        const mods = modifiedCols.split(',')
        const mod = mods.filter(val => val === header.colName)
        return mod.length > 0
      } else {
        return false
      }
    },
    offerToUse() {
      // 应用报价表模板
      const val = this.offerModuleId
      if (val === '') {
        this.$message('请选择报价展示模板！')
        return
      }
      getTempById(val).then(res => {
        const { showCols, colData } = res
        // console.info(showCols)
        // this.offerTableHeader = showCols
        this.offerTableHeader = []
        this.$nextTick(() => {
          for (let i = 0; i < showCols.length; i++) {
            this.offerTableHeader.splice(i, 0, showCols[i])
          }
          // console.info(this.offerTableHeader)
        })
        this.offerColData = colData
      })
      // 清空筛选数据
      this.offerScreeningFormList = []
      // 获取满足条件的行情数据
      this.offerLoadTable()
      this.offerCurrentModuleId = this.offerModuleId
    },
    offerEditCurrentModule() {
      // 报价表头右击事件
      // 取消浏览器默认右击事件
      window.event.returnValue = false
      if (this.offerCurrentModuleId !== '') {
        this.activeName = 'second'
        const module = this.offerModuleList.filter(mod => mod.id === this.offerCurrentModuleId)
        // console.info(module)
        this.editModuleForm.offerModuleName = module[0].tempName

        const offerTableHeaderDetail = this.offerColData.filter(col => this.offerTableHeader.filter(tab => col.colName === tab.colName).length > 0)
        offerTableHeaderDetail.map(res => this.editOfferTableHeaders.push(res))
        const tableHeaderDetail = this.colData.filter(col => this.tableHeader.filter(tab => col.colName === tab.colName).length > 0)
        tableHeaderDetail.map(res => this.editTableHeaders.push(res))
        this.editModuleIsOpen = true
        this.$nextTick(() => {
          this.editOfferTableHeaders.map(obj => {
            this.$refs.editOfferTable.toggleRowSelection(obj, true)
          })
          this.editTableHeaders.map(obj => {
            this.$refs.editTable.toggleRowSelection(obj, true)
          })
        })
      }
    },

    // 成交表
    loadTable() {
      // 加载成交表数据
      // 获取行情列表信息
      this.marketLoading = true
      this.searchParam = []
      // 处理筛选数据
      this.formatScreeningForm(this.screeningFormList)
      // 获取满足条件的行情数据
      const data = {
        page: this.page,
        dataMarket: '02',
        showArea: '02',
        tempId: this.currentModuleId,
        searchParam: this.searchParam,
        queryForm: this.queryForm
      }
      queryMarketData(data).then(response => {
        console.info(response)
        if (typeof response.page !== 'undefined') {
          this.page = response.page
        }
        this.marketList = response.dataList
      })
      this.marketLoading = false
      this.searchParam = []
    },
    headerScreening(column) {
      // 成交表头点击事件
      this.currentTable = 2
      // 清空筛选表单数据
      this.screeningFormReset()
      const key = column.property
      this.currentHeader.key = key
      this.currentHeader.label = column.label
      const form = this.screeningFormList.filter(form => form.headerKey === this.currentHeader.key)
      console.info(form)
      if (form.length > 0) {
        // const form = this.screeningFormList[index].screeningForm
        this.screeningFormSet(JSON.parse(JSON.stringify(form[0].screeningForm)))
      }
      const tab = this.tableHeader.filter(tab => tab.colName === key)
      const type = tab[0].colType
      this.optionHeader = optioins(this, tab[0].realColName)
      console.log('11', this.optionHeader)

      switch (type) {
        case 'DATE':// 日期型
          this.formType = 1
          break
        case 'NUMBER':// 数值型
          this.formType = 2
          break
        case 'STRING':// 字符型
          this.formType = 3
          break
        case 'EQSTRING':// 字符型（不能模糊查询）
          this.formType = 3
          break
        case 'OPTION':// 可选型
          this.formType = 4
          break
      }
      this.screeningFormVisible = true
    },
    cellDblclick(row, column) {
      // 成交表格双击事件
      this.currentTable = 2
      const title = column.property
      const tabs = this.tableHeader.filter(tab => tab.colName === title)
      const tab = tabs[0]
      console.info(row[title])
      if (tab.modiFlag === 'Y') {
        this.currentRow = row
        this.currentHeader.key = column.property
        this.currentHeader.label = column.label
        this.updateFormVisible = true
      }
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.loadTable()
    },
    isLight(row, header) {
      // 成交判断是否高亮
      if (typeof row.modifiedCols !== 'undefined') {
        const modifiedCols = row.modifiedCols
        const mods = modifiedCols.split(',')
        const mod = mods.filter(val => val === header.colName)
        return mod.length > 0
      } else {
        return false
      }
    },
    toUse() {
      // 应用成交表模板
      const val = this.moduleId
      if (val === '') {
        this.$message('请选择模板！')
        return
      }
      getTempById(val).then(res => {
        const { showCols, colData } = res
        // console.info(showCols)
        // this.tableHeader = showCols
        this.tableHeader = []
        this.$nextTick(() => {
          for (let i = 0; i < showCols.length; i++) {
            this.tableHeader.splice(i, 0, showCols[i])
          }
          // console.info(this.tableHeader)
        })
        this.colData = colData
      })
      // 清空筛选数据
      this.screeningFormList = []
      // 获取满足条件的行情数据
      this.loadTable()
      this.currentModuleId = this.moduleId
    },
    editCurrentModule() {
      // 成交表表头右击
      // 取消浏览器默认右击事件
      window.event.returnValue = false
      // 清空表头及多选项旧数据
      this.editOfferTableHeaders = []
      this.editTableHeaders = []
      this.$nextTick(() => {
        this.editOfferTableHeaders.map(obj => {
          this.$refs.editOfferTable.toggleRowSelection(obj, true)
        })
        this.editTableHeaders.map(obj => {
          this.$refs.editTable.toggleRowSelection(obj, true)
        })
      })
      if (this.currentModuleId !== '') {
        this.activeName = 'first'
        const module = this.moduleList.filter(mod => mod.id === this.currentModuleId)
        this.editModuleForm.moduleName = module[0].tempName
        // console.info(this.editModuleForm)

        const offerTableHeaderDetail = this.offerColData.filter(col => this.offerTableHeader.filter(tab => col.colName === tab.colName).length > 0)
        offerTableHeaderDetail.map(res => this.editOfferTableHeaders.push(res))
        const tableHeaderDetail = this.colData.filter(col => this.tableHeader.filter(tab => col.colName === tab.colName).length > 0)
        tableHeaderDetail.map(res => this.editTableHeaders.push(res))

        this.editModuleIsOpen = true
        // 表头默认全选
        this.$nextTick(() => {
          this.editOfferTableHeaders.map(obj => {
            this.$refs.editOfferTable.toggleRowSelection(obj, true)
          })
          this.editTableHeaders.map(obj => {
            this.$refs.editTable.toggleRowSelection(obj, true)
          })
        })
      }
    },

    // 其他
    queryCell() {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          // 查询成交表
          this.loadTable()
          // 查询报价表
          this.offerLoadTable()
          // 确定查询
          this.drawerIsOpen = false
        } else {
          // this.$message('error submit!!')
          return false
        }
      })
    },
    screening() {
      // 确定筛选方法
      switch (this.formType) {
        case 1:
          this.$refs.ScreeningForm.screening()
          break
        case 2:
          this.$refs.ScreeningNumForm.screening()
          break
        case 3:
          this.$refs.ScreeningStringForm.screening()
          break
        case 4:
          this.$refs.ScreeningCheckboxForm.screening()
          break
        case 5:
          this.screeningCallBack()
          break
      }
    },
    offerScreeningTable() {
      // 报价表确定筛选
      const screeningForm = this.$store.state.secondaryScr.screeningForm
      // 判断该字段是否已进行筛选
      const index = this.isScreeningByHeader(this.offerScreeningFormList)
      if (index != null && index !== '') {
        this.offerScreeningFormList[index].screeningForm = screeningForm
      } else {
        const screening = {}
        screening.headerKey = this.currentHeader.key
        screening.headerLabel = this.currentHeader.label
        screening.screeningForm = screeningForm
        this.offerScreeningFormList.push(screening)
      }
      console.info('报价搜索条件集合')
      console.info(this.offerScreeningFormList)
      // 清楚筛选表单信息
      this.screeningFormReset()
      // 清楚当前需筛选的表头信息
      this.currentHeader = {}
      // 关闭弹窗
      this.screeningFormVisible = false
      this.offerLoadTable()
    },
    screeningTable() {
      // 成交表确定筛选
      const screeningForm = this.$store.state.secondaryScr.screeningForm
      // 判断该字段是否已进行筛选
      const index = this.isScreeningByHeader(this.screeningFormList)
      if (index != null && index !== '') {
        this.screeningFormList[index].screeningForm = screeningForm
      } else {
        const screening = {}
        screening.headerKey = this.currentHeader.key
        screening.headerLabel = this.currentHeader.label
        screening.screeningForm = screeningForm
        this.screeningFormList.push(screening)
      }
      console.info('成交搜索条件集合')
      console.info(this.screeningFormList)
      // 清楚筛选表单信息
      this.screeningFormReset()
      // 清楚当前需筛选的表头信息
      this.currentHeader = {}
      // 关闭弹窗
      this.screeningFormVisible = false
      this.loadTable()
    },
    cancel() {
      // 取消筛选
      // 清楚筛选表单信息
      this.screeningFormReset()
      // 清楚当前需筛选的表头信息
      this.currentHeader = {}
      // 关闭弹窗
      this.screeningFormVisible = false
    },
    updateCancel() {
      // 取消修改方法
      this.updateForm.updateContent = ''
      this.currentRow = {}
      this.currentHeader = {}
      this.updateFormVisible = false
    },
    updateCell() {
      // 确定修改方法
      const content = this.updateForm.updateContent
      if (this.currentTable === 1) {
        // 报价表
        const headers = this.offerTableHeader.filter(tab => tab.colName === this.currentHeader.key)
        // console.info('确定修改')
        // alert(content)
        const str = headers[0].colName
        this.currentRow[str]
        // console.info('修改'+ this.currentRow[str])
        if (content === this.currentRow[str] + '') {
          this.updateForm.updateContent = ''
          this.currentRow = {}
          this.currentHeader = {}
          this.updateFormVisible = false
          return
        }
        this.currentRow[str] = content
        const data = {
          currentHeader: headers[0],
          currentRow: this.currentRow,
          content: content,
          tempId: this.currentModuleId,
          dataMarket: '02',
          showArea: '01'
        }
        console.info('报价表修改')
        console.info(data)
        saveMarketData(data).then(res => {
          console.info(res)
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
        this.offerLoadTable()
      } else {
        // 成交表
        const headers = this.tableHeader.filter(tab => tab.colName === this.currentHeader.key)
        // console.info('确定修改')
        // alert(content)
        const str = headers[0].colName
        this.currentRow[str]
        // console.info('修改'+ this.currentRow[str])
        if (content === this.currentRow[str] + '') {
          this.updateForm.updateContent = ''
          this.currentRow = {}
          this.currentHeader = {}
          this.updateFormVisible = false
          return
        }
        this.currentRow[str] = content
        const data = {
          currentHeader: headers[0],
          currentRow: this.currentRow,
          content: content,
          tempId: this.currentModuleId,
          dataMarket: '02',
          showArea: '02'
        }
        console.info('成交表修改')
        console.info(data)
        saveMarketData(data).then(res => {
          console.info(res)
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
        this.loadTable()
      }
      this.updateForm.updateContent = ''
      this.currentRow = {}
      this.currentHeader = {}
      this.updateFormVisible = false
    },
    screeningCallBack() {
      if (this.currentTable === 1) {
        // 报价表
        this.offerScreeningTable()
      } else {
        // 成交表
        this.screeningTable()
      }
    },
    isScreeningByHeader(val) {
      // 根据当前表头查询是否已添加到搜索条件集合
      for (let i = 0; i < val.length; i++) {
        console.info(i)
        if (val[i].headerKey === this.currentHeader.key) {
          return i
        }
      }
    },
    screeningFormReset() {
      this.$store.commit('secondaryScr/setSecondaryScr', {})
    },
    screeningFormSet(form) {
      this.$store.commit('secondaryScr/setSecondaryScr', form)
    },
    handleCheckAllChange(val) {
      // 查询表单可选项全选事件
      this.queryForm.checkedReferenceType = val ? this.referenceTypes : []
      this.isIndeterminate = false
    },
    handleCheckedReferenceTypeChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.referenceTypes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.referenceTypes.length
    },
    loadOfferModuleList(val) {
      // 加载所有报价模板
      if (val) {
        const data = {
          page: {
            pageNumber: 1,
            pageSize: 100
          },
          dataMarket: '02',
          showArea: '01'
        }
        getTempList(data).then(res => {
          console.info(res)
          this.offerModuleList = res.dataList
        })
      }
    },
    loadModuleList(val) {
      // 加载所有成交模板
      if (val) {
        const data = {
          page: {
            pageNumber: 1,
            pageSize: 100
          },
          dataMarket: '02',
          showArea: '02'
        }
        getTempList(data).then(res => {
          console.info(res)
          this.moduleList = res.dataList
        })
      }
    },
    handleClick(tab) {
      // console.info('标签')
      // console.info(tab.name)
      const tabName = tab.name
      if (tabName === 'first') {
        if (this.editModuleForm.moduleName === '') {
          const module = this.moduleList.filter(mod => mod.value === this.moduleId)
          this.editModuleForm.moduleName = module[0].label
        }
      } else if (tabName === 'second') {
        if (this.editModuleForm.offerModuleName === '') {
          const module = this.offerModuleList.filter(mod => mod.value === this.offerModuleId)
          this.editModuleForm.offerModuleName = module[0].label
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    offerHandleSelectionChange(val) {
      this.offerSelection = val
      console.info()
    },
    topMoved(row) {
      // 模板编辑框表头上移
      if (this.activeName === 'first') {
        // 成交表头上移
        const obj = this.editTableHeaders.filter(mod => mod.colName === row.colName)
        const index = this.editTableHeaders.indexOf(obj[0])
        if (index > 0) {
          const temp = this.editTableHeaders[index]
          this.editTableHeaders[index] = this.editTableHeaders[index - 1]
          this.editTableHeaders[index - 1] = temp
        } else {
          this.$message('这是第一个了！')
        }
      } else if (this.activeName === 'second') {
        // 报价表头上移
        const obj = this.editOfferTableHeaders.filter(mod => mod.colName === row.colName)
        const index = this.editOfferTableHeaders.indexOf(obj[0])
        if (index > 0) {
          const temp = this.editOfferTableHeaders[index]
          this.editOfferTableHeaders[index] = this.editOfferTableHeaders[index - 1]
          this.editOfferTableHeaders[index - 1] = temp
        } else {
          this.$message('这是第一个了！')
        }
      }
    },
    bottomMoved(row) {
      // 模板编辑框表头下移
      // console.info('下移')
      // console.info(row)
      if (this.activeName === 'first') {
        // 成交表头下移
        const obj = this.editTableHeaders.filter(mod => mod.colName === row.colName)
        const index = this.editTableHeaders.indexOf(obj[0])
        if (index < (this.editTableHeaders.length - 1)) {
          const temp = this.editTableHeaders[index]
          this.editTableHeaders[index] = this.editTableHeaders[index + 1]
          this.editTableHeaders[index + 1] = temp
        } else {
          this.$message('这是最后一个了！')
        }
      } else if (this.activeName === 'second') {
        // 报价表头下移
        const obj = this.editOfferTableHeaders.filter(mod => mod.colName === row.colName)
        const index = this.editOfferTableHeaders.indexOf(obj[0])
        if (index < (this.offerTableHeader.length - 1)) {
          const temp = this.editOfferTableHeaders[index]
          this.editOfferTableHeaders[index] = this.editOfferTableHeaders[index + 1]
          this.editOfferTableHeaders[index + 1] = temp
        } else {
          this.$message('这是最后一个了！')
        }
      }
    },
    saveEditCell() {
      console.info(this.offerSelection)
      if (this.activeName === 'first') {
        // 编辑当前成交模板
        const modules = this.moduleList.filter(mod => mod.id === this.currentModuleId)
        const module = modules[0]
        if (this.editModuleForm.moduleName !== module.tempName) {
          module.id = ''
          module.tempName = this.editModuleForm.moduleName
        }
        const data = {
          marketTempInfo: module,
          colData: this.currentModuleId === '' ? [] : this.editTableHeaders.filter(v => this.multipleSelection.indexOf(v) !== -1)
        }
        let newTempId = this.currentModuleId
        saveTempInfo(data).then(res => {
          console.info(res)
          newTempId = res.tempId
        })
        this.editModuleIsOpen = false
        // 根据返回的模板id查询表头信息
        getTempById(newTempId).then(res => {
          const { showCols, colData } = res
          console.info(showCols)
          this.tableHeader = []
          this.$nextTick(() => {
            for (let i = 0; i < showCols.length; i++) {
              this.tableHeader.splice(i, 0, showCols[i])
            }
            console.info(this.tableHeader)
          })
          this.colData = colData
        })
        // 获取满足条件的行情数据
        this.loadTable()
        this.currentModuleId = newTempId
      } else if (this.activeName === 'second') {
        // 编辑当前报价模板
        const modules = this.offerModuleList.filter(mod => mod.id === this.offerCurrentModuleId)
        const module = modules[0]
        if (this.editModuleForm.offerModuleName !== module.tempName) {
          module.id = ''
          module.tempName = this.editModuleForm.offerModuleName
        }
        const data = {
          marketTempInfo: module,
          colData: this.offerCurrentModuleId === '' ? [] : this.editOfferTableHeaders.filter(v => this.offerSelection.indexOf(v) !== -1)
        }
        let newTempId = this.offerCurrentModuleId
        saveTempInfo(data).then(res => {
          console.info(res)
          newTempId = res.tempId
        })
        this.editModuleIsOpen = false
        // 根据返回的模板id查询表头信息
        getTempById(newTempId).then(res => {
          const { showCols, colData } = res
          console.info(showCols)
          // this.offerTableHeader = showCols
          this.offerTableHeader = []
          this.$nextTick(() => {
            for (let i = 0; i < showCols.length; i++) {
              this.offerTableHeader.splice(i, 0, showCols[i])
            }
            console.info(this.offerTableHeader)
          })
          this.offerColData = colData
        })
        // 获取满足条件的行情数据
        this.offerLoadTable()
        this.offerCurrentModuleId = newTempId
      }
      // const data = {
      //   moduleId: this.currentModuleId,
      //   moduleName: this.editModuleForm.moduleName,
      //   moduleHeaders: this.currentModuleId === '' ? [] : this.editTableHeaders.filter(v => this.multipleSelection.indexOf(v) !== -1),
      //   offerModuleId: this.offerCurrentModuleId,
      //   offerModuleName: this.editModuleForm.offerModuleName,
      //   offerModuleHeaders: this.offerCurrentModuleId === '' ? [] : this.editOfferTableHeaders.filter(v => this.offerSelection.indexOf(v) !== -1)
      // }
      // console.info(data)
      this.editModuleIsOpen = false
    },
    editCancel() {
      this.editOfferTableHeaders = []
      this.editTableHeaders = []
      this.$nextTick(() => {
        this.editOfferTableHeaders.map(obj => {
          this.$refs.editOfferTable.toggleRowSelection(obj, true)
        })
        this.editTableHeaders.map(obj => {
          this.$refs.editTable.toggleRowSelection(obj, true)
        })
      })
      this.editModuleIsOpen = false
    },
    formatScreeningForm(value) {
      // 处理筛选数据格式
      value.map(val => {
        // 判断表头类型
        let headers = []
        if (this.currentTable === 1) {
          headers = this.offerTableHeader.filter(tab => tab.colName === val.headerKey)
        } else {
          headers = this.tableHeader.filter(tab => tab.colName === val.headerKey)
        }
        const type = headers[0].colType
        const obj = {}
        const data = val.screeningForm
        switch (type) {
          case 'DATE':// 日期型
            obj.colName = headers[0].realColName
            obj.colType = 'DATE'
            if (typeof data.singleDate === 'undefined' || data.singleDate === '') {
              // 范围
              obj.operator = 'BETWEEN'
              if (typeof data.dateRange !== 'undefined') {
                obj.value = (data.dateRange)[0] + ',' + (data.dateRange)[1]
              }
            } else {
              // 单日
              obj.operator = 'EQ'
              obj.value = data.singleDate
            }
            if (typeof data.screeningSort !== 'undefined') {
              obj.sort = obj.sort = data.screeningSort === '1' ? 'ASC' : 'DESC'
            }
            break
          case 'NUMBER':// 数值型
            obj.colName = headers[0].realColName
            obj.colType = 'NUMBER'
            if (typeof data.screeningNum === 'undefined' || data.screeningNum === '') {
              // 范围
              obj.operator = 'BETWEEN'
              if (typeof data.startNum !== 'undefined' && data.startNum !== '') {
                obj.beginvalue = data.startNum + ''
              }
              if (typeof data.endNum !== 'undefined' && data.endNum !== '') {
                obj.endvalue = data.endNum + ''
              }
            } else {
              if (data.absoluteValue) {
                obj.operator = 'ABSEQ'
              } else {
                obj.operator = 'EQ'
              }
              obj.value = data.screeningNum + ''
            }
            if (typeof data.screeningSort !== 'undefined') {
              obj.sort = data.screeningSort === '1' ? 'ASC' : 'DESC'
            }
            break
          case 'STRING':// 字符型
            obj.colName = headers[0].realColName
            obj.colType = 'STRING'
            // 单日
            obj.operator = 'LIKE'
            obj.value = data.screeningString
            if (typeof data.screeningSort !== 'undefined') {
              obj.sort = data.screeningSort === '1' ? 'ASC' : 'DESC'
            }
            break
          case 'EQSTRING':// 字符型（不能模糊查询）
            obj.colName = headers[0].realColName
            obj.colType = 'EQSTRING'
            // 单日
            obj.operator = 'EQ'
            obj.value = data.screeningString
            if (typeof data.screeningSort !== 'undefined') {
              obj.sort = data.screeningSort === '1' ? 'ASC' : 'DESC'
            }
            break
          case 'OPTION':// 可选型
            obj.colName = headers[0].realColName
            obj.colType = 'OPTION'
            if (typeof data.screeningCheckString === 'undefined') {
              if (typeof data.screeningChecked !== 'undefined') {
                obj.operator = 'IN'
                obj.value = ''
                if (data.screeningChecked.length > 0) {
                  for (let i = 0; i < data.screeningChecked.length; i++) {
                    if (i === (data.screeningChecked.length - 1)) {
                      obj.value = obj.value + data.screeningChecked[i]
                    } else {
                      obj.value = obj.value + data.screeningChecked[i] + ','
                    }
                  }
                }
              }
            } else {
              obj.operator = 'LIKE'
              obj.value = data.screeningCheckString
            }
            break
        }
        this.searchParam.push(obj)
      })
    },
    getcurveNames() {
      // 加载曲线列表
      getCurveList().then(response => {
        this.curveList = response
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.knock === '1' || row.netdeviationLimit === '1') {
        return 'warning-row'
      }
      return ''
    },
    codeFormatter(row, column) {
      if (column.colType === 'OPTION' && column.colName === 'curveBuildType') {
        const options = optioins(this, column.realColName)
        const opt = options.filter(opt => opt.value === row[column.colName])
        if (opt.length > 0) {
          return opt[0].label
        } else {
          return row[column.colName]
        }
      } else {
        return row[column.colName]
      }
    }
  }

}
</script>

<style scoped>
  .light {
    color: #df1009;
  }
  .el-table .warning-row {
    background: oldlace;
  }

</style>
