<template>
  <div class="app-container">
    <h4>对敲行情参数设置</h4>
    <el-form ref="Paraform" :model="paraform" :inline="true" :rules="rules" class="demo-form-inline" size="mini">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="para_1" label="利率曲线：检测对敲行情的时间范围">
            <el-select v-model="paraform.para_1.paraValue" value-key="value" style="width:100px" :disabled="disabled">
              <el-option v-for="item in timeFrameOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="para_2" label="单笔数额区间:">
            <el-input v-model="paraform.para_2.minParaValue" type="number" style="width:80px" :disabled="disabled" /> 到
            <el-input v-model="paraform.para_2.maxParaValue" type="number" style="width:80px" :disabled="disabled" /> (万元)
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="para_3" label="对敲价差区间:">
            <el-input v-model="paraform.para_3.minParaValue" type="number" style="width:80px" :disabled="disabled" /> 到
            <el-input v-model="paraform.para_3.maxParaValue" type="number" style="width:80px" :disabled="disabled" /> (万元)
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="para_4" label="信用曲线：检测对敲行情的时间范围">
            <el-select v-model="paraform.para_4.paraValue" value-key="value" style="width:100px" :disabled="disabled">
              <el-option v-for="item in timeFrameOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="para_5" label="单笔数额区间:">
            <el-input v-model="paraform.para_5.minParaValue" type="number" style="width:80px" :disabled="disabled" /> 到
            <el-input v-model="paraform.para_5.maxParaValue" type="number" style="width:80px" :disabled="disabled" /> (万元)
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="para_6" label="对敲价差区间:">
            <el-input v-model="paraform.para_6.minParaValue" type="number" style="width:80px" :disabled="disabled" /> 到
            <el-input v-model="paraform.para_6.maxParaValue" type="number" style="width:80px" :disabled="disabled" /> (万元)
          </el-form-item>
        </el-col>
      </el-row>
      <h4>净值偏差上限设置</h4>
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="para_7" label="净值偏差上限绝对值:">
            <el-input v-model="paraform.para_7.paraValue" type="number" style="width:60px" @change="notNullControl" /> /元
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="6" :offset="16">
        <el-button type="primary" style="width:100px" @click="onSubmit()">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { optioins } from '@/api/curve/code-type.js'
import { queryParaList, saveParaInfo, getAppRoles } from '@/api/market/market-para.js'
export default {
  name: 'Paraform',
  data() {
    return {
      disabled: false,
      notNull: true,
      matchedParaList: [],
      paraform: {
        para_1: {
          id: '',
          curveType: '01',
          paraValue: {
            label: '',
            value: ''
          },
          paraBelongTo: 'O',
          minParaValue: '',
          maxParaValue: '',
          paraName: 'MATCHED_TIME_FRAME',
          orderBy: 1
        },
        para_2: {
          id: '',
          curveType: '01',
          paraBelongTo: 'O',
          minParaValue: '',
          maxParaValue: '',
          paraName: 'SINGLE_AMT_FRAME',
          orderBy: 2
        },
        para_3: {
          id: '',
          curveType: '01',
          paraBelongTo: 'O',
          minParaValue: '',
          maxParaValue: '',
          paraName: 'SPREAD_FRAME',
          orderBy: 3
        },
        para_4: {
          id: '',
          curveType: '02',
          paraValue: {
            label: '',
            value: ''
          },
          paraBelongTo: 'O',
          minParaValue: '',
          maxParaValue: '',
          paraName: 'MATCHED_TIME_FRAME',
          orderBy: 4
        },
        para_5: {
          id: '',
          curveType: '02',
          paraBelongTo: 'O',
          minParaValue: '',
          maxParaValue: '',
          paraName: 'SINGLE_AMT_FRAME',
          orderBy: 5
        },
        para_6: {
          id: '',
          curveType: '02',
          paraBelongTo: 'O',
          minParaValue: '',
          maxParaValue: '',
          paraName: 'SPREAD_FRAME',
          orderBy: 6
        },
        para_7: {
          id: '',
          curveType: '',
          paraValue: '',
          paraBelongTo: 'P',
          minParaValue: '',
          maxParaValue: '',
          paraName: 'NETDEVIATION_LIMIT',
          orderBy: 7
        }
      },
      rules: {
        para_1: [
          { validator: this.checkValue, trigger: 'blur' }
        ],
        para_2: [
          { validator: this.checkFrameValue, trigger: 'blur' }
        ],
        para_3: [
          { validator: this.checkFrameValue, trigger: 'blur' }
        ],
        para_4: [
          { validator: this.checkValue, trigger: 'blur' }
        ],
        para_5: [
          { validator: this.checkFrameValue, trigger: 'blur' }
        ],
        para_6: [
          { validator: this.checkFrameValue, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    timeFrameOptions() {
      return optioins(this, 'MATCHED_TIME_FRAME')
    }
  },
  beforeMount() {
    const data = {}
    // 查询用户角色
    data.appId = '01'
    getAppRoles(data).then(response => {
      const { roles } = response
      // console.log(this.roles)
      if (roles[0].roleName === '估值师') {
        this.disabled = true
      }
    })

    queryParaList(data).then(response => {
      const { paraform } = response
      if (Object.keys(paraform).length !== 0) {
        console.log(paraform)
        this.paraform = paraform
      }
    })
  },
  methods: {
    onSubmit(formName) {
      // console.log("onSubmit")
      this.$refs.Paraform.validate((valid) => {
        if (valid) {
          this.matchedParaList = []
          if (this.paraform.para_1.paraValue.value) {
            this.matchedParaList.push(this.paraform.para_1)
          }
          if (this.paraform.para_2.minParaValue) {
            this.matchedParaList.push(this.paraform.para_2)
          }
          if (this.paraform.para_3.minParaValue) {
            this.matchedParaList.push(this.paraform.para_3)
          }
          if (this.paraform.para_4.paraValue.value) {
            this.matchedParaList.push(this.paraform.para_4)
          }
          if (this.paraform.para_5.minParaValue) {
            this.matchedParaList.push(this.paraform.para_5)
          }
          if (this.paraform.para_6.minParaValue) {
            this.matchedParaList.push(this.paraform.para_6)
          }
          if (this.paraform.para_7.paraValue) {
            this.matchedParaList.push(this.paraform.para_7)
          }
          var data = []
          data = this.matchedParaList
          saveParaInfo(data).then(response => {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
          })
          this.$options.methods.loadform()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    notNullControl(val) {
      if (val) {
        this.notNull = false
      }
    },
    checkValue(rule, value, callback) {
      if (value.paraValue.value === '' && this.notNull) {
        callback(new Error('不能为空'))
      }
      callback()
    },
    checkFrameValue(rule, value, callback) {
      if (value.maxParaValue !== '') {
        if (!value.minParaValue && this.notNull) {
          callback(new Error('不能为空'))
        }
        // if (Number(value.minParaValue) < 0 || Number(value.maxParaValue) < 0) {
        //   callback(new Error('不能小于0'))
        // }
        if (Number(value.minParaValue) > Number(value.maxParaValue)) {
          callback(new Error('最大值不能小于最小值'))
        }
      }
      if (value.minParaValue === '' && value.maxParaValue === '' && this.notNull) {
        callback(new Error('不能为空'))
      }
      callback()
    },
    loadform() {
      const data = {}
      queryParaList(data).then(response => {
        const { paraform } = response
        this.paraform = paraform
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
