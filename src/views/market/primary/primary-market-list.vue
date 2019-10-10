<template>
  <div class="app-container">
    <div style="margin-bottom: 20px" align="right">
      <el-select v-model="moduleId" filterable placeholder="选择模板" @visible-change="loadModuleList">
        <el-option
          v-for="item in moduleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
    <el-dialog v-if="screeningFormVisible" width="45%" title="筛选" :visible.sync="screeningFormVisible">
      <!--日期类型-->
      <ScreeningForm
        v-if="formType===1"
        ref="ScreeningForm"
        :business-id="orderInfoId"
        @dateCallBack="screeningCallBack"
      />
      <!--数字类型-->
      <ScreeningNumForm
        v-if="formType===2"
        ref="ScreeningNumForm"
        :business-id="orderInfoId"
        @dateCallBack="screeningCallBack"
      />
      <!--字符类型-->
      <ScreeningStringForm
        v-if="formType===3"
        ref="ScreeningStringForm"
        :business-id="orderInfoId"
        @dateCallBack="screeningCallBack"
      />
      <!--可选类-->
      <ScreeningCheckboxForm
        v-if="formType===4"
        ref="ScreeningCheckboxForm"
        :business-id="orderInfoId"
        @dateCallBack="screeningCallBack"
      />
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
import ScreeningForm from '@/views/market/primary/screening-form.vue'
import ScreeningNumForm from '@/views/market/primary/screening-num-form.vue'
import ScreeningStringForm from '@/views/market/primary/screening-string-form.vue'
import ScreeningCheckboxForm from '@/views/market/primary/screening-checkbox-form.vue'
import { queryOrderInfoList } from '@/api/market/market.js'
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
      marketLoading: false,
      formType: 1,
      screeningFormVisible: false,
      updateFormVisible: false,
      updateForm: {
        updateContent: ''
      },
      orderInfoId: '',
      marketList: [],
      currentHeader: {},
      currentRow: {},
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
        { id: '8', key: 'remindTime', label: '提醒时间', THType: '8' }
      ],
      moduleList: [],
      moduleId: '',
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      screeningFormList: []
    }
  },
  computed: {

  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      // 初始化表数据
      // 获取用户所有模板
      // 获取默认模板表头信息及行情列表信息
      this.marketLoading = true
      const data = {
        moduleId: this.moduleId,
        pageNum: this.page.pageNumber,
        pageSize: this.page.pageSize,
        screeningForm: this.screeningFormList
      }
      console.info(data)
      queryOrderInfoList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.page = page
        this.marketList = dataList
        this.marketLoading = false
        // this.currentPageList = dataList
      })
    },
    toUse() {
      // 应用模板
      const val = this.moduleId
      if (val === '') {
        this.$message('请选择模板！')
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
    cellDblclick(row, column) {
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
    isLight(row, header) {
      // 判断是否高亮
      // console.info('行')
      // console.info(row)
      // console.info('头')
      // console.info(header)
      return row.remindTime === '08:20:00' && header.key === 'remindTime'
    },
    headerScreening(column) {
      // 表头右击事件
      // 取消浏览器默认右击事件
      window.event.returnValue = false
      // 清空筛选表单数据
      this.screeningFormReset()
      console.info(column.property)
      console.info(column)
      const type = column.property
      this.currentHeader.key = type
      this.currentHeader.label = column.label

      // 判断该字段是否已进行筛选
      const index = this.isScreeningByheader(this.screeningFormList)
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
    screening() {
      // 确定筛选方法
      console.info(this.formType)
      this.screeningTable()
      // switch (this.formType) {
      //   case 1:
      //     this.$refs.ScreeningForm.screening()
      //     break
      //   case 2:
      //     this.$refs.ScreeningNumForm.screening()
      //     break
      //   case 3:
      //     this.$refs.ScreeningStringForm.screening()
      //     break
      //   case 4:
      //     this.$refs.ScreeningCheckboxForm.screening()
      //     break
      // }
    },
    updateCell() {
      // 确定修改方法
      // 确定修改方法
      const content = this.updateForm.updateContent
      alert('确定修改')
      alert(content)
      const data = {
        currentHeader: this.currentHeader,
        currentRow: this.currentRow,
        content: content
      }
      console.info('一级行情表修改')
      console.info(data)

      this.updateForm.updateContent = ''
      this.currentRow = {}
      this.currentHeader = {}
      this.updateFormVisible = false
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
    screeningTable() {
      // 确定筛选返回函数
      console.info('父组件')
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
      // 清楚筛选表单信息
      this.screeningFormReset()
      // 清楚当前需筛选的表头信息
      this.currentHeader = {}
      // 关闭弹窗
      this.screeningFormVisible = false
      this.loadTable()
    },
    screeningCallBack() {
      // // 确定筛选返回函数
      // console.info('父组件')
      // const screeningForm = this.$store.state.screeningDate.screeningForm
      // // 判断该字段是否已进行筛选
      // const index = this.isScreeningByheader(this.screeningFormList)
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
    loadModuleList(val) {
      // 加载所有报价模板
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
