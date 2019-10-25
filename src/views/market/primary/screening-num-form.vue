<template>
  <!--  数值型-->
  <div class="" style="width: 600px">
    <el-form ref="screeningForm" status-icon :model="screeningForm" label-width="150px" :rules="numFormRules">
      <el-row :gutter="76" align="left">
        <div class="grid-content bg-purple">
          <el-form-item label="" prop="screeningNum">
            <el-row :gutter="22">
              <el-col :span="4">
                <el-radio v-model="radio" label="1">数值</el-radio>
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-input v-model.number="screeningForm.screeningNum" type="number" style="width: 200px" :disabled="disable_1" />
                </el-row>
                <el-row>
                  <el-checkbox v-model.number="screeningForm.absoluteValue" :disabled="disable_1">是否包含绝对值</el-checkbox>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="22">
              <el-col :span="4">
                <el-radio v-model="radio" label="2">范围</el-radio>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="startNum">
                  <el-input v-model="screeningForm.startNum" type="number" style="width: 80px" :disabled="disable_2" />
                </el-form-item>
              </el-col>
              <el-col :span="1" align="center">~</el-col>
              <el-col :span="4">
                <el-form-item prop="endNum">
                  <el-input v-model="screeningForm.endNum" type="number" style="width: 80px" :disabled="disable_2" />
                </el-form-item>
              </el-col>
              <el-col :span="2">BP</el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="" align="left">
            <el-row :gutter="22">
              <el-col :span="4" align="center">排序</el-col>
              <el-col :span="20">
                <el-select v-model="screeningForm.screeningSort" placeholder="请选择">
                  <el-option label="升序" value="1" />
                  <el-option label="降序" value="2" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!--    </el-card>-->
  </div>
</template>

<script>
// import { saveOrderInfo, queryOrderInfo } from '@/api/market/market.js'

export default {
  name: 'ScreeningNumForm',
  components: {},
  // props: ['businessId', 'disabled'],
  data() {
    return {
      radio: '1',
      disable_1: false,
      disable_2: true,
      isScreened: false,
      numFormRules: {
        startNum: [{ validator: (rule, value, callback) => {
          // typeof this.screeningForm.endNum === 'undefined' || this.screeningForm.endNum === '' || value <= this.screeningForm.endNum
          if (value > this.screeningForm.endNum) {
            callback(new Error('开始数值需小于等于结束数值'))
          } else {
            callback()
          }
        }, trigger: 'change' }],
        endNum: [{ validator: (rule, value, callback) => {
          // typeof this.screeningForm.startNum === 'undefined' || this.screeningForm.startNum === '' || value >= this.screeningForm.startNum
          if (value < this.screeningForm.startNum) {
            callback(new Error('结束数值需大于等于开始数值'))
          } else {
            callback()
          }
        }, trigger: 'change' }]
      }
    }
  },
  computed: {
    screeningForm: {
      get() {
        return this.$store.state.screeningDate.screeningForm
      },
      set(screeningForm) {
        this.$store.commit('screeningDate/setScreeningDate', screeningForm)
      }
    }
  },
  watch: {
    radio: 'radioChange'
  },
  activated() {
    const form = this.screeningForm
    if (typeof form.startNum !== 'undefined' || typeof form.endNum !== 'undefined') {
      this.radio = '2'
      this.isScreened = true
    }
  },
  methods: {
    screening() {
      this.$refs['screeningForm'].validate((valid) => {
        if (valid) {
          this.$emit('dateCallBack')
        } else {
          // this.$message('error submit!!')
          return false
        }
      })
    },
    radioChange(curVal, oldVal) {
      if (curVal !== oldVal) {
        this.disable_1 = !this.disable_1
        this.disable_2 = !this.disable_2
      }
      if (!this.isScreened) {
        this.reset()
      } else {
        this.isScreened = false
      }
    },
    reset() {
      this.$store.commit('screeningDate/setScreeningDate', {})
    },
    getForm() {
      return this.screeningForm
    }
  }
}
</script>

<style scoped>
  /*.el-form-item {*/
  /*  margin-left: 0px;*/
  /*}*/
</style>

