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
                  <span v-if="scope.row.approveStatus === '01'" style="margin-left: 10px">待复核</span>
                  <span v-if="scope.row.approveStatus === '02'" style="margin-left: 10px">审批通过</span>
                  <span v-if="scope.row.approveStatus === '03'" style="margin-left: 10px">审批不通过</span>
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
              :page-sizes="[10, 20, 30, 40, 50]"
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
                label="类型"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="市场隐含评级"
                align="center"
                width="120px"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="期限区间"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="点差"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
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
                    @click.native.prevent="toDetail(scope.row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click.native.prevent="deleteParams(scope.row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="bottom-box">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" style="margin-bottom:10px">新增点差规则</el-button>
            <el-table
              :data="addRuleList"
              tooltip-effect="dark"
              style="width: 100%"
              border
              highlight-current-row
              fit
            >
              <el-table-column
                label="点差规则ID"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="规则名称"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="资产规则"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="点差规则"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="点差类型"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
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
                    @click.native.prevent="toDetail(scope.row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click.native.prevent="deleteRule(scope.row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog :visible.sync="assetDialog" title="资产组设置" width="1100px" class="dialog-box">
      <!-- <div>
        <el-form label-width="150px">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="规则ID">
                  <el-input v-model="recCurveInfo.id" disabled />
                </el-form-item>
                <el-form-item label="资产规则">
                  <el-input v-model="recCurveInfo.lastUpdBy" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="最后操作人">
                  <el-input v-model="recCurveInfo.lastUpdTs" disabled />
                </el-form-item>
                <el-form-item label="最后操作时间">
                  <el-input v-model="recCurveInfo.lastUpdTs" disabled />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <flow-filter
        ref="refBondFilter"
        :filter-id="recCurveInfo.bondFilterId"
        :disabled="disabled"
      /> -->
      <FlowForm
        ref="refAssetForm"
        :rec-curve-data="recCurveData"
        :business-id="flowId"
        :detail-info="detailInfo"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="assetDialog = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="paramsDialog" title="点差参数设置" width="800px">
      <div>
        <el-form label-width="150px">
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="规则ID">
                  <el-input v-model="recCurveInfo.id" disabled />
                </el-form-item>
                <el-form-item label="类型">
                  <el-input v-model="recCurveInfo.lastUpdBy" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="最后操作人">
                  <el-input v-model="recCurveInfo.lastUpdTs" disabled />
                </el-form-item>
                <el-form-item label="最后操作时间">
                  <el-input v-model="recCurveInfo.lastUpdTs" disabled />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="市场隐含评级">
                <el-select v-model="cityLevel" placeholder="请选择活动区域">
                  <el-option v-for="item in cityLevelList" :key="item.value" :label="item.value" :value="item.label" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="推进待偿期区间">
                <div class="input-box">
                  <div class="first">
                    <el-input v-model="recCurveInfo.lastUpdTs" />
                  </div>
                  <div>
                    <el-input v-model="recCurveInfo.lastUpdTs" />
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="点差">
                <el-input v-model="recCurveInfo.lastUpdTs" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="assetDialog = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import FlowFilter from '@/views/common/bond-filter/filter.vue'
import FlowForm from '@/views/valuation/flow-difference/flow-form.vue'
import { getAssetData, deleteAssetData, signleData } from '@/api/valuation/flow.js'
export default {
  name: 'FlowDifference',
  components: {
    FlowForm
  },
  data() {
    return {
      assetList: [],
      addParamsList: [],
      addRuleList: [],
      recCurveData: {},
      flowId: '',
      detailInfo: {},
      assetDialog: false,
      paramsDialog: false,
      disabled: false,
      recCurveInfo: {},
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      },
      cityLevel: '',
      cityLevelList: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }
      ]
    }
  },
  beforeMount() {
    this.assetTable()
  },
  methods: {
    assetTable() {
      getAssetData({ page: this.page }).then(response => {
        // const { assetList, ruleDetail, page } = response
        // this.assetList = assetList
        // this.bondFilterList = ruleDetail
        this.page = response.pageInfo
        this.assetList = response.assetsGroupList
        this.bondFilterList = response.ruleDetail
      })
    },
    addAsset() {
      if (!this.flowId) {
        this.detailInfo = ''
      }
      this.assetDialog = true
    },
    addParams() {
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
    saveCallBack() {
      this.assetDialog = false
      this.assetTable()
    },
    modifyAsset(id) {
      this.flowId = id
      this.assetDialog = true
      signleData(id).then(res => {
        this.detailInfo = res
      })
    },
    deleteRow(id) {
      deleteAssetData(id).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success',
          showClose: true
        })
        this.assetTable()
      })
    },
    ruleDetail(bondFilterId) {
      const ruleList = this.$lodash.get(this.bondFilterList, bondFilterId)
      let ruleDetail = ''
      this.$lodash.forEach(ruleList, function(value, key) {
        ruleDetail += value.ruleCode + ' = ' + value.ruleValue
        if (key < ruleList.length - 1) {
          ruleDetail += ', '
        }
      })
      return ruleDetail
    },
    save() {
      this.$refs.refAssetForm.save()
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
 .input-box {
        display: flex!important;
        .first {
            margin-right: 10px;
        }
    }
    .btn-box {
        display: flex;
    }
</style>
