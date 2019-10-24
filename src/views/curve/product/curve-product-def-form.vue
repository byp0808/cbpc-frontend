<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-steps :active="stepActive" align-center finish-status="success" process-status="finish">
        <el-step title="定义曲线基本信息" @click.native="stepOnclick(0)" />
        <el-step title="构建曲线类型" @click.native="stepOnclick(1)" />
        <el-step title="定义曲线期限" @click.native="stepOnclick(2)" />
        <el-step title="批次发布" @click.native="stepOnclick(3)" />
        <el-step title="确认产品" @click.native="stepOnclick(4)" />
      </el-steps>
    </el-card>
    <el-card v-if="stepActive === 0" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>基本信息</h3>
      </div>
      <el-form ref="productInfo" :model="productInfo" status-icon :rules="productInfoRules" label-width="120px" class="demo-ruleForm baseinfo">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="曲线产品名称" prop="productName">
              <el-input v-model="productInfo.productName" :disabled="disabled" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线基础产品">
              <el-select v-model="productInfo.basePrdCode" filterable disabled="disabled" placeholder="请选择曲线">
                <el-option
                  v-for="item in optioins(this,'BASE_PRD_CODE')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线编码">
              <el-input v-model="productInfo.curvePrdCode" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线产品简称" prop="productShortName">
              <el-input v-model="productInfo.productShortName" type="text" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线英文名称" prop="productEnglishName">
              <el-input v-model="productInfo.productEnglishName" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市场" prop="markets">
              <el-select v-model="productInfo.markets" multiple placeholder="请选择市场" :disabled="disabled" @change="selectTrigger('market')">
                <el-option v-for="item in marketOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col><el-col :span="8">
            <el-form-item label="产品状态" prop="prdStatus">
              <el-select v-model="productInfo.prdStatus" placeholder="请选择产品状态" :disabled="disabled">
                <el-option v-for="item in prdStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线评级">
              <!-- <el-input v-model="productInfo.productGrade" type="text" :disabled="disabled" />-->
              <el-select v-model="productInfo.productGrade" placeholder="请选择曲线评级" :disabled="disabled">
                <el-option
                  v-for="(name, key) in $dict('MARKET_GRADE')"
                  :key="key"
                  :label="name"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线族系">
              <el-select v-model="productInfo.productType" placeholder="请选择曲线族系" :disabled="disabled">
                <el-option v-for="item in prdTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制日历" prop="createCalendars">
              <el-select v-model="productInfo.createCalendars" multiple placeholder="请选择编制日历" :disabled="disabled" @change="selectTrigger('createCalendar')">
                <el-option v-for="item in calendarOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="币种" prop="currency">
              <el-select v-model="productInfo.currency" placeholder="请选择币种" :disabled="disabled">
                <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="利率类型" prop="rateType">
              <el-select v-model="productInfo.rateType" placeholder="请选择利率类型" :disabled="disabled">
                <el-option v-for="item in rateTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="productInfo.rateType != '01'" label="曲线基准利率" prop="referRate">
              <el-select v-model="productInfo.referRate" placeholder="请选择基准利率" :disabled="disabled">
                <el-option v-for="item in referRateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上市日" prop="curveStartTime" :disabled="disabled">
              <el-date-picker
                v-model="productInfo.curveStartTime"
                align="right"
                type="date"
                placeholder="选择上市日"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停产日" prop="curveEndTime" :disabled="disabled">
              <el-date-picker
                v-model="curveEndTime"
                align="right"
                type="date"
                placeholder="选择停产日"
                :disabled="disabled"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线编制类型">
              <el-select v-model="productInfo.curveBuildType" placeholder="请选择编制类型" :disabled="disabled">
                <el-option v-for="item in curveBuildTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-popover placement="top-start" title="" width="250" trigger="hover" data-html="true" >
                <div>
                  注：利率类型的设置会影响后续功能<br>1.曲线行情对敲判断<br> 2.曲线方案初始化<br> 3.盯市点差调整
                </div>
                <i slot="reference" class="el-icon-info curveBuildTypePopover" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线价格源">
              <el-select v-model="productInfo.curvePriceFr" placeholder="请选择曲线价格源" :disabled="disabled">
                <el-option v-for="item in curvePriceFrOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注(对内展示)" prop="remark">
              <el-input v-model="productInfo.remark" type="text" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center">
        <el-button type="primary" :disabled="disabled" @click="saveProductInfo('productInfo')">保存</el-button>
      </div>
    </el-card>
    <el-card v-show="stepActive === 1" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>构建曲线类型</h3>
      </div>
      <CurveConstructType
        ref="curveConstructType"
        :product-info="productInfo"
        :disabled="disabled"
      />
      <div class="text-center">
        <el-button type="primary" :disabled="disabled" @click="storageCurveInfo">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 2" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>定义曲线期限</h3>
      </div>
      <CurvePrdKd
        ref="curvePrdKd"
        :product-id="productId"
        :product-info="productInfo"
        :disabled="disabled"
      />
      <div class="text-center">
        <el-button type="primary" :disabled="disabled" @click="defCurvePeriod">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 3" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>批次发布</h3>
      </div>
      <CurveProductDefOrderForm
        ref="refCurveProductDefOrderForm"
        :product-id="productId"
        :disabled="disabled"
        :product-info="productInfo"
        :op-type="opType"
        @saveOrderCallBack="saveOrderCallBack"
      />
      <div class="text-center">
        <el-button type="primary" :disabled="disabled" @click="saveOrder">确认</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 4" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>确认产品  编制曲线编码：{{this.productInfo.curvePrdCode}}</h3>
      </div>
      <CurveProductDefConfirm
        ref="refCurveProductDefConfirm"
        :product-id="productId"
        :op-type="opType"
      />
      <div class="text-center">
        <el-button type="primary" :disabled="disabled" @click="curvePrdConfirm">确认</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { formatTimeToStr } from '@/utils/date.js'
