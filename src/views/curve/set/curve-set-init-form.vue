<template>
  <div class="app-container">
    <el-button v-if="false" type="primary" @click="save">保存</el-button>
    <el-row type="flex">
      <el-col class="initPanel initPanel_1" :span="8">
        <el-form ref="dataForm" label-position="left">
          <el-form-item label="选择曲线" label-width="90px">
            <el-select v-model="initInfo.curveId" :disabled="curveSelectDisable" style="width: 100%" placeholder="请选择曲线" @change="loadCurvePrdKd">
              <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item label="最后操作人" label-width="90px">
                <el-input v-model="initInfo.lastUpdBy" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="1">
              <el-form-item label="最后操作时间" label-width="110px">
                <el-input :value="$moment(initInfo.lastUpdTs).format('YYYY-MM-DD')" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="curentCurveOrderKt" border highlight-current-row style="width: 727px;">
          <el-table-column prop="standSlip" width="200" label="关键期限" align="center" />
          <el-table-column label="操作" header-align="center" align="left" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-if="disabled" type="text" @click="initstandSlipSet(scope.$index)">查看</el-button>
              <el-button v-if="!disabled" type="text" @click="initstandSlipSet(scope.$index)">设置</el-button>
              <el-button v-if="0!=scope.$index" :disabled="disabled" type="text" @click="initstandSlipCopy(scope.$index)">复制上一期限并设置</el-button>
              <el-button type="text" :disabled="disabled" @click="initstandSlipDelete(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col v-show="curveHomologyShow" class="initPanel" :span="8">
        <el-row class="grayText">
          <el-col :span="15" :offset="1">
            <span :title="getCurveName(initInfo.curveId)">{{ getCurveName(initInfo.curveId) }}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span>关键期限:{{ currentSelectStandSlip }}Y</span>
          </el-col>
        </el-row>
        <el-table ref="refFormulaEditList" :data="formulaEditList" tyle="width:100%;">
          <el-table-column type="index" width="50" />
          <el-table-column label="场景" prop="sceneFormula" width="120" show-overflow-tooltip />
          <el-table-column label="行为" prop="actionFormula" width="120" show-overflow-tooltip />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="!disabled"
                type="text"
                size="big"
                @click="curveHomologyXiuGai(scope.$index)"
              >修改
              </el-button>
              <el-button
                v-if="disabled"
                type="text"
                size="big"
                @click="curveHomologyXiuGai(scope.$index)"
              >查看
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-button v-if="!disabled" class="filter-item" type="primary" size="big" style="position: absolute;right: 10px;margin-top:30px;width:100px" @click="curveHomologyXinZeng">新增</el-button>
      </el-col>
      <el-col v-show="detaiColVisible" class="initPanel" :span="8">
        <el-form ref="detalForm" :model="detailForm" label-position="left" label-width="90px">
          <el-row>
            <el-col :span="3">
              <h3 style="font-size:40px;">场<br><br>景</h3>
            </el-col>
            <el-col :span="19" class="box">
              <CurveSetInitDetailForm v-for="(item, index) in tmp_sceneList" :key="index" ref="refSceneList" :index="index" :init-info="querycueid" :detail-info="item" :disabled="disabled" />
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
                    <el-input v-model="detailForm.sceneFormulaValue" :disabled="disabled" type="number" style="height:20px;width: 100%" />
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
              <CurveSetInitDetailForm v-for="(item, index) in tmp_actionList" :key="index" ref="refActionList" :index="index" :init-info="querycueid" :detail-info="item" :disabled="disabled" />
              <el-row style="margin-top:5px">
                <el-col :span="8">
                  <el-form-item
                    label-width="0px"
                    prop="actionFormulaType"
                    :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                  >
                    <el-select v-model="detailForm.actionFormulaType" :disabled="disabled" placeholder="请选择" style="height:20px;width: 100%">
                      <el-option v-for="item in selectFormulaType" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                  <el-form-item
                    label-width="0px"
                    prop="actionFormulaValue"
                    :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                  >
                    <el-input v-model="detailForm.actionFormulaValue" :disabled="disabled" type="number" style="height:20px;width: 100%" />
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
            <el-button v-if="!disabled" type="primary" style="float: right;margin-right: 40px;margin-top: 20px;" @click="addDetalInit">保存场景行为</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getInitId,
  selectFormulaType,
  getInitFormulaList,
  getInitDetailList,
  getDetalInitOptions,
  saveInitInfo
} from '@/api/curve/curve-set-init.js'
import { getCurveProductIdOptions, queryCurvePrdKd } from '@/api/curve/curve-product-list.js'
import { sortStandSlip } from '@/api/curve/curve-set-rela.js'
import CurveSetInitDetailForm from '@/views/curve/set/curve-set-init-form-ind.vue'

