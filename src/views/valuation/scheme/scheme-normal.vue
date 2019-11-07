<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card margin-top">
          <el-form-item label="目标信用点差" class="display-inline">
            <el-select v-model="schemeInfo.cdsPremAdjWay" size="small" placeholder="请选择">
              <el-option
                v-for="(name, key) in $dict('ADJ_WAY')"
                :key="key"
                :label="name"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="schemeInfo.cdsPremAdjWay === '01'" label-width="0" class="display-inline">
            <el-select v-model="schemeInfo.cdsPremAdjType" with="80%" size="small" placeholder="请选择">
              <el-option
                v-for="(name, key) in $dict('ADJ_TYPE')"
                :key="key"
                :label="name"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="schemeInfo.cdsPremAdjWay === '02'" label-width="0" class="display-inline">
            <el-input-number v-model="schemeInfo.relaSpread" size="small" /><span class="unit">%</span>
          </el-form-item>
          <el-button v-show="schemeInfo.cdsPremAdjWay === '03'" size="small" @click="selectPrice">选择市场价格</el-button>
          <div v-show="schemeInfo.cdsPremAdjWay === '03'">
            <div style="background:#fafafa;padding:5px 10px">
              <el-form-item label-width="0">
                <el-radio v-model="marketInfo.ttmType" label="01">行权</el-radio>
                <el-radio v-model="marketInfo.ttmType" label="02">非行权</el-radio>
              </el-form-item>
              <el-form-item label="待偿期" class="display-inline">
                <el-input v-model="marketInfo.ttmValue" :disabled="true" />
              </el-form-item>
              <el-form-item label="净价" class="display-inline" style="margin-left:10px">
                <el-input v-model="marketInfo.cPrice" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="全价" class="display-inline">
                <el-input v-model="marketInfo.dPrice" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="收益率" class="display-inline" style="margin-left:10px">
                <el-input v-model="marketInfo.yield" placeholder="请输入内容" />
              </el-form-item>
            </div>
          </div>
          <template>
            <div v-show="schemeInfo.cdsPremAdjWay === '01'">
              <template v-if="schemeInfo.cdsPremAdjType === '01'">
                <el-form-item class="display-inline" label="">
                  <el-input-number v-model="schemeInfo.spreadValue" size="small" :min="-99999" :max="99999" @blur="convertSpread" />
                </el-form-item>
                <el-tag type="info">相对点差:</el-tag>
              </template>
              <template v-else-if="schemeInfo.cdsPremAdjType === '02'">
                <el-form-item label="初始" class="display-inline" prop="spreadStart">
                  <el-input-number v-model="schemeInfo.spreadStart" size="small" :min="-99999" :max="99999" @change="handleChange" />
                </el-form-item>
                <el-form-item label="调整幅度" class="display-inline">
                  <el-input-number v-model="schemeInfo.cdsAdjValue" size="small" @change="handleChange" /><span class="unit">BP/批</span>
                </el-form-item>
                <el-form-item label="最终" class="display-inline">
                  <el-input-number v-model="schemeInfo.spreadEnd" size="small" :min="-99999" :max="99999" @change="handleChange" />
                </el-form-item>
                <el-tag type="info">相对点差:</el-tag>
              </template>
            </div>
            <el-form-item label="目标流动性点差">
              <el-input-number v-model="schemeInfo.flAdjValue" size="small" :min="-99999" :max="99999" @change="handleChange" />
            </el-form-item>
            <el-form-item label="目标其他点差">
              <el-input-number v-model="schemeInfo.otAdjValue" size="small" :min="-99999" :max="99999" @change="handleChange" />
            </el-form-item>
            <el-button size="small" type="primary" style="margin: 0 0 20px 0" @click="spreadTrial">试算</el-button>
          </template>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card margin-top" style="border:0">
          <div v-show="schemeInfo.cdsPremAdjWay === '01'">
            <el-row>
              <el-table
                ref="spreadTable01"
                :data="trialResult"
                size="mini"
              >
                <el-table-column
                  width="55"
                >
                  <template slot-scope="{ row, $index }">
                    <el-radio v-model="selectSpreadVal" :label="$index" @change="selectSpread">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ttmValue"
                  label="待偿期"
                />
                <el-table-column
                  prop="dprice"
                  label="全价"
                />
                <el-table-column
                  prop="cprice"
                  label="净价"
                />
                <el-table-column
                  prop="yield"
                  label="收益率"
                />
                <el-table-column
                  prop="recoDire"
                  label="推荐"
                />
              </el-table>
            </el-row>
          </div>
          <div v-show="schemeInfo.cdsPremAdjWay === '02'">
            <el-row>
              <el-table
                ref="spreadTable02"
                :data="trialResult"
                size="mini"
              >
                <el-table-column
                  prop="date"
                  label="待偿期"
                  width="180"
                />
                <el-table-column
                  prop="address"
                  label="全价"
                />
                <el-table-column
                  prop="address"
                  label="净价"
                />
                <el-table-column
                  prop="address"
                  label="收益率"
                />
                <el-table-column
                  prop="address"
                  label="推荐"
                />
              </el-table>
            </el-row>
          </div>
          <div v-show="schemeInfo.cdsPremAdjWay === '03'">
            <el-row>
              <el-table
                ref="spreadTable03"
                :data="trialResult"
                size="mini"
              >
                <el-table-column
                  prop="date"
                  label="待偿期"
                />
                <el-table-column
                  prop="dPrice"
                  label="全价"
                >
                  <template slot-scope="{ row }">
                    <el-input v-model="row.id" size="mini" class="no-border" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="cPrice"
                  label="净价"
                >
                  <template slot-scope="{ row }">
                    <el-input v-model="row.id" size="mini" class="no-border" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="yield"
                  label="收益率"
                >
                  <template slot-scope="{ row }">
                    <el-input v-model="row.id" size="mini" class="no-border" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="推荐"
                />
              </el-table>
            </el-row>
          </div>
          <el-row class="margin-top" style="text-align:right">
            <el-form-item class="display-inline" label="跨市场债方案同步">
              <el-switch
                v-model="isCover"
              />
            </el-form-item>
            <el-form-item label-width="10" class="display-inline">
              <el-select v-model="schemeInfo.recoDire" placeholder="请选择">
                <el-option
                  v-for="(name, key) in $dict('RECO_DIRE')"
                  :key="key"
                  :label="name"
                  :value="key"
                />
              </el-select>
            </el-form-item>
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
            <div v-if="showTime" class="uploadTime">上传时间：{{ updateTime }}</div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog append-to-body :visible.sync="marketDialog" width="1100px">
      <scheme-market :market-info="marketInfo" />
      <el-row>
        <el-col :span="2" :offset="22">
          <el-button @click="marketDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import SchemeMarket from '@/views/valuation/scheme/scheme-market.vue'
