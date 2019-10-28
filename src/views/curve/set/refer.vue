<template>
  <el-form ref="dataForm" :model="mainInfo" label-position="left" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="选择曲线">
          <el-select v-model="mainInfo.curveId" placeholder="请选择曲线" style="width: 200px" :disabled="curveDisabled" @change="changeCurve">
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
          <el-input :value="$moment(mainInfo.lastUpdTs).format('YYYY-MM-DD')" style="width: 200px" disabled>ßß</el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="选择参考曲线">
      <el-select ref="referCurve" v-model="referCurveId" :disabled="disabled || !(this.mainInfo.curveId)" placeholder="请选择参考曲线">
        <el-option v-for="item in selectCurveRefer" :key="item.value" :label="item.label" :value="item.value" :disabled="disabled" />
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        :disabled="disabled || !(this.mainInfo.curveId)"
        @click="curveReferAdd"
      >
        添加
      </el-button>
    </el-form-item>
    <el-table :data="curveReferList" border highlight-current-row style="width: 727px;">
      <el-table-column label="参考曲线" width="500px" align="center">
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
            @click="curveReferDelete(scope.$index, curveReferList)"
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
  queryCurveRefer,
  queryCurveReferMainInfo,
  getCurveProductIdOptions
} from '@/api/curve/curve-product-list.js'

export default {
  name: 'Refer',
  props: ['referId', 'opType'],
  data() {
    return {
      disabled: false,
      curveDisabled: false,
      mainInfo: {},
      selectCurve: [],
      selectCurveRefer: [],
      referCurveId: '',
      curveReferList: []
    }
  },
  beforeMount() {
    console.info('===beforeMount===referId:' + this.referId + ',optype:' + this.opType)

    // 先加载列表
    this.selectCurve = getCurveProductIdOptions()
    this.selectCurveRefer = getCurveProductIdOptions()

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
      if (this.referId) {
        // 查询主表信息
        await queryCurveReferMainInfo(this.referId).then(response => {
          if (response) {
            this.mainInfo = response
          }
        })
        // 查询曲线列表
        this.getCurveReferList({
          referId: this.referId
        })
      }
    },
    // 查询列表
    getCurveReferList(data) {
      queryCurveRefer(data).then(response => {
        this.curveReferList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },

    // 列表删除
    curveReferDelete(index, rows) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        rows[index]
        rows.splice(index, 1)
      }).catch(() => {
        console.info('cancle')
      })
    },

    // 选择参考曲线并添加到列表
    curveReferAdd() {
      debugger
      var referCurveId = this.referCurveId
      var label = this.$refs.referCurve.selectedLabel
      if (!referCurveId) {
        this.$message({
          type: 'error',
          message: '请选择曲线'
        })
        return false
      }
      if (referCurveId === this.mainInfo.curveId) {
        this.$message({
          type: 'error',
          message: '不可选择目标曲线本身作为参考曲线！'
        })
        return false
      }
      for (var i = 0; i < this.curveReferList.length; i++) {
        var item = this.curveReferList[i]
        if (item.referCurveId === referCurveId) {
          this.$message({
            type: 'error',
            message: '不可重复选择'
          })
          return false
        }
      }
      this.curveReferList.push({
        curveId: this.mainInfo.curveId, // 依赖曲线ID
        referCurveId: referCurveId, // 依赖曲线ID
        productName: label // 同调曲线名称
      })
    },

    obtainCurveRefer() {
      var data = {
        referMainInfo: this.mainInfo,
        curveReferList: this.curveReferList
      }
      return data
    },
    // 主体曲线
    changeCurve() {
      if (this.curveReferList && this.curveReferList.length>0) {
        this.$confirm('更改主体曲线将清空选择的参考曲线列表?', '提示', {
          type: 'warning'
        }).then(() => {
          this.curveReferList = []
          this.referCurveId = ''
        }).catch(() => {
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
