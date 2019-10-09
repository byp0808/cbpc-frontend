<template>
  <div class="app-container">
    <div style="margin-bottom: 20px" align="right">
      <el-select v-model="moduleId" filterable placeholder="选择模板">
        <el-option
          v-for="item in modulesList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="toUse">应用</el-button>
    </div>
    <el-table
      ref="refOrderInfoTable"
      :data="marketList"
      tooltip-effect="dark"
      style="width: 100%"
      @header-click="headerScreening"
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
        @dateCallBack="dateCallBack"
      />
      <!--数字类型-->
      <ScreeningNumForm
        v-if="formType===2"
        ref="ScreeningNumForm"
        :business-id="orderInfoId"
        @dateCallBack="dateCallBack"
      />
      <!--字符类型-->
      <ScreeningStringForm
        v-if="formType===3"
        ref="ScreeningStringForm"
        :business-id="orderInfoId"
        @dateCallBack="dateCallBack"
      />
      <!--可选类-->
      <ScreeningCheckboxForm
        v-if="formType===4"
        ref="ScreeningCheckboxForm"
        :business-id="orderInfoId"
        @dateCallBack="dateCallBack"
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
      formType: 1,
      screeningFormVisible: false,
      updateFormVisible: false,
      updateForm: {
        updateContent: ''
      },
      orderInfoId: '',
      marketList: [],
      currentPageList: [],
      currentPageMarketList: [],
      currentHeader: { id: '0', key: 'orderNo', label: '批次', THType: '1' },
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
      modulesList: [
        { value: '1', label: '模板一' },
        { value: '2', label: '模板二' },
        { value: '3', label: '模板三' }
      ],
      moduleId: '',
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  computed: {

  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    cellDblclick(row, column, cell, event) {
      var title = column.property
      console.info(row[title])
      if (!row[title].isNull) {
        console.info('进来啦')
        this.updateFormVisible = true
      }
    },
    isLight(row, header) {
      // console.info('行')
      // console.info(row)
      // console.info('头')
      // console.info(header)
      if (row.remindTime === '08:20:00' && header.key === 'remindTime') {
        return true
      } else {
        return false
      }
    },
    loadTable() {
      // 初始化表数据
      // 获取用户所有模板
      // 获取默认模板表头信息及行情列表信息
      queryOrderInfoList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.page = page
        this.marketList = dataList
        this.currentPageList = dataList
      })
    },
    toUse() {
      // 应用模板
      var val = this.moduleId
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
    headerScreening(column, event) {
      // 表头点击事件
      console.info(column.property)
      var type = column.property
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
    updateCell() {
      // 确定修改方法
      var data = this.updateForm.updateContent
      alert('确定修改')
      alert(data)
      this.updateForm.updateContent = ''
      this.updateFormVisible = false
    },
    cancel() {
      // 取消筛选方法
      this.screeningFormReset()
      this.screeningFormVisible = false
    },
    updateCancel() {
      // 取消修改方法
      this.updateForm = ''
      this.updateFormVisible = false
    },
    dateCallBack() {
      // 确定筛选返回函数
      console.info('父组件')
      var screeningDate = this.$store.state.screeningDate.screeningForm
      console.info(screeningDate)
      // switch (this.formType) {
      //   case 1:
      //     console.info(this.$refs.ScreeningForm.getForm())
      //     screeningDate = this.$refs.ScreeningForm.getForm()
      //     break
      //   case 2:
      //     console.info(this.$refs.ScreeningNumForm.getForm())
      //     screeningDate = this.$refs.ScreeningNumForm.getForm()
      //     break
      //   case 3:
      //     console.info(this.$refs.ScreeningStringForm.getForm())
      //     screeningDate = this.$refs.ScreeningStringForm.getForm()
      //     break
      // }
      if (screeningDate.dateSort != null) {
        console.info(screeningDate.dateSort)
      }
      this.screeningFormVisible = false
      this.loadTable()
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
    }
  }

}
</script>

<style scoped>
  .light {
    color: #df1009;
  }

</style>
