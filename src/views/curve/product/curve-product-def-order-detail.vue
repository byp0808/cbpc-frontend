<template>
  <div class="app-container">
    <el-form ref="curvePrdOrder" :model="curvePrdOrder" label-width="140px">
      <el-form-item label="该批次所需模型">
        <el-radio-group v-model="curvePrdOrder.model">
          <el-radio v-for="item in modelOption" :key="item.value" :disabled="item.disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需编制方式">
        <el-radio-group v-model="curvePrdOrder.buildType">
          <el-radio v-for="item in buildTypeOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需计算方式">
        <el-radio-group v-model="curvePrdOrder.computedType">
          <el-radio v-for="item in computedTypeOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需发布方式">
        <el-radio-group v-model="curvePrdOrder.publishType">
          <el-radio v-for="item in publishTypeOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="曲线发布类型">
        <el-checkbox-group v-model="curvePubTypeSelected">
          <el-checkbox v-for="item in curvePubTypeOption" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否发布曲线样本券">
        <el-radio-group v-model="curvePrdOrder.publishSampleFlag">
          <el-radio v-for="item in publishSampleFlagOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发布步长">
        <el-checkbox-group v-model="publishStepSizeSelected">
          <el-checkbox v-for="item in publishStepSizeOption" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="付息频率">
        <el-checkbox-group v-model="interestDueFreqSelected">
          <el-checkbox v-for="item in interestDueFreqOption" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div class="clearfix card-head">
      <h4>发布关键期限:</h4>
    </div>
    <el-table
      ref="orderTable"
      :data="curvePrdKdListLocal"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="standSlip" label="标准期限" width="80" show-overflow-tooltip />
      <el-table-column prop="lastUpdTs" label="操作时间" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $moment(scope.row.lastUpdTs).format('YYYY-MM-DD hh:mm') }}
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="数据操作" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="disabled"
            @click.native.prevent="deleteCurvePrdKd(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="clearfix card-head">
      <h4>自动编制规则:</h4>
    </div>
    <el-row>
      <el-select v-model="autoRule" placeholder="请选择自动编制规则" :disabled="disabled">
        <el-option v-for="item in autoRuleOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="toSetRule">设置</el-button>
    </el-row>

    <el-dialog :lock-scroll="lockScroll" width="80%" title="设置" :visible.sync="addAutoRuleFormVisible">
      <el-row>
        <el-select ref="autoRuleCurve" v-model="autoRuleCurve" placeholder="请选择曲线" :disabled="disabled">
          <el-option v-for="item in autoRuleCurveOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="toAddCurve">确认添加</el-button>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-table
            ref="curvePrdOrderAutoListLocal"
            :data="curvePrdOrderAutoListLocal"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column prop="productName" label="曲线名称" width="140" show-overflow-tooltip />
            <el-table-column prop="curveWeight" label="权重" width="140" show-overflow-tooltip>
              <template slot-scope="{row}">
                <el-input v-model.number="row.curveWeight" class="edit-input" size="small" style="width: 50px" /> %
              </template>
            </el-table-column>
            <el-table-column prop="depCurveOrderName" label="批次" width="140" show-overflow-tooltip />
            <el-table-column prop="curveBuildStatus" label="所需状态" width="80" show-overflow-tooltip >
              <template slot-scope="scope">
                {{ scope.row.curveBuildStatus | showCodeLabel('CURVE_BUILD_STATUS') }}
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="60" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="curvePrdOrderAutoListLocal.splice(scope.$index, 1)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" :offset="3">
          <el-button type="primary" @click="reloadKd">预览</el-button>
          <el-table
            ref="curvePrdOrderAutoKtList"
            :data="curvePrdOrderAutoKtListLocal"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" @selectable="prdOrderAutoKtSelectable" />
            <el-table-column prop="standSlip" label="关键期限" width="140" show-overflow-tooltip />
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addAutoRuleFormVisible = false">取 消</el-button>
        <el-button :disabled="disabled" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { optioins } from '@/api/curve/code-type.js'
