<template>
  <div class="app-container">
    <el-card ref="recAddRulesForm" class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form ref="ruleInfo" :model="curveRelationInfo" label-width="120px">
              <el-form-item label="曲线关系ID">
                <el-input v-model="curveRelationInfo.id" disabled />
              </el-form-item>
              <el-form-item label="最后操作人">
                <el-input v-model="curveRelationInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="curveRelationInfo.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form ref="ruleInfo" :model="curveRelationInfo" :rules="rules" label-width="120px">
              <el-form-item label="估值曲线：" prop="curveId">
                <el-select v-model="curveRelationInfo.curveId" filterable placeholder="请选择估值曲线" :disabled="disabled">
                  <el-option
                    v-for="item in curveList"
                    :key="item.curveId"
                    :label="item.productName"
                    :value="item.curveId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="相对曲线：" prop="relativeCurveId">
                <el-select v-model="curveRelationInfo.relativeCurveId" filterable placeholder="请选择相对曲线" :disabled="disabled">
                  <el-option
                    v-for="item in curveList"
                    :key="item.curveId"
                    :label="item.productName"
                    :value="item.curveId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { saveCurveRelation, getCurveList, queryCurveRelation } from '@/api/valuation/curve-relation.js'
export default {
  name: 'AddRulesForm',
  props: ['relationId', 'disabled', 'isCopy'],
  data() {
    var validateEnd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择相对曲线！'))
      } else if (this.curveRelationInfo.relativeCurveId === value) {
        callback(new Error('估值曲线和相对曲线不能相同！'))
      } else {
        callback()
      }
    }
    return {
      curveList: [],
      curveRelationInfo: {
        curveId: '',
        relativeCurveId: ''
      },
      rules: {
        curveId: [{ required: true, message: '请选择估值曲线！', trigger: 'change' }],
        relativeCurveId: [{ required: true, validator: validateEnd, trigger: 'change' }]
      },
      copyRelation: { // 复制新增
        targetValue: '',
        relativeValue: ''
      }
    }
  },
  beforeMount() {
    getCurveList().then(response => {
      this.curveList = response
    })
    if (this.relationId) {
      queryCurveRelation(this.relationId).then(response => {
        this.curveRelationInfo = response
        if (this.isCopy) {
          this.curveRelationInfo.Id = ''
        }
      })
    } else {
      this.curveRelationInfo = {}
    }
  },
  methods: {
    // 保存/编辑曲线关系
    save() {
      this.$refs['ruleInfo'].validate((valid) => {
        if (valid) {
          saveCurveRelation(this.curveRelationInfo).then(response => {
            this.$emit('saveCallBack')
            this.$message({
              message: '保存成功！',
              type: 'success',
              showClose: true
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
