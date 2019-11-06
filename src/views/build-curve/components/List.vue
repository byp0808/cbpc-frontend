<template>
  <div>
    <el-table
      :data="data"
      size="mini"
      border
      class="no-hover-row"
      :header-cell-class-name="headerHighLight"
      :cell-class-name="rowInterval"
      @cell-click="cellClick"
      @cell-dblclick="cellDbClick"
      @header-click="headerClick"
    >
      <template v-for="col in columns">
        <slot :name="col.slot">
          <component
            :is="col.component"
            v-if="col.component"
            :column="col"
          />
          <el-table-column v-else v-bind="col" align="right" header-align="center" :class-name="col.className" />
        </slot>
      </template>
    </el-table>
    <el-dialog title="价格选择辅助决策指标" :visible.sync="dialogFlag" @open="openDialog" @close="closeDialog">
      <el-form ref="compute" :model="compute" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="待偿期" prop="standSlip">
              <el-input v-model="compute.standSlip" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值类型" prop="type">
              <el-input v-model="compute.type" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择格" prop="num">
              <el-input v-model="compute.num" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="均值(1)" prop="avg">
              <el-input v-model="compute.avg" v-focus readonly @keyup.49.native="saveData('avg')" @dblclick.native="saveData('avg')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中位数(2)" prop="mid">
              <el-input v-model="compute.mid" readonly @keyup.50.native="saveData('mid')" @dblclick.native="saveData('mid')" />
            </el-form-item>
          </el-col>
          <el-col v-for="(p, i) in compute.plu" :key="i" :span="12">
            <el-form-item label="众数(3)" prop="plu">
              <el-input v-model="compute.plu[i]" readonly @keyup.51.native="saveData('plu', i)" @dblclick.native="saveData('plu', i)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大值(4)" prop="max">
              <el-input v-model="compute.max" readonly @keyup.52.native="saveData('max')" @dblclick.native="saveData('max')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值(5)" prop="min">
              <el-input v-model="compute.min" readonly @keyup.53.native="saveData('min')" @dblclick.native="saveData('min')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
