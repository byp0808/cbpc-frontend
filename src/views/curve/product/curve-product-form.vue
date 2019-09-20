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
import { optioins } from '@/api/curve/code-type.js'

export default {
  name: 'CurveProductForm',
  components: {},
  data() {
    return {
      productLine: '',
      productGroup: '',
      productGroupList: [],
      product: '',
      productList: [],
      form: {}
    }
  },
  computed: {
    productLineList() {
      // 加载产品线
      return optioins(this, 'PRODUCT_LINE')
    }
  },
  watch: {
    productLine(newValue, oldValue) {
      console.info('productLine.newValue:' + newValue + ',oldValue:' + oldValue)
      this.productGroup = ''
      this.product = ''
      // 获取产品组
      this.getProductGroup(newValue)

      if (this.productGroupList.length > 0) {
        this.productGroup = this.productGroupList[0].value
      }
    },
    productGroup(newValue, oldValue) {
      console.info('productGroup.newValue:' + newValue + ',oldValue:' + oldValue)
      this.product = ''
      this.getProduct(this.productLine, newValue)

      if (this.productList.length > 0) {
        this.product = this.productList[0].value
      }
    }
  },
  methods: {
    // 获取产品组
    getProductGroup(productLine) {
      console.info('===getProductGroup productLine:' + productLine)
      if (!productLine) productLine = this.productLine
      this.productGroupList = optioins(this, 'PRODUCT_GROUP', productLine)
    },
    // 获取基础产品
    getProduct(productLine, productGroup) {
      console.info('===getProduct productLine:' + productLine + ',productGroup:' + productGroup)
      if (!productLine) productLine = this.productLine
      if (!productGroup) productGroup = this.productGroup

      this.productList = optioins(this, 'BASE_PRD_CODE', productGroup)
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
