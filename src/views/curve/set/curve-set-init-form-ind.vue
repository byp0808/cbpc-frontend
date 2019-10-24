<template>
  <div style="margin-top: 5px">
    <el-form ref="detailInfo" :model="detailInfo" style="padding:4px 8px;border:1px solid black;" label-width="120px">
      <el-form-item
        label="权重"
        prop="percent"
        :rules="[
          { required: true, message: '请输入权重', trigger: 'blur' }
        ]"
      >
        <el-input v-model="detailInfo.percent" :disabled="disabled" type="number" style="width: 80%" />%
      </el-form-item>
      <el-form-item
        label="选择同调曲线"
        prop="depCurveId"
        :rules="[
          { required: true, message: '选择同调曲线', trigger: 'change' }
        ]"
      >
        <el-select v-model="detailInfo.depCurveId" :disabled="disabled" placeholder="请选择曲线" style="width: 80%" @change="loadCurvePrdKd">
          <el-option v-for="item in curveList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="关键期限"
        prop="depStandSlip"
        :rules="[
          { required: true, message: '选择关键期限', trigger: 'change' }
        ]"
      >
        <el-select v-model="detailInfo.depStandSlip" :disabled="disabled" placeholder="请选择期限" style="width: 80%">
          <el-option v-for="item in selectStandSlip" :key="item.standSlip" :label="item.standSlip" :value="item.standSlip" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="指标"
        prop="depInd"
        :rules="[
          { required: true, message: '选择关键期限', trigger: 'change' }
        ]"
      >
        <el-select v-model="detailInfo.depInd" :disabled="disabled" placeholder="请选择指标" style="width: 80%">
          <el-option v-for="(name, key) in $dict('COMPUTE_IND_TYPE')" :key="key" :label="name" :value="key" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { queryCurvePrdKd, getQueryCurvOptions } from '@/api/curve/curve-product-list.js'
import { sortStandSlip } from '@/api/curve/curve-set-rela.js'

export default {
  name: 'CurveSetInitDetailForm',
  props: ['detailInfo', 'disabled', 'initInfo'],
  data() {
    return {
      curveList: [],
      selectStandSlip: [],
      abc: ''
    }
  },
  computed: {
  },
  beforeMount() {
    console.info('===beforeMount===')
    this.initPageData()
  },
  methods: {
    // 初始化页面数据
    async initPageData() {
      const news = { curveId: this.initInfo, approveStatus: '02' }
      this.curveList = getQueryCurvOptions(news)
    },
    getCurveName(id) {
      return this.getCurveInfo(id).productName
    },
    getCurveInfo(id) {
      var list = this.curveList
      for (const index in list) {
        const item = list[index]
        if (id === item.curveId) {
          return item
        }
      }
      return {}
    },
    async loadCurvePrdKd(value) {
      console.info('loadCurvePrdKd: value:' + value)
      this.selectStandSlip = []
      var tmp_standSlip = []
      if (this.detailInfo && this.detailInfo.depCurveId) {
        await queryCurvePrdKd({ curveId: this.detailInfo.depCurveId }).then(response => {
          this.curvePrdKdList = response.dataList
          const list = response.dataList
          if (list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              var item = list[i]
              if (tmp_standSlip.indexOf(Number(item.standSlip)) < 0) {
                tmp_standSlip.push(Number(item.standSlip))
              }
            }
            tmp_standSlip.sort(sortStandSlip)
          }
        })
      }
      // 组装列表
      for (let i = 0; i < tmp_standSlip.length; i++) {
        this.selectStandSlip.push({
          key: i,
          standSlip: tmp_standSlip[i]
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
