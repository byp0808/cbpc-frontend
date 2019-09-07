<template>
  <div class="app-container">
    目标曲线：<el-select v-model="targetValue" filterable placeholder="请选择目标曲线">
      <el-option
        v-for="item in target"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    相对曲线：<el-select v-model="relativeValue" filterable placeholder="请选择相对曲线">
      <el-option
        v-for="item in relative"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'AddRulesForm',
  data() {
    return {
      target: [{
        value: 1,
        label: '中债地方政府债收益率曲线（AAA)'
      }, {
        value: 2,
        label: '中债地方政府债收益率曲线（AAA+)'
      }],
      relative: [{
        value: 1,
        label: '中债地方政府债收益率曲线（AA-)'
      }, {
        value: 2,
        label: '中债地方政府债收益率曲线（AA+)'
      }],
      targetValue: '',
      relativeValue: ''
    }
  }
}
</script>

<style scoped>

</style>
