<template>
  <div class="app-container">
    <div class="flow-box">
      <div class="top-box">
        <el-row>
          <el-col :span="11">
            <el-button type="primary" style="margin-bottom:10px" @click="addAsset">新增资产组</el-button>
            <el-table
              :data="assetList"
              style="width: 100%"
              tooltip-effect="dark"
              height="240px"
              border
              fit
            >
              <el-table-column
                label="资产规则"
                align="center"
                width="140px"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.ruleState }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="filterId" label="规则详细" show-overflow-tooltip align="center" width="180px">
                <template slot-scope="scope">
                  <span>{{ ruleDetail(scope.row.filterId) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                align="center"
                width="100px"
              >
                <template slot-scope="scope">
                  {{ $dft('REVIEW_STATUS', scope.row.approveStatus) }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="150px"
              >
                <template slot-scope="scope">
                  <div class="btn-box">
                    <el-button
                      type="primary"
                      size="mini"
                      :disabled="scope.row.approveStatus === '01'?true:false"
                      @click.native.prevent="modifyAsset(scope.row.id)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      :disabled="scope.row.approveStatus === '01'?true:false"
                      @click.native.prevent="deleteRow(scope.row.id)"
                    >
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top:10px"
              align="center"
              :current-page="page.pageNumber"
              :page-sizes="[5, 10, 15, 30, 50]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.totalRecord"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
          <el-col :span="11" :offset="2">
            <el-button type="primary" style="margin-bottom:10px" @click="addParams">新增点差参数表</el-button>
            <el-table
              :data="addParamsList"
              tooltip-effect="dark"
              style="width: 100%"
              border
              highlight-current-row
              height="240px"
              fit
            >
              <el-table-column
                prop="paramType"
                label="类型"
                align="center"
              />
              <el-table-column
                label="市场隐含评级"
                align="center"
                width="120px"
              >
                <template slot-scope="scope">
                  <span>{{ getMarketGrad(scope.row.marketGrad) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="期限区间"
                align="center"
                width="120px"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ joinSpreadParam(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="spreadValue"
                label="点差"
                align="center"
              />
              <el-table-column
                label="状态"
                align="center"
                width="100px"
              >
                <template slot-scope="scope">
                  {{ $dft('REVIEW_STATUS', scope.row.approveStatus) }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="150px"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="scope.row.approveStatus === '01'?true:false"
                    @click.native.prevent="editSpreadParam(scope.row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    :disabled="scope.row.approveStatus === '01'?true:false"
                    @click.native.prevent="deleteParams(scope.row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top:10px"
              align="center"
              :current-page="spreadParamPage.pageNumber"
              :page-sizes="[5, 10, 15, 30, 50]"
              :page-size="spreadParamPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="spreadParamPage.totalRecord"
              @size-change="spreadParamHSChange"
              @current-change="spreadParamHCChange"
            />
          </el-col>
        </el-row>
      </div>
      <div class="bottom-box">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" style="margin-bottom:10px" @click="addSpreadRule">新增点差规则</el-button>
            <el-table
              :data="addRuleList"
              tooltip-effect="dark"
              style="width: 100%"
              border
              highlight-current-row
              fit
            >
              <el-table-column
                prop="spreadRule.id"
                label="点差规则ID"
                align="center"
              />
              <el-table-column
                prop="spreadRule.ruleName"
                label="规则名称"
                align="center"
              />
              <el-table-column
                prop="assetsGroupName"
                label="资产规则"
                align="center"
              />
              <el-table-column
                label="点差规则"
                align="center"
              >
                <template>
                  <span>表格映射</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="spreadRule.spreadType"
                label="点差类型"
                align="center"
              >
                <template slot-scope="scope">
                  {{ getSpreadType(scope.row.spreadRule.spreadType) }}
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                align="center"
              >
                <template slot-scope="scope">
                  {{ $dft('APPROVE_STATUS', scope.row.spreadRule.approveStatus) }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="scope.row.spreadRule.approveStatus === '01'?true:false"
                    @click.native.prevent="editSpreadRule(scope.row.spreadRule.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    :disabled="scope.row.spreadRule.approveStatus === '01'?true:false"
                    @click.native.prevent="deleteRule(scope.row.spreadRule.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top:10px"
              align="center"
              :current-page="spreadRulePage.pageNumber"
              :page-sizes="[5, 10, 15, 30, 50]"
              :page-size="spreadRulePage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="spreadRulePage.totalRecord"
              @size-change="spreadRuleHSChange"
              @current-change="spreadRuleHCChange"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog v-if="assetDialog" :visible.sync="assetDialog" title="资产组设置" width="1100px" class="dialog-box">
      <FlowForm
        ref="refAssetsForm"
        :rec-curve-data="recCurveData"
        :business-id="flowId"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="assetDialog = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="paramsDialog" :visible.sync="paramsDialog" title="点差参数设置" width="800px">
      <SpreadParamForm
        ref="refSpreadParamForm"
        :business-id="spreadParamId"
        @saveCallBack="spreadParamSaveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="paramsDialog = false">取 消</el-button>
        <el-button type="primary" @click="spreadParamSave">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="spreadRuleDialog" :visible.sync="spreadRuleDialog" title="点差规则设置" width="800px">
      <SpreadRuleForm
        ref="refSpreadRuleForm"
        :business-id="spreadRuleId"
        @saveCallBack="spreadRuleSaveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="spreadRuleSave">保存并应用</el-button>
        <el-button @click="spreadRuleDialog = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SpreadParamForm from '@/views/valuation/flow-difference/spread-param-form.vue'
import SpreadRuleForm from '@/views/valuation/flow-difference/spread-rule-form.vue'
import FlowForm from '@/views/valuation/flow-difference/flow-form.vue'
import { getAssetData, deleteAssetData, spreadParamList, deleteSpreadParam, someBadList, delSomeBad } from '@/api/valuation/flow.js'
import { queryFilterIndex } from '@/api/common/bond-filter.js'
export default {
  name: 'FlowDifference',
  components: {
    FlowForm,
    SpreadParamForm,
    SpreadRuleForm
  },
  data() {
    return {
      assetList: [],
      addParamsList: [],
      addRuleList: [],
      recCurveData: {},
      flowId: '',
      spreadParamId: '',
      spreadRuleId: '',
      detailInfo: {},
      assetDialog: false,
      paramsDialog: false,
      spreadRuleDialog: false,
      disabled: false,
      filterIndex: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      },
      spreadParamPage: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      },
      spreadRulePage: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  beforeMount() {
    this.assetTable()
    this.spreadParamTable()
    this.someBadRuleList()
    queryFilterIndex({ paraType: 'BONND_FILTER_INDEX' }).then(response => {
      this.filterIndex = response
    })
  },
  methods: {
    getSpreadType(spreadType) {
      switch (spreadType) {
        case '01': return '流动性点差'
        case '02': return '信用点差'
        case '03': return '其他点差'
      }
    },
    assetTable() {
      getAssetData({ page: this.page }).then(response => {
        const { assetsGroupList, ruleDetail, pageInfo } = response
        this.page = pageInfo
        this.assetList = assetsGroupList
        this.bondFilterList = ruleDetail
      })
    },
    getMarketGrad(marketGrad) {
      switch (marketGrad) {
        case '01': return 'AAA'
        case '02': return 'AAA-'
        case '03': return 'AA'
        case '04': return 'AA'
      }
    },
    spreadParamTable() {
      spreadParamList({ page: this.spreadParamPage }).then(response => {
        const { dataList, page } = response
        this.addParamsList = dataList
        this.spreadParamPage = page
      })
    },
    someBadRuleList() {
      someBadList({ page: this.page }).then(response => {
        const { dataList, page } = response
        this.addRuleList = dataList
        this.spreadRulePage = page
      })
    },
    addAsset() {
      this.flowId = ''
      this.assetDialog = true
    },
    addParams() {
      this.spreadParamId = ''
      this.paramsDialog = true
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.assetTable()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.assetTable()
    },
    spreadParamHSChange(pageSize) {
      this.spreadParamPage.pageSize = pageSize
      this.spreadParamTable()
    },
    spreadParamHCChange(currentPage) {
      this.spreadParamPage.pageNumber = currentPage
      this.spreadParamTable()
    },
    spreadRuleHSChange(pageSize) {
      this.spreadRulePage.pageSize = pageSize
      this.someBadRuleList()
    },
    spreadRuleHCChange(currentPage) {
      this.spreadRulePage.pageNumber = currentPage
      this.someBadRuleList()
    },
    saveCallBack() {
      this.assetDialog = false
      this.assetTable()
    },
    modifyAsset(id) {
      this.flowId = id
      this.assetDialog = true
    },
    editSpreadParam(id) {
      this.spreadParamId = id
      this.paramsDialog = true
    },
    deleteRow(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAssetData(id).then(response => {
          this.assetTable()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteParams(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSpreadParam(id).then(response => {
          this.spreadParamTable()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteRule(id) {
      delSomeBad(id).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success',
          showClose: true
        })
        this.someBadRuleList()
      })
    },
    ruleDetail(bondFilterId) {
      const ruleList = this.$lodash.get(this.bondFilterList, bondFilterId)
      let ruleDetail = ''
      const that = this
      this.$lodash.forEach(ruleList, function(value, key) {
        if (value.ruleValue !== null && value.ruleValue !== '') {
          const index = that.$lodash.findIndex(that.filterIndex, function(o) { return o.paraId === value.ruleCode })
          console.log(index)
          ruleDetail += that.filterIndex[index].paraDesc + ' = ' + value.ruleValue
          if (key < ruleList.length - 1) {
            ruleDetail += ', '
          }
        }
      })
      return ruleDetail
    },
    save() {
      this.$refs.refAssetsForm.save()
    },
    spreadParamSave() {
      this.$refs.refSpreadParamForm.save()
    },
    spreadParamSaveCallBack() {
      this.paramsDialog = false
      this.spreadParamTable()
    },
    addSpreadRule() {
      this.spreadRuleId = ''
      this.spreadRuleDialog = true
    },
    editSpreadRule(id) {
      this.spreadRuleId = id
      this.spreadRuleDialog = true
    },
    spreadRuleSave() {
      this.$refs.refSpreadRuleForm.save()
    },
    spreadRuleSaveCallBack() {
      this.spreadRuleDialog = false
      this.someBadRuleList()
    },
    joinSpreadParam(row) {
      var result = '[ ' + row.rangeStart + 'y , ' + row.rangeEnd + 'y )'
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
  .flow-box {
    .top-box {
      margin-bottom: 50px;
    }
  }
  .btn-box {
    display: flex;
  }
</style>
