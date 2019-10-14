<template>
  <div>
    <el-form ref="form" :inline="true" size="mini" :model="form" label-width="120px">
      <el-form-item label="债券代码" prop="bondCode">
        <el-input v-model="form.bondCode" />
      </el-form-item>
      <el-form-item label="待偿期">
        <el-col :span="11">
          <el-input v-model="form.slipUp" />
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-input v-model="form.slipDown" />
        </el-col>
      </el-form-item>
      <el-form-item prop="marketYield">
        <el-checkbox-button v-model="form.marketYield" label="市场收益率(T+n)不为空" />
      </el-form-item>
      <el-form-item label="买卖点差上限" prop="diffUp">
        <el-input v-model="form.diffUp" />
      </el-form-item>
      <el-form-item label="双边范围限制" prop="rangeLimit">
        <el-input v-model="form.rangeLimit" />
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-selection">
      <el-checkbox-group v-model="selectList" size="mini">
        <el-checkbox-button v-for="row in table" :key="row" :label="row" border>{{ row }}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <quote-table v-if="selectList.filter(value => value === '双边报价').length > 0" class="table-filter" :data="multi" :limit="limit" />
    <quote-table v-if="selectList.filter(value => value === '成交报价').length > 0" class="table-filter" :data="sale" :limit="limit" />
    <quote-table v-if="selectList.filter(value => value === '经纪报价').length > 0" class="table-filter" :data="broker" :limit="limit" />
    <quote-table v-if="selectList.filter(value => value === '报价行情').length > 0" class="table-filter" :data="quote" :limit="limit" />
  </div>
</template>

<script>
import QuoteTable from './QuoteTable'
import { queryCurveKeyTerm, queryBondsMarket } from '@/api/curve/curve-build'

const tableList = ['双边报价', '成交报价', '经纪报价', '报价行情']
export default {
  components: { QuoteTable },
  props: {
    curveId: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    curveOrderId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        bondCode: '',
        slipUp: '',
        slipDown: '',
        marketYield: false,
        diffUp: '',
        rangeLimit: ''
      },
      selectList: ['双边报价'],
      table: tableList,
      multi: [],
      sale: [],
      broker: [],
      quote: [],
      limit: []
    }
  },
  created() {
    this.getList()
    queryCurveKeyTerm({ curveId: this.curveId, orderId: this.orderId }).then(response => {
      this.limit = response
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      queryBondsMarket(this.form).then(response => {
        this.list = response.dataList
        this.total = response.page.totalRecord
        this.listLoading = false
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.right {
  float: right;
}
.table-selection {
  margin: 10px 20px;
}
.table-filter {
  margin: 10px auto;
}
</style>
