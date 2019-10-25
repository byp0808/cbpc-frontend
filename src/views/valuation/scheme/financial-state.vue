<template>
  <div>
    <h3>财务报表</h3>
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <div style="margin-top:10px;margin-bottom:20px">
        <el-button v-if="!showForm" type="primary" @click="isDisplay(activeName)">展开</el-button>
        <el-button v-else type="primary" @click="isDisplay">收起</el-button>
      </div>
      <el-form v-show="showForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="报告期">
              <el-select v-model="parmas.report" placeholder="请选择" @change="changeReport">
                <el-option-group
                  v-for="report in reportList"
                  :key="report.value"
                  :label="report.label"
                  :value="report.value"
                >
                  <el-option
                    v-for="item in report.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间范围">
              <el-select v-model="parmas.limitTime" placeholder="请选择" @change="changeTime">
                <el-option
                  v-for="item in timeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位">
              <el-select v-model="parmas.symbol" placeholder="请选择" @change="changeSymbol">
                <el-option
                  v-for="item in symbolList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button type="primary" plain @click="reducePoint">减少小位数</el-button>
              <el-button type="primary" plain @click="addPoint">增加小位数</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="币种" label-width="53px">
              <el-select v-model="parmas.moneyType" placeholder="请选择" @change="changeMoney">
                <el-option-group
                  v-for="group in moneyList"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序" label-width="63px">
              <el-select v-model="parmas.sortes" placeholder="请选择" @change="changeSort">
                <el-option
                  v-for="item in sortList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="2">
            <el-button type="primary" @click="isDisplay">收起/展开</el-button>
          </el-col> -->
        </el-row>
      </el-form>
      <el-tab-pane label="利率表摘要" name="01">
        <el-table
          v-loading="allLoading.a"
          :data="interestList"
          style="width: 100%"
          max-height="300"
          :header-cell-style="{background:'#eee'}"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="营业总收入" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="营业总成本" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="营业利润" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润总额" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="归属母公司股东的净利润" align="center" width="230px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="非经常性损益" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扣非后归属母公司股东的净利润" align="center" width="230px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="研发支出" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="EBIT" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="EBITDA" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="资产负债表摘要" name="02">
        <el-table
          v-loading="allLoading.b"
          :data="debtList"
          style="width: 100%"
          max-height="300"
          :header-cell-style="{background:'#eee'}"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="流动资产" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="长期股权投资" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="资产总计" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="流动负债" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="非流动负债" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负债合计" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="股东权益" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="归属母公司股东的权益" align="center" width="230px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同比(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="资本公积金" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="盈余公积金" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="未分配利润" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="现金流量表摘要" name="03">
        <el-table
          v-loading="allLoading.c"
          :data="crushList"
          style="width: 100%"
          max-height="300"
          :header-cell-style="{background:'#eee'}"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="流动资产" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售商品提供劳务收到的现金" align="center" width="250px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="经营活动现金净流量" align="center" width="220px">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="购建固定无形长期资产支付的现金" align="center" width="260px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="投资支付的现金" align="center" width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="投资活动现金净流量" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="吸收投资收到的现金" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="取得借款收到的现金" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="筹资活动现金净流量" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="现金净增加额" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="期末现金余额" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="折旧与摊销" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="关键比率" name="04">
        <el-table
          v-loading="allLoading.d"
          :data="keyRateList"
          style="width: 100%"
          max-height="300"
          :header-cell-style="{background:'#eee'}"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="ROE(摊薄)(%)" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="ROE(加权)(%)" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扣非后ROE(摊薄)(%)" align="center" width="200px">
            <template slot-scope="scope">
              <span>{{ scope.row.filterId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="ROA(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="ROIC(%)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售毛利率(%)" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售净利率(%)" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="EBIT Margin" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="EBITDA Margin(%)" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="资产负债率(%)" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="资产周转率(倍)" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售商品和劳务收到现金/营业收入(%)" align="center" width="260px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="每股指标" name="05">
        <el-table
          v-loading="allLoading.e"
          :data="everyIndexList"
          style="width: 100%"
          max-height="300"
          :header-cell-style="{background:'#eee'}"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="EPS(基本)" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="EPS(稀释)" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="EPS(摊薄)" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扣非后EPS(基本)" align="center" width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="每股净资产BPS" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="每股销售额SPS" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售净利率(%)" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="每股经营现金流OCFPS" align="center" width="180px">
            <template slot-scope="scope">
              <span>{{ scope.row.cause }}</span>
            </template>
          </el-table-column>
          <el-table-column label="每股现金净流量CFPS" align="center" width="160px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="P/E(TTM)" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="P/E(LYR)" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="P/B(MRQ)" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="P/S(TTM)" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.marketGrade }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="其他" name="06">
        <el-table
          v-loading="allLoading.f"
          :data="otherList"
          style="width: 100%"
          max-height="300"
          :header-cell-style="{background:'#eee'}"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="员工总人数(人)" align="center" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="显示币种" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="原始币种" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="转换汇率" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利率类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      style="margin-top:20px"
      align="center"
      :current-page="params.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="params.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'FinancialState',
  components: {
  },
  data() {
    return {
      activeName: '01',
      activeIndex: '01',
      showForm: true,
      allLoading: {
        a: false,
        b: false,
        c: false,
        d: false,
        e: false,
        f: false
      },
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      },
      interestList: [],
      debtList: [],
      crushList: [],
      keyRateList: [],
      everyIndexList: [],
      otherList: [],
      timeList: [
        { label: '3Y', value: '01' },
        { label: '5Y', value: '02' },
        { label: '10Y', value: '03' },
        { label: '上市以来', value: '04' },
        { label: '任意区间', value: '05' }
      ],
      symbolList: [
        { label: '元', value: '01' },
        { label: '千元', value: '02' },
        { label: '万元', value: '03' },
        { label: '百万元', value: '04' },
        { label: '亿元', value: '05' },
        { label: '十亿元', value: '06' }
      ],
      moneyList: [
        {
          options: [
            { value: '1', label: 'CNY' },
            { value: '2', label: 'USD' },
            { value: '3', label: 'HKD' },
            { value: '4', label: 'EUR' },
            { value: '5', label: 'JPY' },
            { value: '6', label: 'GBP' },
            { value: '7', label: 'CAD' },
            { value: '8', label: 'AUD' },
            { value: '9', label: 'SGD' },
            { value: '10', label: 'TWD' }
          ]
        },
        { options: [
          { value: '11', label: '最新汇率' },
          { value: '12', label: '历史汇率' }
        ] }
      ],
      sortList: [
        { value: '1', label: '最新在左' },
        { value: '2', label: '最新在右' }
      ],
      parmas: {},
      allList: [],
      reportList: [
        {
          options: [
            { value: '1', label: '年报' },
            { value: '2', label: '中报' },
            { value: '3', label: '一季度' },
            { value: '4', label: '三季度' }
          ]
        },
        { options: [
          { value: '5', label: '最新' },
          { value: '6', label: '盈利预测' }
        ] }
      ]
    }
  },
  created() {
    this.getInterestList()
  },
  methods: {
    tabClick(e) {
      this.activeIndex = e.name
      // if (this.activeIndex === '01') {
      //   this.getInterestList()
      // }
      switch (e.name) {
        case '01' : return this.getInterestList()
        case '02' : return this.getDebtList()
        case '03' : return this.getCrushList()
        case '04' : return this.getKeyList()
        case '05' : return this.getEveryBond()
        case '06' : return this.getOtherList()
      }
    },
    handleSelectionChange(e) {

    },
    getInterestList() {

    },
    getDebtList() {

    },
    getCrushList() {

    },
    getKeyList() {

    },
    getEveryBond() {

    },
    getOtherList() {

    },
    reducePoint() {
      if (this.activeIndex === '01') {
        this.list = this.interestList
      }
      this.list.map((v, i) => {
        const isSrt = v.remark.toString()
        const index = isSrt.indexOf('.')
        if (index > 0) {
          console.log('pp', index)
          const arr = isSrt.split('')
          arr.splice(arr.length - 1, 1)
          v.remark = arr.join('')
        }
      })
    },
    addPoint() {

    },
    changeReport(e) {
      console.log('eew', e)
    },
    changeTime(e) {

    },
    changeSymbol(e) {

    },
    changeMoney(e) {

    },
    changeSort(e) {

    },
    isDisplay(e) {
      console.log('e', e)
      this.showForm = !this.showForm
    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
    }
  }
}
</script>
