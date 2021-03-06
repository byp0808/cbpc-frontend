<template>
  <div class="app-container">
    <el-form ref="valuSchemeForm" :model="schemeInfo" label-width="115px" label-position="left" size="small">
      <el-row>
        <el-col :span="8">
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
        <template v-if="schemeInfo.valuScene === '01'">
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="目标估值曲线">
                <el-select v-model="schemeInfo.curveId" placeholder="请选择">
                  <el-option
                    v-for="curve in curveList"
                    :key="curve.id"
                    :label="curve.name"
                    :value="curve.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="placeholder" label="推荐曲线">
                <span>{{ getCurveName(recCurveName) }}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-dark">
              <el-form-item label="市场隐含评级">
                <el-select v-model="schemeInfo.marketGrade" placeholder="请选择" @change="marketGradeChange">
                  <el-option
                    v-for="(name, key) in $dict('MARKET_GRADE')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="placeholder" label="存量隐含评级">
                <span>{{ stockMarketGrade }}</span>
              </el-form-item>
            </div>
          </el-col>
        </template>
      </el-row>
      <template>
        <SchemeNormal
          v-if="schemeInfo.valuScene === '01'"
          ref="SchemeNormal"
        />
        <div v-else-if="schemeInfo.valuScene === '02'">
          <el-row>
            <el-col :span="7">
              <el-form-item class="display-inline" label="回收率">
                <el-input-number v-model="schemeInfo.recovery" size="small" :min="1" :max="10" />
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
import { getCurveList, findCurveByMarketGrade, save } from '@/api/valuation/scheme.js'
// import { get } from 'http'
export default {
  name: 'ValuationSchemeForm',
  components: {
    SchemeNormal
  },
  props: {
    taskInfo: {
      type: Object,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      uploadUrl: `${basic_api_valuation}/scheme/upload`,
      recCurveName: 'curve2',
      stockMarketGrade: '存量隐含评级',
      valWays: [],
      recovery: '',
      uploadTime: '',
      closeDialog: false,
      // schemeInfo: {
      //   bondId: '12344345',
      //   curveId: 'curve2',
      //   valuScene: '01',
      //   marketGrade: '',
      //   cdsPremAdjType: '01',
      //   cdsPremAdjWay: '01',
      //   recoDire: '01'
      // },
      isCover: true,
      curveList: []
    }
  },
  computed: {
    getValWay() {
      const index = this.$lodash.findIndex(this.valWays, { code: this.schemeInfo.valuScene })
      if (index >= 0) {
        return this.valWays[index]
      }
      return {}
    },
    getCurveName() {
      return function(curveId) {
        const index = this.$lodash.findIndex(this.curveList, { id: curveId })
        return index > -1 ? this.curveList[index].name : ''
      }
    },
    schemeInfo: {
      get() {
        return this.$store.state.scheme.schemeInfo
      },
      set(schemeInfo) {
        this.$store.commit('scheme/setSchemeInfo', schemeInfo)
      }
    },
    marketInfo: {
      get() {
        return this.$store.state.scheme.marketInfo
      },
      set(marketInfo) {
        this.$store.commit('scheme/setMarketInfo', marketInfo)
      }
    }
  },
  mounted() {
    const that = this
    getCurveList().then(response => {
      const { dataList } = response
      that.curveList = dataList
    })
    queryDictList({ codetype: 'VAL_WAYS' }).then(response => {
      this.valWays = response
    })
  },
  beforeMount() {
    if (this.taskInfo && this.taskInfo.taskId) {
      this.$store.dispatch('scheme/initScheme', this.taskInfo)
      console.log('cc', this.schemeInfo)
    }
  },
  methods: {
    save() {
      const data = { valuationScheme: this.schemeInfo }
      if (this.schemeInfo.valuScene === '01') {
        if (this.schemeInfo.cdsPremAdjWay === '01' && this.schemeInfo.cdsPremAdjType === '01' && !this.schemeInfo.spreadValue && this.schemeInfo.spreadValue !== 0) {
          return this.$message.warning('请输入点差')
        }
        if (this.schemeInfo.cdsPremAdjWay === '01' && this.schemeInfo.cdsPremAdjType === '02') {
          if (!this.schemeInfo.spreadStart && this.schemeInfo.spreadStart !== 0) {
            return this.$message.warning('请输入初始点差')
          }
          if (!this.schemeInfo.spreadEnd && this.schemeInfo.spreadEnd !== 0) {
            return this.$message.warning('请输入最终点差')
          }
          if (this.schemeInfo.spreadStart >= this.schemeInfo.spreadEnd) {
            return this.$message.warning('最终点差应大于初始点差')
          }
          if (this.schemeInfo.cdsAdjValue >= (this.schemeInfo.spreadEnd - this.schemeInfo.spreadStart)) {
            return this.$message.warning('调整幅度应小于(最终点差-初始点差)')
          }
          if (!this.schemeInfo.cdsAdjValue && this.schemeInfo.cdsAdjValue !== 0) {
            return this.$message.warning('请输入调整幅度')
          }
        }
        if (this.schemeInfo.cdsPremAdjWay === '02' && !this.schemeInfo.relaSpread && this.schemeInfo.relaSpread !== 0) {
          return this.$message.warning('请输入相对点差')
        }
        if (!this.schemeInfo.flAdjValue && this.schemeInfo.flAdjValue !== 0) {
          return this.$message.warning('请输入目标流动性点差')
        }
        if (!this.schemeInfo.otAdjValue && this.schemeInfo.otAdjValue !== 0) {
          return this.$message.warning('请输入目标其他点差')
        }
        if (this.schemeInfo.spreadValue >= 99999 || this.schemeInfo.spreadValue <= -99999) {
          return this.$message.warning('点差范围是-99999~+99999,请重新输入')
        }
        if (this.schemeInfo.relaSpread > 100 || this.schemeInfo.relaSpread < 0) {
          return this.$message.warning('相对点差范围是0~100,请重新输入')
        }
        if (this.schemeInfo.flAdjValue >= 99999 || this.schemeInfo.flAdjValue <= -99999) {
          return this.$message.warning('目标流动性点差范围是-99999~+99999,请重新输入')
        }
        if (this.schemeInfo.otAdjValue >= 99999 || this.schemeInfo.otAdjValue <= -99999) {
          return this.$message.warning('目标其他点差范围是-99999~+99999,请重新输入')
        }
        if (this.schemeInfo.spreadStart >= 99999 || this.schemeInfo.spreadStart <= -99999) {
          return this.$message.warning('初始点差范围是-99999~+99999,请重新输入')
        }
        if (this.schemeInfo.spreadEnd >= 99999 || this.schemeInfo.spreadEnd <= -99999) {
          return this.$message.warning('最终点差范围是-99999~+99999,请重新输入')
        }
        if (this.schemeInfo.cdsPremAdjWay === '03') {
        // 市场行情
          data.schemeMarket = this.marketInfo
        }
      }
      save(data).then(response => {
        this.$message({
          showClose: true,
          message: `保存成功`,
          type: 'success'
        })
        this.closeDialog = false
        this.$store.commit('scheme/setCloseDialog', { closeDialog: this.closeDialog })
      })
    },
    uploadFile(data) {
      uploadFile({ file: data.file }).then(response => {
        data.onSuccess(response)
        this.uploadTime = this.$moment().format('YYYY-MM-DD')
      })
    },
    marketGradeChange(value) {
      findCurveByMarketGrade(value).then(respnse => {
        this.normalInfo.valuationScheme.curveId = respnse
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
