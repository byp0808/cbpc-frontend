<template>
  <div class="">
    <el-form ref="" :model="ruleInfo" label-width="110px">
      <el-form-item label="1.选择任务范围">
        <el-select v-model="ruleInfo.taskRangeId" filterable placeholder="请选择任务范围" :disabled="disabled">
          <el-option
            v-for="item in taskRangeList"
            :key="item.id"
            :label="item.taskRangeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(personnel, index) in ruleInfo.distRuleList"
        :key="personnel.key"
        :label="'人员' + (index+1)"
        :prop="'ruleInfo.distRuleList.' + index + '.value'"
        :rules="{ required: true, message: '人员不能为空', trigger: 'blur'}"
      >
        <el-col :span="10">
          <el-select v-model="personnel.userId" filterable placeholder="请选择人员">
            <el-option
              v-for="item in personnelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-input v-model="personnel.distRatio" placeholder="请输入分配比例" />
        </el-col>
        <el-button @click.prevent="removePersonnel(personnel)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addPersonnel">添加人员</el-button>
      </el-form-item>
      <el-form-item label="最后操作人">
        <el-col :span="11">
          <el-input v-model="ruleInfo.lastUpdBy" disabled placeholder="黎明" />
        </el-col>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-col :span="11">
          <el-input v-model="ruleInfo.lastUpdTs" disabled placeholder="2019.09.07 10:38 AM" />
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addTaskAllocation, queryTaskRangeList } from '@/api/valuation/task-allocation.js'
export default {
  name: 'PersonnelSetForm',
  props: ['taskRangeId', 'disabled'],
  data() {
    return {
      // 任务范围列表
      taskRangeList: [
        { id: '', taskRangeName: '' }
      ],
      // 人员列表
      personnelList: [
        { id: '01', name: '张三' },
        { id: '02', name: '李四' }
      ],
      // 任务分配规则对象
      ruleInfo: {
        taskRangeId: '', // 任务范围Id // 人员-分配比例 集合
        distRuleList: [{ userId: '', distRatio: '' }],
        lastUpdBy: '', // 最后更新者
        lastUpdTs: '' // 最后更新时间
      } // 规则对象
    }
  },
  beforeMount() {
    queryTaskRangeList().then(response => {
      const { taskRangeList } = response
      this.taskRangeList = taskRangeList
      this.ruleInfo.taskRangeId = this.taskRangeId
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
      addTaskAllocation(this.ruleInfo).then(response => {
        console.log(response)
        this.$emit('saveCallBack')
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
