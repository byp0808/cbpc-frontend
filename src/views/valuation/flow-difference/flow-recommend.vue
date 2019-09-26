<template>
  <div class="app-container">
    <div class="flow-box">
      <div class="top-box">
        <el-row>
          <el-col :span="11">
            <el-button type="primary" style="margin-bottom:10px" @click="addAsset">新增资产组</el-button>
            <el-table
              :data="assetList"
              tooltip-effect="dark"
              style="width: 100%"
              border
              highlight-current-row
              fit
            >
              <el-table-column
                label="资产规则"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="规则详情"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
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
                    @click.native.prevent="toDelete(scope.row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-button type="primary" style="margin-bottom:10px">新增点差参数表</el-button>
            <el-table
              :data="assetList"
              tooltip-effect="dark"
              style="width: 100%"
              border
              highlight-current-row
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
                    @click.native.prevent="toDelete(scope.row.id)"
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
              :data="assetList"
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
                    @click.native.prevent="toDelete(scope.row.id)"
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
    <el-dialog :visible.sync="assetDialog" title="资产组设置" width="1100px">
      <div>
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
      <flow-filter />
    </el-dialog>
  </div>
</template>

<script>
import FlowFilter from '@/views/common/bond-filter/flowFilter.vue'
export default {
  name: 'FlowDifference',
  components: {
    FlowFilter
  },
  data() {
    return {
      assetList: [],
      assetDialog: false,
      recCurveInfo: {}
    }
  },
  //   computed: {
  //     recCurveInfo: {
  //       get() {
  //         return this.$store.state.recCurve.recCurveInfo
  //       },
  //       set(recCurveInfo) {
  //         this.$store.commit('recCurve/setRecCurveInfo', recCurveInfo)
  //       }
  //     }
  //   },
  methods: {
    addAsset() {
      this.assetDialog = true
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
</style>
