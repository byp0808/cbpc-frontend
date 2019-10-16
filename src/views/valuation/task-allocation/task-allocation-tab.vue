<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="任务规则" name="personnel">
      <PersonnelSetList />
    </el-tab-pane>
    <el-tab-pane label="任务范围" name="rule">
      <RuleSetList />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import PersonnelSetList from '@/views/valuation/task-allocation/personnel-set-list.vue'
import RuleSetList from '@/views/valuation/task-allocation/rule-set-list.vue'
export default {
  name: 'TaskAllocation',
  components: { RuleSetList, PersonnelSetList },
  data() {
    return {
      activeName: 'personnel'
    }
  }
}
</script>

<style scoped>

</style>
