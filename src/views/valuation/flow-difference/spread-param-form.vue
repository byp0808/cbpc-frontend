<template>
  <div class="app-container">
    <el-form label-width="150px">
      <el-row>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="规则ID">
              <el-input v-model="spreadParamInfo.id" disabled />
            </el-form-item>
            <el-form-item label="类型">
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
          <el-form-item label="市场隐含评级">
            <el-select v-model="spreadParamInfo.marketGrad" placeholder="请选择市场隐含评级" :disabled="disabled">
              <el-option v-for="item in marketGradeList" :key="item.value" :label="item.value" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-form-item label="推进待偿期区间">
            <div class="input-box">
              <div class="first">
                <el-input v-model="spreadParamInfo.rangeStart" :disabled="disabled" />
              </div>
              <div>
                <el-input v-model="spreadParamInfo.rangeEnd" :disabled="disabled" />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-form-item label="点差">
            <el-input v-model="spreadParamInfo.spreadValue" :disabled="disabled" />
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
      marketGradeList: [
        {
          value: 'AAA+',
          label: 'AAA+'
        }, {
          value: 'AAA',
          label: 'AAA'
        }, {
          value: 'AA+',
          label: 'AA+'
        }
      ]
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
      if (this.spreadParamInfo) {
        saveSpreadParam(this.spreadParamInfo).then(response => {
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
