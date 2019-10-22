<template>
  <el-row type="flex">
    <el-col class="initPanel" :span="12">
      <el-table ref="refFormulaEditList" :data="formulaEditList" tyle="width:100%;">
        <el-table-column type="index" width="40" />
        <el-table-column label="场景" prop="sceneFormula" show-overflow-tooltip />
        <el-table-column label="行为" prop="actionFormula" show-overflow-tooltip />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="!disabled"
              type="text"
              size="big"
              @click="curveHomologyUpdate(scope.$index)"
            >修改
            </el-button>
            <el-button
              v-if="disabled"
              type="text"
              size="big"
              @click="curveHomologyUpdate(scope.$index)"
            >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-if="!disabled" class="filter-item" type="primary" size="big" style="position: absolute;right: 125px;margin-top:30px;width:100px" @click="curveHomologyAdd">新增</el-button>
      <el-button v-if="!disabled" class="filter-item" type="primary" size="big" style="position: absolute;right: 10px;margin-top:30px;width:100px" @click="save">保存</el-button>
    </el-col>
    <el-col v-show="detailColVisible" class="initPanel panelRight" :span="12">
      <el-form ref="detailForm" :model="detailForm" label-position="left" label-width="90px">
        <el-row>
          <el-col :span="3">
            <h3 style="font-size:40px;">场<br><br>景</h3>
          </el-col>
          <el-col :span="19" class="box">
            <CurveSetInitDetailForm v-for="(item, index) in tmp_sceneList" :key="index" ref="refSceneList" :index="index" :detail-info="item" :disabled="disabled" />
            <el-row style="margin-top:5px">
              <el-col :span="8">
                <el-form-item
                  label-width="0px"
                  prop="sceneFormulaType"
                  :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                >
                  <el-select v-model="detailForm.sceneFormulaType" :disabled="disabled" placeholder="请选择" style="height:20px;width: 100%">
                    <el-option v-for="item in selectFormulaType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item
                  label-width="0px"
                  prop="sceneFormulaValue"
                  :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
                >
                  <el-input v-model="detailForm.sceneFormulaValue" :disabled="disabled" style="height:20px;width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="1" style="height:34px;line-height: 34px">BP</el-col>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-button v-if="!disabled" icon="el-icon-circle-plus" style="margin-top:80px;padding:0;font-size:40px;color:black;background:#fff;border:0;" circle @click="addScene" />
          </el-col>
        </el-row>
        <hr>
        <el-row>
          <el-col :span="3">
            <h3 style="font-size:40px;">行<br><br>为</h3>
          </el-col>
          <el-col :span="19" class="box">
            <CurveSetInitDetailForm v-for="(item, index) in tmp_actionList" :key="index" ref="refActionList" :index="index" :detail-info="item" :disabled="disabled" />
            <el-row style="margin-top:5px">
              <el-col :span="8">
                <el-form-item
                  label-width="0px"
                  prop="actionFormulaType"
                  :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                >
                  <el-select v-model="detailForm.actionFormulaType" :disabled="disabled" placeholder="请选择" style="height:20px;width: 100%">
                    <el-option v-for="item in selectFormulaTypeN" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item
                  label-width="0px"
                  prop="actionFormulaValue"
                  :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                >
                  <el-input v-model="detailForm.actionFormulaValue" :disabled="disabled" style="height:20px;width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="1" style="height:34px;line-height: 34px">BP</el-col>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-button
              v-if="!disabled"
              icon="el-icon-circle-plus"
              style="margin-top:80px;padding:0;font-size:40px;color:black;background:#fff;border:0;"
              circle
              @click="addAction"
            />
          </el-col>
        </el-row>
        <el-form-item>
          <el-button v-if="!disabled" type="primary" style="float: right;margin-right: 40px;margin-top: 20px;" @click="addDetailInit">保存场景行为</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { selectFormulaType, selectFormulaTypeN } from '@/api/curve/curve-set-init'
import CurveSetInitDetailForm from '@/views/curve/set/curve-set-init-form-ind'
import { multiply, divide } from '@/utils/math'

