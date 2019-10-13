<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-form ref="recMandatoryInfo" status-icon :model="recMandatoryInfo" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="规则ID">
                <el-input v-model="recMandatoryInfo.id" disabled />
              </el-form-item>
              <el-form-item
                label="规则名称"
                prop="ruleName"
                :rules="[
                  { required: true, message: '请输入规则名称', trigger: 'blur' },
                ]"
              >
                <el-input v-model="recMandatoryInfo.ruleName" :disabled="disabled" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作人">
                <el-input v-model="recMandatoryInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item
                label="强制推荐方向："
                prop="recoDirection"
                :rules="[
                  { required: true, message: '请选择强制推荐方向', trigger: 'change' },
                ]"
              >
                <el-select v-model="recMandatoryInfo.recoDirection" filterable placeholder="请选择强制推荐方向" style="width: 100%" :disabled="disabled">
                  <el-option
                    v-for="(name, key) in $dict('RECO_DIRECTION')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作时间">
                <el-input v-model="recMandatoryInfo.lastUpdTs" disabled />
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
        :filter-id="recMandatoryInfo.bondFilterId"
        :disabled="disabled"
      />
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveRecMandatory, queryRecMandatory } from '@/api/valuation/rec-mandatory.js'

export default {
  name: 'RecMandatoryForm',
  components: {
    BondFilter
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['businessId', 'disabled'],
  data() {
    return {
    }
  },
  computed: {
    recMandatoryInfo: {
      get() {
        return this.$store.state.recMandatory.recMandatoryInfo
      },
      set(recMandatoryInfo) {
        this.$store.commit('recMandatory/setRecMandatoryInfo', recMandatoryInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryRecMandatory(this.businessId).then(reponse => {
        this.$store.commit('recMandatory/setRecMandatoryInfo', reponse)
        // this.$store.commit('bondFilter/setBondFilterId', reponse.bondFilterId)
      })
    } else {
      this.recMandatoryInfo = {}
    }
  },
  methods: {
    saveBusi(req) {
      saveRecMandatory(req).then(response => {
        this.$emit('saveCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    save() {
      this.$refs.recMandatoryInfo.validate((valid) => {
        if (valid) {
          // 校验筛选器结果
          const that = this
          this.$refs.refBondFilter.getData('VAL00003').then(function(data) {
            if (data) {
              const req = {
                recForce: that.recMandatoryInfo,
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
</script>

<style scoped>

</style>
