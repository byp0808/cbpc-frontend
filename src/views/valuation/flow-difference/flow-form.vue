<template>
  <div class="big-container">
    <div>
      <el-form ref="assetsGroupInfo" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="规则ID">
                <el-input v-model="assetsGroupInfo.id" disabled />
              </el-form-item>
              <el-form-item label="资产规则">
                <el-input v-model="assetsGroupInfo.ruleState" :disabled="disabled" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作人">
                <el-input v-model="assetsGroupInfo.createdBy" disabled />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="assetsGroupInfo.lastUpdTs" disabled />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <BondFilter
      ref="refBondFilter"
      :filter-id="assetsGroupInfo.bondFilterId"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveData, signleData } from '@/api/valuation/flow.js'
export default {
  name: 'FlowForm',
  components: {
    BondFilter
  },
  props: ['businessId', 'disabled'],
  data() {
    return {
      assetsGroupInfo: {}
    }
  },
  beforeMount() {
    if (this.businessId) {
      signleData(this.businessId).then(response => {
        this.assetsGroupInfo = response
      })
    } else {
      this.businessId = ''
      this.assetsGroupInfo = {}
    }
  },
  mounted() {
    this.assetsGroupInfo = {}
  },
  methods: {
    save() {
      const bondFilterInfo = this.$refs.refBondFilter.getData()
      const info = { id: this.assetsGroupInfo.id, ruleState: this.assetsGroupInfo.ruleState }
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
