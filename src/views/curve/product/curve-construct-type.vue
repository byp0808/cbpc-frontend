<template>
  <div class="margin-top">
    <el-form ref="productInfo" :model="productInfo" label-width="300px">
      <el-form-item label="到期曲线编制许可">
        <el-radio-group v-model="productInfo.maturityFlag" :disabled="disabled">
          <el-radio :key="1" label="Y">构建</el-radio>
          <el-radio :key="2" label="N">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="即期曲线编制许可">
        <el-radio-group v-model="productInfo.spotFlag" :disabled="spotDisable">
          <el-radio :key="1" label="Y">构建</el-radio>
          <el-radio :key="2" label="N">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="远期曲线编制许可">
        <el-radio-group v-model="productInfo.forwardFlag" :disabled="forwardFlagDisable">
          <el-radio :key="1" label="Y">构建</el-radio>
          <el-radio :key="2" label="N">不构建</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CurveConstructType',
  props: ['productInfo','disabled'],
  data() {
    return {
      spotDisable: false,
      forwardFlagDisable: false,
    }
  },
  beforeMount() {
    console.info('construct-type'+ JSON.stringify(this.productInfo))
    this.disableCheck()
  },
  computed: {

  },
  watch: {
    'productInfo.rateType'(newVal, oldVal) {
      this.disableCheck()
    },
    'productInfo.maturityFlag'(newVal, oldVal) {
      this.disableCheck()
    },
    'productInfo.spotFlag'(newVal, oldVal) {
      this.disableCheck()
    }
  },
  methods: {
    //
    disableCheck() {
      // 如果是浮动利率，只允许选择 到期构建
      // 如果没有选择构建到期，则不允许选择 即期、远期，默认为不构建
      if (this.productInfo.rateType === '01') {
        this.spotDisable = false
        this.forwardFlagDisable = false
      }
      if (this.productInfo.rateType === '02' || this.productInfo.maturityFlag === 'N') {
        this.productInfo.spotFlag = 'N'
        this.productInfo.forwardFlag = 'N'
        this.spotDisable = true
        this.forwardFlagDisable = true
      } else if (this.productInfo.spotFlag === 'N') { // 如果即期为不构建，则远期不允许选择，默认为不构建
        this.productInfo.forwardFlag = 'N'
        this.forwardFlagDisable = true
      }
      if (this.disabled) {
        this.spotDisable = true
        this.forwardFlagDisable = true
      }
    },
    getCurveConstructType() {
      return this.productInfo
    }
  }
}
</script>

<style scoped>

</style>
