<template>
  <div class="app-container">
    <div class="top" style="margin-bottom:30px">
      <el-form ref="ruleInfo" :model="curveRelationInfo" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="目标曲线：" prop="curveId">
              <el-select v-model="curveRelationInfo.curveId" filterable placeholder="请选择目标曲线" @change="changeTarget">
                <el-option
                  v-for="item in curveList"
                  :key="item.curveId"
                  :label="item.productName"
                  :value="item.curveId"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="相对曲线：" prop="relativeCurveId">
              <el-select v-model="curveRelationInfo.relativeCurveId" filterable placeholder="请选择相对曲线" @change="changeRelative">
                <el-option
                  v-for="item in curveRelativeList"
                  :key="item.curveId"
                  :label="item.productName"
                  :value="item.curveId"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="addData">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="selectList"
      style="width: 100%"
      max-height="250"
      :header-cell-style="{background:'#f6f6f6'}"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" type="index" width="70" />
      <el-table-column label="估值曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.targetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="相对曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.relativeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteRow(scope.$index,selectList, selectId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-card ref="recAddRulesForm" class="box-card">
      <div slot="header" class="clearfix card-head">
        <h3 style="margin: 0">基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form ref="ruleInfo" :model="curveRelationInfo" label-width="120px">
              <el-form-item label="曲线关系ID">
                <el-input v-model="curveRelationInfo.id" disabled />
              </el-form-item>
              <el-form-item label="最后操作人">
                <el-input v-model="curveRelationInfo.lastUpdBy" disabled />
              </el-form-item>
              <el-form-item label="最后操作时间">
                <el-input v-model="curveRelationInfo.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card> -->
  </div>
</template>

<script>
import { saveCurveRelation, getCurveList, queryCurveRelation, haveId } from '@/api/valuation/curve-relation.js'
export default {
  name: 'AddRulesForm',
  props: ['relationId', 'disabled', 'isCopy'],
  data() {
    // var validateEnd = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请选择相对曲线！'))
    //   } else if (this.curveRelationInfo.relativeCurveId === value) {
    //     callback(new Error('目标曲线和相对曲线不能相同！'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      curveList: [],
      curveRelativeList: [],
      curveRelationInfo: {
        curveId: '',
        relativeCurveId: ''
      },
      rules: {
        curveId: [{ required: true, message: '请选择估值曲线！', trigger: 'change' }],
        // relativeCurveId: [{ required: true, validator: validateEnd, trigger: 'change' }]
        relativeCurveId: [{ required: true, message: '请选择相对曲线！', trigger: 'change' }]
      },
      copyRelation: { // 复制新增
        targetValue: '',
        relativeValue: ''
      },
      selectList: [],
      selectobj: {},
      selectId: [],
      haveId: [],
      allList: [],
      idInfo: {}
    }
  },
  beforeMount() {
    this.addclick()
    // haveId().then(res => {
    //   this.haveId = res
    // })
    // getCurveList().then(response => {
    //   this.allList = response
    //   for (let i = 0; i < this.allList.length; i++) {
    //     if (this.haveId.indexOf(this.allList[i].curveId) === -1) {
    //       this.curveList.push(this.allList[i])
    //       this.curveRelativeList.push(this.allList[i])
    //       console.log('33')
    //     }
    //   }
    // })
    if (this.relationId) {
      queryCurveRelation(this.relationId).then(response => {
        this.curveRelationInfo = response
        console.log('this.curveRelationInfo', this.curveRelationInfo)
        if (this.isCopy) {
          this.curveRelationInfo.Id = ''
        }
      })
    } else {
      this.curveRelationInfo = {}
    }
  },
  methods: {
    addclick() {
      haveId().then(res => {
        this.haveId = res
      })
      getCurveList().then(response => {
        this.allList = response
        for (let i = 0; i < this.allList.length; i++) {
          Array.from(new Set(this.haveId))
          if (this.haveId.indexOf(this.allList[i].curveId) === -1) {
            this.curveList.push(this.allList[i])
            this.curveRelativeList.push(this.allList[i])
          }
        }
      })
    },
    changeTarget(e) {
      console.log('ee', e)
      const idObj1 = {}
      idObj1.curveId = e
      this.targetId = e
      if (this.relativeId) {
        idObj1.relativeCurveId = this.relativeId
      }
      this.idInfo = idObj1
      const obj1 = {}
      this.curveRelativeList.map(v => {
        if (v.curveId === e) {
          // this.selectobj.targetName = v.productName
          this.targetName = v.productName
          obj1.targetName = v.productName
          if (this.relativeName) {
            obj1.relativeName = this.relativeName
          }
          this.selectobj = obj1
          v.disabled = true
        } else {
          v.disabled = false
        }
      })
    },
    changeRelative(e) {
      // if (e) {
      const idObj = {}
      this.relativeId = e
      idObj.relativeCurveId = e
      if (this.targetId) {
        idObj.curveId = this.targetId
      }
      this.idInfo = idObj
      const obj = {}
      this.curveList.map(v => {
        if (v.curveId === e) {
          // this.selectobj.relativeName = v.productName
          this.relativeName = v.productName
          obj.relativeName = v.productName
          if (this.targetName) {
            obj.targetName = this.targetName
          }
          this.selectobj = obj
          v.disabled = true
        } else {
          v.disabled = false
        }
      })
      // }
    },
    addData() {
      this.$refs.ruleInfo.validate(val => {
        if (val) {
          if (this.selectList.length > 0) {
            this.selectList.map(v => {
              if (v === this.selectobj) {
                this.$message.warning('不能重复添加哦！')
              } else {
                // this.selectList.push(this.selectobj)
                // this.selectId.push(this.idInfo)
                this.selectId.map(v => {
                  if (v.curveId === this.idInfo.curveId || v.relativeCurveId === this.idInfo.relativeCurveId ||
                  v.curveId === this.idInfo.relativeCurveId || v.relativeCurveId === this.idInfo.curveId) {
                    return this.$message.warning('不能重复添加哦！')
                  } else {
                    this.selectList.push(this.selectobj)
                    this.selectId.push(this.idInfo)
                  }
                })
                console.log('ppp', this.selectId)
              }
            })
          } else {
            this.selectList.push(this.selectobj)
            this.selectId.push(this.idInfo)
            console.log('rr', this.selectList)
          }
        }
      })
    },
    deleteRow(index, row, id) {
      this.curveList.map(v => {
        if (v.productName === row[index].targetName || v.productName === row[index].relativeName) {
          v.disabled = false
        }
      })
      this.curveRelativeList.map(v => {
        if (v.productName === row[index].targetName || v.productName === row[index].relativeName) {
          v.disabled = false
        }
      })
      row.splice(index, 1)
      id.splice(index, 1)
      // this.curveRelationInfo.curveId = ''
      // this.curveRelationInfo.relativeCurveId = ''
      console.log('id', this.selectId)
    },
    // 保存/编辑曲线关系
    save() {
      console.log('ids', this.selectId)
      saveCurveRelation(this.selectId).then(response => {
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
