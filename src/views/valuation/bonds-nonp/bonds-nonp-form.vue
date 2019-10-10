<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-form ref="bondsNonpInfo" status-icon :model="bondsNonpInfo" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="ID">
                <el-input v-model="bondsNonpInfo.id" disabled />
              </el-form-item>
              <el-form-item label="资产概念分类">
                <el-input v-model="bondsNonpInfo.bondsConceptType" disabled />
              </el-form-item>
              <el-form-item
                prop="bondId"
                label="资产编码"
                :rules="[
                  { required: true, message: '请输入资产编码', trigger: ['blur', 'change'] }
                ]"
              >
                <el-input
                  v-model="bondsNonpInfo.bondId"
                  :disabled="disabled"
                  placeholder="请输入资产编码"
                  clearable
                >
                  <el-button slot="append" icon="el-icon-search" @click="queryBondsAttr()" />
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作人">
                <el-input v-model="bondsNonpInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="资产简称">
                <el-input v-model="bondsNonpInfo.bondsShortName" disabled />
              </el-form-item>
              <el-form-item
                label="有效期（天）"
                prop="indate"
                :rules="[
                  { required: true, message: '请输入有效期', trigger: 'blur' },
                  { type: 'number', message: '请输入一个整数', trigger: 'blur' }
                ]"
              >
                <el-input
                  v-model.number="bondsNonpInfo.indate"
                  :disabled="disabled"
                  placeholder="请输入有效期"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作时间">
                <el-input v-model="bondsNonpInfo.lastUpdTs" disabled />
              </el-form-item>
              <el-form-item label="发行人">
                <el-input v-model="bondsNonpInfo.bondsIssuer" disabled />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item label="不参与原因">
                <el-input v-model="bondsNonpInfo.cause" type="textarea" :disabled="disabled" placeholder="请输入不参与原因" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveBondsNonp, queryBondsNonp, queryBondsById } from '@/api/valuation/bonds-nonp.js'

export default {
  name: 'BondsNonpForm',
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['businessId', 'disabled'],
  data() {
    return {}
  },
  computed: {
    bondsNonpInfo: {
      get() {
        return this.$store.state.bondsNonp.bondsNonpInfo
      },
      set(bondsNonpInfo) {
        this.$store.commit('bondsNonp/setBondsNonpInfo', bondsNonpInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryBondsNonp(this.businessId).then(response => {
        this.$store.commit('bondsNonp/setBondsNonpInfo', response)
      })
    } else {
      this.bondsNonpInfo = {}
    }
  },
  methods: {
    save() {
      const data = this.bondsNonpInfo
      this.$refs.bondsNonpInfo.validate((valid) => {
        if (valid) {
          saveBondsNonp(data).then(response => {
            this.$emit('saveCallBack')
            this.$message({
              message: '保存成功！',
              type: 'success',
              showClose: true
            })
          })
        } else {
          this.$message.warning('表单校验不通过，请检查！')
        }
      })
    },
    queryBondsAttr() {
      const bondId = this.bondsNonpInfo.bondId
      if (bondId) {
        queryBondsById(bondId).then(response => {
          this.bondsNonpInfo.bondId = response.bondId
          this.bondsNonpInfo.bondsConceptType = response.bondsConceptType
          this.bondsNonpInfo.bondsShortName = response.bondsShortName
          this.bondsNonpInfo.bondsIssuer = response.bondsIssuer
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
