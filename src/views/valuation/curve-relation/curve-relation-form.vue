<template>
  <div class="app-container">
    <el-form ref="recAddRulesForm">
      <el-form-item label="目标曲线：">
        <el-select v-model="targetValue" filterable placeholder="请选择目标曲线">
          <el-option
            v-for="item in curveList"
            :key="item.id"
            :label="item.curveName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="相对曲线：">
        <el-select v-model="relativeValue" filterable placeholder="请选择相对曲线">
          <el-option
            v-for="item in curveList"
            :key="item.id"
            :label="item.curveName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveCurveRelation, editCurveRelation, getCurveList } from '@/api/valuation/curve-relation.js'
export default {
  name: 'AddRulesForm',
  props: ['relationId', 'targetValue', 'relativeValue'],
  data() {
    return {
      curveList: [{
        curveId: '1',
        productName: '测试曲线1（AAA)'
      }, {
        curveId: '2',
        productName: '测试曲线2（AAA+)'
      }],
      method: {
      }
    }
  },
  beforeCreate() {
    // 加载曲线列表
    getCurveList().then(response => {
      const { datalist } = response
      this.curveList = datalist
    })
  },
  methods: {
    // 保存/编辑曲线关系
    save() {
      this.relationId === ''
        ? saveCurveRelation(
          { curveId: this.targetValue,
            relativeCurveId: this.relativeValue })
        : editCurveRelation(
          { oldId: this.relationId,
            curveId: this.targetValue,
            relativeCurveId: this.relativeValue }
        )
    },
    verify() {
      if (this.targetValue === '') {
        this.$message({
          type: 'warning',
          message: '请选择目标曲线'
        })
        return false
      } else if (this.relativeValue === '') {
        this.$message({
          type: 'warning',
          message: '请选择相对曲线'
        })
        return false
      } else if (this.targetValue === this.relativeValue) {
        this.$message({
          type: 'warning',
          message: '目标曲线和相对曲线不能相同'
        })
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
