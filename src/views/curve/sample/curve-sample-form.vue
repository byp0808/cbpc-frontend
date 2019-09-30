<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveForm" :model="curveSample" label-width="150px">
              <el-form-item label="曲线产品名称">
                <el-select v-model="curveSample.curvePrdCode" filterable :disabled="curveSelectDisable" placeholder="请选择曲线">
                  <el-option
                    v-for="item in curveList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <input v-model="curveSample.basePrdCode" type="hidden">
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveForm" label-width="150px">
              <el-form-item label="最后操作时间">
                <el-input v-model="curveSample.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <el-form ref="recCurveForm" label-width="150px">
            <el-form-item label="最后操作人">
              <el-input v-model="curveSample.lastUpdBy" disabled />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-form ref="recCurveForm" :model="curveSample" label-width="150px" hidden>
        <el-form-item label="备注">
          <el-input v-model="curveSample.remark" type="textarea" />
        </el-form-item>
      </el-form>

    </el-card>
    <BondFilter
      ref="refBondFilter"
      :filter-id="curveSample.filterId"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { getCurveSample, getCurveList, saveCurveSample, submitTask } from '@/api/curve/curve-sample.js'
import { getCurveProductOptions } from '@/api/curve/curve-product-list.js'
export default {
  name: 'RecCurveForm',
  components: {
    BondFilter
  },
  props: ['basePrdCode', 'productId', 'opType', 'businessId'],
  data() {
    return {
      disabled: '',
      curveSelectDisable: false,
      curveList: [],
      allCurveList: []
    }
  },
  computed: {
    curveSample: {
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
    console.info('===beforeMount===')

    // 先加载列表
    this.curveList = getCurveProductOptions();
    this.allCurveList = this.curveList;

    if (this.productId) {
      if (this.opType === 'VIEW') {
        this.disabled = true
        this.curveSelectDisable = true
      } else {
        this.disabled = false
      }

      getCurveSample(this.productId).then(reponse => {
        // 审批通过拒绝，不允许个性曲线产品
        if (reponse) {
          if ('02' === reponse.approveStatus || '03' === reponse.approveStatus) {
            this.curveSelectDisable = true
          }
        }
        this.$store.commit('curveProduct/setCurveSampleFilterInfo', reponse)
      })

    } else if (this.businessId) {
      getCurveSample(this.businessId).then(reponse => {
        this.$store.commit('curveProduct/setCurveSampleFilterInfo', reponse)
      })
      this.curveSelectDisable = true
    } else {
      this.disabled = false
      if (this.basePrdCode) {
        this.curveSample = {}
        this.curveSample.basePrdCode = this.basePrdCode
      }
    }
  },
  methods: {
    getCurvePrdCodeValue(prdCode) {
      if (!prdCode) {
        return ''
      } else {
        for (const i of this.allCurveList) {
          if (i.value === prdCode) {
            return i.label
          }
        }
      }
    },
    save() {
      if (!this.curveSample.curvePrdCode || this.curvePrdCode === '') {
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
      if (!refBondFilterInfo.tempId) {
        this.$message({
          message: '请选择应用模板，并应用',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      } else if (refBondFilterInfo.rules.length === 0) {
        this.$message({
          message: '请应用模板',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }

      // 如果是拷贝，则清除ID,新增记录
      if (this.opType === 'COPY') {
        this.curveSample.id = ''
        this.curveSample.filterId = ''
      }
      // 20190930 筛选器模板编号字段修改，这里不影响后续逻辑，特按tempNo走
      refBondFilterInfo.tempNo = refBondFilterInfo.tempId
      var data = _.assign({ curveSample: this.curveSample }, refBondFilterInfo)
      // 保存
      saveCurveSample(data).then(response => {
        this.$emit('saveCureSampleCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    taskSubmit(opType) {
      if (!this.businessId) {
        this.$message({
          message: '获取流程数据失败！',
          type: 'error',
          showClose: true
        })
      }
      var data = { businessNo: this.businessId, taskStatus: opType }
      submitTask(data).then(response => {
        // 回调函数
        this.$emit('saveCureSampleCallBack')
        this.$message({
          message: '操作成功！',
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
