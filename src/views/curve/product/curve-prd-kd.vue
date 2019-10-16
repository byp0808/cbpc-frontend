<template>
  <!-- 编制关键期限 -->
  <div class="app-container">
    <div class="filter-container">
      <label>编制关键期限： </label>
      <el-select v-model="prdKdMod" style="width: 140px" class="filter-item" :disabled="disabled">
        <el-option v-for="item in prdKdMods" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" :disabled="disabled" @click="handleCurvePrdKdFilter">
        应用模板
      </el-button>
      <el-button v-waves class="filter-item" type="primary" :disabled="disabled" @click="toAddCurvePrdKd">
        添加标准期限
      </el-button>
    </div>

    <el-table :data="curvePrdKdList" border highlight-current-row style="width: 820px;">
      <el-table-column label="标准期限" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.standSlip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="样本区间" width="290px" align="center">
        <template slot-scope="scope">
          <span>[{{ scope.row.sampleIntervalDown }}y,{{ scope.row.sampleIntervalUp }}y)</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTs == null ? '' : $moment(scope.row.operateTs).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="big" :disabled="disabled" @click="handleEdit(scope.$index, curvePrdKdList)">修改
          </el-button>
          <el-button type="text" size="big" :disabled="disabled" @click="handleDelete(scope.$index, curvePrdKdList)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="关键期限" :close-on-click-modal="false" append-to-body :visible.sync="curvePrdKdFormVisible">
      <el-form ref="curvePrdKdForm" :rules="rules" :model="curvePrdKdForm" label-position="left" label-width="120px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="标准期限" prop="standSlip">
              <el-select v-model="curvePrdKdForm.standSlip" :disabled="curvePrdKdFormStandSlipEdit" filterable placeholder="请选择标准期限">
                <el-option
                  v-for="(name) in $dict('KD_TYPE')"
                  :key="name"
                  :label="name"
                  :value="name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="单位">
              <el-select v-model="unit">
                <el-option value="d">d</el-option>
                <el-option value="m">m</el-option>
                <el-option value="y">y</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="样本区间下限" prop="sampleIntervalDown">
              <el-input type="number" v-model="curvePrdKdForm.sampleIntervalDown" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item type="number" label="样本区间上限" prop="sampleIntervalUp">
              <el-input v-model="curvePrdKdForm.sampleIntervalUp" type="number" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="curvePrdKdFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addCurvePrdKd('curvePrdKdForm')">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 远期N/K值 -->
    <div
      v-if="curvePrdNkListVisible"
      :visible.sync="curvePrdNkListVisible"
      class="filter-container"
      style="padding-top: 40px"
    >
      <label>远期N/K值： </label>
      <el-select v-model="forwardFlagMod" style="width: 140px" class="filter-item" :disabled="disabled">
        <el-option v-for="item in forwardFlagMods" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" :disabled="disabled" @click="handleCurvePrdNkFilter">
        应用模板
      </el-button>
      <el-button v-waves class="filter-item" type="primary" :disabled="disabled" @click="toAddCurvePrdNk">
        添加远期N/K
      </el-button>
    </div>

    <el-table
      v-if="curvePrdNkListVisible"
      :visible.sync="curvePrdNkListVisible"
      :data="curvePrdNkList"
      border
      highlight-current-row
      style="width: 820px;"
    >
      <el-table-column label="N值" width="150px">
        <template slot-scope="scope" prop="nvalue">
          <span>{{ scope.row.nvalue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="K值" width="150px" align="center" prop="kvalue">
        <template slot-scope="scope">
          <span>{{ scope.row.kvalue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTs == null ? '' : $moment(scope.row.operateTs).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="270px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="big" :disabled="disabled" @click="handleEditNK(scope.$index, curvePrdNkList)">
            修改
          </el-button>
          <el-button type="text" size="big" :disabled="disabled" @click="handleDelete(scope.$index, curvePrdNkList)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-if="curvePrdNkFormVisible"
      title="远期NK"
      :visible.sync="curvePrdNkFormVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="curvePrdNkForm"
        :model="curvePrdNkFormTmp"
        :rules="curvePrdNkRules"
        label-position="left"
        label-width="60px"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="N值" prop="nvalue">
              <el-input v-model="curvePrdNkFormTmp.nvalue" type="number" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="K值" prop="kvalue">
              <el-input v-model="curvePrdNkFormTmp.kvalue" type="number" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="curvePrdNkFormTmp.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="6" offset="19">
          <div >
            <el-button @click="curvePrdNkFormVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="addCurvePrdNk('curvePrdNkForm')">
              确认
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { optioins } from '@/api/curve/code-type.js'

import {
  queryCurvePrdKd,
  queryCurvePrdNk,
  prdKdModsList,
  forwardFlagModsList,
  getCurvePrdNkListByModId
} from '@/api/curve/curve-product-list.js'

export default {
  name: 'CurvePrdKd',
  directives: { waves },
  props: ['productId', 'disabled','productInfo'],
  data() {
    // eslint-disable-next-line no-unused-vars
    var comparison = (rule, value, callback) => {
      value = this.sampleIntervalDown
      if (value >= this.sampleIntervalUp) {
        callback(new Error('样本区间下限必须小于样本区间上限!'))
      } else {
        callback()
      }
    }
    return {
      unit: 'y',
      tableKey: 0,
      curvePrdKdList: [],
      curvePrdNkList: [],
      listLoading: true,
      prdKdMod: null,
      forwardFlagMod: null,
      sampleIntervalDown: null,
      sampleIntervalUp: null,
      temp: {
        id: undefined,
        sampleIntervalUp: '',
        sampleIntervalDown: '',
        operateTs: ''
      },
      dialogFormVisible: false,
      // 新增关键期限
      curvePrdKdFormVisible: false,
      curvePrdKdFormStandSlipEdit: false,
      curvePrdKdForm: {},
      rules: {

      },
      // 新增远期NK
      curvePrdNkFormVisible: false,
      curvePrdNkForm: {},
      curvePrdNkForm_index: null, // 索引，用于编辑时获取行
      curvePrdNkRules: {
        nvalue: [
          { required: true, message: 'N值不可为空', trigger: 'change' }
        ],
        kvalue: [
          { required: true, message: 'K值不可为空', trigger: 'change' }
        ],
        remark: [
          { min: 0, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ]
      },
      curvePrdNkFormTmp: {
        nvalue: null,
        kvalue: null,
        remark: ''
      },
      prdKdList: [],
      forwardFlagModsList: [],
      curvePrdNkListVisible: true
    }
  },
  computed: {
    prdKdMods() {
      var options = []
      var datalist = this.prdKdList
      if (datalist && datalist.length > 0) {
        for (var i = 0; i < datalist.length; i++) {
          var data = datalist[i]
          options.push({ value: data.id, label: data.tempName })
        }
      }
      return options
    },
    forwardFlagMods() {
      var options = []
      var datalist = this.forwardFlagModsList
      if (datalist && datalist.length > 0) {
        for (var i = 0; i < datalist.length; i++) {
          var data = datalist[i]
          options.push({ value: data.id, label: data.tempName })
        }
      }
      return options
    }
  },
  beforeMount() {
    console.info('beforeMount.加载数据')
    this.getCurvePrdKdList()
    this.getCurvePrdNkList()

    this.init()
    var forwardFlag = this.productInfo.forwardFlag
    if(forwardFlag=='Y'){
      this.curvePrdNkListVisible = true
    }else{
      this.curvePrdNkListVisible = false
    }
  },
  methods: {
    async init() {
      console.info('=====init=====')
      // 获取
      var data = {
        'page': {
          'pageNumber': 1,
          'pageSize': 100000
        }
      }

      try{
        await prdKdModsList(data).then(response => {
          if (response && response.dataList) {
            this.prdKdList = response.dataList
          }
        })
      }catch (e) {
        console.error(e)
      }

      try{
        await forwardFlagModsList(data).then(response => {
          if (response && response.dataList) {
            this.forwardFlagModsList = response.dataList
          }
        })
      }catch (e) {
        console.error(e)
      }
    },
    optioins: optioins,
    getCurvePrdKdList() {
      console.info('methods.getCurvePrdKdList')
      var curveId = this.productId
      queryCurvePrdKd({ curveId: curveId }).then(response => {
        console.info('====queryCurvePrdKd:')
        if (response && response.dataList) {
          this.curvePrdKdList = response.dataList
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getCurvePrdNkList() {
      console.info('methods.getCurvePrdNkList')
      var curveId = this.productId
      queryCurvePrdNk({ curveId: curveId }).then(response => {
        if (response && response.dataList) {
          this.curvePrdNkList = response.dataList
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 应用关键期限模板
    handleCurvePrdKdFilter() {
      var prdKdMod = this.prdKdMod
      if (!prdKdMod) {
        this.$message({
          type: 'error',
          message: '请选择一个模板'
        })
        return false
      }
      this.curvePrdKdList = this.getPrdKdListByModId(prdKdMod)
    },
    getPrdKdListByModId(id) {
      var options = []
      var datalist = this.prdKdList
      if (datalist && datalist.length > 0) {
        var standSlip = ''
        for (var i = 0; i < datalist.length; i++) {
          var data = datalist[i]
          if (id === data.id) {
            standSlip = data.standSlip
            break
          }
        }
        if (standSlip) {
          standSlip = standSlip.replace(/[^\d\.;]/g, '')
          var array = standSlip.split(';')
          if (array && array.length > 0) {
            for (var j = 0; j < array.length; j++) {
              if (array[j] || array[j] === '0') {
                options.push({ standSlip: array[j], sampleIntervalUp: '0', sampleIntervalDown: '0', operateTs: null })
              }
            }
          }
        }
      }
      return options
    },
    // 应用远期NK值模板
    handleCurvePrdNkFilter() {
      var forwardFlagMod = this.forwardFlagMod
      if (!forwardFlagMod) {
        this.$message({
          type: 'error',
          message: '请选择一个模板'
        })
        return false
      }
      this.curvePrdNkList = getCurvePrdNkListByModId(forwardFlagMod)
    },
    handleEdit(index, rows) {
      // copy obj
      this.temp = rows[index]
      // 将上下限转换成为数字
      this.temp.sampleIntervalUp = Number(this.temp.sampleIntervalUp)
      this.temp.sampleIntervalDown = Number(this.temp.sampleIntervalDown)

      this.curvePrdKdForm = {
        standSlip: Number(this.temp.standSlip),
        sampleIntervalDown: Number(this.temp.sampleIntervalDown),
        sampleIntervalUp: Number(this.temp.sampleIntervalUp)
      }
      // 强制单位为y
      this.unit = 'y'
      this.curvePrdKdFormVisible = true
      this.curvePrdKdFormStandSlipEdit = true
      this.$nextTick(() => {
        this.$refs['curvePrdKdForm'].clearValidate()
      })
    },
    handleDelete(index, rows) {
      rows.splice(index, 1)
    },
    // NK编辑
    handleEditNK(index, rows) {
      console.info('handleEditNK。编辑NK:' + index)
      var item = rows[index]
      this.curvePrdNkForm = item
      this.curvePrdNkForm_index = index
      this.curvePrdNkFormTmp.nvalue = Number(item.nvalue)
      this.curvePrdNkFormTmp.kvalue = Number(item.kvalue)
      this.curvePrdNkFormTmp.remark = item.remark

      this.curvePrdNkFormVisible = true
      this.$nextTick(() => {
        this.$refs['curvePrdNkForm'].clearValidate()
      })
    },
    obtainCurvePrdKdList() {
      for (var i = 0; i < this.curvePrdKdList.length; i++) {
        this.curvePrdKdList[i].curveId = this.productId
      }
      return this.curvePrdKdList
    },
    obtainCurvePrdNkList() {
      debugger
      for (var i = 0; i < this.curvePrdNkList.length; i++) {
        this.curvePrdNkList[i].curveId = this.productId
      }
      return this.curvePrdNkList
    },
    // 打开新增关键期限dialog
    toAddCurvePrdKd() {
      this.curvePrdKdFormVisible = true
      this.curvePrdKdFormStandSlipEdit = false
      this.curvePrdKdForm = {}
      this.temp = {}
    },
    // 添加关键期限
    addCurvePrdKd() {
      console.info('curve-prd-kd.vue.addCurvePrdKd')
      var standSlip = this.curvePrdKdForm.standSlip
      var sampleIntervalDown = this.curvePrdKdForm.sampleIntervalDown
      var sampleIntervalUp = this.curvePrdKdForm.sampleIntervalUp

      if (!standSlip && ('' + standSlip) !== '0') {
        this.$message({
          type: 'error',
          message: '请选择期限'
        })
        return false
      }
      // 判断样本曲线，上下限是否输入
      if (sampleIntervalDown !== 0 && !sampleIntervalDown) {
        this.$message({
          type: 'error',
          message: '区间下限不能为空'
        })
        return false
      }
      if (sampleIntervalUp !== 0 && !sampleIntervalUp) {
        this.$message({
          type: 'error',
          message: '区间上限上能为空'
        })
        return false
      }
      sampleIntervalDown = Number(sampleIntervalDown)
      sampleIntervalUp = Number(sampleIntervalUp)
      if (sampleIntervalDown >= sampleIntervalUp) {
        this.$message({
          type: 'error',
          message: '区间上限必须大于区间下限'
        })
        return false
      }

      // 判断列表中是否已经存在期限
      for (let i = 0; i < this.curvePrdKdList.length; i++) {
        var item = this.curvePrdKdList[i]
        if (Number(standSlip) === Number(item.standSlip)) {
          if (!this.curvePrdKdFormStandSlipEdit) {
            this.$message({
              type: 'error',
              message: '该期限已经存在'
            })
            return false
          } else { // 非新增，则更新已有记录
            // 按单位转换数值
            if (this.unit === 'm') {
              sampleIntervalDown = sampleIntervalDown / 12
              sampleIntervalUp = sampleIntervalUp / 12
            } else if (this.unit === 'd') {
              sampleIntervalDown = sampleIntervalDown / 365
              sampleIntervalUp = sampleIntervalUp / 365
            } else {
              sampleIntervalDown = sampleIntervalDown / 1
              sampleIntervalUp = sampleIntervalUp / 1
            }
            sampleIntervalDown = sampleIntervalDown.toFixed(2)
            sampleIntervalUp = sampleIntervalUp.toFixed(2)
            // 转换为数值
            sampleIntervalDown = sampleIntervalDown / 1
            sampleIntervalUp = sampleIntervalUp / 1

            this.$refs['curvePrdKdForm'].validate((valid) => {
              if (valid) {
                this.temp.operateTs = new Date()
                this.temp.sampleIntervalUp = sampleIntervalUp
                this.temp.sampleIntervalDown = sampleIntervalDown
                this.dialogFormVisible = false
              }
            })
          }
          this.curvePrdKdFormVisible = false
          return true
        }
      }

      // 添加数据
      if (!this.curvePrdKdList || this.curvePrdKdList.ßlength === 0) {
        this.curvePrdKdList = []
        this.curvePrdKdList.push({
          standSlip: standSlip,
          sampleIntervalDown: sampleIntervalDown,
          sampleIntervalUp: sampleIntervalUp,
          operateTs: new Date()
        })
      } else {
        var isdown = false
        for (let i = 0; i < this.curvePrdKdList.length; i++) {
          // eslint-disable-next-line no-redeclare
          var item = this.curvePrdKdList[i]
          if (standSlip < item.standSlip) {
            this.curvePrdKdList.splice(i, 0, {
              standSlip: standSlip,
              sampleIntervalDown: sampleIntervalDown,
              sampleIntervalUp: sampleIntervalUp,
              operateTs: new Date()
            })
            isdown = true
            break
          }
        }
        if (!isdown) {
          // 如果for循环没有执行插入，则最后插入
          this.curvePrdKdList.push({
            standSlip: standSlip,
            sampleIntervalDown: sampleIntervalDown,
            sampleIntervalUp: sampleIntervalUp,
            operateTs: new Date()
          })
        }
      }

      this.curvePrdKdFormVisible = false
    },
    // 打开添加远期NK页面
    toAddCurvePrdNk() {
      this.curvePrdNkFormVisible = true

      this.curvePrdNkForm = {}
      this.curvePrdNkForm_index = null

      this.curvePrdNkFormTmp.nvalue = null
      this.curvePrdNkFormTmp.kvalue = null
      this.curvePrdNkFormTmp.remark = ''
    },
    // 添加远期NK
    addCurvePrdNk(formName) {
      console.info('curve-prd-kd.vue.addCurvePrdNk')
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var nvalue = (Number(this.curvePrdNkFormTmp.nvalue)).toFixed(1)
          var kvalue = (Number(this.curvePrdNkFormTmp.kvalue)).toFixed(1)
          // 验证N、K值，不可全部为0
          if (nvalue == 0 && kvalue == 0) {
            this.$message({
              type: 'error',
              message: 'NK值不可全部为0'
            })
            return false
          }
          // 验证N、K值，必须有一个为0
          if (nvalue != 0 && kvalue != 0) {
            this.$message({
              type: 'error',
              message: 'NK值必须有一个为0'
            })
            return false
          }
          // N,K值,均不能大于49
          if (nvalue > 49 || kvalue > 49) {
            this.$message({
              type: 'error',
              message: 'NK值不可大于49'
            })
            return false
          }
          // NK值对,不可重复
          for (var i = 0; i < this.curvePrdNkList.length; i++) {
            if (nvalue == this.curvePrdNkList[i].nvalue &&
                kvalue == this.curvePrdNkList[i].kvalue) {
              this.$message({
                type: 'error',
                message: 'NK值对,不可重复'
              })
              return false
            }
          }
          var index = this.curvePrdNkForm_index
          if (index || index === 0) {
            // n,k值保留一位小数
            var _nvalue = Number(this.curvePrdNkFormTmp.nvalue)
            var _kvalue = Number(this.curvePrdNkFormTmp.kvalue)
            this.curvePrdNkForm.nvalue = _nvalue.toFixed(1)
            this.curvePrdNkForm.kvalue = _kvalue.toFixed(1)
            this.curvePrdNkForm.remark = this.curvePrdNkFormTmp.remark
            this.curvePrdNkForm.operateTs = new Date()
          } else {
            // 添加
            this.curvePrdNkList.push(
              {
                nvalue: (Number(this.curvePrdNkFormTmp.nvalue)).toFixed(1),
                kvalue: (Number(this.curvePrdNkFormTmp.kvalue)).toFixed(1),
                remark: this.curvePrdNkFormTmp.remark,
                operateTs: new Date()
              }
            )
          }
          this.curvePrdNkFormVisible = false
          // 保存后对NK值列表进行排序

          this.curvePrdNkList.sort(this.sortCurvePrdNkList)
        } else {
          console.log('error add!!')
          return false
        }
      })
    },
    // 对NK列表进行排序
    sortCurvePrdNkList(currentRow, nextRow) {
      if (currentRow['nvalue'] === nextRow['nvalue']) {
        if (currentRow['kvalue'] > nextRow['kvalue']) {
          return 1
        } else if (currentRow['kvalue'] < nextRow['kvalue']) {
          return -1
        } else {
          return 0
        }
      } else {
        if (currentRow['nvalue'] > nextRow['nvalue']) {
          return 1
        } else {
          return -1
        }
      }
    }
  }
}
</script>
