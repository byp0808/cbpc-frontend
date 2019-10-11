<template>
  <div class="app-container">
    <el-dialog v-if="drawerIsOpen" width="100%" :visible.sync="drawerIsOpen" style="margin-top: 0;padding-bottom: 0" top="0">
      <!--查询条件-->
      <el-form ref="queryForm" status-icon :model="queryForm" label-width="150px">
        <el-form-item label="曲线编制类型">
          <el-select v-model="queryForm.curveType" :clearable="true" placeholder="请选择曲线编制类型">
            <el-option label="利率" value="1" />
            <el-option label="信用" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="曲线名称">
          <el-row>
            <el-col :span="6">
              <el-select
                v-model="queryForm.checkedCurveNames"
                multiple
                collapse-tags
                placeholder="请选择"
              >
                <el-option
                  v-for="item in curveNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
        <el-form-item label="债券代码" prop="screeningString">
          <el-input v-model="queryForm.bondCode" placeholder="请输入债券代码" style="width: 200px" />
        </el-form-item>
        <el-form-item label="代偿期" prop="screeningString">
          <el-input v-model="queryForm.period" placeholder="如[1,2]" style="width: 200px" />
        </el-form-item>
        <el-form-item label="发行人" prop="screeningString">
          <el-input v-model="queryForm.issuer" placeholder="请输入发行人" style="width: 200px" />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="queryForm.updateTime"
            type="datetimerange"
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
    <div style="margin-top: -10px">
      <el-button icon="el-icon-arrow-down" style="margin-bottom: 10px;width: 100%;height: 15px;padding: 0;color: #fff;background: black;font-size: 15px" @click="drawerIsOpen = true" />
    </div>
    <div style="margin-bottom: 20px" align="right">
      <span>
        <el-select v-model="offerModuleId" filterable placeholder="报价展示模板" @visible-change="loadOfferModuleList">
          <el-option
            v-for="item in offerModuleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="offerToUse">应用</el-button>
      </span>
      <span>
        <el-select v-model="moduleId" filterable placeholder="成交展示模板" @visible-change="loadModuleList">
          <el-option
            v-for="item in moduleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
        style="width: 100%"
        height="200"
        @header-contextmenu="offerHeaderScreening"
        @cell-dblclick="offerCellDblclick"
      >
        <el-table-column v-for="item in offerTableHeader" :key="item.id" :prop="item.key" :label="item.label" align="center">
          <template slot-scope="scope">
            <span :class="offerIsLight(scope.row,item)?'light':''">{{ scope.row[item.key] }}</span>
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
        @header-contextmenu="headerScreening"
        @cell-dblclick="cellDblclick"
      >
        <el-table-column v-for="item in tableHeader" :key="item.id" :prop="item.key" :label="item.label" align="center">
          <template slot-scope="scope">
            <span :class="isLight(scope.row,item)?'light':''">{{ scope.row[item.key] }}</span>
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
          @dateCallBack="screeningCallBack"
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
  </div>
</template>

