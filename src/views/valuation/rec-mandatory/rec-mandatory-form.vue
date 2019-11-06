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
                <el-input v-model="recMandatoryInfo.id" type="text" disabled maxlength="100" show-word-limit />
              </el-form-item>
              <el-form-item
                label="规则名称"
                prop="ruleName"
              >
                <el-input v-model="recMandatoryInfo.ruleName" :disabled="disabled" placeholder="请输入规则名称" />
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
              >
                <el-select v-model="recMandatoryInfo.recoDirection" filterable placeholder="请选择" style="width: 100%" :disabled="disabled">
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
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item label="备注">
                <el-input v-model="recMandatoryInfo.remark" type="textarea" :disabled="disabled" placeholder="输入备注内容" maxlength="100" show-word-limit />
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
        check-type="weak"
      />
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveRecMandatory, queryRecMandatory, checkDirection } from '@/api/valuation/rec-mandatory.js'

export default {
  name: 'RecMandatoryForm',
  components: {
    BondFilter
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['businessId', 'disabled'],
  data() {
    return {
      rules: {
        ruleName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        recoDirection: [
          { required: true, message: '请选择强制推荐方向', trigger: 'change' }
        ]
      }
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
      // 草稿状态，确定按钮直接返回父页面
      const busiStatus = this.recMandatoryInfo.busiStatus
      if (busiStatus === '04') {
        this.$emit('saveCallBack')
      } else {
        this.$refs.recMandatoryInfo.validate((valid) => {
          if (valid) {
            // 校验筛选器结果
            const that = this
            this.$refs.refBondFilter.getData('VAL00003').then(function(data) {
              const repeat = that.$refs.refBondFilter.getRepeat()
              var filterId = []
              for (const i in repeat) {
                filterId.push(i)
                break
              }
              if (!that.$refs.refBondFilter.getRepeat()) { // 没有重复债券则直接保存
                const req = {
                  recForce: that.recMandatoryInfo,
                  bondFilterInfo: data
                }
                that.saveBusi(req)
              } else {
                const reqData = {
                  bondFilterId: filterId,
                  recoRuleForceId: that.recMandatoryInfo.id,
                  recoDirection: that.recMandatoryInfo.recoDirection,
                  recoRuleName: that.recMandatoryInfo.ruleName
                }
                const that_2 = that
                checkDirection(reqData).then(response => {
                  if (response.respCode === 'YBL100002005') {
                    that.$confirm(response.respMsg, '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(r => {
                      const req = {
                        recForce: that_2.recMandatoryInfo,
                        bondFilterInfo: data
                      }
                      that_2.saveBusi(req)
                    }).catch(r => {

                    })
                  } else if (response.respCode === 'YBL100002006') {
                    that.$alert(response.respMsg)
                  } else {
                    const req = {
                      recForce: that.recMandatoryInfo,
                      bondFilterInfo: data
                    }
                    that.saveBusi(req)
                  }
                })
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
