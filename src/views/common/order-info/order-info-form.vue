<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-form ref="orderInfoForm" status-icon :model="orderInfoForm" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="ID">
                <el-input v-model="orderInfoForm.id" disabled />
              </el-form-item>
              <el-form-item label="所属基础产品" prop="basePrd">
                <el-select v-model="orderInfoForm.basePrd" :disabled="disabled" placeholder="请选择所属基础产品" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('TASK_BASE_PRD')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="批次计算时间" prop="compTime">
                <el-time-picker
                  v-model="orderInfoForm.compTime"
                  value-format="HH:mm:ss"
                  arrow-control
                  :disabled="disabled"
                  placeholder="请选择批次计算时间"
                  style="width: 100%"
                  :picker-options="{selectableRange: `${orderInfoForm.remindTime?orderInfoForm.remindTime:'00:00:00'}-23:59:59` }"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="批次编号" prop="orderNo">
                <el-input v-model="orderInfoForm.orderNo" disabled />
              </el-form-item>
              <el-form-item label="所属市场" prop="marketId">
                <el-select v-model="orderInfoForm.marketId" :disabled="disabled" placeholder="请选择所属市场" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('MARKET')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="批次提醒时间" prop="remindTime">
                <el-time-picker
                  v-model="orderInfoForm.remindTime"
                  value-format="HH:mm:ss"
                  arrow-control
                  :disabled="disabled"
                  placeholder="请选择批次提醒时间"
                  style="width: 100%"
                  :picker-options="{selectableRange: `00:00:00-${orderInfoForm.compTime?orderInfoForm.compTime:'23:59:59'}`}"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="批次名称" prop="orderName">
                <el-input v-model="orderInfoForm.orderName" type="text" :disabled="disabled" placeholder="请输入批次名称" maxlength="50" show-word-limit />
              </el-form-item>
              <el-form-item label="所属时区" prop="timeZone">
                <el-select v-model="orderInfoForm.timeZone" :disabled="disabled" placeholder="请选择所属时区" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('TIME_ZONE')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="批次标识" prop="orderFlag">
                <el-select v-model="orderInfoForm.orderFlag" :disabled="disabled" placeholder="请选择批次标识" style="width: 100%">
                  <el-option
                    v-for="(name, key) in $dict('ORDER_FLAG')"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item label="批次说明">
                <el-input v-model="orderInfoForm.orderMark" type="textarea" :disabled="disabled" placeholder="请输入批次说明" maxlength="50" show-word-limit />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveOrderInfo, queryOrderInfo } from '@/api/common/order-info.js'
import { checkSpecificKey } from '@/utils/custom-validate.js'

export default {
  name: 'OrderInfoForm',
  components: {},
  props: ['businessId', 'disabled'],
  data() {
    const validOrderName = (rule, value, callback) => {
      if (!checkSpecificKey(value)) {
        // callback(new Error("Special symbols are not supported"));
        callback(new Error('您输入的文本中出现了特殊字符，请检查！'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        basePrd: [
          { required: true, message: '请选择所属基础产品', trigger: 'change' }
        ],
        compTime: [
          { required: true, message: '请选择批次计算时间', trigger: 'change' }
        ],
        marketId: [
          { required: true, message: '请选择所属市场', trigger: 'change' }
        ],
        remindTime: [
          { required: true, message: '请选择批次提醒时间', trigger: 'change' }
        ],
        orderName: [
          { required: true, message: '请输入批次名称', trigger: 'blur' },
          { validator: validOrderName, trigger: ['blur', 'change'] }
        ],
        timeZone: [
          { required: true, message: '请选择所属时区', trigger: 'change' }
        ],
        orderFlag: [
          { required: true, message: '请选择批次标识', trigger: 'change' }
        ]
      }
    }
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
    } else {
      this.orderInfoForm = {}
    }
  },
  methods: {
    save() {
      const data = this.orderInfoForm
      this.$refs.orderInfoForm.validate((valid) => {
        if (valid) {
          saveOrderInfo(data).then(response => {
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
  }
}
</script>

<style scoped>

</style>
