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
      <el-form ref="productInfo" :model="productInfo" status-icon :rules="productInfoRules" label-width="120px" class="demo-ruleForm">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="曲线产品名称" prop="productName">
              <el-input v-model="productInfo.productName" :disabled="disabled" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线基础产品">
              <el-input v-model="productInfo.basePrdCode" disabled="disabled" />
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
              <el-select v-model="productInfo.markets" multiple placeholder="请选择市场"  >
                <el-option v-for="item in marketOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线评级">
              <el-input v-model="productInfo.productGrade" type="text" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排列顺序" prop="sort">
              <el-input v-model.number="productInfo.sort" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制日历" prop="createCalendars">
              <el-select v-model="productInfo.createCalendars" multiple placeholder="请选择编制日历" :disabled="disabled">
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
            <el-form-item label="曲线发布日期" prop="curveStartTime" :disabled="disabled">
              <el-date-picker
                v-model="productInfo.curveStartTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线基准利率">
              <el-select v-if="productInfo.rateType != '01'" v-model="productInfo.referRate" placeholder="请选择基准利率" :disabled="disabled">
                <el-option v-for="item in referRateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-form-item label="曲线终止日期" prop="curveEndTime">
              <el-date-picker
                v-model="productInfo.curveEndTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center">
        <el-button type="primary" :disabled="disabled" @click="saveProductInfo('productInfo')">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 1" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>构建曲线类型</h3>
      </div>
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 2" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>定义曲线期限</h3>
      </div>
      <el-transfer
        v-model="value4"
        class="text-center"
        :props="{
          key: 'value',
          label: 'desc'
        }"
        :titles="['估值基本信息', '估值基本信息']"
        :data="data3"
      />
      <el-transfer
        v-model="value4"
        class="text-center"
        :props="{
          key: 'value',
          label: 'desc'
        }"
        :titles="['估值指标', '估值指标']"
        :data="data3"
      />
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 3" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>批次发布</h3>
      </div>
      <div class="text-center">
        <el-button type="primary" @click="next">确认</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 4" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>确认产品</h3>
      </div>
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { formatTimeToStr } from '@/utils/date.js'
import { saveProductInfo, getCurveProduct } from '@/api/curve/curve-product-list.js'
import { optioins } from '@/api/curve/code-type.js'
export default {
  name: 'ValuationProdForm',
  components: {

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
        callback(new Error('曲线发布起始日不能晚于曲线终止日期'))
      } else {
        callback()
      }
    }

    // 曲线发布终止日
    var checkCurveEndTime = (rule, value, callback) => {
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
        callback(new Error('曲线发布起始日不能晚于曲线终止日期'))
      } else {
        callback()
      }
    }

    return {
      disabled: false,
      stepActive: 0,
      productInfoRules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        productShortName: [
          { required: true, message: '请输入产品简称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        productEnglishName: [
          { required: true, message: '请输入产品英文名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
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
          { required: true, message: '请选择利率类型', trigger: 'change' }
        ],
        curveStartTime: [
          { validator: checkCurveStartTime, trigger: 'change' }
        ],
        curveEndTime: [
          { validator: checkCurveEndTime, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 市场选项
    marketOptions() {
      return optioins('CODE_TYPE_MARKET')
    },
    calendarOptions() {
      return optioins('CODE_TYPE_CALENDAR')
    },
    currencyOptions() {
      return optioins('CURRENCY')
    },
    rateTypeOptions() {
      return optioins('RATE_TYPE')
    },
    referRateOptions() {
      return optioins('REFER_RATE')
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
        console.info('================set....');
        this.$store.commit('curveProduct/setCurveProductInfo', info)
      }
    }
  },
  beforeMount() {
    this.productInfo = {}
    console.info('beforeMount:' + this.basePrdCode)
    if (this.basePrdCode) {
      this.productInfo.basePrdCode = this.basePrdCode
    }

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
    }

    if (id) {
      getCurveProduct(id).then(reponse => {
        this.$store.commit('curveProduct/setCurveProductInfo', reponse)
      })
    }
  },
  methods: {
    stepOnclick(index) {
      console.info('stepOnclick:' + index)
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
        this.productInfo.maturityFlag = 1
      }
      if (!this.productInfo.spotFlag) {
        this.productInfo.spotFlag = 1
      }
      if (!this.productInfo.forwardFlag) {
        this.productInfo.forwardFlag = 1
      }
      if (!this.productInfo.validFlag) {
        this.productInfo.validFlag = 'N'
      }
      return this.productInfo
    },
    saveProductInfo(formName) {
      console.info('saveProductInfo1')
      if (!this.productInfo.basePrdCode) {
        this.$message({
          message: '获取基础产品错误！',
          type: 'error',
          showClose: true
        })
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 调用保存方法
          saveProductInfo(this.getProductInfo()).then(response => {
            // 保存最新信息
            if (response && response.curveId) {
              this.productInfo = response
            }
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
    }
  }
}
</script>

<style scoped>

</style>
