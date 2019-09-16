<template>
  <div class="app-container">

    <el-form ref="curvePrdOrder" :model="curvePrdOrder" label-width="140px">
      <el-form-item label="该批次所需模型">
        <el-radio-group v-model="curvePrdOrder.model">
          <el-radio v-for="item in modelOption" :key="item.value" :disabled="disabled || item.disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需编制方式">
        <el-radio-group v-model="curvePrdOrder.buildType">
          <el-radio v-for="item in buildTypeOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需计算方式">
        <el-radio-group v-model="curvePrdOrder.computedType">
          <el-radio v-for="item in computedTypeOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需发布方式">
        <el-radio-group v-model="curvePrdOrder.publishType">
          <el-radio v-for="item in publishTypeOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="曲线发布类型">
        <el-checkbox-group v-model="curvePubTypeSelected">
          <el-checkbox v-for="item in curvePubTypeOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否发布曲线样本券">
        <el-radio-group v-model="curvePrdOrder.publishSampleFlag">
          <el-radio v-for="item in publishSampleFlagOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发布步长">
        <el-checkbox-group v-model="publishStepSizeSelected">
          <el-checkbox v-for="item in publishStepSizeOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="付息频率">
        <el-checkbox-group v-model="interestDueFreqSelected">
          <el-checkbox v-for="item in interestDueFreqOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div class="clearfix card-head">
      <h4>发布关键期限:</h4>
    </div>

    <div class="order-switch">
      <el-form ref="curvePrdOrder" :model="curvePrdOrder" style="float: right;padding-right: 10px;" label-width="50px">
        <el-row>
          <div class="switch-item">
            <label class="switch-label">批次临时开关</label>
            <el-switch v-model="curvePrdOrder.validFlag" :disabled="disabled" active-value="Y" inactive-value="N" />
          </div>
        </el-row>
        <el-row>
          <div class="switch-item">
            <el-checkbox-group v-model="curvePrdOrder.orderClosedFlag">
              <el-checkbox label="批次关闭的生效时间" :disabled="disabled" name="type" true-label="1" false-label="0" />
            </el-checkbox-group>
          </div>
        </el-row>
        <el-row>
          <div class="switch-item">
            <label class="switch-label">开始</label>
            <el-col :span="4">
              <el-date-picker v-model="curvePrdOrder.orderClosedSt" :disabled="disabled" type="date" style="width:180px" format="yyyy-MM-dd" placeholder="选择日期" />
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="switch-item">
            <label class="switch-label">结束</label>
            <el-col :span="4">
              <el-date-picker v-model="curvePrdOrder.orderClosedEt" :disabled="disabled" type="date" style="width:180px" format="yyyy-MM-dd" placeholder="选择日期" />
            </el-col>
          </div>
        </el-row>
      </el-form>
      <el-button type="primary" size="small" :disabled="disabled" round @click="loadLastOrder(orderIndex)">加载上一批次配置</el-button>
    </div>

    <el-table
      ref="orderTable"
      :data="curvePrdKdList"
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
          <el-option v-for="item in autoRuleCurveOptions" :key="item.value" :label="item.label" :value="item.value" :order-id="item.orderId" />
        </el-select>
        <el-button type="primary" @click="toAddCurve">确认添加</el-button>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-table
            ref="curvePrdOrderAutoList"
            :data="curvePrdOrderAutoList"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column prop="productName" label="曲线名称" width="140" show-overflow-tooltip />
            <el-table-column prop="curveWeight" label="权重" width="140" show-overflow-tooltip>
              <template slot-scope="{row}">
                <el-input v-model.number="row.curveWeight" class="edit-input" size="small" style="width: 50px" /> %
              </template>
            </el-table-column>
            <el-table-column prop="" label="批次" width="140" show-overflow-tooltip>
              <template>
                {{ orderName }}
              </template>
            </el-table-column>
            <el-table-column prop="curveBuildStatus" label="所需状态" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.curveBuildStatus | showCodeLabel('CURVE_BUILD_STATUS') }}
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="60" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="curvePrdOrderAutoList.splice(scope.$index, 1)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" :offset="3">
          <el-button type="primary" @click="preview">预览</el-button>
          <el-table
            ref="curvePrdOrderAutoKtList"
            :data="curvePrdOrderAutoKtList"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" :selectable="prdOrderAutoKtSelectable" />
            <el-table-column prop="standSlip" label="关键期限" width="140" show-overflow-tooltip />
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addAutoRuleFormVisible = false">取 消</el-button>
        <el-button :disabled="disabled" type="primary" @click="saveOrderAuto">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { optioins } from '@/api/curve/code-type.js'
