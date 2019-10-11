<template>
  <!--  可选类-->
  <div class="" style="width: 300px">
    <el-form ref="screeningForm" status-icon :model="screeningForm" label-width="150px">
      <el-row :gutter="66" align="left">
        <div class="grid-content bg-purple">
          <el-form-item label="" align="left">
            <el-row :gutter="22">
              <el-col :span="2">
                <el-radio v-model="radio" label="1">&nbsp;</el-radio>
              </el-col>
              <el-col :span="20">
                <el-input v-model="screeningForm.screeningCheckString" placeholder="请输入内容" :disabled="disable_1" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="22">
              <el-col :span="5">
                <el-radio v-model="radio" label="2">&nbsp;</el-radio>
              </el-col>
              <el-col :span="12">
                <el-checkbox-group v-model="checked" :disabled="disable_2">
                  <el-checkbox label="复选框 A" />
                  <el-checkbox label="复选框 B" />
                  <el-checkbox label="复选框 C" />
                </el-checkbox-group>
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
  name: 'ScreeningCheckboxForm',
  components: {},
  // props: ['businessId', 'disabled'],
  data() {
    return {
      radio: '1',
      disable_1: false,
      disable_2: true,
      checked: [],
      isScreened: false
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
    radio: 'radioChange',
    checked: 'checkedChange'
  },
  activated() {
    const form = this.screeningForm
    if (typeof form.screeningChecked !== 'undefined' && form.screeningChecked.length !== 0) {
      this.checked = form.screeningChecked
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
    checkedChange() {
      this.screeningForm.screeningChecked = this.checked
    },
    reset() {
      this.checked = []
      this.$store.commit('screeningDate/setScreeningDate', {})
    },
    getForm() {
      return this.screeningForm
    }
  }
}
</script>

<style scoped>
  .el-form-item {
    margin-left: 0px;
  }
</style>

