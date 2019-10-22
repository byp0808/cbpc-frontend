<template>
  <div class="app-container">

    <el-form ref="curvePrdOrder" :model="curvePrdOrder" label-width="140px">
      <el-form-item label="该批次所需模型">
        <el-radio-group v-model="curvePrdOrder.model">
          <el-radio v-for="item in modelOption" :key="item.value" :disabled="disabled || item.disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需编制方式">
        <el-radio-group v-model="curvePrdOrder.buildType" @change="disableCheck">
          <el-radio v-for="item in buildTypeOption" :key="item.value" :disabled="disabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需计算方式">
        <el-radio-group v-model="curvePrdOrder.computedType">
          <el-radio v-for="item in computedTypeOption" :key="item.value" :disabled="computedTypeDisabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="该批次所需发布方式">
        <el-radio-group v-model="curvePrdOrder.publishType">
          <el-radio v-for="item in publishTypeOption" :key="item.value" :disabled="publishTypeDisabled" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="曲线发布类型">
        <el-checkbox-group v-model="curvePubTypeSelected">
          <el-checkbox v-for="item in curvePubTypeOption" :key="item.value" :disabled="true" :label="item.value">{{ item.label }}</el-checkbox>
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
              <el-date-picker v-model="curvePrdOrder.orderClosedSt" :disabled="disabled" type="date" style="width:180px" value-format="yyyy-MM-dd" placeholder="选择日期" @change="dateComparison()" />
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="switch-item">
            <label class="switch-label">结束</label>
            <el-col :span="4">
              <el-date-picker v-model="curvePrdOrder.orderClosedEt" :disabled="disabled" type="date" style="width:180px" value-format="yyyy-MM-dd" placeholder="选择日期" @change="dateComparison()" />
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
      <el-select v-model="curvePrdOrder.orderAutoBuildRule" placeholder="请选择自动编制规则" :disabled="orderAutoBuildRuleDisabled">
        <el-option v-for="item in autoRuleOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="toSetRule" :disabled="toSetRuleDisabled">设置</el-button>
    </el-row>

    <el-dialog :lock-scroll="lockScroll" append-to-body :close-on-click-modal="false" width="80%" title="设置" :visible.sync="addAutoRuleFormVisible">
      <el-row>
        <el-select ref="autoRuleCurve" v-model="autoRuleCurve" placeholder="请选择曲线" :disabled="disabled">
          <el-option v-for="item in autoRuleCurveOptions" :key="item.value" :label="item.label" :value="item.value" :curve-order-id="item.curveOrderId" />
        </el-select>
        <el-button type="primary" @click="toAddCurve">确认添加</el-button>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-table
            ref="tmp_curvePrdOrderAutoList"
            :data="tmp_curvePrdOrderAutoList"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column prop="productName" label="曲线名称" width="140" show-overflow-tooltip />
            <el-table-column prop="curveWeight" label="权重" width="140" show-overflow-tooltip type="number">
              <template slot-scope="{row}">
                <el-input v-model="row.curveWeight" type="number" class="edit-input" size="small" style="width: 70px" /> %
              </template>
            </el-table-column>
            <el-table-column prop="" label="批次" width="140" show-overflow-tooltip>
              <template>
                {{ orderName }}
              </template>
            </el-table-column>
            <el-table-column prop="curveBuildStatus" label="所需状态" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.curveBuildStatus" placeholder="请选择产品状态" :disabled="disabled">
                  <el-option v-for="item in prdStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="60" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="deleteCurvePrdOrderAutoList(scope.$index)"
                  :disabled="disabled"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" :offset="3">
          <el-button type="primary" @click="preview('BTN')">预览</el-button>
          <el-table
            ref="curvePrdOrderAutoKtList"
            :data="curvePrdOrderAutoKtList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
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
import { getCurveOrderList } from '@/api/curve/curve-product-list.js'
import { queryPrdOrderKtInfoList } from '@/api/curve/curve-product-order.js'
export default {
  name: 'CurveProductDefOrderDetailForm',
  components: {
  },
  props: ['disabled', 'orderName', 'orderIndex', 'orderData', 'curvePrdKdList', 'curvePrdOrderAutoList', 'autoPrdOrderKts', 'prdOrderAutoKds', 'productInfo'],
  data() {
    return {
      lockScroll: true,
      curvePrdOrder: {
      },
      interestDueFreqSelected: [],
      curvePubTypeSelected: [],
      publishStepSizeSelected: [],
      // 自动编制规则
      // autoRule: '1',
      // 自动编制规则弹窗
      addAutoRuleFormVisible: false,
      // 自动编制规则-选择曲线
      autoRuleCurve: '',
      // 曲线列表
      autoRuleCurveOptions: [],
      // 曲线产品自动编制关键期限
      curvePrdOrderAutoKtList: [],
      // 自动编制关键期限，勾选内容
      prdOrderAutoKdsKeys: [],
      curveKdsIntersection: [], // 所有曲线关键期限交集
      tmp_prdOrderAutoKdsKeys: [], // 编辑时修改数据
      tmp_curvePrdOrderAutoList: [], // 编辑时自动编制列表，保存后，同步curvePrdOrderAutoList
      // 计算方式disable
      computedTypeDisabled: false,
      // 发布方式disable
      publishTypeDisabled: false,
      // 自动编制规则disable
      orderAutoBuildRuleDisabled: false,
      // 设置disable
      toSetRuleDisabled: false
    }
  },
  computed: {
    // 该批次所需模型
    modelOption() {
      return optioins(this, 'MODEL')
    },
    // 该批次所需编制方式
    buildTypeOption() {
      return optioins(this, 'BUILD_TYPE')
    },
    // 该批次所需计算方式
    computedTypeOption() {
      return optioins(this, 'COMPUTED_TYPE')
    },
    // 该批次所需发布方式
    publishTypeOption() {
      return optioins(this, 'PUBLISH_TYPE')
    },
    // 曲线发布类型
    curvePubTypeOption() {
      return optioins(this, 'CURVEPUB_TYPE')
    },
    // 是否发布曲线样本券
    publishSampleFlagOption() {
      return optioins(this, 'Y_OR_N')
    },
    // 发布步长
    publishStepSizeOption() {
      return optioins(this, 'PUBLISH_STEP_SIZE')
    },
    // 付息频率
    interestDueFreqOption() {
      return optioins(this, 'INTEREST_DUE_FREQ')
    },
    // 自动编制规则
    autoRuleOptions() {
      return optioins(this, 'AUTO_RULE')
    },
    prdStatusOptions() {
      return optioins(this, 'CURVE_BUILD_STATUS')
    }
  },
  watch: {
    'curvePrdOrder.buildType'(newVal, oldVal) {
      this.disableCheck()
    },
    'curvePrdOrder.computedType'(newVal, oldVal) {
      this.disableCheck()
    },
    'curvePrdOrder.publishType'(newVal, oldVal) {
      this.disableCheck()
    }
  },
  beforeMount() {
    console.info('curve-product-def-order-detail.vue.beforeMount:')
    debugger
    this.curvePrdOrder = this.orderData
    // 更新曲线发布类型、发布步长、付息频率
    if (this.curvePrdOrder) {
      if (this.curvePrdOrder.interestDueFreq) {
        this.interestDueFreqSelected = this.curvePrdOrder.interestDueFreq.split(',')
      }
      var maturityFlag = this.productInfo.maturityFlag
      var spotFlag = this.productInfo.spotFlag
      var forwardFlag = this.productInfo.forwardFlag
      if (maturityFlag === 'Y') {
        this.curvePubTypeSelected.push('1')
      }
      if (spotFlag === 'Y') {
        this.curvePubTypeSelected.push('2')
      }
      if (forwardFlag === 'Y') {
        this.curvePubTypeSelected.push('3')
      }
      // this.curvePubTypeSelected = this.curvePrdOrder.curvePubType.split(',')
      if (this.curvePrdOrder.publishStepSize) {
        this.publishStepSizeSelected = this.curvePrdOrder.publishStepSize.split(',')
      }
    }

    getCurveOrderList({ orderId: this.orderData.orderId }).then(response => {
      console.info('queryCurveProductList.queryCurveProductList...')
      const { dataList } = response
      for (var i = 0; i < dataList.length; i++) {
        var item = dataList[i]
        this.autoRuleCurveOptions.push({ value: item.curveId, label: item.productName, curveOrderId: item.curveOrderId })
      }
    })

    // 如果产品批次-自动编制-关键期限列表，不为空，则说明已经保存过数据，页面初始化时显示列表
    this.prdOrderAutoKdsKeys = []
    if (this.prdOrderAutoKds && this.prdOrderAutoKds.length > 0) {
      for (var i = 0; i < this.prdOrderAutoKds.length; i++) {
        this.prdOrderAutoKdsKeys.push(this.prdOrderAutoKds[i].standSlip)
      }
    }
    this.disableCheck()
  },
  methods: {
    // 获取获取批次信息
    getCurvePrdOrder() {
      this.curvePrdOrder.interestDueFreq = this.interestDueFreqSelected.join(',')
      this.curvePrdOrder.curvePubType = this.curvePubTypeSelected.join(',')
      this.curvePrdOrder.publishStepSize = this.publishStepSizeSelected.join(',')
      return this.curvePrdOrder
    },
    setCurvePrdOrder() {
      if (this.curvePrdOrder.interestDueFreq) {
        this.interestDueFreqSelected = this.curvePrdOrder.interestDueFreq.split(',')
      }
      if (this.curvePrdOrder.curvePubType) {
        this.curvePubTypeSelected = this.curvePrdOrder.curvePubType.split(',')
      }
      if (this.curvePrdOrder.publishStepSize) {
        this.publishStepSizeSelected = this.curvePrdOrder.publishStepSize.split(',')
      }
    },
    // 获取关键期限
    getPrdKtList() {
      return this.curvePrdKdList
    },
    // 获取自动编制
    getPrdOrderAutoList() {
      return this.tmp_curvePrdOrderAutoList
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
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.curvePrdKdList.splice(index, 1)
      }).catch(() => {
        console.info('cancle')
      })
    },
    // 规则设置
    toSetRule() {
      console.info('========tosetrule==========')
      if (!this.curvePrdOrder.orderAutoBuildRule) {
        this.$message({
          type: 'error',
          message: '请选择自动编制规则'
        })
        return false
      }
      this.addAutoRuleFormVisible = true

      // 默认从缓存中获取数据
      this.tmp_curvePrdOrderAutoList = []
      if (this.curvePrdOrderAutoList) {
        for (const item of this.curvePrdOrderAutoList) {
          var newItem = _.assign({}, item)
          this.tmp_curvePrdOrderAutoList.push(newItem)
        }
      }
      // init auto kt
      this.preview('toSetRule')
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
      var curveOrderId = this.$refs.autoRuleCurve.selected.$attrs.curveOrderId

      this.tmp_curvePrdOrderAutoList.push({
        curveOrderId: this.orderData.curveOrderId, // 曲线批次ID
        curveOrderName: this.orderData.orderName, // 曲线批次ID，批次名称
        curveWeight: '', // 权重
        curveId: value, // 依赖曲线ID
        productName: label, // 依赖曲线名称
        depCurveOrderId: curveOrderId, // 依赖曲线对应批次ID
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
      if (this.tmp_curvePrdOrderAutoList && this.tmp_curvePrdOrderAutoList.length > 0) {
        for (let i = 0; i < this.tmp_curvePrdOrderAutoList.length; i++) {
          ids.push(this.tmp_curvePrdOrderAutoList[i].curveId)
        }
      }
      return ids
    },
    // 预览
    async preview(from) {
      console.info('preview')
      //
      this.tmp_prdOrderAutoKdsKeys = []
      this.prdOrderAutoKdsKeys.forEach((item, index) => {
        this.tmp_prdOrderAutoKdsKeys.push(item)
      })
      // 右侧关键期限列表
      this.curvePrdOrderAutoKtList = []
      var ids = this.getAutoCurveIds()
      var curvekdArray = {}
      const standSlipArray = []

      // 查询关键期限列表
      await queryPrdOrderKtInfoList({ curveIds: ids.join(',') }).then(response => {
        const list = response

        if (list && list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            const standSlip = item.standSlip
            const _tmp_curveId = item.curveId
            // 循环每一曲线关键期限，需要取交集
            var curveKd = curvekdArray[_tmp_curveId]
            if (!curveKd) {
              curveKd = []
              curvekdArray[_tmp_curveId] = curveKd
            }
            curveKd.push(standSlip)

            // 过滤重复关键期限
            if (standSlipArray.indexOf(standSlip) < 0) {
              this.curvePrdOrderAutoKtList.push({ standSlip: standSlip })
              standSlipArray.push(standSlip)
            }
          }
        }
        console.info('所有曲线关键期限:' + JSON.stringify(curvekdArray))
        // 预览按钮点击，重置勾选框

        // 增加当前产品关键期限
        this.curveKdsIntersection = []
        if (this.curvePrdKdList && this.curvePrdKdList.length > 0) {
          for (let i = 0; i < this.curvePrdKdList.length; i++) {
            const item = this.curvePrdKdList[i]
            this.curveKdsIntersection.push(item.standSlip)
            // 添加不存在的
            if (standSlipArray.indexOf(item.standSlip) < 0) {
              this.curvePrdOrderAutoKtList.push({ standSlip: item.standSlip })
            }
          }
        }
        console.info('当前曲线关键期限:' + JSON.stringify(this.curveKdsIntersection))

        // 所有曲线的交集
        for (const _tmp_curveKd of ids) {
          let kds = curvekdArray[_tmp_curveKd]
          if (!kds) {
            kds = []
          }
          this.curveKdsIntersection = _.intersection(this.curveKdsIntersection, kds)
        }
        console.info('所有关键期限交集:' + JSON.stringify(this.curveKdsIntersection))

        // 预览默认选中交集
        if (from === 'BTN') {
          this.tmp_prdOrderAutoKdsKeys = []
          for (const standSlip of this.curveKdsIntersection) {
            this.tmp_prdOrderAutoKdsKeys.push(standSlip)
          }
        }

        this.curvePrdOrderAutoKtList.sort((a, b) => Number(a.standSlip) - Number(b.standSlip))
        // 增加自动勾选内容 prdOrderAutoKdsKeys
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < this.curvePrdOrderAutoKtList.length; i++) {
          const item = this.curvePrdOrderAutoKtList[i]

          if (this.tmp_prdOrderAutoKdsKeys.indexOf(item.standSlip) >= 0) {
            this.$refs.curvePrdOrderAutoKtList.toggleRowSelection(item, true) // 默认选中
          }
        }
      })
    },
    // 是否可选
    prdOrderAutoKtSelectable(row, index) {
      console.info('prdOrderAutoKtSelectable')
      // 只有交集关键期限可选
      if (this.curveKdsIntersection && this.curveKdsIntersection.length > 0) {
        for (var i = 0; i < this.curveKdsIntersection.length; i++) {
          const item = this.curveKdsIntersection[i]
          if (item === row.standSlip) {
            return true
          }
        }
      }
      return false
    },
    // 保存自动编制
    saveOrderAuto() {
      var list = this.tmp_curvePrdOrderAutoList
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
      // 同步选择的关键期限
      this.prdOrderAutoKdsKeys = this.getPrdOrderAutoKtListSelected()
      this.curvePrdOrderAutoList.length = 0
      if (this.tmp_curvePrdOrderAutoList) {
        for (const item of this.tmp_curvePrdOrderAutoList) {
          var newItem = _.assign({}, item)
          this.curvePrdOrderAutoList.push(newItem)
        }
      }
      this.addAutoRuleFormVisible = false
    },
    // 加载上一批次信息
    loadLastOrder(index) {
      this.$emit('locaLastOrder', index)
    },
    // 删除自动编制条件
    deleteCurvePrdOrderAutoList(index) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.tmp_curvePrdOrderAutoList.splice(index, 1)
      }).catch(() => {
        console.info('cancle')
      })
    },
    disableCheck() {
      // 如果编制方式选择 人工干预编制，发布方式默认选择人工发布，且置灰
      if (this.curvePrdOrder.buildType === '1') {
        this.curvePrdOrder.computedType = '1'
        this.curvePrdOrder.publishType = '1'
        this.computedTypeDisabled = true
        this.publishTypeDisabled = true
        this.orderAutoBuildRuleDisabled = true
        this.toSetRuleDisabled = true
      } else if (this.curvePrdOrder.buildType === '2') {
        this.computedTypeDisabled = false
        this.orderAutoBuildRuleDisabled = false
        this.toSetRuleDisabled = false
        if (this.curvePrdOrder.computedType === '1') {
          this.publishTypeDisabled = true
          this.curvePrdOrder.publishType = '1'
        } else {
          this.publishTypeDisabled = false
          this.curvePrdOrder.publishType = '2'
        }
      }
      if (this.disabled) {
        this.computedTypeDisabled = true
        this.publishTypeDisabled = true
        this.orderAutoBuildRuleDisabled = true
      }
    },
    handleSelectionChange(items) {
      this.multipleSelection = items
    },
    dateComparison() {
      var orderClosedSt = this.curvePrdOrder.orderClosedSt
      var orderClosedEt = this.curvePrdOrder.orderClosedEt
      if (orderClosedSt > orderClosedEt && orderClosedSt && orderClosedEt) {
        this.$message({
          type: 'error',
          message: '结束时间要大于开始时间！'
        })
      }
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
