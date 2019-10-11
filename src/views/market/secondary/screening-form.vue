<template>
  <!--  日期类-->
  <div class="" style="width: 300px">
    <el-form ref="screeningForm" status-icon :model="screeningForm" label-width="150px">
      <el-row :gutter="66" align="left">
        <div class="grid-content bg-purple">
          <el-form-item label="" align="left">
            <el-row :gutter="22">
              <el-col :span="6">
                <el-radio v-model="radio" label="1">&nbsp;</el-radio>
              </el-col>
              <el-col :span="18">
                <el-date-picker
                  v-model="screeningForm.singleDate"
                  type="datetime"
                  placeholder="选择日期"
                  :disabled="disable_1"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="22">
              <el-col :span="6">
                <el-radio v-model="radio" label="2">&nbsp;</el-radio>
              </el-col>
              <el-col :span="18">
                <el-date-picker
                  v-model="screeningForm.dateRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :disabled="disable_2"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="" prop="screeningSort">
            <el-row :gutter="22">
              <el-col :span="6" align="right">排序</el-col>
              <el-col :span="12">
                <el-select v-model="screeningForm.screeningSort" placeholder="请选择" style="width: 200px">
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
  name: 'ScreeningForm',
  components: {},
  // props: ['businessId', 'disabled'],
  data() {
    return {
      radio: '1',
      disable_1: false,
      disable_2: true,
      isScreened: false
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
    // this.screeningForm.screeningSort = '1'
  },
  activated() {
    console.info('数值类型')
    const form = this.screeningForm
    if (typeof form.dateRange !== 'undefined') {
      this.radio = '2'
      this.isScreened = true
    }
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
      if (!this.isScreened) {
        this.reset()
      } else {
        this.isScreened = false
      }
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
  .el-form-item[data-v-d31eec1e] {
    margin-left: -50px;
  }
</style>