export default {
  name: 'CurveSetInitForm',
  components: {
    CurveSetInitDetailForm
  },
  props: ['initId', 'opType', 'businessId', 'creatIndexId'],
  data() {
    return {
      disabled: false,
      selectCurve: [],
      initInfo: {
        curveId: ''
      }, // 初始化方案信息
      formulaList: [], // 公式缓存数据
      formulaEditList: [], // 中间公式列表: 编辑数据
      detailList: [], // 场景行为明细缓存数据
      currentSelectStandSlip: '', // 当前选中的关键期限
      curveSelectDisable: false,
      curentCurveOrderKt: [], // 曲线产品关键期限
      curveHomologyShow: false, // 中间 公式列表是否显示
      detaiColVisible: false, // 右侧场景公式明细是否显示
      tmp_sceneList: [], // 场景
      tmp_actionList: [], // 公式
      detailForm: {
        opType: '', // 操作类型
        sceneFormulaType: '', // 场景算号
        sceneFormulaValue: 0, // 场景结果值
        actionFormulaType: '', // 行为算号
        actionFormulaValue: 0, // 行为结果值
        formulaId: '' // 公式主键，用于判断新增、修改记录
      },
      querycueid: ''
    }
  },
  computed: {
    // 该批次所需模型
    selectFormulaType() {
      return selectFormulaType()
    }
  },
  beforeMount() {
    console.info('===beforeMount===' + this.initId)

    // 先加载列表
    this.selectCurve = getCurveProductIdOptions()
    this.selectDepCurve = getCurveProductIdOptions()

    this.selectDepInd = getDetalInitOptions()
    console.info('初始化')

    if (this.initId) {
      if (this.opType === 'VIEW') {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.curveSelectDisable = true
    } else if (this.businessId) {
      this.disabled = true
      this.curveSelectDisable = true
      this.initId = this.businessId
    } else {
      this.disabled = false
    }
    // this.initId = 'INIT_ID_01'
    this.initPageData()
  },
  methods: {
    // 初始化页面数据
    async initPageData() {
      console.info('initPageData:' + this.initId)
      if (!this.initId) {
        return
      }
      // 新建规则时清空
      if (this.creatIndexId === 'creat') {
        this.initInfo = {}
        console.info('active')
        this.curveSelectDisable = false
        this.disabled = false
      } else {
        // 获取初始化方案信息
        await getInitId(this.initId).then(response => {
          if (response) {
            this.initInfo = response
            if (this.initInfo.dataStatus === '05') {
              getInitId(this.initInfo.relId).then(response => {
                this.initInfo = response
              })
            }
          }
        })
      }

      if (!this.initInfo) {
        this.initInfo = {}
        return
      }
      // 获取关键期限列表
      this.getCurrentCurveKd()

      // 获取公式列表
      this.formulaList = []
      await getInitFormulaList({ 'search_initId_EQ': this.initInfo.id }).then(response => {
        if (response) {
          this.formulaList = response
        }
      })
      // 获取场景、公式列表
      this.detailList = []
      await getInitDetailList({ 'search_initId_EQ': this.initInfo.id }).then(response => {
        if (response) {
          this.detailList = response
        }
      })
      console.info('公式列表\n' + JSON.stringify(this.formulaList))
      console.info('场景行为明细列表\n' + JSON.stringify(this.detailList))

      // 公式列表默认显示第一期限方案
      if (this.curentCurveOrderKt.length > 0) {
        this.initstandSlipSet(0)
        // this.formulaEditList = [this.formulaEditList[0]]
        this.curveHomologyShow = true
        console.info('中间' + this.formulaEditList)
        if (this.formulaEditList.length > 0) {
          this.curveHomologyXiuGai(0)
          this.detailForm = this.formulaEditList[0]
          this.detaiColVisible = true
        }
      }
    },
    // 获取当前曲线关键期限列表
    async getCurrentCurveKd() {
      this.curentCurveOrderKt = []
      var tmp_standSlip = []
      if (this.initInfo && this.initInfo.curveId) {
        await queryCurvePrdKd({ curveId: this.initInfo.curveId }).then(response => {
          this.curvePrdKdList = response.dataList
          const list = response.dataList
          console.info('这是期限列表')
          console.info(list)
          if (list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              var item = list[i]
              if (tmp_standSlip.indexOf(Number(item.standSlip)) < 0) {
                tmp_standSlip.push(Number(item.standSlip))
              }
            }
            tmp_standSlip.sort(sortStandSlip)
          }
          this.querycueid = this.curvePrdKdList[0].curveId
        })
      }
      // 组装列表
      for (let i = 0; i < tmp_standSlip.length; i++) {
        this.curentCurveOrderKt.push({
          key: i,
          standSlip: tmp_standSlip[i]
        })
      }
      // 公式列表默认显示第一期限方案  新建
      if (this.curentCurveOrderKt.length > 0) {
        this.initstandSlipSet(0)
        // this.formulaEditList = [this.formulaEditList[0]]
        this.curveHomologyShow = true
        console.info('中间' + this.formulaEditList)
        if (this.formulaEditList.length > 0) {
          this.curveHomologyXiuGai(0)
          this.detailForm = this.formulaEditList[0]
          this.detaiColVisible = true
        }
      }
      console.info(this)
      return this.curentCurveOrderKt
    },
    getCurveName(id) {
      return this.getCurveInfo(id).productName
    },
    getCurveInfo(id) {
      var list = this.selectCurve
      for (const index in list) {
        const item = list[index]
        if (id === item.curveId) {
          return item
        }
      }
      return {}
    },
    loadCurvePrdKd(value) {
      console.info('loadCurvePrdKd: value:' + value)
      this.getCurrentCurveKd()
    },
    // 删除关键期限对应所有记录
    initstandSlipDelete(index) {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.curveHomologyShow = false
        this.detaiColVisible = false
        this.detailForm = {}
        this.tmp_actionList = []
        this.tmp_sceneList = []
        this.currentSelectStandSlip = ''

        var row = this.curentCurveOrderKt[index]
        // 删除已有数据
        this.deleteStandSlipDate(row.standSlip)

        console.info('formula.length:' + this.formulaList.length)
        console.info('detailList.length:' + this.detailList.length)
      }).catch(() => {
        console.info('cancle')
      })
    },
    // 删除关键期限下的数据
    deleteStandSlipDate(standSlip) {
      if (typeof (standSlip) === 'undefined') {
        console.info('standSlip is undefined')
        return
      }
      // 删除formuList对应记录
      this.formulaList = this.formulaList.filter(function(item) {
        if (('' + standSlip) === ('' + item.standSlip)) {
          return false
        }
        return true
      })
      // 删除detaiList对应记录
      this.detailList = this.detailList.filter(function(item) {
        if (('' + standSlip) === ('' + item.standSlip)) {
          return false
        }
        return true
      })
    },
    // 设置
    initstandSlipSet(index) {
      this.curveHomologyShow = true
      this.detaiColVisible = false
      this.detailForm = {}
      this.tmp_actionList = []
      this.tmp_sceneList = []

      var row = this.curentCurveOrderKt[index]
      this.currentSelectStandSlip = row.standSlip
      console.info('当前选中关键期限:' + this.currentSelectStandSlip)
      // 从缓存中获取公式列表
      this.formulaEditList = []
      for (const item of this.formulaList) {
        if (('' + this.currentSelectStandSlip) === ('' + item.standSlip)) {
          this.formulaEditList.push(item)
        }
      }
    },
    // 复制并设置
    initstandSlipCopy(index) {
      this.curveHomologyShow = true
      this.detaiColVisible = false
      this.detailForm = {}
      this.tmp_actionList = []
      this.tmp_sceneList = []

      var currentRow = this.curentCurveOrderKt[index]
      var lastRow = this.curentCurveOrderKt[index - 1]
      this.currentSelectStandSlip = currentRow.standSlip
      var lastStandSlip = lastRow.standSlip
      console.info('当前选中关键期限:' + this.currentSelectStandSlip + ',lastStandSlip:' + lastStandSlip)

      // 删除已有数据
      this.deleteStandSlipDate(this.currentSelectStandSlip)

      this.formulaEditList = []
      var lastFormula = []
      // 从缓存中获取公式列表

      for (const item of this.formulaList) {
        if (('' + lastStandSlip) === ('' + item.standSlip)) {
          lastFormula.push(item)
        }
      }
      // 上条为空
      if (!lastFormula) {
        lastFormula = []
      }

      for (const item of lastFormula) {
        // eslint-disable-next-line no-undef
        const newItem = _.assign({}, item)
        newItem.standSlip = this.currentSelectStandSlip
        newItem.formulaId = 'TMP_' + new Date().getTime()
        this.formulaEditList.push(newItem)
        this.formulaList.push(newItem)

        // 获取场景明细
        for (const detailItem of this.detailList) {
          if (('' + lastStandSlip) === ('' + detailItem.standSlip) && detailItem.formulaId === item.formulaId) {
            // eslint-disable-next-line no-undef
            const newDetailItem = _.assign({}, detailItem)
            newDetailItem.formulaId = newItem.formulaId
            newDetailItem.standSlip = this.currentSelectStandSlip
            this.detailList.push(newDetailItem)
          }
        }
      }
    },
    // 修改场景和行为
    curveHomologyXiuGai(index) {
      this.detaiColVisible = true
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
        // eslint-disable-next-line no-undef
        var newItem = _.assign({}, item)
        if (('' + newItem.standSlip) === ('' + this.currentSelectStandSlip) && newItem.formulaId === this.detailForm.formulaId) {
          if (newItem.formulaType === '1') {
            this.tmp_sceneList.push(newItem)
          } else {
            this.tmp_actionList.push(newItem)
          }
        }
      })
    },
    // 新增场景行为
    curveHomologyXinZeng() {
      this.detaiColVisible = true
      this.tmp_sceneList = []
      this.tmp_actionList = []
      this.detailForm = {
        opType: 'ADD', // 操作类型
        standSlip: this.currentSelectStandSlip,
        sceneFormulaType: '', // 场景算号
        sceneFormulaValue: 0, // 场景结果值
        actionFormulaType: '', // 行为算号
        actionFormulaValue: 0, // 行为结果值
        formulaId: 'TMP_' + new Date().getTime() // 公式主键，用于判断新增、修改记录
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
    addDetalInit() {
      // 获取所有form,验证表单信息
      console.info('addDetalInit')
      // refSceneList
      var shortNameFun
      var refSceneList = this.$refs.refSceneList
      var refActionList = this.$refs.refActionList
      if (!refSceneList || refSceneList.length <= 0) {
        this.$message({
          message: '场景数据不能为空！',
          type: 'error',
          showClose: true
        })
        return false
      } else {
        shortNameFun = refSceneList[0].getProductShortName
      }
      var isAllOk = true
      for (const index in refSceneList) {
        var scenInfo = refSceneList[index]
        scenInfo.$refs['detailInfo'].validate((valid) => {
          if (!valid) {
            isAllOk = false
          } else {
            console.log('scenInfo:' + index + ' is ok...')
          }
        })
      }
      console.info(isAllOk)

      isAllOk = true
      for (const index in refActionList) {
        var actionInfo = refActionList[index]
        actionInfo.$refs['detailInfo'].validate((valid) => {
          if (!valid) {
            isAllOk = false
          } else {
            console.log('actionInfo:' + index + ' is ok...')
          }
        })
      }
      console.info(isAllOk)

      this.$refs['detalForm'].validate((valid) => {
        if (!valid) {
          isAllOk = false
        } else {
          console.log('detalForm:' + ' is ok...')
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
      var sceneFormula = this.toFormula(shortNameFun, this.tmp_sceneList) + ' ' + this.detailForm.sceneFormulaType + ' ' + this.detailForm.sceneFormulaValue
      var actionFormula = this.toFormula(shortNameFun, this.tmp_actionList) + ' ' + this.detailForm.actionFormulaType + ' ' + this.detailForm.actionFormulaValue
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

      // 删除 关键期限对应的明细数据、新增明细记录
      // this.detailList.forEach((item, index) => {
      //   if (('' + item.standSlip) === ('' + this.currentSelectStandSlip) && item.formulaId === this.detailForm.formulaId) {
      //     // delete this.detailList[index]
      //     this.detailList.splice(index, 1)
      //   }
      // })
      // 用过滤器方式删除数据
      var currentSelectStandSlip = this.currentSelectStandSlip
      var formulaId = this.detailForm.formulaId
      this.detailList = this.detailList.filter(function(item) {
        if (('' + item.standSlip) === ('' + currentSelectStandSlip) && item.formulaId === formulaId) {
          return false
        }
        return true
      })

      // 插入场景
      this.tmp_sceneList.forEach((item, index) => {
        // eslint-disable-next-line no-undef
        var newItem = _.assign({}, item)
        newItem.formulaId = this.detailForm.formulaId
        newItem.standSlip = this.currentSelectStandSlip
        newItem.formulaType = '1'
        newItem.sortNo = index
        this.detailList.push(newItem)
      })
      // 插入行为
      this.tmp_actionList.forEach((item, index) => {
        // eslint-disable-next-line no-undef
        var newItem = _.assign({}, item)
        newItem.formulaId = this.detailForm.formulaId
        newItem.standSlip = this.currentSelectStandSlip
        newItem.formulaType = '2'
        newItem.sortNo = index
        this.detailList.push(newItem)
        this.$message({
          type: 'success',
          message: '保存场景行为成功！'
        })
      })
    },
    // 根据列表计算公式
    toFormula(shortNameFun, detailList) {
      // 权重 * [产品 关键期限 指标]
      var formula = ''
      if (detailList && detailList.length > 0) {
        for (const item of detailList) {
          if (formula) {
            formula += ' + '
          }
          formula += item.percent / 100 + ' * #[' + shortNameFun(item.depCurveId) + '' + item.depStandSlip + '' + item.depInd + ']'
        }
      }
      return formula
    },
    // 保存
    save() {
      var data = {
        init: this.initInfo,
        initFormulaList: this.formulaList,
        detailList: this.detailList
      }
      if (!this.initInfo.curveId) {
        this.$message({
          message: '请选择一条曲线',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      console.info('保存初始化方案信息' + JSON.stringify(data))
      // 保存
      saveInitInfo(data).then(response => {
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
        this.$emit('saveCallBack')
      })
    }

  }
}
</script>

<style scoped>
  .initPanel {
    min-height: 400px;
    border: 1px solid black;
    border-left: 0px;
    padding: 10px;
    position: relative;
  }
  .initPanel_1{
    border-left: 1px solid black;
  }
  .grayText{
    color: #97a8be;
  }
</style>
