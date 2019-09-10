<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-steps :active="stepActive" align-center finish-status="success" process-status="finish">
        <el-step title="基本信息" />
        <el-step title="选择范围" />
        <el-step title="选择指标" />
        <el-step title="估值方法" />
        <el-step title="批次发布指标" />
        <el-step title="确认产品" />
      </el-steps>
    </el-card>
    <el-card v-if="stepActive === 0" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form :model="prodInfo" status-icon label-width="100px" class="demo-ruleForm">
              <el-form-item label="产品名称">
                <el-input v-model="prodInfo.prodName" type="text" auto-complete="off" />
              </el-form-item>
              <el-form-item label="产品状态">
                <el-select v-model="prodInfo.prodStatus" placeholder="产品状态" style="width: 100%">
                  <el-option
                    v-for="prodStatus in prodStatusList"
                    :key="prodStatus.id"
                    :label="prodStatus.name"
                    :value="prodStatus.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="退市日">
                <el-date-picker
                  v-model="prodInfo.delistingDate"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleForm2" :model="prodInfo" status-icon :rules="rules2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="基础产品">
                <el-select v-model="prodInfo.prodBasic" placeholder="基础产品" style="width: 100%">
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
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="prodInfo.currency" placeholder="请选择币种" style="width: 100%">
                  <el-option
                    v-for="currency in currencyList"
                    :key="currency.id"
                    :label="currency.name"
                    :value="currency.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleForm2" :model="prodInfo" status-icon label-width="100px" class="demo-ruleForm">
              <el-form-item label="市场">
                <el-select v-model="prodInfo.prodMarket" placeholder="请选择市场" style="width: 100%">
                  <el-option
                    v-for="market in marketList"
                    :key="market.id"
                    :label="market.name"
                    :value="market.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="编制日历">
                <el-select v-model="prodInfo.calendar" placeholder="请选择编制日历" style="width: 100%">
                  <el-option
                    v-for="calendar in calendarList"
                    :key="calendar.id"
                    :label="calendar.name"
                    :value="calendar.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" @click="saveProd">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 1" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>选择范围</h3>
      </div>
      <BondFilter
        ref="refBondFilter"
      />
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 2" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>选择指标</h3>
      </div>
      <el-transfer
        v-model="basicIndicesResult"
        class=""
        filterable="true"
        :props="{
          key: 'id',
          label: 'name'
        }"
        :titles="['估值基本信息', '估值基本信息']"
        :data="basicIndices"
      />
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
      <div class="text-center">
        <el-button type="primary" @click="saveProdIndices">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 3" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>估值方法</h3>
      </div>
      <el-table
        :data="loadValuationWay"
        tooltip-effect="dark"
        style="width:100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="id"
          label="估值方法"
          width="200"
        />
        <el-table-column
          prop="name"
          label="描述"
          width=""
        />
      </el-table>
      <div class="text-center">
        <el-button type="primary" @click="saveWay">确认</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 4" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>批次发布指标</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div>
              <el-button type="primary" @click="useChoiceBatch">应用所选批次</el-button>
              <el-button type="primary">刷新</el-button>
            </div>
            <el-table
              :data="batches"
              tooltip-effect="dark"
              style="width:100%"
              @selection-change="choiceBatch"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="batchName"
                label="批次"
              />
            </el-table>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-tabs type="card">
              <el-tab-pane v-for="batch in batchesChoice" :key="batch.batchId" :label="batch.batchName">
                <el-table
                  :data="batchProdIndices[batch.batchId]"
                  tooltip-effect="dark"
                  style="width:100%"
                >
                  <el-table-column
                    prop="name"
                    label="估值指标"
                  >
                    <template slot-scope="{row}">
                      <span>{{ fmtIndexName(row.indexId) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="计算许可"
                  >
                    <template slot-scope="{row}">
                      <el-switch
                        v-model="batchChoiceIndicesStatus(batch.batchId, row.id).compPermStatus"
                        active-color="#13ce66"
                        active-value="1"
                        inactive-value="0"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="发布许可"
                  >
                    <template slot-scope="{row}">
                      <el-switch
                        v-model="batchChoiceIndicesStatus(batch.batchId, row.id).relaPermStatus"
                        active-color="#13ce66"
                        active-value="1"
                        inactive-value="0"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" @click="saveBatchIndices">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 5" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>确认产品</h3>
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
      <div class="text-center">
        <el-button type="primary">确认</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveProd, confirmProd, indicesProd } from '@/api/valuation/prod.js'
export default {
  name: 'ValuationProdForm',
  components: {
    BondFilter
  },
  data() {
    return {
      prodId: '402835816d1a6431016d1a83bee10000',
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
        const index = this.$lodash.findIndex(this.batches, { batchId: batchId })
        return this.batches[index].batchName
      }
    }
  },
  beforeMount() {
    this.$store.dispatch('valuationProd/loadProdIndices')
  },
  methods: {
    choiceBatch(val) {
      this.batchesChoiceTemp = val
    },
    useChoiceBatch() {
      const that = this
      this.$store.commit('valuationProd/setBatchIndices', { batchesChoice: this.batchesChoiceTemp })
      this.$lodash.each(this.batchesChoiceTemp, function(batch, key) {
        that.$store.commit('valuationProd/setBatchProdIndices', { batchId: batch.batchId, prodIndices: that.$lodash.clone(that.prodIndices) })
        that.$lodash.each(that.prodIndices, function(index, key) {
          const temp = {
            batchId: batch.batchId,
            prodId: that.prodId,
            indexId: index.id,
            compPermStatus: '1',
            relaPermStatus: '1'
          }
          that.batchesChoiceIndices.push(temp)
        })
      })
    },
    next() {
      if (this.stepActive++ > 5) this.stepActive = 0
    },
    saveProd() {
      saveProd({ step: this.stepActive + 1, valuationProd: this.prodInfo }).then(response => {
        this.prodId = response
        this.next()
        this.$message({
          showClose: true,
          message: '产品信息保存成功',
          type: 'success'
        })
      })
    },
    saveProdIndices() {
      const that = this
      const dataList = []
      this.$lodash.each(this.basicIndicesResult, function(value, index) {
        const data = { prodId: that.prodId, indexId: value, indexType: '01' }
        dataList.push(data)
      })

      this.$lodash.each(this.compIndicesResult, function(value, index) {
        const data = { prodId: that.prodId, indexId: value, indexType: '02' }
        dataList.push(data)
      })

      saveProd({ step: this.stepActive + 1, prodId: that.prodId, valuationProdIndices: dataList }).then(response => {
        this.next()
        this.$store.dispatch('valuationProd/loadValuationWay')
        this.$message({
          showClose: true,
          message: '产品计算指标保存成功',
          type: 'success'
        })
      })
    },
    saveWay() {
      const that = this
      const dataList = []
      this.$lodash.each(this.loadValuationWay, function(way, index) {
        const tep = {
          prodId: that.prodId,
          methodId: way.id
        }
        dataList.push(tep)
      })
      saveProd({ step: this.stepActive + 1, prodId: that.prodId, valuationProdMethods: dataList }).then(response => {
        this.next()
        this.$store.dispatch('valuationProd/loadBatches')
        indicesProd(this.prodId).then(response => {
          const { dataList } = response
          that.prodIndices = dataList
        })
        this.$message({
          showClose: true,
          message: '估值方法保存成功',
          type: 'success'
        })
      })
    },
    saveBatchIndices() {
      const that = this
      saveProd({ step: this.stepActive + 1, prodId: that.prodId, valuationProdBatchIndices: this.batchesChoiceIndices }).then(response => {
        confirmProd(this.prodId).then(response => {
          this.confirm = response
        })
        this.next()
        this.$message({
          showClose: true,
          message: '批次发布指标保存成功',
          type: 'success'
        })
      })
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
