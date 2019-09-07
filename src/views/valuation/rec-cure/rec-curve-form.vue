<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveInfo" :model="recCurveInfo" label-width="150px">
              <el-form-item label="规则ID">
                <el-input v-model="recCurveInfo.id" disabled />
              </el-form-item>
              <el-form-item label="最后操作人">
                <el-input v-model="recCurveInfo.lastUpdBy" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveInfo" :model="recCurveInfo" label-width="150px">
              <el-form-item label="曲线规则名称">
                <el-input v-model="recCurveInfo.ruleName" :disabled="disabled" />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="recCurveInfo.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <el-form ref="recCurveInfo" :model="recCurveInfo" label-width="150px">
            <el-form-item label="估值曲线">
              <el-select v-model="recCurveInfo.curveId" placeholder="请选择估值曲线" style="width: 100%" :disabled="disabled">
                <el-option
                  v-for="curve in curveList"
                  :key="curve.curveId"
                  :label="curve.curveName"
                  :value="curve.curveId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-form ref="recCurveInfo" :model="recCurveInfo" label-width="150px">
        <el-form-item label="备注">
          <el-input v-model="recCurveInfo.remark" type="textarea" :disabled="disabled" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">债券筛选器</h3>
      </div>
      <BondFilter
        ref="refBondFilter"
        :filter-id="recCurveInfo.bondFilterId"
        :disabled="disabled"
      />
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveRecCurve, queryCurveList, queryRecCurve } from '@/api/valuation/rec-curve.js'
export default {
  name: 'RecCurveForm',
  components: {
    BondFilter
  },
  props: ['businessId', 'disabled'],
  data() {
    return {
      curveList: []
    }
  },
  computed: {
    recCurveInfo: {
      get() {
        return this.$store.state.recCurve.recCurveInfo
      },
      set(recCurveInfo) {
        this.$store.commit('recCurve/setRecCurveInfo', recCurveInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryRecCurve(this.businessId).then(reponse => {
        this.$store.commit('recCurve/setRecCurveInfo', reponse)
        // this.$store.commit('bondFilter/setBondFilterId', reponse.bondFilterId)
      })
    }
    queryCurveList().then(response => {
      const { datalist } = response
      this.curveList = datalist
    })
  },
  methods: {
    save() {
      const bondFilterInfo = this.$refs.refBondFilter.getData()
      const data = {
        recCurve: this.recCurveInfo,
        bondFilterInfo: bondFilterInfo
      }
      saveRecCurve(data).then(response => {
        this.$emit('saveCallBack')
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
