<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="refRuleInfo" :model="ruleInfo" label-width="150px">
              <el-form-item label="规则ID">
                <el-input v-model="ruleInfo.id" disabled />
              </el-form-item>
              <el-form-item label="最后操作人">
                <el-input v-model="ruleInfo.lastUpdBy" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="refRuleInfo" :rules="rules" :model="ruleInfo" label-width="150px">
              <el-form-item label="规则描述" prop="taskRangeName">
                <el-input v-model="ruleInfo.taskRangeName" :disabled="disabled" />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="ruleInfo.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">债券筛选器</h3>
      </div>
      <BondFilter
        ref="refBondFilter"
        :filter-id="ruleInfo.filterId"
        :disabled="disabled"
      />
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { addTaskRange, queryTaskRange } from '@/api/valuation/task-allocation.js'

export default {
  components: { BondFilter },
  props: ['businessId', 'disabled'],
  data() {
    return {
      ruleInfo: {},
      rules: {
        taskRangeName: [{ required: true, message: '请输入规则描述', trigger: 'blur' }]
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryTaskRange(this.businessId).then(response => {
        this.ruleInfo = response
      })
    } else {
      this.ruleInfo = {}
    }
  },
  methods: {
    save() {
      const that = this
      this.$refs['refRuleInfo'].validate((valid) => {
        if (valid) {
          that.$refs.refBondFilter.getData('VAL00005').then(function(data) {
            if (data) {
              const param = {
                taskRange: that.ruleInfo,
                bondFilterInfo: data
              }
              addTaskRange(param).then(response => {
                that.$emit('saveCallBack')
                that.$message({
                  message: '保存成功！',
                  type: 'success',
                  showClose: true
                })
              })
            }
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