import { showCodeLabel } from '@/api/curve/code-type.js'
import { getCurveOrderList } from '@/api/curve/curve-product-list.js'
import { queryPrdOrderKts } from '@/api/curve/curve-product-order.js'
export default {
  name: 'CurveProductDefOrderDetailForm',
  components: {
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  props: ['disabled', 'orderName', 'orderIndex', 'orderData', 'curvePrdKdList', 'curvePrdOrderAutoList', 'autoPrdOrderKts', 'prdOrderAutoKds'],
  data() {
    return {
      lockScroll: true,
      curvePrdOrder: {
      },
      interestDueFreqSelected: [],
      curvePubTypeSelected: [],
      publishStepSizeSelected: [],
      // 自动编制规则
      autoRule: '1',
      // 自动编制规则弹窗
      addAutoRuleFormVisible: false,
      // 自动编制规则-选择曲线
      autoRuleCurve: '',
      // 曲线列表
      autoRuleCurveOptions: [],
      // 曲线产品自动编制关键期限
      curvePrdOrderAutoKtList: [],
      // 自动编制关键期限，勾选内容
      prdOrderAutoKdsKeys: []
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

    this.curvePrdOrder = this.orderData
    // 更新曲线发布类型、发布步长、付息频率
    if (this.curvePrdOrder) {
      if (this.curvePrdOrder.interestDueFreq) {
        this.interestDueFreqSelected = this.curvePrdOrder.interestDueFreq.split(',')
      }
      if (this.curvePrdOrder.curvePubType) {
        this.curvePubTypeSelected = this.curvePrdOrder.curvePubType.split(',')
      }
      if (this.curvePrdOrder.publishStepSize) {
        this.publishStepSizeSelected = this.curvePrdOrder.publishStepSize.split(',')
      }
    }
    if (!this.curvePrdOrderAutoList) {
      this.curvePrdOrderAutoList = []
    }

    getCurveOrderList({ orderId: this.orderData.orderId }).then(response => {
      console.info('queryCurveProductList.queryCurveProductList...')
      const { dataList } = response
      for (var i = 0; i < dataList.length; i++) {
        var item = dataList[i]
        this.autoRuleCurveOptions.push({ value: item.curveId, label: item.productName, orderId: item.orderId })
      }
    })

    // 如果产品批次-自动编制-关键期限列表，不为空，则说明已经保存过数据，页面初始化时显示列表
    this.prdOrderAutoKdsKeys = []
    if (this.prdOrderAutoKds && this.prdOrderAutoKds.length > 0) {
      for (var i = 0; i < this.prdOrderAutoKds.length; i++) {
        this.prdOrderAutoKdsKeys.push(this.prdOrderAutoKds[i].standSlip)
      }
    }
  },
  methods: {
    // 获取获取批次信息
    getCurvePrdOrder() {
      this.curvePrdOrder.interestDueFreq = this.interestDueFreqSelected.join(',')
      this.curvePrdOrder.curvePubType = this.curvePubTypeSelected.join(',')
      this.curvePrdOrder.publishStepSize = this.publishStepSizeSelected.join(',')
      return this.curvePrdOrder
    },
    // 获取关键期限
    getPrdKtList() {
      return this.curvePrdKdList
    },
    // 获取自动编制
    getPrdOrderAutoList() {
      return this.curvePrdOrderAutoList
    },
    // 获取自动编制关键期限
    getPrdOrderAutoKtList() {
      return this.curvePrdOrderAutoKtList
    },
    // 获取自动编制关键期限，选择列表
    getPrdOrderAutoKtListSelected() {
      var selected = []
      if (this.$refs.curvePrdOrderAutoKtList) {
        var selecttion = this.$refs.curvePrdOrderAutoKtList.selection
        if (selecttion && selecttion.length > 0) {
          for (let i = 0; i < selecttion.length; i++) {
            selected.push(selecttion[i].standSlip)
          }
        }
      }
      return selected
    },
    // 删除关键期限
    deleteCurvePrdKd(index, row) {
      this.curvePrdKdList.splice(index, 1)
    },
    // 规则设置
    toSetRule() {
      console.info('========tosetrule==========')
      this.addAutoRuleFormVisible = true
      // init auto kt
      this.preview()
    },
    toAddCurve() {
      console.info('toAddCurve:')
      var value = this.autoRuleCurve
      var label = this.$refs.autoRuleCurve.selectedLabel
      var orderId = this.$refs.autoRuleCurve.selected.$attrs.orderId
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
      this.curvePrdOrderAutoList.push({
        curveOrderId: this.orderData.curveOrderId, // 曲线批次ID
        curveOrderName: this.orderData.orderName, // 曲线批次ID，批次名称
        curveWeight: '', // 权重
        curveId: value, // 依赖曲线ID
        productName: label, // 依赖曲线名称
        depCurveOrderId: orderId, // 依赖曲线对应批次ID
        orderName: '', // 批次名称
        curveBuildStatus: '' // 曲线编制状态
      })
    },
    // 检查曲线ID
    checkPrdOrderAuto(curveId) {
      for (var i = 0; i < this.curvePrdOrderAutoList.length; i++) {
        var item = this.curvePrdOrderAutoList[i]
        if (item.curveId === curveId) {
          return false
        }
      }
      return true
    },
    // 获取列表中曲线ID
    getAutoCurveIds() {
      var ids = []
      if (this.curvePrdOrderAutoList && this.curvePrdOrderAutoList.length > 0) {
        for (let i = 0; i < this.curvePrdOrderAutoList.length; i++) {
          ids.push(this.curvePrdOrderAutoList[i].curveId)
        }
      }
      return ids
    },
    // 预览
    preview() {
      console.info('preview')

      this.curvePrdOrderAutoKtList = []
      // 查询关键期限列表
      queryPrdOrderKts({ curveIds: this.getAutoCurveIds().join(',') }).then(response => {
        const list = response
        const standSlipArray = []
        if (list && list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            if (this.curvePrdOrderAutoKtList.indexOf(item) < 0) {
              this.curvePrdOrderAutoKtList.push({ standSlip: item })
              standSlipArray.push(item)
            }
          }
        }

        // 增加当前产品关键期限
        if (this.curvePrdKdList && this.curvePrdKdList.length > 0) {
          for (var i = 0; i < this.curvePrdKdList.length; i++) {
            const item = this.curvePrdKdList[i]

            if (standSlipArray.indexOf(item.standSlip) < 0) {
              this.curvePrdOrderAutoKtList.push({ standSlip: item.standSlip })
            }
          }
        }

        // 增加自动勾选内容 prdOrderAutoKdsKeys
        for (var i = 0; i < this.curvePrdOrderAutoKtList.length; i++) {
          const item = this.curvePrdOrderAutoKtList[i]

          if (this.prdOrderAutoKdsKeys.indexOf(item.standSlip) >= 0) {
            this.$refs.curvePrdOrderAutoKtList.toggleRowSelection(item, true) // 默认选中
          }
        }
      })
    },
    // 是否可选
    prdOrderAutoKtSelectable(row, index) {
      console.info('prdOrderAutoKtSelectable')
      if (this.curvePrdKdList && this.curvePrdKdList.length > 0) {
        for (var i = 0; i < this.curvePrdKdList.length; i++) {
          const item = this.curvePrdKdList[i]
          if (item.standSlip === row.standSlip) {
            return true
          }
        }
      }
      return false
    },
    // 保存自动编制
    saveOrderAuto() {
      var list = this.curvePrdOrderAutoList
      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          var item = list[i]
          if (!item.curveWeight) {
            this.$message({
              type: 'warning',
              duration: 10000,
              showClose: true,
              message: '权重不能为空'
            })
            return false
          }
        }
      }
      this.addAutoRuleFormVisible = false
    },
    // 加载上一批次信息
    loadLastOrder(index) {
      this.$emit('locaLastOrder', index)
    }
  }
}
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 0px;
  }
  .order-switch{
    position: absolute;
    right: 0;
    top: 0;
    height: 200px;
    width: 240px;
    border: 1px solid #c0c4cc;
    text-align: center;
  }
  .switch-label{
    float: left;
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .switch-item{
    line-height: 36px;
  }
</style>
