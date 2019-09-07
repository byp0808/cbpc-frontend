<template>
  <div class="app-container">
    <el-form :inline="true" label-width="150px">
      <el-form-item label="选择产品线">
        <el-select v-model="productLine" placeholder="请选择产品线">
          <el-option v-for="item in productLineList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择产品组">
        <el-select v-model="productGroup" placeholder="请选择产品组">
          <el-option v-for="item in productGroupList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择基础产品">
        <el-select v-model="product" placeholder="请选择基础产品">
          <el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CurveProductForm',
  components: {},
  data() {
    return {
      productLine: '',
      productLineList: [
        { value: 'CBP', label: '中债估值' },
        { value: 'CB', label: '中债收益率曲线' }
      ],
      productGroup: '',
      productGroupList: [],
      product: '',
      productList: [],
      form: {}
    }
  },
  watch: {
    productLine(newValue, oldValue) {
      console.info('productLine.newValue:' + newValue + ',oldValue:' + oldValue)
      this.productGroup = ''
      this.product = ''
      // 获取产品组
      this.getProductGroup(newValue)
    },
    productGroup(newValue, oldValue) {
      console.info('productGroup.newValue:' + newValue + ',oldValue:' + oldValue)
      this.product = ''
      this.getProduct(this.productLine, newValue)
    }
  },
  methods: {
    // 获取产品组
    getProductGroup(productLine) {
      if (!productLine) productLine = this.productLine
      if (productLine == 'CB') {
        this.productGroupList = [
          { value: 'CB', label: '收益率曲线' }
        ]
        this.productGroup = this.productGroupList[0].value
      } else if (productLine == 'CBP') {
        this.productGroupList = [
          { value: 'CBPB', label: '债权类估值' }
        ]
        this.productGroup = this.productGroupList[0].value
      }
    },
    // 获取基础产品
    getProduct(productLine, productGroup) {
      if (!productLine) productLine = this.productLine
      if (!productGroup) productGroup = this.productGroup
      if (productGroup == 'CB') {
        this.productList = [
          { value: '0017', label: '收益率曲线' },
          { value: '0018', label: '收益率曲线样本券' },
          { value: '0019', label: '市场利率曲线' }
        ]
        this.product = this.productList[0].value
      } else {
        this.productList = [
        ]
      }
    },
    // 保存产品
    save() {
      console.info('curve-product-form.save.data:' + JSON.stringify(this.$data))
      return this.$data
    }
  }
}
</script>

<style scoped>

</style>
