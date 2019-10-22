<template>
  <div class="app-container">
    <div style="margin-bottom: 20px" align="right">
      <el-select v-model="moduleId" filterable placeholder="选择模板" @visible-change="loadModuleList">
        <el-option
          v-for="item in moduleList"
          :key="item.id"
          :label="item.tempName"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" @click="toUse">应用</el-button>
    </div>
    <el-table
      ref="refOrderInfoTable"
      v-loading="marketLoading"
      :data="marketList"
      tooltip-effect="dark"
      style="width: 100%"
      @header-click="headerScreening"
      @cell-dblclick="cellDblclick"
      @header-contextmenu="editCurrentModule"
    >
      <el-table-column v-for="item in tableHeader" :key="item.colName" :prop="item.colName" :label="item.colChiName" align="center" width="180px">
        <template slot-scope="scope">
          <span :class="isLight(scope.row,item)?'light':''">{{ scope.row[item.colName] }}</span>
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
    <el-dialog v-if="screeningFormVisible" width="45%" title="筛选" :visible.sync="screeningFormVisible">
      <keep-alive>
        <!--日期类型-->
        <ScreeningForm
          v-if="formType===1"
          ref="ScreeningForm"
          :business-id="orderInfoId"
          @dateCallBack="screeningTable"
        />
        <!--数字类型-->
        <ScreeningNumForm
          v-if="formType===2"
          ref="ScreeningNumForm"
          :business-id="orderInfoId"
          @dateCallBack="screeningTable"
        />
        <!--字符类型-->
        <ScreeningStringForm
          v-if="formType===3"
          ref="ScreeningStringForm"
          :business-id="orderInfoId"
          @dateCallBack="screeningTable"
        />
        <!--可选类-->
        <ScreeningCheckboxForm
          v-if="formType===4"
          ref="ScreeningCheckboxForm"
          :business-id="orderInfoId"
          @dateCallBack="screeningTable"
        />
      </keep-alive>
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
    <el-dialog v-if="editModuleIsOpen" width="50%" :visible.sync="editModuleIsOpen">
      <!--编辑模板-->
      <el-form ref="" status-icon :model="editModuleForm" label-width="150px">
        <el-form-item label="模板名称" prop="moduleName">
          <el-input v-model="editModuleForm.moduleName" placeholder="" style="width: 300px" />
        </el-form-item>
        <el-form-item>
          <span style="font-size: 2px;color: #dddfdd">
            修改模板名称后保存，视为新模板
          </span>
        </el-form-item>
        <el-form-item label="展示区域">
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
import ScreeningForm from '@/views/market/primary/screening-form.vue'
import ScreeningNumForm from '@/views/market/primary/screening-num-form.vue'
import ScreeningStringForm from '@/views/market/primary/screening-string-form.vue'
import ScreeningCheckboxForm from '@/views/market/primary/screening-checkbox-form.vue'
import { queryDefaultCols, queryMarketData, getTempList, getTempById, saveTempInfo, saveMarketData } from '@/api/market/market.js'
export default {
  name: 'PrimaryMarketList',
  components: {
    ScreeningForm,
    ScreeningNumForm,
    ScreeningStringForm,
    ScreeningCheckboxForm
  },
  data() {
    return {
      // 模板编辑
      editModuleIsOpen: false,
      editModuleForm: {
        moduleName: ''
      },
      multipleSelection: [],
      isShowHeader: false,
      editTableHeaders: [],

      marketLoading: false,
      formType: 0,
      screeningFormVisible: false,
      updateFormVisible: false,
      updateForm: {
        updateContent: ''
      },
      orderInfoId: '',
      marketList: [
        { id: '1', col_1: '123456', col_2: 'name1', timeZone: 'GMT_E_0800', remindTime: '10:10:00' },
        { id: '2', col_1: '1234567', col_2: 'name2', timeZone: 'GMT_E_0800', remindTime: '10:10:00' },
        { id: '3', col_1: '1234568', col_2: 'name3', timeZone: 'GMT_E_0800', remindTime: '08:20:00' },
        { id: '4', col_1: '1234569', col_2: 'name4', timeZone: 'GMT_E_0800', remindTime: '10:10:00' },
        { id: '5', col_1: '12345610', col_2: 'name5', timeZone: 'GMT_E_0800', remindTime: '10:10:00' }
      ],
      currentHeader: {},
      currentRow: {},
      tableHeader: [
        { id: '1', key: 'orderNo', label: '批次', THType: '1' },
        { id: '2', key: 'orderName', label: '批次名字', THType: '2' },
        { id: '3', key: 'timeZone', label: '时区', THType: '5' },
        { id: '4', key: 'remindTime', label: '提醒时间', THType: '6' }
      ],
      colData: [],
      moduleList: [],
      moduleId: '',
      currentModuleId: '',
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      screeningFormList: [],
      // 最终筛选数据（传送给服务器）
      searchParam: []
    }
  },
  computed: {

  },
  beforeMount() {
    this.initTable()
  },
  methods: {
    initTable() {
      // 初始化表数据
      // 获取默认模板表头信息及行情列表信息
      this.marketLoading = true
      // 查询默认表头
      const data = {
        dataMarket: '01'
      }
      queryDefaultCols(data).then(response => {
        const { colData, showCols } = response
        console.info(showCols)
        this.tableHeader = showCols
        this.colData = colData
      })
      // 获取满足条件的行情数据
      const data2 = {
        page: this.page,
        dataMarket: '01'
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
    loadTable() {
      // 加载数据
      // 获取行情列表信息
      this.marketLoading = true
      this.searchParam = []
      // 处理删选数据格式
      this.formatScreeningForm(this.screeningFormList)
      console.info('处理后')
      console.info(this.searchParam)
      // 获取满足条件的行情数据
      const data2 = {
        page: this.page,
        dataMarket: '01',
        tempId: this.currentModuleId,
        searchParam: this.searchParam
      }
      queryMarketData(data2).then(response => {
        console.info(response)
        if (typeof response.page !== 'undefined') {
          this.page = response.page
        }
        this.marketList = response.dataList
      })
      this.marketLoading = false
      this.searchParam = []
    },
    toUse() {
      // 应用模板
      const val = this.moduleId
      if (val === '') {
        this.$message('请选择模板！')
        return
      }
      getTempById(val).then(res => {
        const { colData, showCols } = res
        console.info(res)
        this.tableHeader = showCols
        this.colData = colData
      })
      // 清空筛选数据
      this.screeningFormList = []
      // 获取满足条件的行情数据
      this.loadTable()
      this.currentModuleId = this.moduleId
    },
    cellDblclick(row, column) {
      const title = column.property
      const tabs = this.tableHeader.filter(tab => tab.colName === title)
      const tab = tabs[0]
      console.info(row[title])
      if (tab.modiFlag === 'Y') {
        console.info('进来啦')
        this.currentRow = row
        this.currentHeader.key = column.property
        this.currentHeader.label = column.label
        this.updateFormVisible = true
      }
    },
    isLight(row, header) {
      // 判断是否高亮
      // console.info('行')
      // console.info(row)
      // console.info('头')
      // console.info(header)
      if (typeof row.modifiedCols !== 'undefined') {
        const modifiedCols = row.modifiedCols
        const mods = modifiedCols.filter(val => val.colName === header.key)
        return mods.length > 0
      } else {
        return false
      }
    },
    headerScreening(column) {
      // 表头点击事件
      // 清空筛选表单数据
      this.screeningFormReset()
      const key = column.property
      this.currentHeader.key = key
      this.currentHeader.label = column.label

      // 判断该字段是否已进行筛选
      const index = this.isScreeningByheader(this.screeningFormList)
      if (index != null && index !== '') {
        const form = this.screeningFormList[index].screeningForm
        this.screeningFormSet(form)
      }

      const tab = this.tableHeader.filter(tab => tab.colName === key)
      const type = tab[0].colType

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
        default:// 自定义字段不予筛选
          this.formType = 0
          break
      }
      this.screeningFormVisible = true
    },
    screening() {
      // 确定筛选方法
      // console.info(this.formType)
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
      }
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
    screeningTable() {
      // 确定筛选
      // console.info('父组件')
      const screeningForm = this.$store.state.screeningDate.screeningForm
      // 判断该字段是否已进行筛选
      const index = this.isScreeningByheader(this.screeningFormList)
      if (index != null && index !== '') {
        this.screeningFormList[index].screeningForm = screeningForm
      } else {
        const screening = {}
        screening.headerKey = this.currentHeader.key
        screening.headerLabel = this.currentHeader.label
        screening.screeningForm = screeningForm
        this.screeningFormList.push(screening)
      }
      console.info('搜索条件集合')
      console.info(this.screeningFormList)
      this.loadTable()
      // 清楚筛选表单信息
      this.screeningFormReset()
      // 清楚当前需筛选的表头信息
      this.currentHeader = {}
      // 关闭弹窗
      this.screeningFormVisible = false
    },
    updateCell() {
      // 确定修改方法
      // 确定修改方法
      const content = this.updateForm.updateContent
      const headers = this.tableHeader.filter(tab => tab.colName === this.currentHeader.key)
      // console.info('确定修改')
      // alert(content)
      const data = {
        currentHeader: headers[0],
        currentRow: this.currentRow,
        content: content,
        tempId: this.currentModuleId,
        dataMarket: '01'
      }
      console.info('一级行情表修改')
      console.info(data)
      saveMarketData(data).then(res => {
        console.info(res)
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      })

      this.updateForm.updateContent = ''
      this.currentRow = {}
      this.currentHeader = {}
      this.updateFormVisible = false
      this.loadTable()
    },
    updateCancel() {
      // 取消修改方法
      this.updateForm.updateContent = ''
      this.currentRow = {}
      this.currentHeader = {}
      this.updateFormVisible = false
    },
    loadModuleList(val) {
      // 加载所有模板
      if (val) {
        const data = {
          page: {
            pageNumber: 1,
            pageSize: 100
          },
          dataMarket: '01'
        }
        getTempList(data).then(res => {
          console.info(res)
          this.moduleList = res.dataList
        })
      }
    },

    editCurrentModule() {
      // 编辑当前模板
      // 取消浏览器默认右击事件
      window.event.returnValue = false
      // 清空表头及多选项旧数据
      this.editTableHeaders = []
      this.editTableHeaders.map(obj => {
        this.$refs.editTable.toggleRowSelection(obj, true)
      })
      if (this.currentModuleId !== '') {
        const module = this.moduleList.filter(mod => mod.id === this.currentModuleId)
        this.editModuleForm.moduleName = module[0].tempName
        console.info(this.editModuleForm)
        const tableHeaderDetail = this.colData.filter(col => this.tableHeader.filter(tab => col.colName === tab.colName).length > 0)
        // console.info('详细')
        // console.info(this.tableHeader)
        // console.info(this.colData)
        // console.info(tableHeaderDetail)
        tableHeaderDetail.map(res => this.editTableHeaders.push(res))
        this.editModuleIsOpen = true
        // 表头默认全选
        this.$nextTick(() => {
          this.editTableHeaders.map(obj => {
            this.$refs.editTable.toggleRowSelection(obj, true)
          })
        })
      }
    },
    topMoved(row) {
      // 模板编辑框表头上移
      // console.info('上移')
      // console.info(row)
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
    },
    bottomMoved(row) {
      // 模板编辑框表头下移
      // console.info('下移')
      // console.info(row)
      // 成交表头上移
      const obj = this.editTableHeaders.filter(mod => mod.colName === row.colName)
      const index = this.editTableHeaders.indexOf(obj[0])
      if (index < (this.editTableHeaders.length - 1)) {
        const temp = this.editTableHeaders[index]
        this.editTableHeaders[index] = this.editTableHeaders[index + 1]
        this.editTableHeaders[index + 1] = temp
      } else {
        this.$message('这是最后一个了！')
      }
    },
    saveEditCell() {
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
      console.info(data)
      let newTempId = this.currentModuleId
      saveTempInfo(data).then(res => {
        console.info(res)
        newTempId = res.tempId
      })
      this.editModuleIsOpen = false
      // 根据返回的模板id查询表头信息
      getTempById(newTempId).then(res => {
        const { colData, showCols } = res
        console.info(res)
        this.tableHeader = showCols
        this.colData = colData
      })
      // 获取满足条件的行情数据
      this.loadTable()
      this.currentModuleId = newTempId
    },
    editCancel() {
      this.editTableHeaders = []
      this.$nextTick(() => {
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
        const headers = this.tableHeader.filter(tab => tab.colName === val.headerKey)
        const type = headers[0].colType
        const obj = {}
        const data = val.screeningForm
        switch (type) {
          case 'DATE':// 日期型
            obj.colName = val.headerKey
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
            obj.colName = val.headerKey
            obj.colType = 'NUMBER'
            if (typeof data.screeningNum === 'undefined') {
              // 范围
              obj.operator = 'BETWEEN'
              if (typeof data.startNum !== 'undefined') {
                obj.startvalue = data.startNum + ''
              }
              if (typeof data.endNum !== 'undefined') {
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
            obj.colName = val.headerKey
            obj.colType = 'STRING'
            // 单日
            obj.operator = 'LIKE'
            obj.value = data.screeningString
            if (typeof data.screeningSort !== 'undefined') {
              obj.sort = data.screeningSort === '1' ? 'ASC' : 'DESC'
            }
            break
          case 'EQSTRING':// 字符型（不能模糊查询）
            obj.colName = val.headerKey
            obj.colType = 'EQSTRING'
            // 单日
            obj.operator = 'EQ'
            obj.value = data.screeningString
            if (typeof data.screeningSort !== 'undefined') {
              obj.sort = data.screeningSort === '1' ? 'ASC' : 'DESC'
            }
            break
          case 'OPTION':// 可选型
            obj.colName = val.headerKey
            obj.colType = 'OPTION'
            if (typeof data.screeningCheckString === 'undefined') {
              if (typeof data.screeningChecked === 'undefined') {
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
    screeningCallBack() {
    },
    isScreeningByheader(val) {
      for (let i = 0; i < val.length; i++) {
        console.info(i)
        if (val[i].headerKey === this.currentHeader.key) {
          return i
        }
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
    screeningFormReset() {
      this.$store.commit('screeningDate/setScreeningDate', {})
    },
    screeningFormSet(form) {
      this.$store.commit('screeningDate/setScreeningDate', form)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }

}
</script>

<style scoped>
  .light {
    color: #df1009;
  }

</style>
