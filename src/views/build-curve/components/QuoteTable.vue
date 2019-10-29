<template>
  <div>
    <list
      :columns="makeColumns"
      :data="makeData"
      :selectable="makeHighLight"
      :interval="makeInterval"
      :edit-enable="true"
      @open="computePrice"
      @header-click="headerScreening"
    />
    <pagination v-show="total>100" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" :page-sizes="listQuery.pageSizes" @pagination="getList" />
    <el-dialog v-if="screeningFormVisible" width="45%" title="筛选" :visible.sync="screeningFormVisible">
      <keep-alive>
        <!--日期类型-->
        <screening-form
          v-if="formType===1"
          ref="ScreeningForm"
          :business-id="orderInfoId"
          @dateCallBack="screeningTable"
        />
        <!--数字类型-->
        <screening-num-form
          v-if="formType===2"
          ref="ScreeningNumForm"
          :business-id="orderInfoId"
          @dateCallBack="screeningTable"
        />
        <!--字符类型-->
        <screening-string-form
          v-if="formType===3"
          ref="ScreeningStringForm"
          :business-id="orderInfoId"
          @dateCallBack="screeningTable"
        />
        <!--可选类-->
        <screening-checkbox-form
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
  </div>
</template>

<script>
import List from '@/views/build-curve/components/List'
import ScreeningForm from '@/views/market/primary/screening-form'
import ScreeningNumForm from '@/views/market/primary/screening-num-form'
import ScreeningStringForm from '@/views/market/primary/screening-string-form'
import ScreeningCheckboxForm from '@/views/market/primary/screening-checkbox-form'
import Pagination from '@/components/Pagination'
import { getMean, getMedian, getMode } from '@/utils/math'

export default {
  components: { List, ScreeningForm, ScreeningNumForm, ScreeningStringForm, ScreeningCheckboxForm, Pagination },
  props: {
    header: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectable: { '收益率': ['估值日买入收益率', '市场收益率(%)'], '偏差值': ['推荐收益率偏差'] },
      intervalBy: 'MTRTY',
      selectBy: 'MTRTY',
      listQuery: {
        pageNumber: 1,
        pageSize: 100,
        pageSizes: [100, 200]
      },
      screeningFormVisible: false,
      formType: 0,
      orderInfoId: '',
      currentHeader: {},
      screeningFormList: [],
      search: []
    }
  },
  computed: {
    makeColumns() {
      const arr = []
      this.header.map((value, index) => {
        const array = Object.keys(this.selectable).filter(k => this.selectable[k].findIndex(m => m === value.colChiName) > -1)
        arr.push(array.length > 0 ? { prop: value.colName, label: value.colChiName, index, type: array[0] } : { prop: value.colName, label: value.colChiName, index })
      })
      return arr
    },
    makeHighLight() {
      return Object.keys(this.selectable).reduce((arr, k) => arr.concat(this.selectable[k]), [])
    },
    makeInterval() {
      return this.data.map(v => v[this.intervalBy]).map(value => this.limit.findIndex(i => value >= i.down && value < i.up))
    },
    makeData() {
      return this.data.map((v, i) => {
        const value = v[this.intervalBy]
        const e = this.limit.find(i => value >= i.down && value < i.up)
        return this.$lodash.assign(v, e, { index: i })
      })
    }
  },
  methods: {
    computePrice({ arr, standSlip, type, result }) {
      const flag = arr.map(value => value.row[this.selectBy]).filter((v, i, a) => a.indexOf(v, 0) === i).length > 0
      const values = arr.map(v => v.row[v.label])
      Object.assign(result, {
        standSlip: flag ? standSlip : 0 + arr[0].row[this.intervalBy],
        type: type,
        num: arr.length,
        avg: getMean(values),
        mid: getMedian(values),
        plu: getMode(values).length < 1 ? 0 : getMode(values),
        max: Math.max.apply(Math, values),
        min: Math.min.apply(Math, values)
      })
    },
    getList() {
      this.$emit('refresh-list', this.listQuery, this.search)
    },
    headerScreening(column) {
      // 表头点击事件
      // 清除筛选表单数据
      this.$store.commit('screeningDate/setScreeningDate', {})
      const key = column.property
      this.currentHeader.key = key
      this.currentHeader.label = column.label
      this.currentHeader.index = column.index

      // 判断该字段是否已进行筛选
      const index = this.screeningFormList.findIndex(value => value.headerKey === this.currentHeader.key)
      if (index !== -1) {
        const form = this.screeningFormList[index].screeningForm
        this.$store.commit('screeningDate/setScreeningDate', form)
      }

      const tab = this.header.filter(tab => tab.colName === key)
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
      // 清除筛选表单信息
      this.$store.commit('screeningDate/setScreeningDate', {})
      // 清除当前需筛选的表头信息
      this.currentHeader = {}
      // 关闭弹窗
      this.screeningFormVisible = false
    },
    screeningTable() {
      const screeningForm = this.$store.state.screeningDate.screeningForm
      // 判断该字段是否已进行筛选
      const index = this.screeningFormList.findIndex(value => value.headerKey === this.currentHeader.key)
      if (index !== -1) {
        this.screeningFormList[index].screeningForm = screeningForm
      } else {
        const screening = {}
        screening.headerKey = this.currentHeader.key
        screening.headerLabel = this.currentHeader.label
        screening.screeningForm = screeningForm
        this.screeningFormList.push(screening)
      }

      this.formatScreeningForm(this.screeningFormList)
      this.getList()
      // 清除筛选表单信息
      this.$store.commit('screeningDate/setScreeningDate', {})
      // 清除当前需筛选的表头信息
      this.currentHeader = {}
      // 关闭弹窗
      this.screeningFormVisible = false
    },
    formatScreeningForm(value) {
      // 处理筛选数据格式
      value.map(val => {
        // 判断表头类型
        const headers = this.header.filter(tab => tab.colName === val.headerKey)
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
        this.search.push(obj)
      })
    }
  }
}
</script>

<style scoped>

</style>
