<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-form ref="recCurveInfo" status-icon :model="recCurveInfo" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="规则ID">
                <el-input v-model="recCurveInfo.id" disabled />
              </el-form-item>
              <el-form-item
                label="曲线规则名称"
                prop="ruleName"
                :rules="[
                  { required: true, message: '请输入曲线规则名称', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="recCurveInfo.ruleName"
                  type="text"
                  :disabled="disabled"
                  maxlength="64"
                  show-word-limit
                  placeholder="请输入曲线规则名称"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作人">
                <el-input v-model="recCurveInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item
                label="估值曲线"
                prop="curveId"
                :rules="[
                  { required: true, message: '请选择估值曲线', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="recCurveInfo.curveId"
                  placeholder="请选择估值曲线"
                  style="width: 100%"
                  :disabled="disabled"
                >
                  <el-option
                    v-for="curve in curveList"
                    :key="curve.curveId"
                    :label="curve.curveName"
                    :value="curve.curveId"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后操作时间">
              <el-input v-model="recCurveInfo.lastUpdTs" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item
                label="备注"
                prop="remark"
                :rules="[
                  { required: true, message: '请输入备注', trigger: 'blur' },
                ]"
              >
                <el-input v-model="recCurveInfo.remark" type="textarea" :disabled="disabled" placeholder="请输入曲线规则名称" maxlength="50" show-word-limit />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
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
  props: ['businessId', 'disabled', 'isCopy'],
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
    } else {
      this.recCurveInfo = {}
    }
    const id = this.$store.state.recCurve.recCurveInfo.id ? this.$store.state.recCurve.recCurveInfo.id : 'unknown'
    queryCurveList(id).then(response => {
      const { dataList } = response
      this.curveList = dataList
    })
  },
  methods: {
    saveBusi(req) {
      saveRecCurve(req).then(response => {
        this.$emit('saveCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    save() {
      if (this.isCopy) {
        // 复制新增-->删除Id
      }
      // 草稿状态，确定按钮直接返回父页面
      const busiStatus = this.recCurveInfo.busiStatus
      if (busiStatus === '04') {
        this.$emit('saveCallBack')
      } else {
        this.$refs.recCurveInfo.validate((valid) => {
          if (valid) {
          // 校验筛选器结果
            const that = this
            this.$refs.refBondFilter.getData('VAL00002').then(function(data) {
              if (data) {
                const req = {
                  recCurve: that.recCurveInfo,
                  bondFilterInfo: data
                }
                that.saveBusi(req)
              }
            })
          } else {
            this.$message.warning('表单校验不通过，请检查！')
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
