<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="orderInfoForm" :model="orderInfoForm" label-width="150px">
              <el-form-item label="ID">
                <el-input v-model="orderInfoForm.id" disabled />
              </el-form-item>
              <el-form-item label="所属基础产品">
                <el-select v-model="orderInfoForm.basePrd" :disabled="disabled" placeholder="请选择所属基础产品" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('BASE_PRD_CODE')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="批次计算时间">
                <el-time-picker
                  v-model="orderInfoForm.compTime"
                  arrow-control
                  :disabled="disabled"
                  placeholder="请选择批次计算时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="orderInfoForm" :model="orderInfoForm" label-width="150px">
              <el-form-item label="批次编号">
                <el-input v-model="orderInfoForm.orderNo" :disabled="disabled" />
              </el-form-item>
              <el-form-item label="所属市场">
                <el-select v-model="orderInfoForm.marketId" :disabled="disabled" placeholder="请选择所属市场" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('MARKET')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="批次提醒时间">
                <el-time-picker
                  v-model="orderInfoForm.remindTime"
                  arrow-control
                  :disabled="disabled"
                  placeholder="请选择批次提醒时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="orderInfoForm" :model="orderInfoForm" label-width="150px">
              <el-form-item label="批次名称">
                <el-input v-model="orderInfoForm.orderName" :disabled="disabled" placeholder="请输入批次名称" />
              </el-form-item>
              <el-form-item label="所属时区">
                <el-select v-model="orderInfoForm.timeZone" :disabled="disabled" placeholder="请选择所属时区" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('TIME_ZONE')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="批次标识">
                <el-select v-model="orderInfoForm.orderFlag" :disabled="disabled" placeholder="请选择批次标识" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('ORDER_FLAG')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-form ref="orderInfoForm" :model="orderInfoForm" label-width="150px">
        <el-form-item label="批次说明">
          <el-input v-model="orderInfoForm.orderMark" type="textarea" :disabled="disabled" placeholder="请输入批次说明" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveOrderInfo, queryOrderInfo } from '@/api/common/order-info.js'

export default {
  name: 'OrderInfoForm',
  components: {},
  props: ['businessId', 'disabled'],
  data() {
    return {}
  },
  computed: {
    orderInfoForm: {
      get() {
        return this.$store.state.orderInfo.orderInfoForm
      },
      set(orderInfoForm) {
        this.$store.commit('orderInfo/setOrderInfo', orderInfoForm)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      queryOrderInfo(this.businessId).then(response => {
        this.$store.commit('orderInfo/setOrderInfo', response)
      })
    }
  },
  methods: {
    save() {
      const data = this.orderInfoForm
      saveOrderInfo(data).then(response => {
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
