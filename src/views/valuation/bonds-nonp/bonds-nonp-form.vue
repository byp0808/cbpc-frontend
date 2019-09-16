<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="bondsNonpInfo" :model="bondsNonpInfo" label-width="150px">
              <el-form-item label="ID">
                <el-input v-model="bondsNonpInfo.id" disabled />
              </el-form-item>
              <el-form-item label="资产概念分类">
                <el-input v-model="bondsNonpInfo.bondsConceptType" disabled />
              </el-form-item>
              <el-form-item label="资产编码">
                <el-input
                  v-model="bondsNonpInfo.bondsId"
                  :disabled="disabled"
                  clearable
                >
                  <el-button slot="append" icon="el-icon-search" @click="queryBondsAttr()" />
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="bondsNonpInfo" :model="bondsNonpInfo" label-width="150px">
              <el-form-item label="最后操作人">
                <el-input v-model="bondsNonpInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="资产简称">
                <el-input v-model="bondsNonpInfo.bondsShortName" disabled />
              </el-form-item>
              <el-form-item label="有效期（天）">
                <el-input v-model="bondsNonpInfo.indate" :disabled="disabled" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="bondsNonpInfo" :model="bondsNonpInfo" label-width="150px">
              <el-form-item label="最后操作时间">
                <el-input v-model="bondsNonpInfo.lastUpdTs" disabled />
              </el-form-item>
              <el-form-item label="发行人">
                <el-input v-model="bondsNonpInfo.bondsIssuer" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-form ref="bondsNonpInfo" :model="bondsNonpInfo" label-width="150px">
        <el-form-item label="不参与原因">
          <el-input v-model="bondsNonpInfo.cause" type="textarea" :disabled="disabled" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveBondsNonp, queryBondsNonp, queryBondsById } from '@/api/valuation/bonds-nonp.js'

export default {
  name: 'BondsNonpForm',
  components: {},
  props: ['businessId', 'disabled'],
  data() {
    return {}
  },
  computed: {
    bondsNonpInfo: {
      get() {
        console.log('get')
        return this.$store.state.bondsNonp.bondsNonpInfo
      },
      set(bondsNonpInfo) {
        console.log('set')
        this.$store.commit('bondsNonp/setBondsNonpInfo', bondsNonpInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryBondsNonp(this.businessId).then(reponse => {
        this.$store.commit('bondsNonp/setBondsNonpInfo', reponse)
      })
    }
  },
  methods: {
    save() {
      const data = this.bondsNonpInfo
      saveBondsNonp(data).then(response => {
        this.$emit('saveCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    queryBondsAttr() {
      const bondsId = this.bondsNonpInfo.bondsId
      if (bondsId) {
        queryBondsById(bondsId).then(response => {
          console.log('full')
          this.$store.commit('bondsNonp/setBondsAttrInfo', response)
        })
      } else {
        console.log('empty')
        const empty = { bondsConceptType: '', bondsShortName: '', bondsIssuer: '' }
        this.$store.commit('bondsNonp/setBondsAttrInfo', empty)
      }
    }
  }
}
</script>

<style scoped>

</style>
