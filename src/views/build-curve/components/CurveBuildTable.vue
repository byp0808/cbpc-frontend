<template>
  <div class="line-table">
    <h3 class="orange">{{ name }}
      <span v-if="showButton">
        <el-button v-if="!lockStatus" size="mini" circle @click="toggleLock(true)"><svg-icon icon-class="unlock" /></el-button>
        <el-button v-else size="mini" circle @click="toggleLock(false)"><svg-icon icon-class="lock" /></el-button>
      </span>
      <span v-if="showButton" class="right">
        <el-button v-if="edit && !lockStatus" size="mini" icon="el-icon-plus" @click="dialogEnable = true">加权选点</el-button>
        <el-button v-if="edit" size="mini" type="primary" @click="confirmBuild">确认曲线</el-button>
        <el-button v-if="!edit" size="mini" type="danger" @click="refundBuild">回退</el-button>
        <el-button v-if="edit" size="mini" type="danger" @click="resetBuild">重置</el-button>
      </span>
    </h3>
    <el-table :data="makeData" size="mini" :fit="false" class="no-hover-row">
      <el-table-column label="期限" width="56" align="right" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.standSlip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选券" align="center">
        <template slot-scope="{ row }">
          <span>{{ credit ? row.bondName : row.bondNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选券期限" align="center">
        <template slot-scope="{ row }">
          <span>{{ credit && !!row.slip ? row.standSlip : row.slip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选收益率" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.yield }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选偏差值" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deviations }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同调">
        <editable-cell
          v-model="row.homology"
          slot-scope="{ row }"
          editable-component="el-select"
          size="mini"
          :name="'homology'"
          :row-data="row"
          :can-edit="editModeEnabled && !lockStatus && edit"
          close-event="change"
          @change-data="changeHomology"
        >
          <span slot="content">{{ row.homology || '-' }}</span>
          <template slot="edit-component-slot">
            <el-option value="-" label="请选择" />
            <el-option v-for="(option, index) in makeOptions(row)" :key="index" :value="option.value" :label="option.label" />
            <el-option value="" label="自定义" />
          </template>
        </editable-cell>
      </el-table-column>
      <el-table-column label="调整理由">
        <template slot-scope="{ row }">
          <span>{{ row.adjReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整幅度" align="center">
        <editable-cell
          v-model="row.adjRange"
          slot-scope="{ row }"
          size="mini"
          oninput="value = value.replace(/[^\d]/g,'')"
          :name="'adjRange'"
          :row-data="row"
          :can-edit="editModeEnabled && !lockStatus && edit"
          @change-data="changeData"
        >
          <span slot="content">{{ row.adjRange }}</span>
        </editable-cell>
      </el-table-column>
      <el-table-column label="昨天收益率" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lastYield }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整结果" align="center">
        <editable-cell
          v-model="row.adjResult"
          slot-scope="{ row }"
          size="mini"
          oninput="value = value.replace(/[^\d.]/g,'')"
          :name="'adjResult'"
          :row-data="row"
          :can-edit="editModeEnabled && !lockStatus && edit"
          @change-data="changeData"
        >
          <span slot="content">{{ row.adjResult }}</span>
        </editable-cell>
      </el-table-column>
      <el-table-column label="期限间变动" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.variations }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选字段">
        <template slot-scope="{ row }">
          <span>{{ row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showDivision" align="center" width="120">
        <template slot="header">
          <el-button size="mini" @click="historyDivision">历史分位点</el-button>
        </template>
        <template slot-scope="{ row }">
          <span>{{ row.historyDivision ? row.historyDivision + '%' : '' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="加权选点" :visible.sync="dialogEnable" @open="openDialog" @close="closeDialog">
      <el-form ref="weight" :model="weight" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="债券代码" prop="bondNo">
              <el-autocomplete
                v-model="weight.bondNo"
                class="inline-input"
                :value-key="'label'"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="债券简称" prop="bondName">
              <el-input v-model="weight.bondName" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="待偿期限" prop="slip">
              <el-input v-model="weight.slip" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曲线名称" prop="name">
              <el-input v-model="name" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级打分" prop="onePoint">
              <el-input v-model="weight.onePoint" oninput="value = value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级利率" prop="oneRate">
              <el-input v-model="weight.oneRate" oninput="value = value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级打分" prop="twoPoint">
              <el-input v-model="weight.twoPoint" oninput="value = value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级利率" prop="twoRate">
              <el-input v-model="weight.twoRate" oninput="value = value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button :disabled="makeCalcEnable" @click="calculusYield">计算加权收益率</el-button>
              <div v-if="showResult">计算结果{{ weight.yield }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button :disabled="makeCalcEnable" @click="saveWeightYield">填写至关键期限</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="自定义同调" :visible.sync="customEnabled" :fullscreen="true" @close="customHomology">
      <custom-homology
        :curve-id="curveId"
        :stand-slip="formulaRow.standSlip"
        :homology="formulaRow.homology"
        @change-formula="customHomology"
      />
    </el-dialog>
  </div>
</template>

<script>
import EditableCell from '@/views/build-curve/components/EditableCell'
import CustomHomology from '@/views/build-curve/components/CustomHomology'
import { queryCurveKeyTerm } from '@/api/curve/curve-build'
import { queryBondsAll } from '@/api/common/bond-filter'
import { add, multiply, divide } from '@/utils/math'
import { mapState } from 'vuex'

export default {
  components: { EditableCell, CustomHomology },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    curveId: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    curveOrderId: {
      type: String,
      default: ''
    },
    curveTaskId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    edit: {
      type: Boolean,
      default: false
    },
    showDivision: {
      type: Boolean,
      default: false
    },
    showButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const map = {}
    this.list.forEach(l => { map[l.standSlip] = l.homology })
    return {
      editModeEnabled: true,
      customEnabled: false,
      dialogEnable: false,
      weight: {},
      showResult: false,
      limit: [],
      homologyMap: map,
      formulaRow: {}
    }
  },
  computed: {
    ...mapState({
      lockStatus: function(state) {
        return state.curveBuild.curveStatus[this.curveId] ? state.curveBuild.curveStatus[this.curveId].lock : false
      },
      credit: function(state) {
        return state.curveBuild.curveStatus[this.curveId] ? state.curveBuild.curveStatus[this.curveId].credit : false
      }
    }),
    makeData() {
      return this.list
    },
    makeCalcEnable() {
      const l = Object.keys(this.weight).filter(value => !!this.weight[value]).length
      return l !== 7
    }
  },
  watch: {
    list: function(nl) {
      const map = {}
      nl.forEach(l => { map[l.standSlip] = l.homology })
      this.homologyMap = map
    }
  },
  mounted() {
    window.addEventListener('storage', () => {
      const obj = JSON.parse(localStorage.getItem('watchStorage'))
      if (this.credit || (!this.credit && obj.slip === obj.standSlip)) {
        if (obj.yield) {
          obj.adjResult = obj.yield
        }
        if (obj.deviations) {
          obj.adjRange = obj.deviations
        }
      }
      obj.adjReason = obj.isMultiple ? '多券选点' : '单券选点'
      obj.calcYield = !!obj.yield
      console.log(obj)
      this.$store.dispatch('curveBuild/updateData', obj)
    })
  },
  methods: {
    makeOptions(data) {
      const standSlip = '[' + data.standSlip + 'Y]'
      return this.options.filter(value => value.label !== standSlip)
    },
    changeData(name, row) {
      const obj = {}
      if (name === 'adjRange') {
        obj.adjRange = row[name] || 0
        obj.calcYield = false
        obj.standSlip = row.standSlip
        obj.curveId = this.curveId
        obj.adjReason = '手工调整'
      } else if (name === 'adjResult') {
        obj.adjResult = row[name] || 0
        obj.calcYield = true
        obj.standSlip = row.standSlip
        obj.curveId = this.curveId
        obj.adjReason = '手工调整'
      }
      this.$store.dispatch('curveBuild/updateData', obj)
    },
    changeHomology(name, row) {
      if (row.homology === '') {
        row.homology = this.homologyMap[row.standSlip] || '-'
        this.formulaRow = row
        this.customEnabled = true
        return
      }
      const obj = {}
      obj.calcYield = true
      obj.standSlip = row.standSlip
      obj.homology = !row.homology || row.homology === '' ? '-' : row.homology
      obj.curveId = this.curveId
      obj.adjReason = '混合同调'
      if (obj.homology.indexOf('?') !== -1) {
        obj.adjReason = '自定义同调'
      }
      if (/^#\[[\d.]+(Y|R|YR|BR|YBR)\]/g.test(obj.homology)) {
        obj.adjReason = '自身同调'
      }
      if (obj.homology === '-') {
        obj.adjReason = ''
      }
      this.$store.dispatch('curveBuild/updateData', obj)
    },
    historyDivision() {
      this.$emit('click-history-division')
    },
    customHomology() {
      // this.$set(this.homologyMap, data.standSlip, data.homology)
      this.customEnabled = false
    },
    openDialog() {
      queryCurveKeyTerm({ curveId: this.curveId, orderId: this.orderId }).then(response => {
        this.limit = response
      })
    },
    closeDialog() {
      this.weight = {}
      this.showResult = false
    },
    querySearch(queryString, cb) {
      const data = { curveId: this.curveId }
      if (queryString) {
        data.valAssetCode = queryString
      }
      queryBondsAll(data).then(response => {
        const results = response.map(i => {
          return { value: i.valAssetCode, label: i.valAssetCode, bondName: i.valAssetShortName, slip: i.mtrty }
        })
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },
    handleSelect(item) {
      this.weight.bondName = item.bondName
      this.weight.slip = item.slip
    },
    calculusYield() {
      if (add(this.weight.onePoint, this.weight.twoPoint) === 0) {
        this.$message({
          message: '加权数据有误，无法计算',
          center: true,
          type: 'error'
        })
        return
      }
      const _ = this.$lodash
      const temp = add(multiply(this.weight.onePoint, this.weight.oneRate), multiply(this.weight.twoPoint, this.weight.twoRate))
      this.weight.yield = _.round(divide(temp, add(this.weight.onePoint, this.weight.twoPoint)), 2)
      this.showResult = true
    },
    saveWeightYield() {
      const index = this.limit.findIndex(value => {
        return this.weight.slip >= value.down && this.weight.slip <= value.up
      })
      if (index === -1) {
        this.$message({
          message: '待偿期限不在关键期限范围之内，请重新填写',
          center: true,
          type: 'error'
        })
        return
      }
      const _ = this.$lodash
      const temp = add(multiply(this.weight.onePoint, this.weight.oneRate), multiply(this.weight.twoPoint, this.weight.twoRate))
      this.weight.yield = _.round(divide(temp, add(this.weight.onePoint, this.weight.twoPoint)), 2)
      const obj = _.merge({}, { bondNo: this.weight.bondNo, bondName: this.weight.bondName, adjReason: '加权选点', adjResult: this.weight.yield,
        itemName: '(' + this.weight.onePoint + '*' + this.weight.oneRate + '+' + this.weight.twoPoint + '*' + this.weight.twoRate + ')/(' + this.weight.onePoint + '+' + this.weight.twoPoint + ')' })
      obj.calcYield = true
      this.$store.dispatch('curveBuild/updateData', obj)
      this.dialogEnable = false
    },
    toggleLock(flag) {
      this.$store.dispatch('curveBuild/lockData', {
        curveId: this.curveId,
        orderId: this.orderId,
        curveOrderId: this.curveOrderId,
        curveTaskId: this.curveTaskId,
        lock: flag
      })
    },
    confirmBuild() {
      this.$confirm('此操作将确认曲线方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('curveBuild/confirmData', {
          curveId: this.curveId,
          orderId: this.orderId,
          curveOrderId: this.curveOrderId,
          curveTaskId: this.curveTaskId,
          callback: () => this.$message({ type: 'success', message: '确认成功!' })
        })
      })
    },
    refundBuild() {
      this.$confirm('此操作将回退曲线方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('curveBuild/refundData', {
          curveId: this.curveId,
          orderId: this.orderId,
          curveOrderId: this.curveOrderId,
          curveTaskId: this.curveTaskId,
          callback: () => this.$message({ type: 'success', message: '退回成功!' })
        })
      })
    },
    resetBuild() {
      this.$confirm('此操作将永久重置数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('reset-build')
        this.$store.dispatch('curveBuild/resetData', {
          curveId: this.curveId,
          orderId: this.orderId,
          curveOrderId: this.curveOrderId,
          curveTaskId: this.curveTaskId,
          callback: () => this.$message({ type: 'success', message: '重置成功!' })
        })
      })
    }
  }
}
</script>

<style scoped>
.line-table {
  padding: 5px;
}
.orange {
  color: #ff8901;
}
.right {
  float: right;
}
</style>
