<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recMandatoryInfo" :model="recMandatoryInfo" label-width="150px">
              <el-form-item label="规则ID">
                <el-input v-model="recMandatoryInfo.id" disabled />
              </el-form-item>
              <el-form-item label="曲线规则名称">
                <el-input v-model="recMandatoryInfo.ruleName" :disabled="disabled" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recMandatoryInfo" :model="recMandatoryInfo" label-width="150px">
              <el-form-item label="最后操作人">
                <el-input v-model="recMandatoryInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="recMandatoryInfo.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
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
    }
  },
  methods: {
    save() {
      const bondFilterInfo = this.$refs.refBondFilter.getData()
      const data = {
        recMandatory: this.recMandatoryInfo,
        bondFilterInfo: bondFilterInfo
      }
      saveRecMandatory(data).then(response => {
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
