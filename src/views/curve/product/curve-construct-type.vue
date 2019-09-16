<template>
  <div class="margin-top">
    <el-form ref="productInfo" :model="productInfo" label-width="300px">
      <el-form-item label="到期曲线编制许可">
        <el-radio-group v-model="productInfo.maturityFlag">
          <el-radio :key="1" label="1">构建</el-radio>
          <el-radio :key="2" label="2">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="即期曲线编制许可">
        <el-radio-group v-model="productInfo.spotFlag">
          <el-radio :key="1" label="1">构建</el-radio>
          <el-radio :key="2" label="2">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="远期曲线编制许可">
        <el-radio-group v-model="productInfo.forwardFlag">
          <el-radio :key="1" label="1">构建</el-radio>
          <el-radio :key="2" label="2">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CurveConstructType',
  props: ['productInfo'],
  data() {
    return {

    }
  },
  beforeMount() {
    console.info('construct-type'+ JSON.stringify(this.productInfo))
  },
  methods: {
    getCurveConstructType() {
      return this.productInfo
    }
  }
}
</script>

<style scoped>

</style>
