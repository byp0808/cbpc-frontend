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
                prop="assetCode"
                label="资产编码"
              >
                <el-input
                  v-model="bondsNonpInfo.assetCode"
                  :disabled="csinDisabled"
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
              <el-form-item label="流通场所" prop="marketId">
                <el-select v-model="bondsNonpInfo.marketId" multiple :disabled="csinDisabled" placeholder="" style="width: 100%">
                  <el-option
                    v-for="item in filtedMarket"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                    :disabled="item.disabled"
                  />
                </el-select>
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
              <el-form-item
                label="有效期（天）"
                prop="indate"
              >
                <el-input
                  v-model.number="bondsNonpInfo.indate"
                  :disabled="disabled"
                  placeholder="请输入有效期"
                  clearable
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item label="不参与原因">
                <el-input v-model="bondsNonpInfo.cause" type="textarea" :disabled="disabled" placeholder="请输入不参与原因" maxlength="500" show-word-limit />
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
  props: ['businessId', 'disabled', 'csinDisabled'],
  data() {
    // eslint-disable-next-line no-unused-vars
    const validDayRange = (rule, value, callback) => {
      if (parseInt(value) < 1 || parseInt(value) > 999999) {
        callback(new Error('1天≤有效期≤999999天'))
      } else {
        callback()
      }
    }
    const validAssetCode = (rule, value, callback) => {
      console.log(value)
      const regex = /^[a-zA-Z0-9.]{6,15}$/
      if (!regex.test(value)) {
        callback(new Error('请输入包含字母数字.的6-15位字符'))
      } else {
        callback()
      }
    }
    return {
      filtedMarket: [],
      rules: {
        assetCode: [
          { required: true, message: '请输入资产编码', trigger: ['blur', 'change'] },
          { validator: validAssetCode, trigger: 'blur' }
        ],
        indate: [
          { required: true, message: '请输入有效期', trigger: 'blur' },
          { type: 'number', message: '请输入一个整数', trigger: 'blur' },
          { validator: validDayRange, trigger: 'blur' }
        ],
        marketId: [
          { required: true, message: '请选择流通场所', trigger: ['blur'] }
        ]
      }
    }
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
        response.marketId = response.marketId.split(';')
        this.$store.commit('bondsNonp/setBondsNonpInfo', response)
      })
    } else {
      this.bondsNonpInfo = {}
    }

    // 初始化流通场所
    const origin = this.$dict('MARKET')
    for (const key in origin) {
      const res = { key: key, name: origin[key], disabled: true }
      this.filtedMarket.push(res)
    }
  },
  methods: {
    save() {
      // 草稿状态，确定按钮直接返回父页面
      const busiStatus = this.bondsNonpInfo.busiStatus
      if (busiStatus === '04') {
        this.$emit('saveCallBack')
      } else {
        const data = Object.assign({}, this.bondsNonpInfo)
        data.marketId = this.bondsNonpInfo.marketId.toString()
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
      }
    },
    queryBondsAttr() {
      const assetCode = this.bondsNonpInfo.assetCode
      const that = this
      if (assetCode) {
        queryBondsById(assetCode).then(response => {
          that.bondsNonpInfo.assetCode = response.assetCode
          that.bondsNonpInfo.bondsConceptType = response.bondsConceptType
          that.bondsNonpInfo.bondsShortName = response.bondsShortName
          that.bondsNonpInfo.bondsIssuer = response.bondsIssuer
          that.bondsNonpInfo.marketId = response.marketIds

          if (response.marketIds && response.marketIds.length === 0) {
            that.$message.warning('该债券无可配置的流通场所信息')
          } else {
            // 重新封装下字典数据
            for (const index in this.filtedMarket) {
              const map = this.filtedMarket[index]
              for (const id in response.marketIds) {
                if (map.key === response.marketIds[id]) {
                  this.filtedMarket[index].disabled = false
                  break
                }
              }
            }
          }
        })
      } else {
        that.bondsNonpInfo.assetCode = ''
        this.$message.warning('未查到该债券信息')
      }
    }
  }
}
</script>

<style scoped>

</style>
