<template>
  <div class="app-container">
    <el-form ref="valuSchemeForm" :model="schemeInfo" label-width="130px">
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
            <el-form-item class="placeholder" label="对应估值方法">
              <span>{{ getValWay.codeValue }}</span>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <template>
        <SchemeNormal
          v-if="schemeInfo.valuScene === '01'"
          ref="SchemeNormal"
          :scheme-info="schemeInfo"
        />
        <div v-else-if="schemeInfo.valuScene === '02'">
          <el-row>
            <el-col :span="7">
              <el-form-item class="display-inline" label="回收率">
                <el-input-number v-model="recovery" size="small" :min="1" :max="10" />
                <span class="unit">%</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-form>
    <div class="text-center margin-top">
      <el-button type="primary" @click="save">保存估值方案</el-button>
    </div>
  </div>
</template>

<script>
import SchemeNormal from '@/views/valuation/scheme/scheme-normal.vue'
import { queryDictList } from '@/api/common/common.js'
import { save } from '@/api/valuation/scheme.js'
export default {
  name: 'ValuationSchemeForm',
  components: {
    SchemeNormal
  },
  data() {
    return {
      valWays: [],
      recovery: '',
      schemeInfo: {
        bondId: '12344345',
        curveId: 'curve2',
        valuScene: '01',
        marketGrade: '',
        cdsPremAdjType: '01',
        cdsPremAdjWay: '01',
        recoDire: '01'
      },
      isCover: true
    }
  },
  computed: {
    getValWay() {
      const index = this.$lodash.findIndex(this.valWays, { code: this.schemeInfo.valuScene })
      if (index >= 0) {
        return this.valWays[index]
      }
      return {}
    }
  },
  mounted() {
    queryDictList({ codetype: 'VAL_WAYS' }).then(response => {
      this.valWays = response
    })
  },
  methods: {
    save() {
      const schemeInfo = this.$refs.SchemeNormal.getData()
      schemeInfo.valuationScheme.valuScene = this.schemeInfo.valuScene
      schemeInfo.valuationScheme.bondId = this.schemeInfo.bondId
      console.log('schemeInfo', schemeInfo)
      if (schemeInfo.valuationScheme.cdsPremAdjWay === '01' && schemeInfo.valuationScheme.cdsPremAdjType === '01' && !schemeInfo.valuationScheme.spreadValue) {
        return this.$message.warning('请输入点差')
      }
      if (schemeInfo.valuationScheme.cdsPremAdjWay === '01' && schemeInfo.valuationScheme.cdsPremAdjType === '02') {
        if (!schemeInfo.spreadStart) {
          return this.$message.warning('请输入初始点差')
        }
        if (!schemeInfo.spreadEnd) {
          return this.$message.warning('请输入最终点差')
        }
        if (!schemeInfo.cdsAdjValue) {
          return this.$message.warning('请输入调整幅度')
        }
      }
      if (schemeInfo.valuationScheme.cdsPremAdjWay === '02' && !schemeInfo.valuationScheme.relaSpread) {
        return this.$message.warning('请输入相对点差')
      }
      if (!schemeInfo.valuationScheme.flAdjValue) {
        return this.$message.warning('请输入目标流动性点差')
      }
      if (!schemeInfo.valuationScheme.otAdjValue) {
        return this.$message.warning('请输入目标其他点差')
      }
      save(schemeInfo).then(response => {
        this.$message({
          showClose: true,
          message: `保存成功`,
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
