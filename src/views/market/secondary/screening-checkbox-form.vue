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
                <!--<el-input v-model="screeningForm.screeningCheckString" placeholder="请输入内容" :disabled="disable_1" />-->
                <el-select
                  v-model="screeningForm.screeningCheckString"
                  multiple
                  collapse-tags
                  filterable
                  :disabled="disable_1"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
                  <el-checkbox v-for="item in options" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
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

export default {
  name: 'ScreeningCheckboxForm',
  components: {},
  // props: ['options'],
  props: {
    optionsList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      radio: '1',
      disable_1: false,
      disable_2: true,
      options: [],
      checked: [],
      isScreened: false
    }
  },
  // watch: {
  //   options(val) {
  //     console.log('val', val)
  //   }
  // },
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
    radio: 'radioChange',
    checked: 'checkedChange'
  },
  activated() {
    // console.info(this.optionsList)
    this.optionsList.map(opt => {
      this.options.push(opt)
    })
    const form = this.screeningForm
    // console.info('刚进来')
    // console.info(this.screeningForm)
    if (typeof form.screeningChecked !== 'undefined' && form.screeningChecked !== []) {
      this.checked = form.screeningChecked
      this.radio = '2'
      this.isScreened = true
    } else if (typeof form.screeningCheckString !== 'undefined' && form.screeningCheckString !== []) {
      this.radio = '1'
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
      // console.info('切换')
      // console.info(this.screeningForm)
    },
    checkedChange() {
      this.screeningForm.screeningChecked = this.checked
    },
    reset() {
      this.checked = []
      // this.$store.commit('secondaryScr/setSecondaryScr', {})
      this.screeningForm.screeningCheckString = []
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

