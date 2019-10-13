<template>
  <div class="app-container">
    <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form :model="prodInfo" status-icon label-width="100px" class="demo-ruleForm">
              <el-form-item label="产品名称">
                <el-input v-model="prodInfo.prodName" type="text" auto-complete="off" :disabled="boolTrue" />
              </el-form-item>
              <el-form-item label="产品状态">
                <el-select v-model="prodInfo.prodStatus" placeholder="产品状态" style="width: 100%" :disabled="boolTrue">
                  <el-option
                    v-for="(name, key) in $dict('CURVE_PRODUCT_STATUS')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="prodInfo.currency" multiple placeholder="请选择币种" style="width: 100%" :disabled="boolTrue">
                  <el-option
                    v-for="(name, key) in $dict('CURRENCY')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleForm2" :model="prodInfo" status-icon label-width="100px" class="demo-ruleForm">
              <el-form-item label="基础产品">
                <el-select v-model="prodInfo.prodBasic" placeholder="基础产品" style="width: 100%" :disabled="boolTrue">
                  <el-option
                    v-for="basicProd in basicProdList"
                    :key="basicProd.id"
                    :label="basicProd.name"
                    :value="basicProd.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="上市日">
                <el-date-picker
                  v-model="prodInfo.listingDate"
                  :disabled="boolTrue"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleForm2" :model="prodInfo" status-icon label-width="100px" class="demo-ruleForm">
              <el-form-item label="编制日历">
                <el-select v-model="prodInfo.calendar" placeholder="请选择编制日历" style="width: 100%" :disabled="boolTrue">
                  <el-option
                    v-for="calendar in calendarList"
                    :key="calendar.id"
                    :label="calendar.name"
                    :value="calendar.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="停产日">
                <el-date-picker
                        v-model="prodInfo.delistingDate"
                        :disabled="boolTrue"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>选择范围</h3>
      </div>
      <BondFilter
        ref="refBondFilter"
        :disabled="boolTrue"
        :filter-id="prodInfo.bondFilterId"
      />
    </el-card>
    <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>选择指标</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="12" :offset="6">
          <div class="grid-content bg-purple">
            <el-transfer
              v-model="basicIndicesResult"
              class=""
              :filterable="boolTrue"
              :props="{
                key: 'id',
                label: 'name'
              }"
              :titles="['估值基本信息', '估值基本信息']"
              :data="basicIndices"
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="margin-top">
        <el-col :span="12" :offset="6">
          <div class="grid-content bg-purple">
            <el-transfer
              v-model="compIndicesResult"
              class=""
              :props="{
                key: 'id',
                label: 'name'
              }"
              :titles="['估值指标', '估值指标']"
              :data="compIndices"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>估值场景</h3>
      </div>
      <el-row :gutter="20" class="margin-top">
        <el-col :span="12" :offset="6">
          <div class="grid-content bg-purple">
            <el-table
              ref="wayTable"
              :data="loadValuationWay"
              tooltip-effect="dark"
              style="width:100%"
            >
              <el-table-column
                type="selection"
                width="55"
                :selectable="checkSelectable"
              />
              <el-table-column
                prop="name"
                label="估值场景"
                width="200"
              />
              <el-table-column
                prop=""
                label="描述"
                width=""
              />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>批次发布指标</h3>
      </div>
      <el-card
        v-for="(batch, key) in confirm"
        :key="key"
        class="box-card margin-top"
      >
        <div slot="header" class="clearfix card-head">
          <span>{{ fmtBatchName(key) }}</span>
        </div>
        <el-table
          :data="batch.statusData"
          style="width: 100%"
        >
          <el-table-column
            v-for="(index, key) in batch.indices"
            :key="key"
            :prop="index"
            :label="fmtIndexName(index)"
            align="center"
          >
            <template slot-scope="{row}">
              <i v-if="row[index] === '1'" style="color: #13ce66" class="el-icon-success" />
              <i v-else-if="row[index] === '0'" style="color: #ff4949" class="el-icon-error" />
              <span v-else="">{{ row[index] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { confirmProd, indicesProd, detailProd } from '@/api/valuation/prod.js'
export default {
  name: 'ValuationProdForm',
  components: {
    BondFilter
  },
  props: ['businessNo'],
  data() {
    return {
      boolTrue: true,
      boolFalse: false,
      prodId: '',
      stepActive: 0,
      batchesChoiceTemp: [],
      batchesChoiceIndices: [],
      prodIndices: [],
      confirm: {},
      basicProdList: [{
        id: 'prod-1',
        name: '基础产品1'
      },
      {
        id: 'prod-2',
        name: '基础产品2'
      }],
      marketList: [{
        id: 'market-1',
        name: '市场1'
      },
      {
        id: 'market-2',
        name: '市场2'
      }],
      calendarList: [{
        id: 'calendar-1',
        name: '编制日历1'
      },
      {
        id: 'calendar-2',
        name: '编制日历2'
      }],
      prodStatusList: [{
        id: 'prodStatus-1',
        name: '产品状态1'
      },
      {
        id: 'prodStatus-2',
        name: '产品状态2'
      }],
      currencyList: [{
        id: 'currency-1',
        name: '币种1'
      },
      {
        id: 'currency-2',
        name: '币种2'
      }]
    }
  },
  computed: {
    prodInfo: {
      get() {
        return this.$store.state.valuationProd.prodInfo
      },
      set(prodInfo) {
        this.$store.commit('valuationProd/setProdInfo', prodInfo)
      }
    },
    basicIndices: {
      get() {
        return this.$store.state.valuationProd.prodIndices.basicIndices
      }
    },
    compIndices: {
      get() {
        return this.$store.state.valuationProd.prodIndices.compIndices
      }
    },
    basicIndicesResult: {
      get() {
        return this.$store.state.valuationProd.prodIndices.basicIndicesResult
      },
      set(basicIndicesResult) {
        this.$store.commit('valuationProd/setProdIndices', { basicIndicesResult: basicIndicesResult })
      }
    },
    compIndicesResult: {
      get() {
        return this.$store.state.valuationProd.prodIndices.compIndicesResult
      },
      set(compIndicesResult) {
        this.$store.commit('valuationProd/setProdIndices', { compIndicesResult: compIndicesResult })
      }
    },
    loadValuationWay: {
      get() {
        return this.$store.state.valuationProd.valuationWay.dataList
      }
    },
    batches: {
      get() {
        return this.$store.state.valuationProd.batchIndices.batches
      }
    },
    batchesChoice: {
      get() {
        return this.$store.state.valuationProd.batchIndices.batchesChoice
      }
    },
    batchChoiceIndicesStatus() {
      return function(batchId, indexId) {
        const arrIndex = this.$lodash.findIndex(this.batchesChoiceIndices, { batchId: batchId, indexId: indexId })
        return this.batchesChoiceIndices[arrIndex]
      }
    },
    batchProdIndices: {
      get() {
        return this.$store.state.valuationProd.batchIndices.batchProdIndices
      }
    },
    fmtIndexName() {
      return function(indexId) {
        const index = this.$lodash.findIndex(this.compIndices, { id: indexId })
        if (index >= 0) {
          return this.compIndices[index].name
        } else {
          return ''
        }
      }
    },
    fmtBatchName() {
      return function(batchId) {
        const index = this.$lodash.findIndex(this.batches, { id: batchId })
        return this.batches[index].orderName
      }
    }
  },
  beforeMount() {
    const that = this
    if (this.$store.state.valuationProd.prodId || this.businessNo) {
      this.prodId = this.$store.state.valuationProd.prodId || this.businessNo
    }
    this.$store.dispatch('valuationProd/loadProdIndices')
    this.$store.dispatch('valuationProd/loadProdIndices')
    const ways = []
    this.$lodash(this.$dict('VAL_SCENE')).forEach(function(value, key) {
      ways.push({
        id: key,
        name: value
      })
    })
    this.$store.commit('valuationProd/setValuationWay', { dataList: ways })
    this.$store.dispatch('valuationProd/loadBatches')
    indicesProd(this.prodId).then(response => {
      const { dataList } = response
      that.prodIndices = dataList
    })
    detailProd(this.prodId).then(response => {
      const { valuationProd, valuationProdIndices, valuationProdMethods } = response
      if (valuationProd.currency) {
        valuationProd.currency = this.$lodash.split(valuationProd.currency, ';')
      }
      that.$store.commit('valuationProd/setProdInfo', valuationProd)
      this.initWays(valuationProdIndices)
      that.$lodash.each(valuationProdMethods, function(value, key) {
        const index = that.$lodash.findIndex(that.loadValuationWay, { id: value.methodId })
        that.$refs.wayTable.toggleRowSelection(that.loadValuationWay[index], true)
      })
    })
    confirmProd(this.prodId).then(response => {
      this.confirm = response
    })
  },
  mounted() {
    this.$store.commit('valuationProd/setProdId', '')
  },
  methods: {
    initWays(valuationProdIndices) {
      const compIndicesResult = []
      const basicIndicesResult = []
      this.$store.dispatch('valuationProd/loadProdIndices', true)
      this.$lodash.each(valuationProdIndices, function(value, key) {
        if (value.indexType === '02') {
          compIndicesResult.push(value.indexId)
        } else if (value.indexType === '01') {
          basicIndicesResult.push(value.indexId)
        }
      })
      this.$store.commit('valuationProd/setProdIndices', { compIndicesResult: compIndicesResult, basicIndicesResult: basicIndicesResult })
    },
    checkSelectable(row) {
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-card__body .el-card.is-always-shadow {
    box-shadow: unset;
    -webkit-box-shadow: unset;
  }
</style>
