<template>
  <div class="app-container">
    <el-form ref="refSpreadRuleForm" :rules="rules" :model="spreadRule" label-width="150px">
      <el-row>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="spreadRule.ruleName" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="点差类型" prop="spreadType">
              <el-select v-model="spreadRule.spreadType" placeholder="请选择" :disabled="disabled">
                <el-option
                  v-for="item in spreadTypes"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="资产规则" prop="assetsGroupId">
              <el-select v-model="spreadRule.assetsGroupId" placeholder="请选择" :disabled="disabled">
                <el-option
                  v-for="item in assetsList"
                  :key="item.id"
                  :label="item.ruleState"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="最后操作人">
              <el-input v-model="spreadRule.lastUpdBy" disabled />
            </el-form-item>
            <el-form-item label="最后操作时间">
              <el-input v-model="spreadRule.lastUpdTs" disabled />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="allSpreadParamList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="paramType"
        label="类型"
        width="120"
      />
      <el-table-column
        label="市场隐含评级"
        width="200"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ getMarketGrad(scope.row.marketGrad) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="期限区间"
        width="200"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ joinSpreadParam(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="spreadValue"
        label="点差"
        width="100"
      />
    </el-table>
  </div>
</template>

<script>
import { someBad, saveSomeBad, assetsGroups, spreadParams } from '@/api/valuation/flow.js'
export default {
  name: 'SpreadRuleForm',
  props: ['businessId', 'disabled'],
  data() {
    return {
      spreadRule: {},
      spreadParamSelects: [], // 已选中点差列表
      allSpreadParamList: [], // 所有规则列表
      assetsList: [], // 资产组列表
      spreadTypes: [
        { key: '01', value: '流动性点差', disabled: false },
        { key: '02', value: '信用点差', disabled: true },
        { key: '03', value: '其他点差', disabled: true }
      ],
      rules: {
        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        spreadType: [{ required: true, message: '请选择点差类型', trigger: 'change' }],
        assetsGroupId: [{ required: true, message: '请选择资产规则', trigger: 'change' }]
      }
    }
  },
  beforeMount() {
    assetsGroups().then(response => {
      this.assetsList = response
    })
    spreadParams().then(response => {
      this.allSpreadParamList = response
    }).then(res => {
      if (this.businessId) {
        someBad(this.businessId).then(response => {
          const { spreadRule, spreadParamList } = response
          this.spreadRule = spreadRule
          this.spreadParamSelects = spreadParamList
          // 使点差参数列表处于选中状态
          if (this.spreadParamSelects) {
            this.spreadParamSelects.forEach(row => {
              const index = this.$lodash.findIndex(this.allSpreadParamList, { id: row.id })
              this.$refs.multipleTable.toggleRowSelection(this.allSpreadParamList[index], true)
            })
          }
        })
      }
    })
  },
  methods: {
    save() {
      this.$refs['refSpreadRuleForm'].validate((valid) => {
        if (valid) {
          if (this.spreadParamSelects.length !== 0) {
            saveSomeBad({ spreadRule: this.spreadRule, spreadParamList: this.spreadParamSelects }).then(response => {
              this.$emit('saveCallBack')
              this.$message({
                message: '保存成功！',
                type: 'success',
                showClose: true
              })
            })
          } else {
            this.$message({
              message: '请勾选点差参数！',
              type: 'error',
              showClose: true
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getMarketGrad(marketGrad) {
      switch (marketGrad) {
        case '01': return 'AAA'
        case '02': return 'AAA-'
        case '03': return 'AA'
        case '04': return 'AA'
      }
    },
    handleSelectionChange(val) {
      this.spreadParamSelects = val
    },
    joinSpreadParam(row) {
      var result = '( ' + row.rangeStart + ', ' + row.rangeEnd + 'y ]'
      return result
    }
  }
}
</script>

<style scoped>

</style>
