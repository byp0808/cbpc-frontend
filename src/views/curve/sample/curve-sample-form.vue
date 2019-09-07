<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveForm" :model="curveSampleFilterInfo" label-width="150px">
              <el-form-item label="曲线产品名称">
                <el-select v-model="curveSampleFilterInfo.curveSample.curvePrdCode" :disabled="curveSampleFilterInfo.disabled" placeholder="请选择曲线">
                  <el-option v-for="item in curveList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <input v-model="curveSampleFilterInfo.curveSample.baseProduct" type="hidden">
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveForm" label-width="150px">
              <el-form-item label="最后操作时间">
                <el-input v-model="curveSampleFilterInfo.curveSample.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <el-form ref="recCurveForm" label-width="150px">
            <el-form-item label="最后操作人">
              <el-input v-model="curveSampleFilterInfo.curveSample.lastUpdBy" disabled />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-form ref="recCurveForm" :model="curveSampleFilterInfo" label-width="150px" hidden>
        <el-form-item label="备注">
          <el-input v-model="curveSampleFilterInfo.curveSample.remark" type="textarea" />
        </el-form-item>
      </el-form>

    </el-card>
    <BondFilter
      ref="refBondFilter"
    />
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { getCurveList, saveCurveSample } from '@/api/curve/curve-sample.js'
export default {
  name: 'RecCurveForm',
  components: {
    BondFilter
  },
  props: ['baseProduct'],
  data() {
    return {
      curveSampleForm: {
        curveSample: {}
      },
      curveList: []
    }
  },
  computed: {
    // curveList() {
    //   debugger;
    //   return getCurveList({}).then(response => {
    //     var datalist = response.datalist;
    //     debugger;
    //     var options = [];
    //     if (datalist && datalist.length > 0) {
    //       for (var i = 0 ; i < datalist.length ; i++) {
    //         var data = datalist[i];
    //         options.push({value: data.curveId, label: data.productName });
    //       }
    //     }
    //     return  options;
    //   });
    // },
    curveSampleFilterInfo: {
      get() {
        console.info('curveSampleFilterInfo.get')
        return this.$store.state.curveProduct.curveSampleFilterInfo
      },
      set(info) {
        console.info('curveSampleFilterInfo.set' + JSON.stringify(info))
        this.$store.commit('curveProduct/setCurveSampleFilterInfo', info)
      }
    }
  },
  beforeMount() {
    const curveSampleFilterInfo = this.$store.state.curveProduct.curveSampleFilterInfo
    this.curveSampleForm = curveSampleFilterInfo
    console.info('curve-sample-form.beforeMount:' + JSON.stringify(curveSampleFilterInfo))
    getCurveList({}).then(response => {
      var datalist = response.datalist
      this.curveList = []
      if (datalist && datalist.length > 0) {
        for (var i = 0; i < datalist.length; i++) {
          var data = datalist[i]
          this.curveList.push({ value: data.curveId, label: data.productName })
        }
      }
    })
  },
  methods: {
    save() {
      if (!this.curveSampleForm.curveSample.curvePrdCode || this.curveSampleForm.curvePrdCode == '') {
        this.$message({
          message: '请选择一条曲线',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      var refBondFilterInfo = this.$refs.refBondFilter.getData()
      console.log(refBondFilterInfo)
      if (!refBondFilterInfo.tempNo) {
        this.$message({
          message: '请选择应用模板，并应用',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      } else if (refBondFilterInfo.rules.length == 0) {
        this.$message({
          message: '请应用模板',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      // return {data:data,curveSelected:this.curveSelected};
      // refBondFilterInfo.curveSelected = this.curveSelected;
      // refBondFilterInfo.baseProduct = this.baseProduct;
      // this.curveSampleForm.tempNo = refBondFilterInfo.tempNo;
      var data = Object.assign(this.curveSampleForm, refBondFilterInfo)
      saveCurveSample(data).then(response => {
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
