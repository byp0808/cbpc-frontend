<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增规则</el-button>
      <el-button type="primary" @click="toggleSelection()">复制新增</el-button>
    </div>
    <el-table
      ref="refRecCureTable"
      :data="recCurveList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="id"
        label="估值曲线规则ID"
        show-overflow-tooltip
        width="145"
      />
      <el-table-column
        prop="ruleName"
        label="估值曲线规则描述"
        show-overflow-tooltip
        width="165"
      />
      <el-table-column
        prop="bondFilterId"
        label="详细信息"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ ruleDetail(scope.row.bondFilterId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="curveId"
        label="估值曲线"
        width="260"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ curveName(scope.row.curveId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="approveStatus"
        label="复核状态"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="操作"
        width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="mvToBlackList(scope.$index, bondListAll)"
          >
            停用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="recCurveFormVisible" width="92%" title="新增估值曲线推荐规则" :visible.sync="recCurveFormVisible">
      <RecCurveForm
        ref="refRecCurveForm"
        :rec-curve-data="recCurveData"
        :business-id="recCureId"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="recCurveFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RecCurveForm from '@/views/valuation/rec-cure/rec-curve-form.vue'
import { queryRecCurveList } from '@/api/valuation/rec-curve.js'
export default {
  name: 'RecCurveList',
  components: {
    RecCurveForm
  },
  data() {
    return {
      recCurveFormVisible: false,
      recCureId: '',
      recCurveList: [],
      curveList: [],
      bondFilterList: [],
      recCurveData: {}
    }
  },
  computed: {
    curveName() {
      return function(curveId) {
        const index = this.$lodash.findIndex(this.curveList, { curveId: curveId })
        if (index >= 0) {
          return this.$lodash.get(this.curveList, [index, 'curveName'])
        }
      }
    },
    ruleDetail() {
      return function(bondFilterId) {
        const ruleList = this.$lodash.get(this.bondFilterList, bondFilterId)
        let ruleDetail = ''
        this.$lodash.forEach(ruleList, function(value, key) {
          ruleDetail += value.ruleCode + ' = ' + value.ruleValue
          if (key < ruleList.length - 1) {
            ruleDetail += ', '
          }
        })
        return ruleDetail
      }
    }
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      queryRecCurveList().then(response => {
        const { valuationCurves, curveList, ruleDetail } = response
        this.recCurveList = valuationCurves
        this.curveList = curveList
        this.bondFilterList = ruleDetail
      })
    },
    save() {
      this.$refs.refRecCurveForm.save()
    },
    toDetail(id) {
      this.recCureId = id
      this.recCurveFormVisible = true
    },
    toAdd() {
      this.$store.commit('recCurve/setRecCurveInfo', {})
      // this.$store.commit('bondFilter/clearBondFilterId')
      this.recCurveFormVisible = true
    },
    saveCallBack() {
      this.recCurveFormVisible = false
      this.loadTable()
    }
  }
}
</script>

<style scoped>

</style>
