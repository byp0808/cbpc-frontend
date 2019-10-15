<template>
  <div class="">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form ref="KdTempForm" :model="kdTempInfo" :rules="kdTempInfoRules" label-width="150px">
              <el-form-item label="规则ID">
                <el-input v-model="kdTempInfo.id" disabled />
              </el-form-item>
              <el-form-item label="规则名称" prop="tempName">
                <el-input v-model="kdTempInfo.tempName" :disabled="false" placeholder="请输入规则名称" type="text" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form ref="kdTempInfo" :model="kdTempInfo" label-width="150px">
              <el-form-item label="最后操作人">
                <el-input v-model="kdTempInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="kdTempInfo.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="18" :offset="5">
          <div class="grid-content bg-purple">
            <el-transfer
              v-model="kdrule.picked"
              :data="kdrule.unpick"
              :titles="['未选', '已选']"
              :props="{
                key: 'key',
                label: 'lable'
              }"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { savekdTemp, queryKdTemp, checkTempName } from '@/api/curve/curve-kdtemp-list.js'

export default {
  name: 'KdTempForm',
  components: {},
  props: ['businessId', 'disabled', 'isCopy'],
  data() {
    const generateData = _ => {
      const data = this.$dict('KD_TYPE')
      // console.log(data, typeof (data))
      const unpick = []
      for (var key in data) {
        unpick.push({
          key: data[key],
          lable: data[key]
        })
      }
      return unpick
    }
    return {
      kdrule: {
        unpick: generateData(),
        picked: []
      },

      kdTempInfoRules: {
        tempName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' },
          { validator: this.checkTempName, trigger: 'blur' }
        ]
      },

      reqData: {
        id: '',
        tempType: 'kd',
        rules: []
      }
    }
  },
  computed: {
    kdTempInfo: {
      get() {
        return this.$store.state.kdTemp.kdTempInfo
      },
      set(kdTempInfo) {
        this.$store.commit('kdTemp/setkdTempInfo', kdTempInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      this.reqData.id = this.businessId
      this.reqData.tempType = 'kd'
      this.reqData.rules = this.kdrule.unpick
      const data = this.reqData
      queryKdTemp(data).then(response => {
        this.$store.commit('kdTemp/setkdTempInfo', response)
        const { picked } = response
        this.kdrule.picked = picked
        // console.log(this.kdrule.picked)
      })
    }
  },
  methods: {
    save(formName) {
      if (this.isCopy) {
        // 复制新增-->删除Id
        this.reqData.id = ''
        this.kdTempInfo.id = ''
      }
      this.$refs.KdTempForm.validate((valid) => {
        if (valid) {
          const data = this.kdTempInfo
          var standSlip = ''
          var picked = this.kdrule.picked.sort(this.sortNum)
          // console.log(picked)
          for (var i in picked) {
            if (picked[i] === '0') {
              standSlip += picked[i] + 'd;'
            } else {
              standSlip += picked[i] + 'Y;'
            }
          }
          if (!standSlip) {
            this.$message({
              message: '规则不能为空',
              type: 'error'
            })
            return false
          }
          data.standSlip = standSlip
          // console.log(this.kdrule.picked)
          savekdTemp(data).then(response => {
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
    },
    sortNum(a, b) {
      return a - b
    },
    checkTempName(rule, value, callback) {
      var data = {}
      data.tempType = 'kd'
      data.tempName = value
      data.id = this.kdTempInfo.id
      checkTempName(data).then(response => {
        // console.log(response)
        if (response) {
          callback(new Error('模板名称重复'))
        } else {
          callback()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
