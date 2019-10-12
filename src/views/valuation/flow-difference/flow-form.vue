<template>
  <div class="big-container">
    <div>
      <el-form ref="refAssetsGroupForm" :rules="rules" :model="assetsGroupInfo" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="规则ID">
                <el-input v-model="assetsGroupInfo.id" disabled />
              </el-form-item>
              <el-form-item label="资产规则" prop="ruleState">
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
      :filter-id="assetsGroupInfo.filterId"
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
      assetsGroupInfo: {},
      rules: {
        ruleState: [{ required: true, message: '请输入资产规则', trigger: 'blur' }]
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      signleData(this.businessId).then(response => {
        this.assetsGroupInfo = response
      })
    } else {
      this.assetsGroupInfo = {}
    }
  },
  mounted() {
    this.assetsGroupInfo = {}
  },
  methods: {
    save() {
      this.$refs['refAssetsGroupForm'].validate((valid) => {
        if (valid) {
          this.$refs.refBondFilter.getData('VAL00006').then(function(data) {
            if (data) {
              const info = { id: this.assetsGroupInfo.id, ruleState: this.assetsGroupInfo.ruleState }
              const param = {
                assetsGroup: info,
                bondFilterInfo: data
              }
              saveData(param).then(response => {
                this.$emit('saveCallBack')
                this.$message({
                  message: '保存成功！',
                  type: 'success',
                  showClose: true
                })
              })
            }
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

<style lang="scss" scoped>
</style>
