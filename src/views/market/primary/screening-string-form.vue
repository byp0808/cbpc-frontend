<template>
  <!--  字段类-->
  <div class="" style="width: 300px">
    <el-form ref="screeningForm" status-icon :model="screeningForm" label-width="150px">
      <el-row :gutter="66" align="left">
        <div class="grid-content bg-purple">
          <el-form-item label="内容" align="left" prop="screeningString">
            <el-input v-model="screeningForm.screeningString" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="排序" prop="screeningSort">
            <el-select v-model="screeningForm.screeningSort" placeholder="请选择" style="width: 200px">
              <el-option label="升序" value="1" />
              <el-option label="降序" value="2" />
            </el-select>
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
  name: 'ScreeningStringForm',
  components: {},
  props: ['businessId', 'disabled'],
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
        return this.$store.state.screeningDate.screeningForm
      },
      set(screeningForm) {
        this.$store.commit('screeningDate/setScreeningDate', screeningForm)
      }
    }
  },
  methods: {
    screening() {
      const data = this.screeningForm
      console.info(data)
      this.$emit('dateCallBack')
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
  .el-form-item {
    margin-left: 0px;
  }
</style>