let time = null
let time_dia = null
export default {
  directives: {
    focus(el, _, { context }) {
      context.$nextTick(() => {
        el.querySelector('input').focus()
      })
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Array,
      default: () => []
    },
    interval: {
      type: Array,
      default: () => []
    },
    editEnable: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    slip: {
      type: String,
      default: ''
    },
    curveId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      highLight: [],
      selected: [], // 多选使用，用于保存选择项
      selectedType: '', // 多选使用，选中类型
      selectedTerm: '', // 多选使用，选中关键期限
      selectedByRadio: [], // 单选使用，用于保存选择项
      compute: {},
      dialogFlag: false
    }
  },
  computed: {
    headerHighLight() {
      const s = this.selectable
      return function({ column }) {
        return s.indexOf(column.label) !== -1 ? 'red' : ''
      }
    },
    rowInterval() {
      const i = this.interval
      const h = this.highLight
      return function({ rowIndex, columnIndex }) {
        if (h && h.length > 0 && h[rowIndex][columnIndex]) {
          return 'high-light'
        } else if (i[rowIndex] !== i[rowIndex + 1]) {
          return 'row-red'
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    data: function(newlist) {
      this.highLight = newlist.map(v => Array(Object.keys(v).length).fill(false))
    }
  },
  created() {
    this.makeHighLight()
  },
  methods: {
    makeHighLight() {
      this.highLight = this.data.map(v => Array(Object.keys(v).length).fill(false))
    },
    cellClick(row, column) {
      if (!this.editEnable) {
        return
      }
      if (this.selectable.indexOf(column.label) === -1) {
        return
      }
      if (this.interval[row.index] === -1) {
        return
      }
      if (this.selectedType !== '' && this.selectedType !== column.type) {
        return
      }
      if (this.selectedTerm !== '' && this.selectedTerm !== row.standSlip) {
        return
      }
      if (this.selectedByRadio.length > 0) {
        return
      }
      let _row = this.highLight[row.index]
      const flag = _row[column.index]
      if (!flag) {
        this.selectedType = column.type
        this.selectedTerm = row.standSlip
      }
      if (this.$lodash.findIndex(this.selected, (value) => value.standSlip === row.standSlip) === -1) {
        this.interval.map((v, i) => {
          if (v === this.interval[row.index]) {
            this.$set(this.highLight, i, Array(this.highLight[i].length).fill(false))
          }
        })
        _row = Array(Object.keys(_row).length).fill(false)
      }
      _row[column.index] = !flag
      this.$set(this.highLight, row.index, _row)
      clearTimeout(time)
      time = setTimeout(() => {
        // 高亮
        // 价格计算 {standSlip: 0, value: 0, bond: 0, slip: 0}
        if (flag) {
          this.$lodash.pullAllWith(this.selected, [{ standSlip: row.standSlip, label: column.label, property: column.property, row }], this.$lodash.isEqual)
          if (this.selected.length === 0) {
            this.selectedType = ''
            this.selectedTerm = ''
            clearTimeout(time_dia)
          }
        } else {
          this.selected.push({ standSlip: row.standSlip, label: column.label, property: column.property, row })
        }
      }, 300)
      // 价格辅助Dialog
      clearTimeout(time_dia)
      time_dia = setTimeout(() => {
        if (this.selected.filter(value => value.standSlip === row.standSlip).length > 0) {
          this.dialogFlag = true
        }
      }, 1300)
    },
    cellDbClick(row, column) {
      if (!this.editEnable) {
        return
      }
      if (this.selectable.indexOf(column.label) === -1) {
        return
      }
      if (this.interval[row.index] === -1) {
        return
      }
      if (this.selected.length > 0) {
        return
      }
      clearTimeout(time)
      clearTimeout(time_dia)
      let _row = this.highLight[row.index]
      const flag = _row[column.index]
      this.interval.map((v, i) => {
        if (v === this.interval[row.index]) {
          this.$set(this.highLight, i, Array(this.highLight[i].length).fill(false))
        }
      })
      _row = Array(Object.keys(_row).length).fill(false)
      _row[column.index] = !flag
      this.$set(this.highLight, row.index, _row)
      if (flag) {
        this.selectedByRadio.pop()
      } else {
        this.selectedByRadio.push({ standSlip: row.standSlip, label: column.label, property: column.property, row })
      }
      this.$lodash.pullAllBy(this.selected, [{ standSlip: row.standSlip }], 'standSlip')
      this.selectedType = ''
      this.selectedTerm = ''
      const item = this.$lodash.assign({}, {
        bondNo: row.bondId,
        bondName: row.bondName,
        standSlip: row.standSlip,
        slip: row[this.slip],
        curveId: this.curveId,
        itemName: column.label,
        itemNameEng: column.property,
        itemType: this.type,
        liveFlag: '0',
        isMultiple: false
      }, (column.type === '收益率' ? { yield: row[column.property] } : { deviations: row[column.property] }))
      if (!flag) {
        this.resetSetItem('watchStorage', JSON.stringify(item))
      }
    },
    openDialog() {
      const arr = this.selected.filter(value => value.standSlip === this.selectedTerm)
      const compute = {}
      this.$emit('open', { arr, standSlip: this.selectedTerm, type: this.selectedType, result: compute })
      this.compute = compute
    },
    closeDialog() {
      this.compute = {}
    },
    saveData(v, i) {
      let value = this.compute[v]
      if (i >= 0) {
        value = value[i]
      }
      const arr = this.selected.filter(value => value.standSlip === this.selectedTerm)
      const obj = this.selectedType === '收益率' ? { yield: value } : { deviations: value }
      this.dialogFlag = false
      const standSlip = this.compute.standSlip
      const label = arr.map(e => e.label).filter((t, i, a) => a.indexOf(t, 0) === i).join(',')
      const property = arr.map(e => e.property).filter((t, i, a) => a.indexOf(t, 0) === i).join(',')
      const flag = arr.map(value => value.row.bondId).filter((v, i, a) => a.indexOf(v, 0) === i).length > 0
      const item = this.$lodash.assign({}, {
        slip: standSlip,
        standSlip: arr[0].standSlip,
        curveId: this.curveId,
        itemName: label,
        itemNameEng: property,
        itemType: this.type,
        liveFlag: '0',
        isMultiple: true
      }, obj, { bondNo: flag ? null : arr[0].bondId, bondName: flag ? null : arr[0].bondName })
      this.resetSetItem('watchStorage', JSON.stringify(item))
    },
    headerClick(columns) {
      if (!this.editEnable) {
        return
      }
      this.$emit('header-click', columns)
    }
  }
}
</script>

<style scoped>

</style>
