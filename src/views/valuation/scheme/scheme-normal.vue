<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="grid-content">
          <el-form-item label="目标估值曲线">
            <el-select v-model="normalInfo.curveId" placeholder="请选择">
              <el-option
                v-for="curve in curveList"
                :key="curve.id"
                :label="curve.name"
                :value="curve.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="placeholder" label="推荐曲线">
            <span>{{getCurveName(recCurveName)}}</span>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-dark">
          <el-form-item label="市场隐含评级">
            <el-select v-model="normalInfo.marketGrade" placeholder="请选择" @change="marketGradeChange">
              <el-option
                v-for="(name, key) in $dict('MARKET_GRADE')"
                :key="key"
                :label="name"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="placeholder" label="存量隐含评级">
            <span>{{stockMarketGrade}}</span>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <el-form-item label="跨市场债方案同步">
          <el-switch
            v-model="isCover"
            active-color="#13ce66"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-card class="box-card margin-top">
        <div slot="header" class="clearfix card-head">
          <h3>目标信用点差调整</h3>
        </div>
        <el-form-item label="调整方式" class="display-inline">
          <el-select with="80%" size="small"  v-model="normalInfo.cdsPremAdjType" placeholder="请选择">
            <el-option
              v-for="(name, key) in $dict('ADJ_TYPE')"
              :key="key"
              :label="name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="normalInfo.cdsPremAdjType === '01'" class="display-inline" label="调整值">
          <el-input-number size="small" v-model="normalInfo.cdsAdjValue" :min="1"/>
        </el-form-item>
        <template v-else-if="normalInfo.cdsPremAdjType === '02'">
          <el-form-item label="初始点差" class="display-inline">
            <el-input-number size="small" v-model="normalInfo.cdsSpread" :min="1" :max="10" @change="handleChange" />
          </el-form-item>
          <el-form-item label="最终点差" class="display-inline">
            <el-input-number size="small" v-model="normalInfo.cdsTarget" :min="1" :max="10" @change="handleChange" />
          </el-form-item>
          <el-form-item label="调整幅度" class="display-inline">
            <el-input-number size="small" v-model="normalInfo.cdsAdjValue" :min="1" :max="10" @change="handleChange" />
          </el-form-item>
        </template>
        <el-row>
          <el-form-item label="相对点差" size="small" class="display-inline">
            <el-input-number v-model="normalInfo.relaSpread" :min="1" :max="10" @change="handleChange" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="display-inline">
            <el-button size="small" type="primary">选择市场价格</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="代偿期短">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="全价">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="净价">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="收益率">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代偿期长">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="全价">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="净价">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="收益率">
              <el-input v-model="input" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-card class="box-card margin-top">
          <div slot="header" class="clearfix card-head">
            <h3>其他点差</h3>
          </div>
          <el-form-item label="目标流动性点差">
            <el-input-number size="small" v-model="normalInfo.flAdjValue" :min="1" :max="10" @change="handleChange" />
          </el-form-item>
          <el-form-item label="目标其他点差">
            <el-input-number size="small" v-model="normalInfo.otAdjValue" :min="1" :max="10" @change="handleChange" />
          </el-form-item>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card margin-top">
          <el-form-item label="含权推荐方向">
            <el-select v-model="normalInfo.recoDire" placeholder="请选择">
              <el-option
                v-for="(name, key) in $dict('RECO_DIRE')"
                :key="key"
                :label="name"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">上传估值判断依据</el-button>
              <div slot="tip" class="el-upload__tip">只能上传world/excel/pdf文件，且不超过1MB</div>
            </el-upload>
          </el-form-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCurveList, findCurveByMarketGrade } from '@/api/valuation/scheme.js'
export default {
  name: 'ValuationSchemeNormal',
  props: {
    schemeInfo: {
      type: Object,
      required: true
    }
  },
  components: {
  },
  data() {
    return {
      isCover: true,
      recCurveName: this.schemeInfo.curveId,
      stockMarketGrade: '存量隐含评级',
      input: '',
      normalInfo: {
        curveId: this.schemeInfo.curveId,
        marketGrade: this.schemeInfo.marketGrade,
        cdsPremAdjType: this.schemeInfo.cdsPremAdjType,
        recoDire: this.schemeInfo.recoDire,
        cdsAdjValue: this.schemeInfo.cdsAdjValue,
        cdsSpread: this.schemeInfo.cdsSpread,
        cdsTarget: this.schemeInfo.cdsSpread,
        relaSpread: this.schemeInfo.relaSpread,
        flAdjValue: this.schemeInfo.flAdjValue,
        otAdjValue: this.schemeInfo.otAdjValue
      },
      curveList: []
    }
  },
  computed: {
    getCurveName() {
      return function(curveId) {
        const index = this.$lodash.findIndex(this.curveList, { id: curveId })
        return index > -1 ? this.curveList[index].name : ''
      }
    }
  },
  mounted() {
    const that = this
    getCurveList().then(response => {
      const { dataList } = response
      that.curveList = dataList
    })
  },
  methods: {
    getData() {
      return this.normalInfo
    },
    marketGradeChange(value) {
      findCurveByMarketGrade(value).then(respnse => {
        this.normalInfo.curveId = respnse
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-card.is-always-shadow {
    box-shadow: unset;
    -webkit-box-shadow: unset;
  }
</style>
