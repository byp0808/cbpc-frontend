<template>
  <div class="app-container">
    <el-col :span="10">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item prop="dateType" label="计算历史分位点类型">
          <el-select v-model="form.dateType" placeholder="" @change="computeHisIndexChange" prop="computeHisIndex">
            <el-option v-for="item in dateTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="计算历史分位点期限">
          <el-select v-model="form.termType" :disabled="computeHisDateDisabled" placeholder="">
            <el-option v-for="item in termTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>
<script>
import { getCurveSetHisIndexByOrgId, saveCurveSetHisIndexByOrgId } from '@/api/curve/curve-set-hisindex.js'
import { optioins } from '@/api/curve/code-type.js'
export default {
  data() {
    return {
      computeHisDateDisabled: true,
      computeResultVisible: false, // 计算结果是否显示
      computeResult: '', // 计算结果
      form: {
        dateType: '',
        termType: ''
      },
      rules: {
        dateType: [
          { required: true, message: '请选择历史分位点类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dateTypeOptions() {
      return optioins(this,'COMPUTE_HISINDEX')
    },
    termTypeOptions() {
      return optioins(this,'COMPUTE_HIS_DATE')
    }
  },
  beforeMount() {
    console.info('===beforeMount===')
    // 加载本部门已有配置
    getCurveSetHisIndexByOrgId({}).then(response => {
      if (!response) {
        this.form = {
          dateType: '',
          termType: ''
        }
      }else {
        this.form = response
        this.computeHisIndexChange(response.dateType)
      }
    })

  },
  methods: {
    computeHisIndexChange(newValue) {
      // 自曲线发布以来，时间隐藏不可选
      if (newValue === '1') {
        this.computeHisDateDisabled = true
        this.form.termType = ''
      } else if (newValue === '2') {
        this.computeHisDateDisabled = false
      }
    },
    // 计算
    onSubmit() {
      console.log('submit!')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveCurveSetHisIndexByOrgId(this.form).then(response => {
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
<style>
.with-full {
  width: 100%;
}
</style>
