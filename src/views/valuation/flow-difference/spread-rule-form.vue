<template>
  <div class="app-container">
    <el-form label-width="150px">
      <el-row>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="规则名称">
              <el-input v-model="spreadRule.ruleName" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="点差类型">
              <el-select v-model="spreadRule.spreadType" placeholder="请选择" :disabled="disabled">
                <el-option
                  v-for="item in spreadTypes"
                  :key="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="资产规则">
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
              <el-input v-model="spreadRule.lastUpdTs" disabled />
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
        prop="marketGrad"
        label="市场隐含评级"
        width="200"
      />
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
        { key: '流动性点差', value: '流动性点差' },
        { key: '信用点差', value: '信用点差' },
        { key: '其他点差', value: '其他点差' }
      ]
    }
  },
  beforeMount() {
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
    assetsGroups().then(response => {
      this.assetsList = response
    })
    spreadParams().then(response => {
      this.allSpreadParamList = response
    })
  },
  methods: {
    save() {
      saveSomeBad({ spreadRule: this.spreadRule, spreadParamList: this.spreadRuleParamSelects }).then(response => {
        this.$emit('saveCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    handleSelectionChange(val) {
      this.spreadRuleParamSelects = val
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
