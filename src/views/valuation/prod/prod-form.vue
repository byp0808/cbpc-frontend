<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-steps :active="stepActive" align-center finish-status="success" process-status="finish">
        <el-step title="基本信息" @click.native="go(0)" />
        <el-step title="选择范围" @click.native="go(1)" />
        <el-step title="选择指标" @click.native="go(2)" />
        <el-step title="估值场景" @click.native="go(3)" />
        <el-step title="批次发布指标" @click.native="go(4)" />
        <el-step title="确认产品" @click.native="go(5)" />
      </el-steps>
    </el-card>
    <el-card v-show="stepActive === 0" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>基本信息</h3>
      </div>
      <el-form ref="prodBasicForm" :model="prodInfo" :rules="rules" status-icon label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="产品名称" prop="prodName">
                <el-input v-model="prodInfo.prodName" type="text" auto-complete="off" />
              </el-form-item>
              <el-form-item label="产品状态">
                <el-select v-model="prodInfo.prodStatus" disabled placeholder="产品状态" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('CURVE_PRODUCT_STATUS')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="币种" prop="currency">
                <el-select v-model="prodInfo.currency" multiple placeholder="请选择币种" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('CURRENCY')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="基础产品" prop="prodBasic">
                <el-select v-model="prodInfo.prodBasic" placeholder="基础产品" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('VALUATION_BASE_PROD')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="上市日" prop="listingDate">
                <el-date-picker
                  v-model="prodInfo.listingDate"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  @change="listingDateChange"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
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
              <el-form-item label="停产日" prop="delistingDate">
                <el-date-picker
                  v-model="prodInfo.delistingDate"
                  prop="delistingDate"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  @change="delistingDateChange"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center">
        <!--<el-button type="primary" @click="next">下一步</el-button>-->
        <el-button type="primary" @click="saveProd('prodBasicForm')">保存</el-button>
      </div>
    </el-card>
    <el-card v-show="stepActive === 1" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>选择范围</h3>
      </div>
      <BondFilter
        ref="refBondFilter"
        :filter-id="prodInfo.bondFilterId"
      />
      <div class="text-center margin-top">
        <!--<el-button type="primary" @click="back">上一步</el-button>-->
        <!--<el-button type="primary" @click="next">下一步</el-button>-->
        <el-button type="primary" @click="saveFilter">保存</el-button>
      </div>
    </el-card>
    <el-card v-show="stepActive === 2" class="box-card margin-top">
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
      <div class="text-center margin-top">
        <!--<el-button type="primary" @click="back">上一步</el-button>-->
        <!--<el-button type="primary" @click="next">下一步</el-button>-->
        <el-button type="primary" @click="saveProdIndices">保存</el-button>
      </div>
    </el-card>
    <el-card v-show="stepActive === 3" class="box-card margin-top">
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
              border
              @selection-change="choiceWay"
            >
              <el-table-column
                type="selection"
                width="55"
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
      <div class="text-center margin-top">
        <!--<el-button type="primary" @click="back">上一步</el-button>-->
        <!--<el-button type="primary" @click="next">下一步</el-button>-->
        <el-button type="primary" @click="saveWay">保存</el-button>
      </div>
    </el-card>
    <el-card v-show="stepActive === 4" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>批次发布指标</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div>
              <el-button type="primary" @click="useChoiceBatch">应用所选批次</el-button>
              <el-button type="primary" @click="refreshBatch">刷新</el-button>
            </div>
            <el-table
              ref="batchesTable"
              class="margin-top"
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
                prop="orderName"
                label="批次"
              />
            </el-table>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-tabs type="card">
              <el-tab-pane v-for="batch in batchesChoice" :key="batch.id" :label="batch.orderName">
                <el-table
                  :data="batchProdIndices[batch.id]"
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
                        v-model="batchChoiceIndicesStatus(batch.id, row.indexId).compPermStatus"
                        active-color="#13ce66"
                        active-value="1"
                        inactive-value="0"
                        @change="compPermStatusChange(batch.id, row)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="发布许可"
                  >
                    <template slot-scope="{row}">
                      <el-switch
                        v-model="batchChoiceIndicesStatus(batch.id, row.indexId).relaPermStatus"
                        active-color="#13ce66"
                        active-value="1"
                        inactive-value="0"
                        @change="relaPermStatusChange(batch.id, row)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
      <div class="text-center margin-top">
        <!--<el-button type="primary" @click="back">上一步</el-button>-->
        <!--<el-button type="primary" @click="next">下一步</el-button>-->
        <el-button type="primary" @click="saveBatchIndices">保存</el-button>
      </div>
    </el-card>
    <el-card v-show="stepActive === 5" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>确认产品</h3>
      </div>
      <el-card
        v-for="batch in confirmBatches"
        :key="batch.id"
        class="box-card margin-top"
      >
        <div slot="header" class="clearfix card-head">
          <span>{{ batch.orderName }}</span>
          <span class="text-smaller text-placeholder">[当前债券总数: 60000]</span>
        </div>
        <el-table
          :data="confirm[batch.id].statusData"
          style="width: 100%"
        >
          <el-table-column
            v-for="(index, key) in confirm[batch.id].indices"
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
      <div class="text-center margin-top">
        <!--<el-button type="primary" @click="back">上一步</el-button>-->
        <el-button type="primary" @click="taskStart">提交审核</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveProd, confirmProd, indicesProd, detailProd, taskStart, checkProdName, getStandard } from '@/api/valuation/prod.js'
