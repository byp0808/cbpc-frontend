<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="180px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="估值场景">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="覆盖所有流通场所">
              <el-switch
                v-model="value2"
                active-color="#13ce66"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <SchemeNormal />
    </el-form>
  </div>
</template>

<script>
import SchemeNormal from '@/views/valuation/scheme/scheme-normal.vue'
export default {
  name: 'ValuationSchemeForm',
  components: {
    SchemeNormal
  }
}
</script>

<style scoped>

</style>
