<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-form ref="dateSetInfo" status-icon :model="dateSetInfo" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="规则ID">
                <el-input v-model="dateSetInfo.id" disabled />
              </el-form-item>
              <el-form-item label="规则名称" prop="ruleName">
                <el-input v-model="dateSetInfo.ruleName" :disabled="disabled" placeholder="请输入规则名称" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="最后操作人">
                <el-input v-model="dateSetInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="首次估值日" prop="firstDateType" label-width="150px">
                <el-select
                  v-model="dateSetInfo.firstDateType"
                  filterable
                  placeholder="请选择首次估值日"
                  :disabled="disabled"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(name, key) in $dict('FIRST_DATE_TYPE')"
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
                <el-input v-model="dateSetInfo.lastUpdTs" disabled />
              </el-form-item>
              <el-form-item v-if="dateSetInfo.firstDateType === '03'" label="延后天数" prop="delayDays" placeholder="请输入延后天数">
                <el-input v-model.number="dateSetInfo.delayDays" :disabled="disabled" />
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
        :filter-id="dateSetInfo.filterId"
        :disabled="disabled"
      />
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
import { saveDateSet, queryDateSet } from '@/api/valuation/date-set.js'

export default {
  name: 'DateSetForm',
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
        firstDateType: [
          { required: true, message: '请选择首次估值日', trigger: 'change' }
        ],
        delayDays: [
          { required: true, message: '请输入延后天数', trigger: 'blur' },
          { type: 'number', message: '请输入一个整数', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dateSetInfo: {
      get() {
        return this.$store.state.dateSet.dateSetInfo
      },
      set(dateSetInfo) {
        this.$store.commit('dateSet/setDateSetInfo', dateSetInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryDateSet(this.businessId).then(reponse => {
        this.$store.commit('dateSet/setDateSetInfo', reponse)
      })
    } else {
      this.dateSetInfo = {}
    }
  },
  methods: {
    saveBusi(req) {
      saveDateSet(req).then(response => {
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
      const busiStatus = this.dateSetInfo.busiStatus
      if (busiStatus === '04') {
        this.$emit('saveCallBack')
      } else {
        this.$refs.dateSetInfo.validate((valid) => {
          if (valid) {
            // 校验筛选器结果
            const that = this
            this.$refs.refBondFilter.getData('VAL00004').then(function(data) {
              if (data) {
                const req = {
                  dateSet: that.dateSetInfo,
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
