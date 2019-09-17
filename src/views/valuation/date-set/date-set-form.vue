<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="dateSetInfo" :model="dateSetInfo" label-width="150px">
              <el-form-item label="规则ID">
                <el-input v-model="dateSetInfo.id" disabled />
              </el-form-item>
              <el-form-item label="规则名称">
                <el-input v-model="dateSetInfo.ruleName" :disabled="disabled" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="dateSetInfo" :model="dateSetInfo" label-width="150px">
              <el-form-item label="最后操作人">
                <el-input v-model="dateSetInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="首次估值日：">
                <el-select
                  v-model="dateSetInfo.firstDateType"
                  filterable
                  placeholder="请选择首次估值日"
                  :disabled="disabled"
                  @change="typeChange"
                >
                  <el-option
                    v-for="item in firstDateTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="dateSetInfo" :model="dateSetInfo" label-width="150px">
              <el-form-item label="最后操作时间">
                <el-input v-model="dateSetInfo.lastUpdTs" disabled />
              </el-form-item>
              <el-form-item v-if="dateSetInfo.firstDateType !== '01'" label="延后天数">
                <el-input v-model="dateSetInfo.delayDays" :disabled="disabled" />
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
  props: ['businessId', 'disabled'],
  data() {
    return {
      firstDateTypes: [{
        id: '01',
        name: '起息日'
      }, {
        id: '02',
        name: '上市日'
      }, {
        id: '03',
        name: '按起息日或上市日优先'
      }]
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
    }
  },
  methods: {
    save() {
      const bondFilterInfo = this.$refs.refBondFilter.getData()
      const data = {
        dateSet: this.dateSetInfo,
        bondFilterInfo: bondFilterInfo
      }
      saveDateSet(data).then(response => {
        this.$emit('saveCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    },
    typeChange(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>

</style>
