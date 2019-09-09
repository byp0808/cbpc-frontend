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
        <el-button type="primary" @click="next">确认</el-button>
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
                  :data="batches"
                  tooltip-effect="dark"
                  style="width:100%"
                  @selection-change="choiceBatch"
                >
                  <el-table-column
                    prop="batchName"
                    label="估值指标"
                  />
                  <el-table-column
                    prop="batchName"
                    label="计算许可"
                  >
                    <template slot-scope="scope">
                      <el-checkbox v-model="checked" style="margin-left: 20px" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="batchName"
                    label="发布许可"
                  >
                    <template slot-scope="scope">
                      <el-checkbox v-model="checked" style="margin-left: 20px" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 5" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>确认产品</h3>
      </div>
      <div class="text-center">
        <el-button type="primary">确认</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveProd } from '@/api/valuation/prod.js'
export default {
  name: 'ValuationProdForm',
  components: {
    BondFilter
  },
  data() {
    return {
      stepActive: 4,
      batchesChoiceTemp: [],
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
    }
  },
  beforeMount() {
    this.$store.dispatch('valuationProd/loadProdIndices')
    this.$store.dispatch('valuationProd/loadValuationWay')
    this.$store.dispatch('valuationProd/loadBatches')
  },
  methods: {
    choiceBatch(val) {
      this.batchesChoiceTemp = val
    },
    useChoiceBatch() {
      this.$store.commit('valuationProd/setBatchIndices', { batchesChoice: this.batchesChoiceTemp })
    },
    next() {
      if (this.stepActive++ > 5) this.stepActive = 0
    },
    saveProd() {
      saveProd({ step: this.stepActive + 1, valuationProd: this.prodInfo }).then(response => {
        this.next()
        this.$message({
          showClose: true,
          message: '产品信息保存成功',
          type: 'success'
        })
      })
    },
    saveProdIndices() {
      const dataList = []
      this.$lodash.each(this.basicIndicesBasic, function(value, index) {
        const data = { prodId: '111', indexId: value, indexType: '01' }
        dataList.push(data)
      })

      this.$lodash.each(this.compIndicesComp, function(value, index) {
        const data = { prodId: '111', indexId: value, indexType: '02' }
        dataList.push(data)
      })

      saveProd({ step: this.stepActive + 1, valuationProdIndices: dataList }).then(response => {
        // this.next()
        this.$message({
          showClose: true,
          message: '产品计算指标保存成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
