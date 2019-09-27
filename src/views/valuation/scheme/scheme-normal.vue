<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="grid-content">
          <el-form-item label="目标估值曲线">
            <el-select v-model="normalInfo.valuationScheme.curveId" placeholder="请选择">
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
            <el-select v-model="normalInfo.valuationScheme.marketGrade" placeholder="请选择" @change="marketGradeChange">
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
        <el-form-item label="调整方式">
          <el-select size="small" v-model="normalInfo.valuationScheme.cdsPremAdjWay" placeholder="请选择">
            <el-option
              v-for="(name, key) in $dict('ADJ_WAY')"
              :key="key"
              :label="name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <template>
          <div v-show="normalInfo.valuationScheme.cdsPremAdjWay === '01'">
            <el-form-item label="调整类型" class="display-inline">
              <el-select with="80%" size="small"  v-model="normalInfo.valuationScheme.cdsPremAdjType" placeholder="请选择">
                <el-option
                  v-for="(name, key) in $dict('ADJ_TYPE')"
                  :key="key"
                  :label="name"
                  :value="key"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="normalInfo.valuationScheme.cdsPremAdjType === '01'" class="display-inline" label="点差">
              <el-input-number size="small" v-model="normalInfo.valuationScheme.spreadValue"/>
            </el-form-item>
            <template v-else-if="normalInfo.valuationScheme.cdsPremAdjType === '02'">
              <el-form-item label="初始点差" class="display-inline">
                <el-input-number size="small" v-model="normalInfo.spreadStart" @change="handleChange" />
              </el-form-item>
              <el-form-item label="最终点差" class="display-inline">
                <el-input-number size="small" v-model="normalInfo.spreadEnd" @change="handleChange" />
              </el-form-item>
              <el-form-item label="调整幅度" class="display-inline">
                <el-input-number size="small" v-model="normalInfo.cdsAdjValue" @change="handleChange" /><span class="unit">/批</span>
              </el-form-item>
            </template>
            <el-row>
              <el-button @click="spreadTrial" size="small" type="primary" style="margin: 0 0 20px 0">试算</el-button>
              <el-table
                :data="normalInfo.schemeSpreads"
                border
                size="mini"
                ref="spreadTable01"
              >
                <el-table-column
                  width="55">
                  <template slot-scope="{ row, $index }">
                    <el-radio v-model="selectSpreadVal" :label="$index" @change="selectSpread">&nbsp</el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ttmValue"
                  label="待尝期">
                </el-table-column>
                <el-table-column
                  prop="relaSpread"
                  label="相对点差"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="dprice"
                  label="全价">
                </el-table-column>
                <el-table-column
                  prop="cprice"
                  label="净价">
                </el-table-column>
                <el-table-column
                  prop="yield"
                  label="收益率">
                </el-table-column>
                <el-table-column
                  prop="recoDire"
                  label="公式库推荐">
                </el-table-column>
              </el-table>
            </el-row>
          </div>
          <div v-show="normalInfo.valuationScheme.cdsPremAdjWay === '02'">
            <el-form-item label="相对点差" class="display-inline">
              <el-input-number size="small" v-model="normalInfo.valuationScheme.relaSpread" :min="1"/><span class="unit">%</span>
            </el-form-item>
            <el-row>
              <el-button size="small" type="primary" style="margin: 0 0 20px 0">试算</el-button>
              <el-table
                :data="normalInfo.valuationScheme.schemeSpread"
                border
                size="mini"
                ref="spreadTable02"
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="待尝期"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="绝对点差"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="全价">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="净价">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="收益率">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="公式库推荐">
                </el-table-column>
              </el-table>
            </el-row>
          </div>
          <div v-show="normalInfo.valuationScheme.cdsPremAdjWay === '03'">
            <el-row>
              <div style="margin: 30px 0 20px 0">
                <el-button size="small" type="">选择市场价格</el-button>
                <el-button @click="spreadTrial" size="small" type="primary">试算</el-button>
              </div>
              <el-table
                :data="normalInfo.valuationScheme.schemeSpread"
                size="mini"
                border
                ref="spreadTable03"
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="待尝期">
                </el-table-column>
                <el-table-column
                  prop="dPrice"
                  label="全价">
                  <template slot-scope="{ row }">
                    <el-input size="mini" class="no-border" v-model="row.id"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="cPrice"
                  label="净价">
                  <template slot-scope="{ row }">
                    <el-input size="mini" class="no-border" v-model="row.id"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="yield"
                  label="收益率">
                  <template slot-scope="{ row }">
                    <el-input size="mini" class="no-border" v-model="row.id"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="绝对点差">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="相对点差 %">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="公式库推荐">
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </template>
      </el-card>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="18">
        <el-card class="box-card margin-top">
          <el-form-item class="display-inline" label="目标流动性点差">
            <el-input-number size="small" v-model="normalInfo.valuationScheme.flAdjValue" @change="handleChange" />
          </el-form-item>
          <el-form-item class="display-inline" label="目标其他点差">
            <el-input-number size="small" v-model="normalInfo.valuationScheme.otAdjValue" @change="handleChange" />
          </el-form-item>
          <el-form-item class="display-inline" label="含权推荐方向">
            <el-select v-model="normalInfo.valuationScheme.recoDire" placeholder="请选择">
              <el-option
                v-for="(name, key) in $dict('RECO_DIRE')"
                :key="key"
                :label="name"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card margin-top">
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCurveList, findCurveByMarketGrade, spreadTrial } from '@/api/valuation/scheme.js'
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
      selectSpreadVal: 1,
      normalInfo: {
        spreadStart: this.schemeInfo.spreadStart,
        spreadEnd: this.schemeInfo.spreadEnd,
        cdsAdjValue: this.schemeInfo.cdsAdjValue,

        valuationScheme: {
          curveId: this.schemeInfo.curveId,
          marketGrade: this.schemeInfo.marketGrade,
          cdsPremAdjType: this.schemeInfo.cdsPremAdjType,
          cdsPremAdjWay: this.schemeInfo.cdsPremAdjWay,
          recoDire: this.schemeInfo.recoDire,
          relaSpread: this.schemeInfo.relaSpread,
          flAdjValue: this.schemeInfo.flAdjValue,
          otAdjValue: this.schemeInfo.otAdjValue,
          spreadValue: this.schemeInfo.otAdjValue
        },
        schemeSpreads: this.schemeInfo.schemeSpread
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
    selectSpread(index) {
      this.normalInfo.schemeSpreads[index].status = '1'
    },
    spreadTrial() {
      spreadTrial().then(response => {
        const { dataList } = response
        this.normalInfo.schemeSpreads = dataList
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
  .el-card.is-always-shadow {
    box-shadow: unset;
    -webkit-box-shadow: unset;
  }
</style>