import { getCurveList, findCurveByMarketGrade, spreadTrial, convertSpread } from '@/api/valuation/scheme.js'
import { basic_api_valuation } from '@/api/base-api.js'
import { upload } from '../../../utils/file-request'
// import { get } from 'http'
export default {
  name: 'ValuationSchemeNormal',
  components: {
    SchemeMarket
  },
  data() {
    return {
      isCover: true,
      recCurveName: '',
      uploadUrl: `${basic_api_valuation}/scheme/upload`,
      stockMarketGrade: '存量隐含评级',
      selectSpreadVal: 1,
      updateTime: '',
      fileList: [],
      showTime: false,
      trialResult: [],
      curveList: [],
      marketDialog: false
    }
  },
  computed: {
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
    console.log(this.schemeInfo)
    const that = this
    getCurveList().then(response => {
      const { dataList } = response
      that.curveList = dataList
    })
  },
  methods: {
    getData() {
      // return this.normalInfo
    },
    selectSpread(index) {
      // this.normalInfo.schemeSpreads[index].status = '1'
    },
    selectPrice() {
      this.marketDialog = true
    },
    convertSpread() {
      convertSpread(this.schemeInfo).then(response => {
        console.log(response)
      })
    },
    // changePower(e) {
    //   this.schemeInfo.recoDire = e
    // },
    uploadFile(data) {
      // const date = new Date()
      // const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + date.getHours() + ':' + date.getMinutes()
      // this.fileList.push({ name: `${data.file.name}-${today}` })
      const form = new FormData()
      form.append('data', data.file)
      upload({
        url: this.uploadUrl,
        data: form
      }).then(response => {
        data.onSuccess(response)
        const date = new Date()
        this.showTime = true
        this.updateTime = this.$moment(date).format('YYYY-MM-DD')
      })
    },
    handleExceed() {
      this.$message.warning('当前只能上传1个文件')
    },
    remove(e) { // 移除上传时间
      if (e.status === 'success') {
        this.showTime = false
      }
    },
    handlePreview(data) {
      console.log('data', data)
      if (data.size > 8388608) {
        this.$message.warning('上传的文件应小于1M')
        return false
      }
    },
    handleChange(e) {

    },
    spreadTrial() {
      if (this.schemeInfo.cdsPremAdjWay === '01') {
        if (this.schemeInfo.cdsPremAdjType === '01' && !this.schemeInfo.spreadValue) {
          this.$message.warning('请填写点差')
          return false
        }
        if (this.schemeInfo.cdsPremAdjType === '02' && !this.schemeInfo.spreadStart) {
          this.$message.warning('请填写初始点差')
          return false
        }
        if (this.schemeInfo.cdsPremAdjType === '02') {
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
      }
      spreadTrial().then(response => {
        const { dataList } = response
        this.normalInfo.schemeSpreads = dataList
      })
    },
    marketGradeChange(value) {
      findCurveByMarketGrade(value).then(respnse => {
        this.schemeInfo.curveId = respnse
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
 .uploadTime {
   font-size: 12px;
   color: #999;
   margin-top: 10px;
 }
</style>
