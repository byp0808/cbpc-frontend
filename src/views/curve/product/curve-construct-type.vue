<template>
  <div class="margin-top">
    <el-form ref="CurveConstructType" :model="curveConstructType" label-width="300px">
      <el-form-item label="到期曲线编制许可">
        <el-radio-group v-model="curveConstructType.maturityFlag">
          <el-radio :label="1">构建</el-radio>
          <el-radio :label="2">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="即期曲线编制许可">
        <el-radio-group v-model="curveConstructType.spotFlag">
          <el-radio :label="1">构建</el-radio>
          <el-radio :label="2">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="远期曲线编制许可">
        <el-radio-group v-model="curveConstructType.forwardFlag">
          <el-radio :label="1">构建</el-radio>
          <el-radio :label="2">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name: 'CurveConstructType',
    data () {
        return {
          curveConstructType: {}
        };
    },
    methods:{
      getCurveConstructType(){
        return this.curveConstructType;
      }
    }
}
</script>

<style scoped>

</style>
