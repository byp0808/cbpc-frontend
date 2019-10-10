<template>
  <!--  数值型-->
  <div class="" style="width: 600px">
    <el-form ref="screeningForm" status-icon :model="screeningForm" label-width="150px">
      <el-row :gutter="76" align="left">
        <div class="grid-content bg-purple">
          <el-form-item label="">
            <el-row :gutter="22">
              <el-col :span="4">
                <el-radio v-model="radio" label="1">数值</el-radio>
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-input v-model="screeningForm.screeningNum" style="width: 200px" :disabled="disable_1" />
                </el-row>
                <el-row>
                  <el-checkbox v-model="screeningForm.absoluteValue" :disabled="disable_1">是否包含绝对值</el-checkbox>
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
                <el-input v-model="screeningForm.startNum" style="width: 80px" :disabled="disable_2" />
              </el-col>
              <el-col :span="1" align="center">~</el-col>
              <el-col :span="4">
                <el-input v-model="screeningForm.endNum" style="width: 80px" :disabled="disable_2" />
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
      dateDisabled: false,
      rangeDisabled: false,
      radio: '1',
      disable_1: false,
      disable_2: true
    }
  },
  computed: {
    screeningForm: {
      get() {
        return this.$store.state.secondaryScr.screeningForm
      },
      set(screeningForm) {
        this.$store.commit('secondaryScr/setSecondaryScr', screeningForm)
      }
    }
  },
  watch: {
    radio: 'radioChange'
  },
  beforeMount() {
    // this.screeningForm.absoluteValue = false
    // this.screeningForm.screeningSort = '1'
  },
  methods: {
    screening() {
      const data = this.screeningForm
      console.info(data)
      this.$emit('dateCallBack')
    },
    radioChange(curVal, oldVal) {
      if (curVal !== oldVal) {
        this.disable_1 = !this.disable_1
        this.disable_2 = !this.disable_2
      }
      this.reset()
    },
    reset() {
      this.$store.commit('secondaryScr/setSecondaryScr', {})
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

