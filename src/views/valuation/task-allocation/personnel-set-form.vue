<template>
  <div class="">
    <el-form ref="refPersonnelSetForm" :model="ruleInfo" :rules="rules" label-width="110px">
      <el-form-item label="选择任务范围" prop="taskRangeId">
        <el-select v-model="ruleInfo.taskRangeId" filterable placeholder="请选择任务范围" :disabled="disabled">
          <el-option
            v-for="range in taskRangeList"
            :key="range.id"
            :label="range.taskRangeName"
            :value="range.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(personnel, index) in ruleInfo.distRuleList"
        :key="index"
        :label="'人员' + (index+1)"
      >
        <el-col :span="10">
          <el-form-item
            :prop="'distRuleList.'+index+'.userId'"
            :rules="{ required: true, message: '请选择分配人员', trigger: 'change' }"
          >
            <el-select v-model="personnel.userId" filterable placeholder="请选择人员" :disabled="disabled">
              <el-option
                v-for="item in personnelList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            :prop="'distRuleList.'+index+'.distRatio'"
            :rules="[
              { required: true, message: '请输入分配比例', trigger: 'blur' }
              ,{ type: 'number', message: '比例必须为整数型'}
            ]"
          >
            <el-input v-model.number="personnel.distRatio" placeholder="请输入分配比例" :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-button :disabled="disabled" @click.prevent="removePersonnel(personnel)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="disabled" @click="addPersonnel">添加人员</el-button>
      </el-form-item>
      <el-form-item label="最后操作人">
        <el-col :span="11">
          <el-input v-model="ruleInfo.lastUpdBy" disabled />
        </el-col>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-col :span="11">
          <el-input v-model="ruleInfo.lastUpdTs" disabled />
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addTaskAllocation, queryTaskRangeSelects, taskAllocation, personnelList } from '@/api/valuation/task-allocation.js'
export default {
  name: 'PersonnelSetForm',
  props: ['groupId', 'disabled'],
  data() {
    return {
      // 任务范围列表
      taskRangeList: [{ id: '', taskRangeName: '' }],
      // 人员列表
      personnelList: [],
      // 任务分配规则对象
      ruleInfo: {
        taskRangeId: '', // 任务范围Id
        gropuId: '',
        distRuleList: [{ userId: '', distRatio: '' }], // 人员-分配比例 列表
        lastUpdBy: '', // 最后更新者
        lastUpdTs: '' // 最后更新时间
      }, // 规则对象
      rules: {
        taskRangeId: [{ required: true, message: '请选择任务范围', trigger: 'change' }]
      }
    }
  },
  beforeMount() {
    personnelList('00001').then(response => {
      this.personnelList = response
    })
    if (this.groupId) {
      taskAllocation(this.groupId).then(response => {
        this.ruleInfo = response
      })
    }
    queryTaskRangeSelects().then(response => {
      this.taskRangeList = response
    })
  },
  methods: {
    addPersonnel() {
      this.ruleInfo.distRuleList.push({
        userId: '',
        distRatio: '',
        key: Date.now()
      })
    },
    removePersonnel(item) {
      console.log(item)
      var index = this.ruleInfo.distRuleList.indexOf(item)
      if (index !== -1) {
        this.ruleInfo.distRuleList.splice(index, 1)
      }
    },
    save() {
      this.$refs['refPersonnelSetForm'].validate((valid) => {
        if (valid) {
          if (this.ruleInfo.distRuleList.length !== 0) {
            let result = 0
            for (const item of this.ruleInfo.distRuleList) {
              result = result + Number.parseInt(item.distRatio)
            }
            if (result === 100) {
              addTaskAllocation(this.ruleInfo).then(response => {
                this.$emit('saveCallBack')
                this.$message({
                  message: '保存成功！',
                  type: 'success',
                  showClose: true
                })
              })
            } else {
              this.$message({
                message: '分配任务总和应为100！',
                type: 'error',
                showClose: true
              })
            }
          } else {
            this.$message({
              message: '请添加人员分配！',
              type: 'error',
              showClose: true
            })
          }
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
