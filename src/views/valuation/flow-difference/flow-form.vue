<template>
  <div class="big-container">
    <div>
      <el-form ref="detailInfo" label-width="150px" status-icon :model="detailInfo">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="规则ID">
                <el-input v-model="detailInfo.id" disabled />
              </el-form-item>
              <el-form-item label="资产规则">
                <el-input v-model="detailInfo.ruleState" :disabled="disabled" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作人">
                <el-input v-model="detailInfo.createdBy" disabled />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="detailInfo.lastUpdTs" disabled />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <el-card class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">债券筛选器</h3>
      </div> -->
    <BondFilter
      ref="refBondFilter"
      :filter-id="detailInfo.bondFilterId"
      :disabled="disabled"
    />
    <!-- </el-card> -->
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
// import { saveRecCurve, queryCurveList, queryRecCurve } from '@/api/valuation/rec-curve.js'
import { saveData, signleData } from '@/api/valuation/flow.js'
export default {
  name: 'RecCurveForm',
  components: {
    BondFilter
  },
  props: ['businessId', 'disabled', 'detailInfo'],
  //   props: {
  //     'bussinessId': {
  //       type: String,
  //       default: ''
  //     },
  //     'disabled': {
  //       type: Boolean,
  //       default: false
  //     }
  //   },
  data() {
    return {
      curveList: [],
      recCurveInfo: {}
    }
  },
  //   beforeMount() {
  //     if (this.businessId) {
  //       queryRecCurve(this.businessId).then(reponse => {
  //         this.$store.commit('recCurve/setRecCurveInfo', reponse)
  //         // this.$store.commit('bondFilter/setBondFilterId', reponse.bondFilterId)
  //       })
  //     }
  //     queryCurveList().then(response => {
  //       const { dataList } = response
  //       this.curveList = dataList
  //     })
  //   },
  beforeMount() {
    console.log('pp', this.businessId)
    if (this.businessId) {
      signleData(this.businessId).then(response => {
        this.detailInfo = response
      })
    } else {
      this.businessId = ''
      this.detailInfo = ''
    }
  },
  methods: {
    save() {
      const bondFilterInfo = this.$refs.refBondFilter.getData()
      const info = { id: this.businessId, ruleState: this.detailInfo.ruleState }
      const data = {
        assetsGroup: info,
        bondFilterInfo: bondFilterInfo
      }
      saveData(data).then(response => {
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

<style lang="scss" scoped>
</style>
