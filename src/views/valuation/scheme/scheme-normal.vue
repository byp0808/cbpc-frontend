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
            <el-row style="margin-left:10px">
              <el-col :span="12">
                <el-radio v-model="radio" label="1">行权</el-radio>
                <el-radio v-model="radio" label="2">非行权</el-radio>
              </el-col>
            </el-row>
            <el-form style="margin-top:15px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="待偿期" label-width="60px">
                    <el-input v-model="priceParams.residualMaturity" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="净价" label-width="50px">
                    <el-input v-model="priceParams.netPrice" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="全价" label-width="50px">
                    <el-input v-model="priceParams.fullPrice" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收益率" label-width="60px">
                    <el-input v-model="priceParams.yield" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
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
                  label="待尝期"
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
                  label="待尝期"
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
                  label="待尝期"
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
    <el-dialog :visible.sync="priceDialog" width="1000px">
      <!-- <div style="margin-top: -10px">
        <el-button
          icon="el-icon-arrow-down"
          style="margin-bottom: 10px;width: 100%;height: 15px;padding: 0;color: #fff;background: black;font-size: 15px"
          @click="drawerIsOpen = true"
        />
      </div>
      <div style="margin-bottom: 20px" align="right">
        <span>
          <el-select v-model="offerModuleId" filterable placeholder="报价展示模板" @visible-change="loadOfferModuleList">
            <el-option
              v-for="item in offerModuleList"
              :key="item.id"
              :label="item.tempName"
              :value="item.id"
            />
          </el-select>
          <el-button type="primary" @click="offerToUse">应用</el-button>
        </span>
        <span>
          <el-select v-model="moduleId" filterable placeholder="成交展示模板" @visible-change="loadModuleList">
            <el-option
              v-for="item in moduleList"
              :key="item.id"
              :label="item.tempName"
              :value="item.id"
            />
          </el-select>
          <el-button type="primary" @click="toUse">应用</el-button>
        </span>
      </div> -->
      <div>
        <el-table
          ref="offerMarketListTable"
          v-loading="offerMarketLoading"
          :data="offerMarketList"
          tooltip-effect="dark"
          width="100%"
          height="300px"
        >
          <el-table-column v-for="item in offerTableHeader" :key="item.colName" :prop="item.colName" :label="item.colChiName" align="center" width="180px">
            <template slot-scope="scope">
              <span :class="offerIsLight(scope.row,item)?'light':''">{{ codeFormatter(scope.row,item) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="center"
          style="margin-top:20px"
          :current-page="offerPage.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="offerPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="offerPage.totalRecord"
          @size-change="offerHandleSizeChange"
          @current-change="offerHandleCurrentChange"
        />
      </div>
      <hr style="color: #b7bfa5">
      <!--成交表格-->
      <div style="margin-top: 20px">
        <el-table
          ref="marketListTable"
          v-loading="marketLoading"
          :data="marketList"
          tooltip-effect="dark"
          style="width: 100%"
          max-height="300"
          :row-class-name="tableRowClassName"
          @cell-dblclick="offerCellDblclick"
        >
          <el-table-column
            v-for="item in tableHeader"
            :key="item.colName"
            :prop="item.colName"
            :label="item.colChiName"
            align="center"
            width="180px"
          >
            <template slot-scope="scope">
              <span :class="isLight(scope.row,item)?'light':''">{{ codeFormatter(scope.row,item) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="center"
          style="margin-top:20px"
          :current-page="page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-row>
        <el-col :span="3" :offset="21">
          <div class="dialog-footer">
            <el-button @click="priceDialog = false">取 消</el-button>
            <!-- <el-button v-loading="methodUpload" type="primary">确 定</el-button> -->
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getCurveList, findCurveByMarketGrade, spreadTrial, convertSpread } from '@/api/valuation/scheme.js'
import { basic_api_valuation } from '@/api/base-api.js'
import { upload } from '../../../utils/file-request'
import { queryDefaultCols, queryMarketData, getTempList, getTempById } from '@/api/market/market.js'
import { optioins } from '@/api/curve/code-type.js'

// import { get } from 'http'
export default {
  name: 'ValuationSchemeNormal',
  components: {
  },
  data() {
    return {
      isCover: true,
      recCurveName: '',
      radio: '1',
      uploadUrl: `${basic_api_valuation}/scheme/upload`,
      stockMarketGrade: '存量隐含评级',
      selectSpreadVal: 1,
      updateTime: '',
      fileList: [],
      offerModuleId: '',
      offerModuleList: [],
      offerMarketList: [],
      offerTableHeader: [],
      moduleId: '',
      moduleList: [],
      tableHeader: [],
      priceParams: {
        fullprice: '',
        netPrice: '',
        residualMaturity: '',
        yield: ''
      },
      fullprice: '',
      offerMarketLoading: false,
      marketLoading: false,
      marketList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      offerPage: {
        pageNumber: 1,
        pageSize: 10
      },
      showTime: false,
      priceDialog: false,
      trialResult: [],
      curveList: []
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
      // console.log(this.schemeInfo)
      // return this.schemeInfo
    }
  },
  created() {
    this.initTable()
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
    loadOfferModuleList(val) {
      // 加载所有报价模板
      if (val) {
        const data = {
          page: {
            pageNumber: 1,
            pageSize: 100
          },
          dataMarket: '02',
          showArea: '01'
        }
        getTempList(data).then(res => {
          console.info(res)
          this.offerModuleList = res.dataList
        })
      }
    },
    loadModuleList(val) {
      // 加载所有成交模板
      if (val) {
        const data = {
          page: {
            pageNumber: 1,
            pageSize: 100
          },
          dataMarket: '02',
          showArea: '02'
        }
        getTempList(data).then(res => {
          console.info(res)
          this.moduleList = res.dataList
        })
      }
    },
    offerToUse() {
      // 应用报价表模板
      const val = this.offerModuleId
      if (val === '') {
        this.$message('请选择报价展示模板！')
        return
      }
      getTempById(val).then(res => {
        const { showCols, colData } = res
        this.offerTableHeader = []
        this.$nextTick(() => {
          for (let i = 0; i < showCols.length; i++) {
            this.offerTableHeader.splice(i, 0, showCols[i])
          }
          // console.info(this.offerTableHeader)
        })
        this.offerColData = colData
      })
      // 清空筛选数据
      this.offerScreeningFormList = []
      // 获取满足条件的行情数据
      this.offerLoadTable()
      this.offerCurrentModuleId = this.offerModuleId
    },
    toUse() {
      // 应用成交表模板
      const val = this.moduleId
      if (val === '') {
        this.$message('请选择模板！')
        return
      }
      getTempById(val).then(res => {
        const { showCols, colData } = res
        // console.info(showCols)
        // this.tableHeader = showCols
        this.tableHeader = []
        this.$nextTick(() => {
          for (let i = 0; i < showCols.length; i++) {
            this.tableHeader.splice(i, 0, showCols[i])
          }
          // console.info(this.tableHeader)
        })
        this.colData = colData
      })
      // 清空筛选数据
      this.screeningFormList = []
      // 获取满足条件的行情数据
      this.initTable()
      this.currentModuleId = this.moduleId
    },
    offerCellDblclick(row, column) { // 双击单元格
      console.log('row', row)
      console.log('column', column)
      console.log('dd', column.label)
      if (column.label.indexOf('全价') !== -1) {
        this.priceParams.fullPrice = row[column.property]
        console.log('ffff', row[column.property])
        this.priceParams.residualMaturity = row.mtrty
      }
      if (column.label.indexOf('净价') !== -1) {
        this.priceParams.netPrice = row[column.property]
        this.priceParams.residualMaturity = row.mtrty
      }
      if (column.label.indexOf('收益率') !== -1) {
        this.priceParams.yield = row[column.property]
        this.priceParams.residualMaturity = row.mtrty
      }
    },
    // 初始化
    async initTable() {
      await this.initOfferTable()
      await this.initCJTable()
    },
    initOfferTable() {
      // 初始化报价表数据
      // 获取默认模板表头信息及行情列表信息
      this.offerMarketLoading = true
      // 查询默认表头
      const data = {
        dataMarket: '02',
        showArea: '01'
      }
      queryDefaultCols(data).then(response => {
        const { showCols, colData } = response
        // console.info(showCols)
        // console.info(colData)
        this.offerTableHeader = showCols
        this.offerColData = colData
      })
      // 获取满足条件的行情数据
      const data2 = {
        page: this.offerPage,
        dataMarket: '02',
        showArea: '01',
        queryForm: this.queryForm
      }
      queryMarketData(data2).then(response => {
        // console.info(response)
        if (typeof response.page !== 'undefined') {
          this.offerPage = response.page
        }
        this.offerMarketList = response.dataList
      })
      this.offerMarketLoading = false
    },
    initCJTable() {
      // 初始化成交表数据
      // 获取默认模板表头信息及行情列表信息
      this.marketLoading = true
      // 查询默认表头
      const data = {
        dataMarket: '02',
        showArea: '02'
      }
      queryDefaultCols(data).then(response => {
        const { showCols, colData } = response
        // console.info(showCols)
        // console.info(colData)
        this.tableHeader = showCols
        this.colData = colData
      })
      // 获取满足条件的行情数据
      const data2 = {
        page: this.page,
        dataMarket: '02',
        showArea: '02',
        queryForm: this.queryForm
      }
      queryMarketData(data2).then(response => {
        console.info(response)
        if (typeof response.page !== 'undefined') {
          this.page = response.page
        }
        this.marketList = response.dataList
      })
      this.marketLoading = false
    },
    offerIsLight(row, header) {
      // 判断是否高亮
      if (typeof row.modifiedCols !== 'undefined') {
        const modifiedCols = row.modifiedCols
        const mods = modifiedCols.split(',')
        const mod = mods.filter(val => val === header.colName)
        return mod.length > 0
      } else {
        return false
      }
    },
    isLight(row, header) {
      // 成交判断是否高亮
      if (typeof row.modifiedCols !== 'undefined') {
        const modifiedCols = row.modifiedCols
        const mods = modifiedCols.split(',')
        const mod = mods.filter(val => val === header.colName)
        return mod.length > 0
      } else {
        return false
      }
    },
    codeFormatter(row, column) {
      //  && (column.colName === 'curveBuildType' || column.colName === 'curveSource')
      if (column.colType === 'OPTION' && (column.colName === 'curveBuildType' || column.colName === 'curveSource')) {
        const options = optioins(this, column.realColName)
        const opt = options.filter(opt => opt.value === row[column.colName])
        if (opt.length > 0) {
          return opt[0].label
        } else {
          return row[column.colName]
        }
      } else {
        return row[column.colName]
      }
    },
    offerHandleSizeChange(pageSize) {
      this.offerPage.pageSize = pageSize
      this.initOfferTable()
    },
    offerHandleCurrentChange(currentPage) {
      this.offerPage.pageNumber = currentPage
      this.initOfferTable()
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.initCJTable()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.initCJTable()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.knock === '1' || row.netdeviationLimit === '1') {
        return 'warning-row'
      }
      return ''
    },
    getData() {
      // return this.normalInfo
    },
    selectSpread(index) {
      // this.normalInfo.schemeSpreads[index].status = '1'
    },
    convertSpread() {
      convertSpread(this.schemeInfo).then(response => {
        console.log(response)
      })
    },
    selectPrice() {
      this.priceDialog = true
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
