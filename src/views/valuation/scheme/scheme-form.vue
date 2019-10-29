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
            <el-col :offset="6" :span="11">
              <el-upload
                class="upload-demo"
                action=""
                :before-upload="handlePreview"
                name="attach"
                :http-request="uploadFile"
                :on-exceed="handleExceed"
                :before-remove="remove"
                multiple
                :limit="1"
                accept=".xlsx,.pdf,.xls,.doc,.docx"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">上传估值判断依据</el-button>
                <div slot="tip" class="el-upload__tip">只能上传world/excel/pdf文件，且不超过1MB</div>
              </el-upload>
              <div v-if="uploadTime" class="text-smaller text-placeholder">上传时间：{{ uploadTime }}</div>
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
import { queryDictList, uploadFile } from '@/api/common/common.js'
import { basic_api_valuation } from '@/api/base-api.js'
import { save } from '@/api/valuation/scheme.js'
export default {
  name: 'ValuationSchemeForm',
  components: {
    SchemeNormal
  },
  props: {
    adjustData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      uploadUrl: `${basic_api_valuation}/scheme/upload`,
      valWays: [],
      recovery: '',
      uploadTime: '',
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
  created() {
    console.log('112', this.adjustData)
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
      if (schemeInfo.valuationScheme.cdsPremAdjWay === '01' && schemeInfo.valuationScheme.cdsPremAdjType === '01' && !schemeInfo.valuationScheme.spreadValue && schemeInfo.valuationScheme.spreadValue !== 0) {
        return this.$message.warning('请输入点差')
      }
      if (schemeInfo.valuationScheme.cdsPremAdjWay === '01' && schemeInfo.valuationScheme.cdsPremAdjType === '02') {
        if (!schemeInfo.spreadStart && schemeInfo.spreadStart !== 0) {
          return this.$message.warning('请输入初始点差')
        }
        if (!schemeInfo.spreadEnd && schemeInfo.spreadEnd !== 0) {
          return this.$message.warning('请输入最终点差')
        }
        if (schemeInfo.spreadStart >= schemeInfo.spreadEnd) {
          return this.$message.warning('最终点差应大于初始点差')
        }
        if (schemeInfo.cdsAdjValue >= (schemeInfo.spreadEnd - schemeInfo.spreadStart)) {
          return this.$message.warning('调整幅度应小于(最终点差-初始点差)')
        }
        if (!schemeInfo.cdsAdjValue && schemeInfo.cdsAdjValue !== 0) {
          return this.$message.warning('请输入调整幅度')
        }
      }
      if (schemeInfo.valuationScheme.cdsPremAdjWay === '02' && !schemeInfo.valuationScheme.relaSpread && schemeInfo.valuationScheme.relaSpread !== 0) {
        return this.$message.warning('请输入相对点差')
      }
      if (!schemeInfo.valuationScheme.flAdjValue && schemeInfo.valuationScheme.flAdjValue !== 0) {
        return this.$message.warning('请输入目标流动性点差')
      }
      if (!schemeInfo.valuationScheme.otAdjValue && schemeInfo.valuationScheme.otAdjValue !== 0) {
        return this.$message.warning('请输入目标其他点差')
      }
      if (schemeInfo.valuationScheme.spreadValue >= 99999 || schemeInfo.valuationScheme.spreadValue <= -99999) {
        return this.$message.warning('点差范围是-99999~+99999,请重新输入')
      }
      if (schemeInfo.valuationScheme.relaSpread > 100 || schemeInfo.valuationScheme.relaSpread < 0) {
        return this.$message.warning('相对点差范围是0~100,请重新输入')
      }
      if (schemeInfo.valuationScheme.flAdjValue >= 99999 || schemeInfo.valuationScheme.flAdjValue <= -99999) {
        return this.$message.warning('目标流动性点差范围是-99999~+99999,请重新输入')
      }
      if (schemeInfo.valuationScheme.otAdjValue >= 99999 || schemeInfo.valuationScheme.otAdjValue <= -99999) {
        return this.$message.warning('目标其他点差范围是-99999~+99999,请重新输入')
      }
      if (schemeInfo.valuationScheme.spreadStart >= 99999 || schemeInfo.valuationScheme.spreadStart <= -99999) {
        return this.$message.warning('初始点差范围是-99999~+99999,请重新输入')
      }
      if (schemeInfo.valuationScheme.spreadEnd >= 99999 || schemeInfo.valuationScheme.spreadEnd <= -99999) {
        return this.$message.warning('最终点差范围是-99999~+99999,请重新输入')
      }
      save(schemeInfo).then(response => {
        this.$message({
          showClose: true,
          message: `保存成功`,
          type: 'success'
        })
      })
    },
    uploadFile(data) {
      uploadFile({ file: data.file }).then(response => {
        data.onSuccess(response)
        this.uploadTime = this.$moment().format('YYYY-MM-DD')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
