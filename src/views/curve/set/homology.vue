<template>
  <el-form ref="dataForm" :model="mainInfo" label-position="left" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="选择曲线">
          <el-select v-model="mainInfo.curveId" placeholder="请选择曲线" style="width: 200px" :disabled="curveDisabled">
            <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-show="false" label="approveStatus">
          <el-input v-model="mainInfo.approveStatus" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="最后操作人">
          <el-input v-model="mainInfo.lastUpdBy" style="width: 200px" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="最后操作时间">
          <el-input disabled style="width: 200px" :value="$moment(mainInfo.lastUpdTs).format('YYYY-MM-DD')" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="选择同调曲线" :disabled="disabled">
      <el-select ref="homologyCurve" v-model="homologyCurveId" :disabled="disabled" placeholder="请选择同调曲线">
        <el-option v-for="item in selectCurveHomology" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        :disabled="disabled"
        @click="curveHomologyAdd"
      >
        添加
      </el-button>
    </el-form-item>
    <el-table :data="curveHomologyList" border highlight-current-row style="width: 727px;">
      <el-table-column label="同调曲线" width="500px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="226px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="big"
            :disabled="disabled"
            @click="curveHomologyDelete(scope.$index, curveHomologyList)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import {
  querycurveHomology,
  querycurveHomologyMain,
  getCurveProductIdOptions
} from '@/api/curve/curve-product-list.js'

export default {
  name: 'Homology',
  props: ['homologyId', 'opType'],
  data() {
    return {
      disabled: false,
      curveDisabled: false,
      mainInfo: {},
      selectCurve: [],
      selectCurveHomology: [],
      homologyCurveId: '',
      curveHomologyList: []
    }
  },
  beforeMount() {
    console.info('===beforeMount===homologyId:' + this.homologyId + ',optype:' + this.opType)
    // 先加载列表
    this.selectCurve = getCurveProductIdOptions()
    this.selectCurveHomology = getCurveProductIdOptions()
    if (this.opType === 'VIEW') {
      this.disabled = true
    } else if (this.opType === 'EDIT') {
      this.disabled = false
    }
    if (this.opType === 'ADD') {
      this.curveDisabled = false
      this.disabled = false
    } else {
      this.curveDisabled = true
    }

    this.init()
  },
  methods: {
    async init() {

      if (this.homologyId) {
        // 查询主表信息
        await querycurveHomologyMain(this.homologyId).then(response => {
          if (response) {
            this.mainInfo = response
          }
        })
        // 查询曲线列表
        this.getCurveHomologyList({
          homologyId: this.homologyId
        })
      }
    },
    // 查询列表
    getCurveHomologyList(data) {
      this.curveHomologyList = []
      querycurveHomology(data).then(response => {
        if (response && response.dataList) {
          this.curveHomologyList = response.dataList
        }
        setTimeout(1.5 * 1000)
      })
    },

    // 列表删除
    curveHomologyDelete(index, rows) {
      rows[index]
      rows.splice(index, 1)
    },

    // 选择同调曲线并添加到列表
    curveHomologyAdd() {
      var homologyCurveId = this.homologyCurveId
      var label = this.$refs.homologyCurve.selectedLabel
      if (!homologyCurveId) {
        this.$message({
          type: 'error',
          message: '请选择曲线'
        })
        return false
      }
      for (var i = 0; i < this.curveHomologyList.length; i++) {
        var item = this.curveHomologyList[i]
        if (item.homologyCurveId === homologyCurveId) {
          this.$message({
            type: 'error',
            message: '不可重复选择'
          })
          return false
        }
      }
      this.curveHomologyList.push({
        curveId: this.mainInfo.curveId, // 依赖曲线ID
        homologyCurveId: homologyCurveId, // 依赖曲线ID
        productName: label // 同调曲线名称
      })
    },

    obtainCurveHomology() {
      var data = {
        mainInfo: this.mainInfo,
        curveHomologyList: this.curveHomologyList
      }
      return data
    }
  }
}
</script>

<style scoped>

</style>
