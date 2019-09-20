<template>
  <div class="app-container">
    <el-form ref="valuSchemeForm" :model="schemeInfo" label-width="160px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="估值场景">
              <el-select v-model="schemeInfo.valuScene" placeholder="请选择">
                <el-option
                  v-for="(name, key) in $dict('VAL_SCENE')"
                  :key="key"
                  :label="name"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="覆盖所有流通场所">
              <el-switch
                v-model="isCover"
                active-color="#13ce66"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <SchemeNormal
        :schemeInfo="schemeInfo"
      />
    </el-form>
  </div>
</template>

<script>
import SchemeNormal from '@/views/valuation/scheme/scheme-normal.vue'
export default {
  name: 'ValuationSchemeForm',
  components: {
    SchemeNormal
  },
  data() {
    return {
      schemeInfo: {
        valuScene: '',
        marketGrade: '',
        cdsPremAdjType: '01',
        recoDire: ''
      },
      isCover: true
    }
  }
}
</script>

<style scoped>

</style>
