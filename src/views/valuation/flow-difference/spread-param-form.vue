<template>
  <div class="app-container">
    <el-form ref="refSpreadParamForm" :model="spreadParamInfo" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="规则ID">
              <el-input v-model="spreadParamInfo.id" disabled />
            </el-form-item>
            <el-form-item label="类型" prop="paramType">
              <el-input v-model="spreadParamInfo.paramType" :disabled="disabled" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="最后操作人">
              <el-input v-model="spreadParamInfo.lastUpdTs" disabled />
            </el-form-item>
            <el-form-item label="最后操作时间">
              <el-input v-model="spreadParamInfo.lastUpdTs" disabled />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-form-item label="市场隐含评级" prop="marketGrad">
            <el-select v-model="spreadParamInfo.marketGrad" placeholder="请选择市场隐含评级" :disabled="disabled">
              <el-option
                v-for="(name, key) in $dict('MARKET_GRADE')"
                :key="key"
                :label="name"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-form-item label="推荐待偿期区间" required>
            <div class="input-box">
              <div class="first">
                <el-form-item prop="rangeStart">
                  <el-input v-model.number="spreadParamInfo.rangeStart" type="number" :disabled="disabled" />
                </el-form-item>
              </div>
              <div>
                <el-form-item prop="rangeEnd">
                  <el-input v-model.number="spreadParamInfo.rangeEnd" type="number" :disabled="disabled" />
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-form-item label="点差" prop="spreadValue">
            <el-input v-model.number="spreadParamInfo.spreadValue" type="number" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { spreadParam, saveSpreadParam } from '@/api/valuation/flow.js'
export default {
  name: 'SpreadParamForm',
  props: ['businessId', 'disabled'],
  data() {
    return {
      spreadParamInfo: {},
      rules: {
        paramType: [{ required: true, message: '请输入点差参数类型', trigger: 'blur' }],
        marketGrad: [{ required: true, message: '请选择市场隐含评级', trigger: 'change' }],
        rangeStart: [
          { required: true, message: '请完整输入', trigger: 'blur' }
        ],
        rangeEnd: [
          { required: true, message: '请完整输入', trigger: 'blur' }
        ],
        spreadValue: [
          { required: true, message: '请输入点差', trigger: 'blur' }
        ]
      }
    }
  },
  beforeMount() {
    this.loadSpreadParam()
  },
  mounted() {
    this.spreadParamInfo = {}
  },
  methods: {
    loadSpreadParam() {
      if (this.businessId) {
        spreadParam(this.businessId).then(response => {
          this.spreadParamInfo = response
        })
      }
    },
    save() {
      this.$refs['refSpreadParamForm'].validate((valid) => {
        if (valid) {
          if (this.spreadParamInfo.rangeStart >= this.spreadParamInfo.rangeEnd) {
            this.$message({
              message: '结束区间应大于开始区间！',
              type: 'warning',
              showClose: true
            })
            return false
          }
          if (this.spreadParamInfo.rangeStart < 0 || this.spreadParamInfo.rangeEnd < 0) {
            this.$message({
              message: '区间不能是负数',
              type: 'warning',
              showClose: true
            })
            return false
          }
          if (this.spreadParamInfo.spreadValue < 0) {
            this.$message({
              message: '点差不能是负数',
              type: 'warning',
              showClose: true
            })
            return false
          }
          saveSpreadParam(this.spreadParamInfo).then(response => {
            this.$emit('saveCallBack')
            this.$message({
              message: '保存成功！',
              type: 'success',
              showClose: true
            })
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

<style scoped>
  .input-box {
    display: flex !important;
  }
  .first {
    margin-right: 10px;
  }
</style>