export default {
  name: 'ValuationProdForm',
  components: {
    BondFilter
  },
  data() {
    return {
      boolTrue: true,
      prodId: '',
      stepActive: 0,
      valuationWay: [],
      batchesChoiceTemp: [],
      batchesChoiceIndices: [],
      compIndices: [],
      // compIndicesResult: [],
      prodIndices: [],
      confirm: {},
      confirmBatches: [],
      basicProdList: [{
        id: 'prod-1',
        name: '基础产品1'
      },
      {
        id: 'prod-2',
        name: '基础产品2'
      }],
      calendarList: [{
        id: 'calendar-1',
        name: '编制日历1'
      },
      {
        id: 'calendar-2',
        name: '编制日历2'
      }],
      currencyList: [{
        id: 'currency-1',
        name: '币种1'
      },
      {
        id: 'currency-2',
        name: '币种2'
      }],
      detail: null,
      rules: {
        prodName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { validator: this.checkProdName, trigger: 'blur' }
        ],
        listingDate: [
          { required: true, message: '请选择上市日', trigger: 'change' },
          { validator: this.checkDate, trigger: 'change' }
        ],
        delistingDate: [
          { required: true, message: '请选择停产日', trigger: 'change' },
          { validator: this.checkDate, trigger: 'change' }
        ],
        prodBasic: [
          { required: true, message: '请选择基础产品', trigger: 'change' }
        ],
        prodMarket: [
          { required: true, message: '请选择市场', trigger: 'blur' }
        ],
        currency: [
          { type: 'array', required: true, message: '请选择至少一种币种', trigger: 'change' }
        ]
      }
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
    // compIndices: {
    //   get() {
    //     return this.$store.state.valuationProd.prodIndices.compIndices
    //   }
    // },
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
        return this.batchesChoiceIndices[arrIndex] || {}
      }
    },
    batchProdIndices() {
      console.log('batchProdIndices', this.$store.state.valuationProd.batchIndices.batchProdIndices)
      return this.$store.state.valuationProd.batchIndices.batchProdIndices
    },
    fmtIndexName() {
      return function(indexId) {
        const indices = this.$lodash.concat(this.compIndices, this.basicIndices)
        const index = this.$lodash.findIndex(indices, { id: indexId })
        if (index >= 0) {
          return indices[index].name
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
    this.initData()
    // this.getStandard()
    if (this.$store.state.valuationProd.prodId) {
      this.prodId = this.$store.state.valuationProd.prodId
      this.initDetailData()
    }
  },
  mounted() {
    this.$store.commit('valuationProd/setProdId', '')
    console.log('batchesChoice', this.batchesChoice)
  },
  methods: {
    go(index) {
      if (index === this.stepActive) {
        return false
      }
      const { valuationProd, valuationProdIndices, valuationProdMethods, bachIds } = this.detail
      if (index === 0) {
        this.initDetailData()
        this.stepActive = index
      }
      if (index === 1 && valuationProd) {
        this.stepActive = index
      }
      if (index === 2 && valuationProdIndices && valuationProdIndices.length > 0) {
        // this.initData()
        this.initDetailData()
        this.stepActive = index
      }
      if (index === 3 && valuationProdMethods && valuationProdMethods.length > 0) {
        this.initDetailData()
        this.stepActive = index
      }
      if ((index === 4 || index === 5) && bachIds && bachIds.length > 0) {
        this.initDetailData()
        this.stepActive = index
      }
    },
    getStandard() {
      getStandard({ paraType: 'BONND_CPT_INDEX' }).then(res => {
        res.map(v => {
          this.compIndices.push({ name: v.paraValue, id: v.paraName })
        })
      })
    },
    back() {
      if (this.stepActive-- < 0) this.stepActive = 5
    },
    next() {
      if (this.stepActive++ > 5) this.stepActive = 0
      this.initData()
      // if (this.prodId) {
      //   this.loadDetail()
      // }
    },
    initData() {
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

      // switch (this.stepActive) {
      //   case 0:
      //     break
      //   case 1:
      //     this.$store.dispatch('valuationProd/loadProdIndices')
      //     break
      //   case 2:
      //     const ways = []
      //     this.$lodash(this.$dict('VAL_SCENE')).forEach(function(value, key) {
      //       ways.push({
      //         id: key,
      //         name: value
      //       })
      //     })
      //     this.$store.commit('valuationProd/setValuationWay', { dataList: ways })
      //     break
      //   case 3:
      //     // this.$store.dispatch('valuationProd/loadBatches')
      //     // indicesProd(this.prodId).then(response => {
      //     //   const { dataList } = response
      //     //   that.prodIndices = dataList
      //     // })
      //     break
      //   case 4:
      //     this.$store.dispatch('valuationProd/loadBatches')
      //     if (this.prodId) {
      //       new Promise((resolve, reject) => {
      //         indicesProd(this.prodId).then(response => {
      //           const { dataList } = response
      //           that.prodIndices = dataList
      //           resolve()
      //         })
      //       })
      //     }
      //     break
      //   case 5:
      //     this.$store.dispatch('valuationProd/loadBatches')
      //     confirmProd(this.prodId).then(response => {
      //       this.confirm = response
      //     })
      //     break
      // }
      // const that = this
    },
    initDetailData() {
      const that = this
      detailProd(this.prodId).then(response => {
        that.detail = response
        that.loadDetail()
      })
    },
    loadDetail() {
      const that = this
      this.confirmBatches = []
      const { valuationProd, valuationProdIndices, valuationProdMethods, bachIds, valuationProdBatchIndices } = this.detail
      if (this.stepActive === 0 || this.stepActive === 1) {
        if (valuationProd.currency) {
          valuationProd.currency = this.$lodash.split(valuationProd.currency, ';')
        }
        that.$store.commit('valuationProd/setProdInfo', valuationProd)
      } else if (this.stepActive === 2) {
        this.getStandard()
        if (valuationProdIndices && valuationProdIndices.length > 0) {
          const compIndicesResult = []
          const basicIndicesResult = []
          this.$store.dispatch('valuationProd/loadProdIndices')
          that.$lodash.each(valuationProdIndices, function(value, key) {
            if (value.indexType === '02') {
              compIndicesResult.push(value.indexId)
            } else if (value.indexType === '01') {
              basicIndicesResult.push(value.indexId)
            }
          })
          that.$store.commit('valuationProd/setProdIndices', { compIndicesResult: compIndicesResult, basicIndicesResult: basicIndicesResult })
        } else {
          const basicIndicesResult = []
          that.$lodash.each(that.basicIndices, function(value, key) {
            basicIndicesResult.push(value.id)
          })
          that.$store.commit('valuationProd/setProdIndices', { basicIndicesResult: basicIndicesResult })
        }
      } else if (this.stepActive === 3) {
        if (valuationProdMethods && valuationProdMethods.length > 0) {
          that.$lodash.each(valuationProdMethods, function(value, key) {
            const index = that.$lodash.findIndex(that.loadValuationWay, { id: value.methodId })
            that.$refs.wayTable.toggleRowSelection(that.loadValuationWay[index], true)
          })
        } else {
          that.$lodash.each(that.loadValuationWay, function(value, key) {
            that.$refs.wayTable.toggleRowSelection(value, true)
          })
        }
      } else if (this.stepActive === 4) {
        if (bachIds && bachIds.length > 0) {
          that.$lodash.each(bachIds, function(value, key) {
            const index = that.$lodash.findIndex(that.batches, { id: value })
            if (index >= 0) {
              that.$refs.batchesTable.toggleRowSelection(that.batches[index], true)
            }
          })
          this.$store.commit('valuationProd/setBatchIndices', { batchesChoice: that.batchesChoiceTemp })
        }
        indicesProd(this.prodId).then(response => {
          const { dataList } = response
          this.prodIndices = dataList
          const prodIndices = {}
          this.$lodash.each(that.batchesChoiceTemp, function(batch, key) {
            prodIndices[batch.id] = dataList
          })
          this.$store.commit('valuationProd/setBatchProdIndices', prodIndices)
          if (valuationProdBatchIndices) {
            this.batchesChoiceIndices = valuationProdBatchIndices
          }
        })
      } else if (this.stepActive === 5) {
        if (bachIds && bachIds.length > 0) {
          that.$lodash.each(bachIds, function(value, key) {
            const index = that.$lodash.findIndex(that.batches, { id: value })
            if (index >= 0) {
              that.confirmBatches.push(that.batches[index])
            }
          })
          this.confirmBatches = this.$lodash.orderBy(this.confirmBatches, ['compTime'])
        }
        confirmProd(this.prodId).then(response => {
          this.confirm = response
        })
      }
    },
    choiceBatch(val) {
      if (val) {
        this.batchesChoiceTemp = this.$lodash.orderBy(val, ['compTime'])
      }
    },
    choiceWay(val) {
      if (val) {
        this.valuationWay = val
      }
    },
    useChoiceBatch() {
      const that = this
      this.batchesChoiceIndices = []
      this.$store.commit('valuationProd/setBatchIndices', { batchesChoice: this.batchesChoiceTemp })
      const prodIndices = {}
      this.$lodash.each(that.batchesChoiceTemp, function(batch, key) {
        prodIndices[batch.id] = that.$lodash.clone(that.prodIndices)
        // that.batchProdIndices[batch.id] = that.prodIndices
        that.$lodash.each(that.prodIndices, function(index, key) {
          const temp = {
            batchId: batch.id,
            prodId: that.prodId,
            indexId: index.indexId,
            compPermStatus: '1',
            relaPermStatus: '1'
          }
          that.batchesChoiceIndices.push(temp)
        })
      })
      this.$store.commit('valuationProd/setBatchProdIndices', prodIndices)
    },
    refreshBatch() {
      this.$store.dispatch('valuationProd/loadBatches')
      indicesProd(this.prodId).then(response => {
        const { dataList } = response
        this.prodIndices = dataList
      })
    },
    compPermStatusChange(batchId, row) {
      const compPermStatus = this.batchChoiceIndicesStatus(batchId, row.indexId).compPermStatus
      // const relaPermStatus = this.batchChoiceIndicesStatus(batchId, row.indexId).relaPermStatus
      if (compPermStatus === '0') {
        this.batchChoiceIndicesStatus(batchId, row.indexId).relaPermStatus = '0'
      }
    },
    relaPermStatusChange(batchId, row) {
      // const compPermStatus = this.batchChoiceIndicesStatus(batchId, row.indexId).compPermStatus
      const relaPermStatus = this.batchChoiceIndicesStatus(batchId, row.indexId).relaPermStatus
      if (relaPermStatus === '1') {
        this.batchChoiceIndicesStatus(batchId, row.indexId).compPermStatus = '1'
      }
    },
    save(data, msg) {
      const reqData = { step: this.stepActive + 1, prodId: this.prodId }
      this.$lodash.assign(reqData, data)
      saveProd(reqData).then(response => {
        this.prodId = response
        this.next()
        this.$message({
          showClose: true,
          message: `${msg}保存成功`,
          type: 'success'
        })
        // 保存后回调查询 更新model内的数据信息
        this.initDetailData()
      })
    },
    saveProd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const prodInfo = this.$lodash.clone(this.prodInfo)
          prodInfo.currency = this.$lodash.join(prodInfo.currency, [';'])
          this.save({ valuationProd: prodInfo }, '产品信息')
        } else {
          return false
        }
      })
    },
    saveFilter() {
      const that = this
      this.$refs.refBondFilter.getData('VAL00001').then(function(data) {
        if (data) {
          that.save({ bondFilterInfo: data }, '筛选范围')
        }
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
      console.log('333', this.compIndicesResult)
      if (!dataList || dataList.length === 0) {
        this.$message.error('请选择产品指标')
        return false
      }
      this.save({ valuationProdIndices: dataList }, '产品计算指标')
    },
    saveWay() {
      if (!this.valuationWay || this.valuationWay.length === 0) {
        this.$message.error('请选择估值场景')
        return false
      }
      const that = this
      const dataList = []
      this.$lodash.each(this.valuationWay, function(way, index) {
        const tep = {
          prodId: that.prodId,
          methodId: way.id
        }
        dataList.push(tep)
      })
      this.save({ valuationProdMethods: dataList }, '估值场景')
    },
    saveBatchIndices() {
      if (!this.batchesChoiceIndices || this.batchesChoiceIndices.length === 0) {
        this.$message.error('请选择批次计算发布指标')
        return false
      }
      this.save({ valuationProdBatchIndices: this.batchesChoiceIndices }, '批次发布指标')
    },
    taskStart() {
      taskStart({
        businessNo: this.prodId,
        businessName: '估值产品定义',
        businessRouter: 'ValuationProdTask',
        taskName: `估值产品定义-${this.prodInfo.prodName}`,
        taskType: '01'
      }).then(response => {
        this.$message({
          showClose: true,
          message: '流程提交成功',
          type: 'success'
        })
        this.$router.push({ name: 'ValuationProdList' })
      })
    },
    checkProdName(rule, value, callback) {
      var data = {
        prodName: value
      }
      if (this.prodId) {
        data.id = this.prodId
      }
      checkProdName(data).then(response => {
        if (!response) {
          callback(new Error('产品名称重复,请调整产品名称'))
        } else {
          callback()
        }
      })
    },
    checkDate(rule, value, callback) {
      const listingDate = this.prodInfo.listingDate
      const delistingDate = this.prodInfo.delistingDate
      if (listingDate && delistingDate) {
        if (this.$moment(delistingDate).isBefore(listingDate) || this.$moment(delistingDate).isSame(listingDate)) {
          callback(new Error('停产日不能早于上市日期'))
        }
      }
      callback()
    },
    listingDateChange(val) {
      // 上市日变更触发 产品状态变更
      const prodInfo = this.$store.state.valuationProd.prodInfo
      const nowDate = this.$moment(new Date()).add('year', 0).format('YYYY-MM-DD')
      if (prodInfo.delistingDate && (this.$moment(prodInfo.delistingDate).isBefore(nowDate) || this.$moment(prodInfo.delistingDate).isSame(nowDate))) {
        prodInfo.prodStatus = '3'
      } else if (this.$moment(val).isBefore(nowDate) || this.$moment(val).isSame(nowDate)) {
        prodInfo.prodStatus = '2'
      } else {
        prodInfo.prodStatus = '1'
      }
      this.$store.commit('valuationProd/setProdInfo', prodInfo)
      this.$refs['prodBasicForm'].validateField('delistingDate')
    },
    delistingDateChange(val) {
      const prodInfo = this.$store.state.valuationProd.prodInfo
      const nowDate = this.$moment(new Date()).add('year', 0).format('YYYY-MM-DD')
      if (this.$moment(val).isBefore(nowDate) || this.$moment(val).isSame(nowDate)) {
        prodInfo.prodStatus = '3'
      } else {
        this.listingDateChange(this.prodInfo.listingDate)
      }
      this.$refs['prodBasicForm'].validateField('listingDate')
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