<script>
import ScreeningForm from '@/views/market/secondary/screening-form.vue'
import ScreeningNumForm from '@/views/market/secondary/screening-num-form.vue'
import ScreeningStringForm from '@/views/market/secondary/screening-string-form.vue'
import ScreeningCheckboxForm from '@/views/market/secondary/screening-checkbox-form.vue'
import { queryOrderInfoList } from '@/api/market/market.js'
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
      // 查询表单
      queryForm: {
        checkedCurveNames: [],
        curveType: '',
        bondCode: '',
        period: '',
        issuer: '',
        updateTime: [],
        checkedReferenceType: ['样本券维度', '估值曲线维度']
      },
      checkAll: true,
      referenceTypes: ['样本券维度', '估值曲线维度'],
      isIndeterminate: false,
      curveNames: [
        { value: '1', label: '曲线一' },
        { value: '2', label: '曲线二' },
        { value: '3', label: '曲线三' },
        { value: '4', label: '曲线四' },
        { value: '5', label: '曲线五' },
        { value: '6', label: '曲线六' },
        { value: '7', label: '曲线七' },
        { value: '8', label: '曲线八' },
        { value: '9', label: '曲线九' }
      ],
      // 查询是否打开
      drawerIsOpen: false,
      // 当前表:1报价表，2成交表
      currentTable: 1,
      // 当前行
      currentRow: {},
      // 当前头
      currentHeader: {},
      formType: 1,
      screeningFormVisible: false,
      updateFormVisible: false,
      // 报价
      offerMarketList: [
        // { id: '1', orderNo: '123456', orderName: 'name1', timeZone: 'GMT_E_0800', remindTime: '10:10:00' },
        // { id: '2', orderNo: '1234567', orderName: 'name2', timeZone: 'GMT_E_0800', remindTime: '10:10:00' },
        // { id: '3', orderNo: '1234568', orderName: 'name3', timeZone: 'GMT_E_0800', remindTime: '08:20:00' },
        // { id: '4', orderNo: '1234569', orderName: 'name4', timeZone: 'GMT_E_0800', remindTime: '10:10:00' },
        // { id: '5', orderNo: '12345610', orderName: 'name5', timeZone: 'GMT_E_0800', remindTime: '10:10:00' }
      ],
      offerTableHeader: [
        { id: '1', key: 'orderNo', label: '批次', THType: '1' },
        { id: '2', key: 'orderName', label: '批次名字', THType: '2' },
        { id: '3', key: 'timeZone', label: '时区', THType: '5' },
        { id: '4', key: 'timeZone', label: '时区', THType: '5' },
        { id: '5', key: 'remindTime', label: '提醒时间', THType: '7' }
      ],
      offerPage: {
        pageNumber: 1,
        pageSize: 10
      },
      offerScreeningFormList: [],
      offerModuleId: '',
      offerModuleList: [],
      offerMarketLoading: false,

      // 成交
      updateForm: {
        updateContent: ''
      },
      marketList: [],
      tableHeader: [
        { id: '1', key: 'orderNo', label: '批次', THType: '1' },
        { id: '2', key: 'orderName', label: '批次名字', THType: '2' },
        { id: '3', key: 'timeZone', label: '时区', THType: '5' },
        { id: '4', key: 'remindTime', label: '提醒时间', THType: '6' }
      ],
      module_1: [
        { id: '1', key: 'orderNo', label: '批次', THType: '1' },
        { id: '2', key: 'orderName', label: '批次名字', THType: '2' },
        { id: '3', key: 'orderNo', label: '批次', THType: '3' },
        { id: '4', key: 'timeZone', label: '时区', THType: '5' },
        { id: '5', key: 'remindTime', label: '提醒时间', THType: '6' }
      ],
      module_2: [
        { id: '1', key: 'orderNo', label: '批次', THType: '1' },
        { id: '2', key: 'orderName', label: '批次名字', THType: '2' },
        { id: '3', key: 'orderNo', label: '批次', THType: '3' },
        { id: '4', key: 'orderName', label: '批次名字', THType: '4' },
        { id: '5', key: 'timeZone', label: '时区', THType: '5' },
        { id: '6', key: 'remindTime', label: '提醒时间', THType: '6' }
      ],
      module_3: [
        { id: '1', key: 'orderNo', label: '批次', THType: '1' },
        { id: '2', key: 'orderName', label: '批次名字', THType: '2' },
        { id: '3', key: 'orderNo', label: '批次', THType: '3' },
        { id: '4', key: 'orderName', label: '批次名字', THType: '4' },
        { id: '5', key: 'orderNo', label: '批次', THType: '5' },
        { id: '6', key: 'orderName', label: '批次名字', THType: '6' },
        { id: '7', key: 'timeZone', label: '时区', THType: '7' },
        { id: '5', key: 'orderNo', label: '批次', THType: '5' },
        { id: '6', key: 'orderName', label: '批次名字', THType: '6' },
        { id: '7', key: 'timeZone', label: '时区', THType: '7' },
        { id: '5', key: 'orderNo', label: '批次', THType: '5' },
        { id: '6', key: 'orderName', label: '批次名字', THType: '6' },
        { id: '7', key: 'timeZone', label: '时区', THType: '7' },
        { id: '5', key: 'orderNo', label: '批次', THType: '5' },
        { id: '6', key: 'orderName', label: '批次名字', THType: '6' },
        { id: '7', key: 'timeZone', label: '时区', THType: '7' },
        { id: '8', key: 'remindTime', label: '提醒时间', THType: '8' }
      ],
      moduleList: [],
      moduleId: '',
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      screeningFormList: [],
      marketLoading: false
    }
  },
  beforeMount() {
    this.offerLoadTable()
    this.loadTable()
  },
  methods: {
    // 报价
    offerLoadTable() {
      // 初始化报价表数据
      // 获取用户所有模板
      // 获取默认模板表头信息及行情列表信息
      this.offerMarketLoading = true
      const data = {
        moduleId: this.offerModuleId,
        pageNum: this.offerPage.pageNumber,
        pageSize: this.offerPage.pageSize,
        screeningForm: this.offerScreeningFormList,
        queryForm: this.queryForm
      }
      console.info(data)
      queryOrderInfoList({ page: this.offerPage }).then(response => {
        const { dataList, page } = response
        this.offerPage = page
        this.offerMarketList = dataList
        this.offerMarketLoading = false
      })
    },
    offerHeaderScreening(column) {
      // 报价表头右击事件
      // 取消浏览器默认右击事件
      window.event.returnValue = false
      // 清空筛选表单数据
      this.screeningFormReset()
      this.currentTable = 1
      // console.info(column.property)
      // console.info(column)
      const type = column.property
      this.currentHeader.key = type
      this.currentHeader.label = column.label
      // 默认该表头没有筛选过
      const index = this.isScreeningByHeader(this.offerScreeningFormList)
      if (index != null && index !== '') {
        // 该表头筛选过
        const form = this.offerScreeningFormList[index].screeningForm
        this.screeningFormSet(form)
      }
      switch (type) {
        case 'orderNo':
          this.formType = 1
          break
        case 'orderName':
          this.formType = 2
          break
        case 'timeZone':
          this.formType = 3
          break
        case 'remindTime':
          this.formType = 4
          break
      }
      this.screeningFormVisible = true
    },
    offerCellDblclick(row, column) {
      // 报价表格双击事件
      this.currentTable = 1
      const title = column.property
      console.info(row[title])
      if (!row[title].isNull) {
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
      return row.remindTime === '08:20:00' && header.key === 'remindTime'
    },
    offerToUse() {
      // 应用报价表模板
      const val = this.offerModuleId
      if (val === '') {
        this.$message('请选择报价展示模板！')
        return
      }
      switch (val) {
        case '1':
          this.offerTableHeader = this.module_1
          break
        case '2':
          this.offerTableHeader = this.module_2
          break
        case '3':
          this.offerTableHeader = this.module_3
          break
      }
    },

    // 成交表
    loadTable() {
      // 初始化表数据
      // 获取默认模板表头信息及行情成交列表信息
      this.marketLoading = true
      const data = {
        moduleId: this.moduleId,
        pageNum: this.page.pageNumber,
        pageSize: this.page.pageSize,
        screeningForm: this.screeningFormList,
        queryForm: this.queryForm
      }
      console.info(data)
      queryOrderInfoList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.page = page
        this.marketList = dataList
        this.marketLoading = false
      })
    },
    headerScreening(column) {
      // 成交表头右击事件
      this.currentTable = 2
      // 取消浏览器默认右击事件
      window.event.returnValue = false
      // 清空筛选表单数据
      this.screeningFormReset()
      const type = column.property
      this.currentHeader.key = type
      this.currentHeader.label = column.label
      const index = this.isScreeningByHeader(this.screeningFormList)
      if (index != null && index !== '') {
        const form = this.screeningFormList[index].screeningForm
        this.screeningFormSet(form)
      }
      switch (type) {
        case 'orderNo':
          this.formType = 1
          break
        case 'orderName':
          this.formType = 2
          break
        case 'timeZone':
          this.formType = 3
          break
        case 'remindTime':
          this.formType = 4
          break
      }
      this.screeningFormVisible = true
    },
    cellDblclick(row, column) {
      // 成交表格双击事件
      this.currentTable = 2
      const title = column.property
      console.info(row[title])
      if (!row[title].isNull) {
        console.info('进来啦')
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
      return row.remindTime === '08:20:00' && header.key === 'remindTime'
    },
    toUse() {
      // 应用成交表模板
      const val = this.moduleId
      if (val === '') {
        this.$message('请选择成交展示模板！')
        return
      }
      switch (val) {
        case '1':
          this.tableHeader = this.module_1
          break
        case '2':
          this.tableHeader = this.module_2
          break
        case '3':
          this.tableHeader = this.module_3
          break
      }
    },

    // 公用
    queryCell() {
      // 确定查询
      this.drawerIsOpen = false
      // 查询成交表
      this.loadTable()
      // 查询报价表
      this.offerLoadTable()
    },
    screening() {
      // 确定筛选方法
      if (this.currentTable === 1) {
        // 报价表
        this.offerScreeningTable()
      } else {
        // 成交表
        this.screeningTable()
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
      alert('确定修改')
      alert(content)
      const data = {
        currentHeader: this.currentHeader,
        currentRow: this.currentRow,
        content: content
      }
      if (this.currentTable === 1) {
        // 报价表
        console.info('报价表修改')
        console.info(data)
      } else {
        // 成交表
        console.info('成交表修改')
        console.info(data)
      }
      this.updateForm.updateContent = ''
      this.currentRow = {}
      this.currentHeader = {}
      this.updateFormVisible = false
    },
    screeningCallBack() {
      // // 确定筛选返回函数
      // console.info('父组件')
      // const screeningForm = this.$store.state.secondaryScr.screeningForm
      // // 判断该字段是否已进行筛选
      // const index = this.isScreeningByHeader(this.screeningFormList)
      // if (index != null && index !== '') {
      //   this.screeningFormList[index].screeningForm = screeningForm
      // } else {
      //   const screening = {}
      //   screening.headerKey = this.currentHeader.key
      //   screening.headerLabel = this.currentHeader.label
      //   screening.screeningForm = screeningForm
      //   this.screeningFormList.push(screening)
      // }
      // console.info('搜索条件集合')
      // console.info(this.screeningFormList)
      // // 清楚筛选表单信息
      // this.screeningFormReset()
      // // 清楚当前需筛选的表头信息
      // this.currentHeader = {}
      // // 关闭弹窗
      // this.screeningFormVisible = false
      // this.loadTable()
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
        this.offerModuleList = [
          { value: '1', label: '模板一' },
          { value: '2', label: '模板二' },
          { value: '3', label: '模板三' }
        ]
      }
    },
    loadModuleList(val) {
      // 加载所有成交模板
      if (val) {
        this.moduleList = [
          { value: '1', label: '模板一' },
          { value: '2', label: '模板二' },
          { value: '3', label: '模板三' }
        ]
      }
    }
  }

}
</script>

<style scoped>
  .light {
    color: #df1009;
  }

</style>