export default {
  components: { CurveSetInitDetailForm },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      disabled: false,
      formulaList: [], // 公式缓存数据
      formulaEditList: [], // 中间公式列表: 编辑数据
      detailList: [], // 场景行为明细缓存数据
      detailColVisible: false, // 右侧场景公式明细是否显示
      tmp_sceneList: [], // 场景
      tmp_actionList: [], // 公式
      detailForm: {
        opType: '', // 操作类型
        sceneFormulaType: '', // 场景算号
        sceneFormulaValue: 0, // 场景结果值
        actionFormulaType: '', // 行为算号
        actionFormulaValue: 0 // 行为结果值
      }
    }
  },
  computed: {
    // 该批次所需模型
    selectFormulaType() {
      return selectFormulaType()
    },
    selectFormulaTypeN() {
      return selectFormulaTypeN()
    }
  },
  beforeMount() {
    // 先加载列表
    this.resolve(this.row.homology)
    if (this.row) {
      this.detailForm.opType = 'EDIT'
    } else {
      this.detailForm.opType = 'ADD'
    }
  },
  methods: {
    // 修改场景和行为
    curveHomologyUpdate(index) {
      const _ = this.$lodash
      this.detailColVisible = true
      // 获取记录
      this.detailForm = this.formulaEditList[index]
      if (!this.detailForm) {
        this.$message({
          message: '获取记录异常，新重新操作！',
          type: 'error',
          showClose: true
        })
        return false
      }

      this.tmp_sceneList = []
      this.tmp_actionList = []
      // 获取场景、行为
      this.detailList.forEach((item, index) => {
        const newItem = _.assign({}, item)
        if (newItem.formulaId === this.detailForm.formulaId) {
          if (newItem.formulaType === '1') {
            this.tmp_sceneList.push(newItem)
          } else {
            this.tmp_actionList.push(newItem)
          }
        }
      })
    },
    // 新增场景行为
    curveHomologyAdd() {
      this.detailColVisible = true
      this.tmp_sceneList = []
      this.tmp_actionList = []
      this.detailForm = {
        opType: 'ADD', // 操作类型
        sceneFormulaType: '', // 场景算号
        sceneFormulaValue: 0, // 场景结果值
        actionFormulaType: '', // 行为算号
        actionFormulaValue: 0, // 行为结果值
        formulaId: 'TMP_' + new Date().getMilliseconds() // 公式主键，用于判断新增、修改记录
      }
      this.tmp_sceneList.push({ depCurveId: '', percent: 0, standSlip: '', depInd: 'Y' })
      this.tmp_actionList.push({ depCurveId: '', percent: 0, standSlip: '', depInd: 'Y' })
    },
    addScene() {
      this.tmp_sceneList.push({ depCurveId: '', percent: 0, standSlip: '', depInd: 'Y' })
    },
    addAction() {
      this.tmp_actionList.push({ depCurveId: '', percent: 0, standSlip: '', depInd: 'Y' })
    },
    // 保存场景行为
    addDetailInit() {
      const _ = this.$lodash
      // 获取所有form,验证表单信息
      // refSceneList
      const refSceneList = this.$refs.refSceneList
      const refActionList = this.$refs.refActionList
      if (!refSceneList || refSceneList.length <= 0 || !refActionList || refActionList.length <= 0) {
        this.$message({
          message: '场景行为数据不能为空！',
          type: 'error',
          showClose: true
        })
        return false
      }
      let isAllOk = true
      refSceneList.map((sceneInfo, index) => {
        sceneInfo.$refs['detailInfo'].validate((valid) => {
          if (!valid) {
            isAllOk = false
          } else {
            console.log('actionInfo:' + index + ' is ok...')
          }
        })
      })
      console.info(isAllOk)
      refActionList.map((actionInfo, index) => {
        actionInfo.$refs['detailInfo'].validate((valid) => {
          if (!valid) {
            isAllOk = false
          } else {
            console.log('actionInfo:' + index + ' is ok...')
          }
        })
      })
      console.info(isAllOk)
      this.$refs['detailForm'].validate((valid) => {
        if (!valid) {
          isAllOk = false
        } else {
          console.log('detailForm:' + ' is ok...')
        }
      })
      console.info(isAllOk)

      // sceneFormulaType: '', // 场景算号
      // sceneFormulaValue: 0, // 场景结果值
      // actionFormulaType: '', // 行为算号
      // actionFormulaValue: 0, // 行为结果值
      if (!this.detailForm.sceneFormulaType || !this.detailForm.sceneFormulaValue && this.detailForm.sceneFormulaValue !== 0) {
        this.$message({
          message: '场景计算公式、值不能为空！',
          type: 'error',
          showClose: true
        })
        return false
      }
      if (!this.detailForm.actionFormulaType || !this.detailForm.actionFormulaValue && this.detailForm.actionFormulaValue !== 0) {
        this.$message({
          message: '行为计算公式、值不能为空！',
          type: 'error',
          showClose: true
        })
        return false
      }

      // 计算公式
      console.log(this.tmp_sceneList)
      console.log(this.tmp_actionList)
      const sceneFormula = this.toFormula(this.tmp_sceneList) + ' ' + this.detailForm.sceneFormulaType + ' ' + this.detailForm.sceneFormulaValue
      const actionFormula = this.detailForm.actionFormulaValue === 0 ? this.toFormula(this.tmp_actionList) : this.toFormula(this.tmp_actionList) + ' ' + this.detailForm.actionFormulaType + ' ' + this.detailForm.actionFormulaValue
      console.info('sceneFormula:' + sceneFormula)
      console.info('actionFormula:' + actionFormula)

      // 保存数据
      this.detailForm.sceneFormula = sceneFormula
      this.detailForm.actionFormula = actionFormula
      // 判断公式列表中是否存在对应记录，如果存在，则更新，不存在新增记录
      if (this.detailForm.opType === 'ADD') {
        // 编辑列表添加数据，缓存添加数据
        this.formulaEditList.push(this.detailForm)
        this.formulaList.push(this.detailForm)
        this.detailForm.opType = 'EDIT'
      }

      // 用过滤器方式删除数据
      const formulaId = this.detailForm.formulaId
      this.detailList = this.detailList.filter(function(item) {
        return item.formulaId !== formulaId
      })

      // 插入场景
      this.tmp_sceneList.forEach((item, index) => {
        const newItem = _.assign({}, item)
        newItem.formulaId = this.detailForm.formulaId
        newItem.formulaType = '1'
        newItem.sortNo = index
        this.detailList.push(newItem)
      })
      // 插入行为
      this.tmp_actionList.forEach((item, index) => {
        const newItem = _.assign({}, item)
        newItem.formulaId = this.detailForm.formulaId
        newItem.formulaType = '2'
        newItem.sortNo = index
        this.detailList.push(newItem)
      })
    },
    // 根据列表计算公式
    toFormula(detailList) {
      // 权重 * [产品 关键期限 指标]
      return detailList.map(item => divide(item.percent, 100) + ' * #[' + item.depCurveId + '' + item.depStandSlip + '' + item.depInd + ']').join('+')
    },
    save() {
      const _formula = this.formulaEditList.map(value => value.sceneFormula + ' ? ' + value.actionFormula + ' : ').join('') + '0'
      console.log(_formula)
      const row = this.row
      row.homology = _formula
      this.$emit('change-formula', row)
    },
    resolve(data) {
      const _ = this.$lodash
      // const m = '0.1 * #[NIED0.08Y] + 0.2 * #[NIED0.5Y] <> 5 ? 0.2 * #[NIED0.08Y] + 3 : 0.3 * #[NIED0.08Y] + 0.3 * #[NIED0.5Y] <> 4 ? 0.3 * #[NIED0.08Y] : 0.2 * #[NIED0.08Y] + 5'
      const array = data.split(/(\?|\:)/).filter(value => value !== '?' && value !== ':')
      const list = []
      array.filter((value, index) => {
        return index % 2 !== 0
      }).forEach((value, index) => {
        list.push({ formulaId: 'TMP_' + index, sceneFormula: array[2 * index], actionFormula: array[2 * index + 1] })
      })
      this.formulaEditList = list.map(value => {
        console.log(value.formulaId)
        const sceneList = value.sceneFormula.split(/(\*|\+|\!\=|\=\=|\<\=|\>\=|\<\>|\<|\>)/).map(value => value.trim()).filter(v1 => v1 !== '*' && v1 !== '+')
        sceneList.forEach((v, i) => {
          if (v.indexOf('#') !== -1) {
            let temp = v.match(/\#\[(.*)\]/)
            temp = temp ? temp[1] : ''
            const arr = temp.split(/(0\.\d*|[1-9]\d*|0)/)
            const ind = arr[arr.length - 1]
            const slip = arr[arr.length - 2]
            const item = {}
            item.formulaId = value.formulaId
            item.formulaType = '1'
            item.percent = multiply(sceneList[i - 1], 100)
            item.depCurveId = temp.replace(ind, '').replace(slip, '')
            item.depStandSlip = slip
            item.depInd = ind
            console.log(item)
            this.detailList.push(item)
          }
        })
        const actionList = value.actionFormula.split(/(\*|\+|\-)/).map(value => value.trim()).filter(v1 => v1 !== '*')
        actionList.forEach((v, i) => {
          if (v.indexOf('#') !== -1) {
            let temp = v.match(/\#\[(.*)\]/)
            temp = temp ? temp[1] : ''
            const arr = temp.split(/(0\.\d*|[1-9]\d*|0)/)
            const ind = arr[arr.length - 1]
            const slip = arr[arr.length - 2]
            const item = {}
            item.formulaId = value.formulaId
            item.formulaType = '2'
            item.percent = multiply(sceneList[i - 1], 100)
            item.depCurveId = temp.replace(ind, '').replace(slip, '')
            item.depStandSlip = slip
            item.depInd = ind
            console.log(item)
            this.detailList.push(item)
          }
        })
        const detailForm = { opType: '', sceneFormulaType: sceneList[sceneList.length - 2], sceneFormulaValue: sceneList[sceneList.length - 1] }
        if (actionList[actionList.length - 1].indexOf('#') === -1) {
          detailForm.actionFormulaType = actionList[actionList.length - 2]
          detailForm.actionFormulaValue = actionList[actionList.length - 1]
        }
        return _.assign(value, detailForm)
      })
    }
  }
}
</script>

<style scoped>
.initPanel {
  min-height: 400px;
  border: 1px solid black;
  padding: 10px;
  position: relative;
}
.panelRight {
  border-left: 0;
}
</style>
