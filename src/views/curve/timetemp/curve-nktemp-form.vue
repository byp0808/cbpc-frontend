<template>
  <div class="">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form ref="NkTempForm" :model="nkTempInfo" :rules="nkTempInfoRules" label-width="150px">
              <el-form-item label="规则ID">
                <el-input v-model="nkTempInfo.id" disabled />
              </el-form-item>
              <el-form-item label="规则名称" prop="tempName">
                <el-input v-model="nkTempInfo.tempName" :disabled="false" maxlength="42" placeholder="请输入规则名称" type="text" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form ref="nkTempInfo" :model="nkTempInfo" label-width="150px">
              <el-form-item label="最后操作人">
                <el-input v-model="nkTempInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="nkTempInfo.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="addDetail" :model="addDetail" label-width="150px">
              <el-form-item label="N=">
                <el-input v-model="addDetail.nvalue" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="addDetail" :model="addDetail" label-width="150px">
              <el-form-item label="K=">
                <el-input v-model="addDetail.kvalue" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="margin-bottom: 20px">
            <el-button type="primary" @click="adddetail">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table
        ref="refNkValueTable"
        border
        highlight-current-row
        :data="newsList"
        tooltip-effect="dark"
        style="width: 401px;left: 200px"
      >
        <el-table-column
          prop="nvalue"
          label="N"
          show-overflow-tooltip
          width="200"
          align="center"
        />
        <el-table-column
          prop="kvalue"
          label="K"
          show-overflow-tooltip
          width="200"
          align="center"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { savenkTemp, queryNkTemp } from '@/api/curve/curve-nktemp-list.js'
import { checkTempName } from '@/api/curve/curve-kdtemp-list.js'

export default {
  name: 'NkTempForm',
  components: {},
  props: ['businessId', 'disabled', 'isCopy'],
  data() {
    return {
      nkTempInfoRules: {
        tempName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { min: 1, max: 42, message: '超长', trigger: 'blur' },
          { validator: this.checkTempName, trigger: 'blur' }
        ]
      },
      addDetail: {},
      newsList: [],
      reqData: {
        id: '',
        tempType: 'nk'
      }
    }
  },
  computed: {
    nkTempInfo: {
      get() {
        return this.$store.state.nkTemp.nkTempInfo
      },
      set(nkTempInfo) {
        this.$store.commit('nkTemp/setnkTempInfo', nkTempInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      this.reqData.id = this.businessId
      this.reqData.tempType = 'nk'
      const data = this.reqData
      queryNkTemp(data).then(response => {
        const { nkList } = response
        // console.log(nkList)
        this.newsList = nkList
        this.$store.commit('nkTemp/setnkTempInfo', response)
      })
    }
  },
  methods: {
    save(formName) {
      if (this.isCopy) {
        this.nkTempInfo.id = ''
      }
      this.$refs.NkTempForm.validate((valid) => {
        if (valid) {
          // console.log(this.newsList)
          if (this.newsList.length === 0) {
            this.$message({
              message: 'NK值不能为空！',
              type: 'error',
              showClose: true
            })
            return false
          }
          const data = this.nkTempInfo
          data.nkList = this.newsList
          savenkTemp(data).then(response => {
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
    adddetail() {
      // 这里的思路应该是把this.addDetail传给服务端，然后加载列表this.newsList
      // this.newsList.push(this.addDetail)
      if (this.addDetail.nvalue > 49 || this.addDetail.kvalue > 49) {
        this.$message({
          message: 'N\K值不能大于49',
          type: 'error'
        })
        return false
      }
      if (this.addDetail.nvalue === '0' && this.addDetail.kvalue === '0') {
        this.$message({
          message: 'N\K值不能同时为0',
          type: 'error'
        })
        return false
      }
      if (Number(this.addDetail.nvalue) % 1 !== 0 || Number(this.addDetail.kvalue) % 1 !== 0) {
        this.$message({
          message: 'N\K值只能为整数',
          type: 'error'
        })
        return false
      }
      // 判断NK 是否互斥
      if (Number(this.addDetail.nvalue) + Number(this.addDetail.kvalue) !== Math.abs(Number(this.addDetail.nvalue) - Number(this.addDetail.kvalue))) {
        this.$message({
          message: 'NK值需互斥,一方有值,另一方为0',
          type: 'error'
        })
        return false
      }
      // 判断NK重复
      var reflag = false
      for (const item of this.newsList) {
        if (item.nvalue === Number(this.addDetail.nvalue).toFixed(1) && item.kvalue === Number(this.addDetail.kvalue).toFixed(1)) {
          reflag = true
          break
        }
      }
      if (reflag) {
        this.$message({
          message: 'N\K重复',
          type: 'error'
        })
        return false
      }
      if (this.addDetail.nvalue && this.addDetail.kvalue) {
        var nvalue = Number(this.addDetail.nvalue).toFixed(1)
        var kvalue = Number(this.addDetail.kvalue).toFixed(1)
        this.newsList.push({
          nvalue: nvalue,
          kvalue: kvalue
        })
      }
    },
    checkTempName(rule, value, callback) {
      var data = {}
      data.tempType = 'nk'
      data.tempName = value
      data.id = this.nkTempInfo.id
      checkTempName(data).then(response => {
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