import { showCodeLabel } from '@/api/curve/code-type.js'
import { getCurveOrderList } from '@/api/curve/curve-product-list.js'
export default {
  name: 'CurveProductDefOrderDetailForm',
  components: {
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  props: ['orderData', 'curvePrdKdList', 'curvePrdOrderAutoList'],
  data() {
    return {
      lockScroll: true,
      curvePrdOrder: {
      },
      interestDueFreqSelected: [],
      curvePubTypeSelected: [],
      publishStepSizeSelected: [],
      disabled: false,
      // 自动编制规则
      autoRule: '1',
      curvePrdKdListLocal: [],
      // 自动编制规则弹窗
      addAutoRuleFormVisible: false,
      // 自动编制规则-选择曲线
      autoRuleCurve: '',
      // 曲线-权重信息
      curvePrdOrderAutoListLocal: [],
      // 批次自动编制关键期限
      curvePrdOrderAutoKtListLocal: [],

      // 曲线列表
      autoRuleCurveOptions: []
    }
  },
  computed: {
    // 该批次所需模型
    modelOption() {
      return optioins('MODEL')
    },
    // 该批次所需编制方式
    buildTypeOption() {
      return optioins('BUILD_TYPE')
    },
    // 该批次所需计算方式
    computedTypeOption() {
      return optioins('COMPUTED_TYPE')
    },
    // 该批次所需发布方式
    publishTypeOption() {
      return optioins('PUBLISH_TYPE')
    },
    // 曲线发布类型
    curvePubTypeOption() {
      return optioins('CURVEPUB_TYPE')
    },
    // 是否发布曲线样本券
    publishSampleFlagOption() {
      return optioins('Y_OR_N')
    },
    // 发布步长
    publishStepSizeOption() {
      return optioins('PUBLISH_STEP_SIZE')
    },
    // 付息频率
    interestDueFreqOption() {
      return optioins('INTEREST_DUE_FREQ')
    },
    // 自动编制规则
    autoRuleOptions() {
      return optioins('AUTO_RULE')
    }
  },
  beforeMount() {
    console.info('curve-product-def-order-detail.vue.beforeMount:')

    // 加载关键期限
    this.curvePrdKdListLocal = this.curvePrdKdList
    this.curvePrdOrder = this.orderData
    // 更新曲线发布类型、发布步长、付息频率
    if (this.curvePrdOrder) {
      this.interestDueFreqSelected = this.curvePrdOrder.interestDueFreq.split(',')
      this.curvePubTypeSelected = this.curvePrdOrder.curvePubType.split(',')
      this.publishStepSizeSelected = this.curvePrdOrder.publishStepSize.split(',')
    }
    if (!this.curvePrdOrderAutoList) {
      this.curvePrdOrderAutoListLocal = []
    } else {
      this.curvePrdOrderAutoListLocal = this.curvePrdOrderAutoList
    }

    getCurveOrderList({ orderId: this.orderData.orderId }).then(response => {
      console.info('queryCurveProductList.queryCurveProductList...')
      const { dataList } = response
      for (var i = 0; i < dataList.length; i++) {
        var item = dataList[i]
        this.autoRuleCurveOptions.push({ value: item.productName, lable: item.curvePrdCode })
      }
    })
  },
  methods: {
    // 获取form数据
    getAllForm() {
      this.curvePrdOrder.interestDueFreq = this.interestDueFreqSelected.join(',')
      this.curvePrdOrder.curvePubType = this.curvePubTypeSelected.join(',')
      this.curvePrdOrder.publishStepSize = this.publishStepSizeSelected.join(',')
      return this.curvePrdOrder
    },
    // 应用所选批次
    applyOrder() {

    },
    // 删除关键期限
    deleteCurvePrdKd(index, row) {
      this.curvePrdKdList.splice(index, 1)
    },
    // 规则设置
    toSetRule() {
      this.addAutoRuleFormVisible = true
    },
    toAddCurve() {
      console.info('toAddCurve:')
      var value = this.autoRuleCurve
      var label = this.$refs.autoRuleCurve.selectedLabel
      if (!value) {
        this.$message({
          type: 'error',
          message: '请选择曲线'
        })
        return false
      }
      // 判断是否已经存在
      if (!this.checkPrdOrderAuto(value)) {
        this.$message({
          type: 'error',
          message: '已经存在'
        })
        return false
      }
      this.curvePrdOrderAutoListLocal.push({
        curveOrderId: this.orderData.curveOrderId, // 曲线批次ID
        curveOrderName: this.orderData.orderName, // 曲线批次ID，批次名称
        curveWeight: '', // 权重
        curveId: value, // 依赖曲线ID
        productName: label, // 依赖曲线名称
        depCurveOrderId: '', // 依赖曲线对应批次ID
        orderName: '', // 批次名称
        curveBuildStatus: '' // 曲线编制状态
      })
    },
    // 检查曲线ID
    checkPrdOrderAuto(curveId) {
      for (var i = 0; i < this.curvePrdOrderAutoListLocal.length; i++) {
        var item = this.curvePrdOrderAutoListLocal[i]
        if (item.curveId === curveId) {
          return false
        }
      }
      return true
    },
    // 加载关键期限
    reloadKd() {

    },
    // 是否可选
    prdOrderAutoKtSelectable() {
      return false
    }
  }
}
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 0px;
  }
</style>
