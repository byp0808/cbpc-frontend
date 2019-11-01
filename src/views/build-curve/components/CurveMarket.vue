<template>
  <div>
    <div class="table-selection">
      <el-checkbox-group v-model="selectList" size="mini">
        <el-checkbox-button v-for="row in table" :key="row" :label="row" border>{{ row }}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <quote-table
      v-if="selectList.filter(value => value === '成交报价').length > 0"
      class="table-filter"
      :header="saleTableHeader"
      :data="sale.list"
      :total="sale.total"
      :limit="limit"
      @refresh-list="getSaleList"
    />
    <quote-table
      v-if="selectList.filter(value => value === '报价行情').length > 0"
      class="table-filter"
      :header="quoteTableHeader"
      :data="quote.list"
      :total="quote.total"
      :limit="limit"
      @refresh-list="getQuoteList"
    />
  </div>
</template>

<script>
import QuoteTable from '@/views/build-curve/components/QuoteTable'
import { queryCurveKeyTerm } from '@/api/curve/curve-build'
import { queryMarketData } from '@/api/market/market'

const tableList = ['成交报价', '报价行情']
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
    },
    quoteTableHeader: {
      type: Array,
      default: () => []
    },
    saleTableHeader: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectList: ['成交报价', '报价行情'],
      table: tableList,
      sale: {
        list: [],
        total: 0
      },
      quote: {
        list: [],
        total: 0
      },
      limit: []
    }
  },
  created() {
    this.getSaleList()
    this.getQuoteList()
    queryCurveKeyTerm({ curveId: this.curveId, orderId: this.orderId }).then(response => {
      this.limit = response
    })
  },
  methods: {
    getQuoteList(page, search) {
      const searchParam = search || []
      searchParam.push({ colName: 'CURVE_ID', colType: 'String', operator: 'EQ', value: this.curveId })
      const _data = {
        page: page || { pageNumber: 1, pageSize: 100 },
        dataMarket: '02',
        showArea: '01',
        searchParam: searchParam
      }
      queryMarketData(_data).then(response => {
        this.quote.list = response.dataList
        this.quote.total = response.page.totalRecord
      })
    },
    getSaleList(page, search) {
      const searchParam = search || []
      searchParam.push({ colName: 'CURVE_ID', colType: 'String', operator: 'EQ', value: this.curveId })
      const _data = {
        page: page || { pageNumber: 1, pageSize: 100 },
        dataMarket: '02',
        showArea: '02',
        searchParam: searchParam
      }
      queryMarketData(_data).then(response => {
        this.sale.list = response.dataList
        this.sale.total = response.page.totalRecord
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