import { saveProductInfo, getCurveProduct, storageCurveInfo, defCurvePeriod, confirmCurveInfo } from '@/api/curve/curve-product-list.js'
import { optioins } from '@/api/curve/code-type.js'
import CurveProductDefOrderForm from '@/views/curve/product/curve-product-def-order.vue'
import CurveConstructType from '@/views/curve/product/curve-construct-type.vue'
import CurvePrdKd from '@/views/curve/product/curve-prd-kd.vue'
import CurveProductDefConfirm from '@/views/curve/product/curve-product-def-confirm.vue'
export default {
  name: 'CurveProductDefForm',
  components: {
    CurveProductDefOrderForm,
    CurveConstructType,
    CurvePrdKd,
    CurveProductDefConfirm
  },
  props: ['basePrdCode', 'productId', 'opType', 'businessId'],
  data() {
    // 曲线发布起始日
    var checkCurveStartTime = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }
      var endDate = this.productInfo.curveEndTime
      if (!endDate) {
        callback()
        return
      }
      var start = formatTimeToStr(value, 'yyyy-MM-dd')
      var end = formatTimeToStr(endDate, 'yyyy-MM-dd')
      console.info('starttime:' + start + ',end:' + end)
      if (start > end) {
        callback(new Error('上市日不能晚于停产日'))
      } else {
        callback()
      }
    }

    // 曲线发布终止日
    var checkCurveEndTime = (rule, value, callback) => {
      value = this.productInfo.curveEndTime
      if (!value) {
        callback()
        return
      }
      var startdate = this.productInfo.curveStartTime
      if (!startdate) {
        callback()
        return
      }
      var start = formatTimeToStr(startdate, 'yyyy-MM-dd')
      var end = formatTimeToStr(value, 'yyyy-MM-dd')
      console.info('starttime:' + start + ',end:' + end)
      if (start > end) {
        callback(new Error('上市日不能晚于停产日'))
      } else {
        callback()
      }
    }

    return {
      disabled: false,
      stepActive: 0,
      curveEndTime: null,
      productInfoRules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        productShortName: [
          { required: true, message: '请输入产品简称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        productEnglishName: [
          { required: true, message: '请输入产品英文名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' }
        ],
        markets: [
          { required: true, message: '请选择市场', trigger: 'change' }
        ],
        currency: [
          { required: true, message: '请选择币种', trigger: 'change' }
        ],
        rateType: [
          { required: true, message: '请选择利率类型', trigger: 'change' }
        ],
        createCalendars: [
          { required: true, message: '请选择编制日历', trigger: 'change' }
        ],
        curveStartTime: [
          { validator: checkCurveStartTime, trigger: 'change' }
        ],
        curveEndTime: [
          { validator: checkCurveEndTime, trigger: 'change' }
        ],
        remark: [
          { min: 0, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ],
        referRate: [
          { required: true, message: '请选择曲线基准利率', trigger: 'change' }
        ],
        prdStatus: [
          { required: true, message: '请选择产品状态', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        shortcuts: [
          { text: '今天', onClick(picker) { picker.$emit('pick', new Date()) } }
        ]
      }
    }
  },
  computed: {
    // 市场选项
    marketOptions() {
      return optioins(this, 'MARKET')
    },
    calendarOptions() {
      return optioins(this, 'CALENDAR')
    },
    currencyOptions() {
      return optioins(this, 'CURRENCY')
    },
    rateTypeOptions() {
      return optioins(this, 'RATE_TYPE')
    },
    referRateOptions() {
      return optioins(this, 'REFER_RATE')
    },
    curveBuildTypeOptions() {
      return optioins(this, 'CURVE_BUILD_TYPE')
    },
    curvePriceFrOptions() {
      return optioins(this, 'CURVE_PRICE_FR')
    },
    prdStatusOptions() {
      return optioins(this, 'CURVE_PRODCUT_SATAUS')
    },
    prdTypeOptions() {
      return optioins(this, 'PRODUCT_TYPE')
    },
    productInfo: {
      get() {
        console.info('productInfo:')
        var info = this.$store.state.curveProduct.curveProductInfo
        if (info) {
          const market = info.market
          if (market) {
            info.markets = market.split(',')
          }
          const createCalendar = info.createCalendar
          if (createCalendar) {
            info.createCalendars = createCalendar.split(',')
          }
        }
        return info
      },
      set(info) {
        console.info('================set....')
        this.$store.commit('curveProduct/setCurveProductInfo', info)
      }
    }
  },
  watch: {
    curveEndTime(newValue, oldValue) {
      console.info('curveEndTime:' + newValue)
      this.productInfo.curveEndTime = newValue
    }
  },
  beforeMount() {
    this.productInfo = {}
    console.info('beforeMount:' + this.basePrdCode)
    if (this.basePrdCode) {
      this.productInfo.basePrdCode = this.basePrdCode
    }
    this.productInfo.curveEndTime = new Date('9999-12-31').getTime()
    this.curveEndTime = this.productInfo.curveEndTime

    var id = ''
    if (this.productId) {
      id = this.productId

      if (this.opType === 'VIEW') {
        this.disabled = true
      } else {
        this.disabled = false
      }
    } else if (this.businessId) {
      id = this.businessId
      this.productId = id
      this.disabled = true
    }
    console.info('曲线产品ID:' + this.productId)
    if (id) {
      getCurveProduct(id).then(reponse => {
        this.$store.commit('curveProduct/setCurveProductInfo', reponse)
      })
    }
  },
  methods: {
    optioins: optioins,
    stepOnclick(index) {
      console.info('stepOnclick:' + index)
      if (index > 0) {
        if (!this.productId) {
          this.$message({
            message: '请先保存基本信息！',
            type: 'error',
            showClose: true
          })
          return
        }
      }

      var sort = this.productInfo.sort
      if (sort < index) {
        this.$message({
          message: '请先保存上一步骤信息！',
          type: 'error',
          showClose: true
        })
        return
      }

      // 如果是修改已审批通过的产品，则只允许先保存第一步，再操作后续步骤
      if (this.opType === 'EDIT' && '02' === this.productInfo.approveStatus) {
        if (index > 0) {
          this.$message({
            message: '请先保存基本信息！',
            type: 'error',
            showClose: true
          })
          return
        }
      }

      this.stepActive = index
    },
    next() {
      if (this.stepActive++ > 4) this.stepActive = 0
    },
    getProductInfo() {
      if (this.productInfo.markets) {
        this.productInfo.market = this.productInfo.markets.join(',')
      }
      if (this.productInfo.createCalendars) {
        this.productInfo.createCalendar = this.productInfo.createCalendars.join(',')
      }
      if (!this.productInfo.maturityFlag) {
        this.productInfo.maturityFlag = 'Y'
      }
      if (!this.productInfo.spotFlag) {
        this.productInfo.spotFlag = 'Y'
      }
      if (!this.productInfo.forwardFlag) {
        this.productInfo.forwardFlag = 'Y'
      }
      if (!this.productInfo.validFlag) {
        this.productInfo.validFlag = 'Y'
      }
      return this.productInfo
    },
    // 保存产品基本信息
    saveProductInfo(formName) {
      console.info('saveProductInfo1')
      if (!this.productInfo.basePrdCode) {
        this.$message({
          message: '获取基础产品错误！',
          type: 'error',
          showClose: true
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 调用保存方法
          var data = {
            ccdcCurvePrdInfo: this.getProductInfo(),
            opType: this.opType
          }
          saveProductInfo(data).then(response => {
            // 保存最新信息
            if (response && response.curveId) {
              this.productInfo = response
              this.productId = this.productInfo.curveId
            }
            this.opType = this.opType + '_SAVED'
            this.stepActive++
            this.$message({
              message: '操作成功！',
              type: 'success',
              showClose: true
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
      console.info('saveProductInfo3')
    },
    // 保存批次
    async saveOrder() {
      const { result } = await this.$refs.refCurveProductDefOrderForm.saveOrder()
      console.info('保存批次信息，返回:' + result)
      // 如果当前步骤号为2-曲线内容，关键期限保存成功后，更新步骤号为3
      if (this.productInfo.sort <= 3) {
        this.productInfo.sort = 4
      }
      if (result) {
        this.stepActive++
      }
    },
    saveOrderCallBack() {
      this.stepActive++
    },
    /**
     * 保存曲线类型
     */
    storageCurveInfo() {
      var productInfo = this.getProductInfo()
      var curveConstructType = this.$refs.curveConstructType.getCurveConstructType()
      // eslint-disable-next-line no-undef
      var data = _.assign(productInfo, curveConstructType)
      if (data.sort === 1) {
        data.sort = 2
      }
      // 调用保存方法
      var sendData = {
        ccdcCurvePrdInfo: data
      }
      storageCurveInfo(sendData).then(response => {
        this.stepActive++
        // 如果当前步骤号为1-只保存基本信息，保存成功后，步骤号为2
        if (data.sort === 1) {
          this.productInfo.sort = 2
        }
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    /**
     * 定义曲线类型
     */
    defCurvePeriod() {
      console.info('curve-product-def-form.vue==>defCurvePeriod')
      var curvePrdKdList = this.$refs.curvePrdKd.obtainCurvePrdKdList()
      var curvePrdNkList = this.$refs.curvePrdKd.obtainCurvePrdNkList()

      // 验证列表数据
      if (curvePrdKdList && curvePrdKdList.length > 0) {
        for (let i = 0; i < curvePrdKdList.length; i++) {
          var item = curvePrdKdList[i]
          if (!item.sampleIntervalDown && item.sampleIntervalDown !== 0 || !item.sampleIntervalUp && item.sampleIntervalUp !== 0) {
            this.$message({
              message: '第' + (i + 1) + '条关键期限,样本区间上、下限不能为空！',
              type: 'error',
              showClose: true
            })
            return false
          } else if (item.sampleIntervalDown >= item.sampleIntervalUp) {
            this.$message({
              message: '第' + (i + 1) + '条关键期限,样本区间下限必须小于区间上限！',
              type: 'error',
              showClose: true
            })
            return false
          }
          // 判断是否有区间交集
          if (i + 1 < curvePrdKdList.length) {
            var nextItem = curvePrdKdList[i + 1]
            if (item.sampleIntervalUp > nextItem.sampleIntervalDown) {
              this.$message({
                message: '关键期限,第' + (i + 1) + '条区间上限,不能大于第' + (i + 2) + '条区间下限',
                type: 'error',
                showClose: true
              })
              return false
            }
          }
        }
      } else {
        this.$message({
          message: '关键期限不可以为空',
          type: 'error',
          showClose: true
        })
        return false
      }

      if(this.productInfo.forwardFlag=='Y'&&curvePrdNkList.length<=0){
        this.$message({
          message: '远期NK值列表不能为空！',
          type: 'error',
          showClose: true
        })
        return false
      }
      var data = {
        curvePrdKdList: curvePrdKdList,
        curvePrdNkList: curvePrdNkList
      }
      defCurvePeriod(data).then(response => {
        this.stepActive++
        // 如果当前步骤号为2-曲线内容，关键期限保存成功后，更新步骤号为3
        if (this.productInfo.sort <= 2) {
          this.productInfo.sort = 3
        }
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    // 产品确认
    curvePrdConfirm() {
      if (!this.productId) {
        this.$message({
          message: '获取产品信息失败，请刷新后重新操作！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      confirmCurveInfo(this.productId).then(response => {
        this.stepActive++
        this.$emit('confirmCurveInfoCallBack')
        this.$message({
          message: '产品'+this.productInfo.productName+'完成装备！',
          type: 'success',
          showClose: true
        })
      })
    },
    // 多选事件
    selectTrigger(type) {
      if (type === 'market') {
        if (this.productInfo.markets) {
          this.productInfo.market = this.productInfo.markets.join(',')
        }
      } else if (type === 'createCalendar') {
        this.productInfo.createCalendar = this.productInfo.createCalendars.join(',')
      }
    }
  }
}
</script>

<style>
  .baseinfo .el-select__tags {
    white-space: nowrap;
    overflow: hidden;
  }
  .baseinfo .el-select {
    width: 100%
  }
  .baseinfo .el-select > div > span {
    display: block;
  }
  .baseinfo .el-select .el-select__tags>span{
    display: block;
  }
  .curveBuildTypePopover{
    color: red;
    float: left;
    position: absolute;
    top: 4px;
    left: -13px;
    font-size: 12px;
  }
</style>
