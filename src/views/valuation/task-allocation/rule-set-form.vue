<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleInfo" :model="ruleInfo" label-width="150px">
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
            <el-form ref="ruleInfo" :model="ruleInfo" label-width="150px">
              <el-form-item label="规则描述">
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
        :filter-id="ruleInfo.bondFilterId"
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
      ruleInfo: {}
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryTaskRange(this.businessId).then(response => {
        this.ruleInfo = response
      })
    }
  },
  methods: {
    save() {
      const bondFilterInfo = this.$refs.refBondFilter.getData()
      const data = {
        taskRange: this.ruleInfo,
        bondFilterInfo: bondFilterInfo
      }
      addTaskRange(data).then(response => {
        this.$emit('saveCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
