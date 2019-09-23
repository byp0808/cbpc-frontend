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
import { savekdTemp, queryKdTemp } from '@/api/curve/curve-kdtemp-list.js'

export default {
  name: 'KdTempForm',
  components: {},
  props: ['businessId', 'disabled'],
  data() {
    const generateData = _ => {
      const data = this.$dict('KD_TYPE')
      console.log(data)
      const unpick = []
      for (var i in data) {
        unpick.push({
          key: data[i],
          lable: data[i]
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
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
        ]
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
      queryKdTemp(this.businessId).then(response => {
        this.$store.commit('kdTemp/setkdTempInfo', response)
      })
    }
  },
  methods: {
    save(formName) {
      this.$refs.KdTempForm.validate((valid) => {
        if (valid) {
          const data = this.kdTempInfo
          var standSlip = []
          for (var i in this.kdrule.picked) {
            if (this.kdrule.picked[i] === '0') {
              standSlip += this.kdrule.picked[i] + 'd;'
            } else {
              standSlip += this.kdrule.picked[i] + 'Y;'
            }
          }
          data.standSlip = standSlip
          console.log(this.kdrule.picked)
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
    }
  }
}
</script>

<style scoped>

</style>
