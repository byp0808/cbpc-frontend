<template>
  <div class="app-container">
    <el-col :span="10">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="曲线名称" prop="curveId">
          <el-select v-model="form.curveId" filterable placeholder="请选择曲线" class="with-full"  @change="curveIdChange">
            <el-option
              v-for="item in curveList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键期限" prop="curvePrdKd">
          <el-select v-model="form.curvePrdKd" placeholder="请选择活动区域" class="with-full">
            <el-option
              v-for="item in curvePrdKdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计算历史分位点">
          <el-col :span="11">
            <el-form-item prop="computeHisIndex">
              <el-select v-model="form.computeHisIndex" placeholder="" @change="computeHisIndexChange" prop="computeHisIndex">
                <el-option v-for="item in computeHisIndexOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-select v-model="form.computeHisDate" :disabled="computeHisDateDisabled" placeholder="">
              <el-option v-for="item in computeHisDateOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="输入关键期限收益率" prop="rate">
          <el-col :span="11">
            <el-input type="number" v-model="form.rate" />
          </el-col>
          <el-col :span="1">
            %
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">计算</el-button>
        </el-form-item>
        <el-form-item v-if="computeResult">
          <p>计算结果：{{ computeResult }}%</p>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>
<script>
import { getCurveProductIdOptions, queryCurvePrdKd } from '@/api/curve/curve-product-list.js'
import { computeHisIndex } from '@/api/curve/curve-set-hisindex.js'
import { optioins } from '@/api/curve/code-type.js'
export default {
  data() {
    return {
      curveList: [],
      curvePrdKd: [],
      curvePrdKdList: [],
      computeHisDateDisabled: true,
      computeResultVisible: false, // 计算结果是否显示
      computeResult: '', // 计算结果
      form: {
        curveId: '',
        curvePrdKd: '',
        computeHisIndex: '',
        computeHisDate: '',
        rate: ''
      },
      rules: {
        curveId: [
          {required: true, message: '请选择一条曲线', trigger: 'blur'}
        ],
        curvePrdKd: [
          {required: true, message: '请选择关键期限', trigger: 'blur'}
        ],
        computeHisIndex: [
          {required: true, message: '请选择历史分位点', trigger: 'blur'}
        ],
        rate: [
          {required: true, message: '请输入利率', trigger: 'blur'}
        ]

      }
    }
  },
  computed: {
    computeHisIndexOptions() {
      return optioins('COMPUTE_HISINDEX')
    },
    computeHisDateOptions() {
      return optioins('COMPUTE_HIS_DATE')
    }
  },
  beforeMount() {
    console.info('===beforeMount===')
    // 先加载列表
    this.curveList = getCurveProductIdOptions()
  },
  methods: {
    curveIdChange(newValue) {
      console.info('curveId.newValue:' + newValue)
      this.curvePrdKdList = []
      this.curvePrdKd = ''
      // 获取产品组
      this.getCurvePrdKd(newValue)

      if (this.curvePrdKdList.length > 0) {
        this.curvePrdKd = this.curvePrdKdList[0].value
      }
    },
    computeHisIndexChange(newValue) {
      // 自曲线发布以来，时间隐藏不可选
      if (newValue === '1') {
        this.computeHisDateDisabled = true
        this.computeHisDate = ''
      } else if (newValue === '2') {
        this.computeHisDateDisabled = false
      }
    },
    async getCurvePrdKd(curveId) {
      this.curvePrdKdList = []
      await queryCurvePrdKd({ curveId: curveId }).then(response => {
        if (response && response.dataList) {
          for (var i = 0; i < response.dataList.length; i++) {
            var item = response.dataList[i]
            this.curvePrdKdList.push({ value: item.standSlip, lable: item.standSlip })
          }
        }
      })
    },
    // 计算
    onSubmit() {
      console.log('submit!')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          computeHisIndex(this.form).then(response => {
            this.computeResultVisible = true
            this.computeResult = response.result
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style>
.with-full {
  width: 100%;
}
</style>
