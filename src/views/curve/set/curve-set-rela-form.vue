<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveForm" :model="tempMain" label-width="150px">
              <el-form-item label="曲线产品名称">
                <el-select ref="curveIdSelect" v-model="tempMain.curveId" style="width: 100%" filterable :disabled="curveSelectDisable" @change="curveSelect" placeholder="请选择曲线">
                  <el-option
                    v-for="item in curveList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="recCurveForm" label-width="150px">
              <el-form-item label="最后操作时间">
                <el-input v-model="tempMain.lastUpdTs" disabled />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <el-form ref="recCurveForm" label-width="150px">
            <el-form-item label="最后操作人">
              <el-input v-model="tempMain.lastUpdBy" disabled />
            </el-form-item>
          </el-form>
        </el-col>
        <div class="btn-zone">
          <el-button type="primary" @click="saveAll">保存</el-button>
        </div>
      </el-row>
    </el-card>
    <el-card>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form ref="form" :model="tmp_tempInfo" label-width="120px">
            <el-form-item label="选择批次">
              <el-col :span="12">
                <el-input disabled :title="!tempMain.curveId ? '' : getCurveName(tempMain.curveId)" :value="!tempMain.curveId ? '' : getCurveName(tempMain.curveId)" />
              </el-col>
              <el-col :span="6">
                <el-select v-model="tmp_tempInfo.dayType" :disabled=" !tempMain.curveId ? true : disabled">
                  <el-option v-for="(name, key) in $dict('CURVE_DAY_TYPE')" :key="key" :label="name" :value="key" />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select v-model="tmp_tempInfo.orderId" :disabled="!tempMain.curveId ? true : disabled">
                  <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.id" />
                </el-select>
              </el-col>
              <el-col style="margin: 10px">
                <el-col :span="6">
                  <el-checkbox-group v-model="tmp_tempInfo.spreadFlag">
                    <el-checkbox true-label="Y" label="Y" :disabled=" !tempMain.curveId ? true : disabled">与上一批次利差</el-checkbox>
                  </el-checkbox-group>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="tmp_tempInfo.spreadDatType" :disabled=" !tempMain.curveId ? true : ( tmp_tempInfo.spreadFlag !== 'Y' ? true : disabled)">
                    <el-option v-for="(name, key) in $dict('CURVE_DAY_TYPE')" :key="key" :label="name" :value="key" />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="tmp_tempInfo.spreadOrderId" :disabled="!tempMain.curveId ? true : ( tmp_tempInfo.spreadFlag !== 'Y' ? true : disabled)">
                    <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.id" />
                  </el-select>
                </el-col>
              </el-col>
            </el-form-item>
            <el-form-item label="选择曲线间关系">
              <el-col :span="6">
                <el-input disabled :title="!tmp_tempInfo.orderId ? '' : getOrderName(tmp_tempInfo.orderId)" :value="!tmp_tempInfo.orderId ? '' : getOrderName(tmp_tempInfo.orderId)" />
              </el-col>
              <el-col :span="12">
                <el-select v-model="selectedCurveId" style="width: 100%;" filterable :disabled="disabled" placeholder="请选择曲线">
                  <el-option v-for="item in curveList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-dropdown @command="handleCommandAddToZone">
                  <el-button type="primary">
                    添加至<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">区域1</el-dropdown-item>
                    <el-dropdown-item command="Y">族系区</el-dropdown-item>
                    <el-dropdown-item command="3">区域2</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="tmp_quXJList" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="productName" label="" width="100" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{ row.referFlag === 'Y' ? '族系区' : (row.referFlag === '1' ? '区域1' : '区域2') }}
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="曲线名称" width="250" show-overflow-tooltip />
            <el-table-column prop="productGrade" label="曲线评级" width="150" show-overflow-tooltip />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <i class="operation el-icon-caret-top" @click="quXJMove(scope.$index, 'UP')" />
                <i class="operation el-icon-caret-bottom" @click="quXJMove(scope.$index, 'DOWN')" />
                <i class="operation el-icon-delete" @click="quXJMove(scope.$index, 'DEL')" />
              </template>
            </el-table-column>
          </el-table>
          <div class="btn-zone">
            <el-button type="primary" @click="generatCurveRela">生成曲线间关系</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form ref="tempSelfFormInfo" :model="tempSelfFormInfo" :rules="tempFormSelfRules" label-width="150px">
            <el-form-item label="选择自身曲线关系">
              <el-col :span="6">
                <el-form-item prop="dayType">
                  <el-select v-model="tempSelfFormInfo.dayType" :disabled=" !tempMain.curveId ? true : disabled">
                    <el-option v-for="(name, key) in $dict('CURVE_DAY_TYPE_SLF')" :key="key" :label="name" :value="key" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="orderId">
                  <el-select v-model="tempSelfFormInfo.orderId" :disabled="!tempMain.curveId ? true : disabled">
                    <el-option v-for="item in orderList" :key="item.id" :label="item.orderName" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="addToSelf">添加</el-button>
              </el-col>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="tmp_quZSList" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="productName" label="曲线名称" width="350" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{ showLabel(row) }}
              </template>
            </el-table-column>
            <el-table-column label="" width="150">
              <template slot-scope="scope">
                <i class="operation el-icon-caret-top" @click="quZSMove(scope.$index, 'UP')" />
                <i class="operation el-icon-caret-bottom" @click="quZSMove(scope.$index, 'DOWN')" />
                <i class="operation el-icon-delete" @click="quZSMove(scope.$index, 'DEL')" />
              </template>
            </el-table-column>
          </el-table>
          <div class="btn-zone">
            <el-button type="primary" @click="generatCurveRelaZs('N')">生成自身曲线关系</el-button>
            <el-button type="primary" @click="generatCurveRelaZs('Y')">生成自身倒挂检验关系</el-button>
          </div>
        </el-col>
      </el-row>
      <el-carousel ref="relaFormTableCarousel" :interval="0" :initial-index="initialIndex" :autoplay="false" trigger="click" :loop="false" @change="carouselChange" indicator-position="outside" type="card" height="440px">
        <el-carousel-item v-for="(item, index) in relaFormTableList" :key="index" style="height: 400px;overflow: scroll">
          <CurveSetRelaFormTable
            ref="refCurveSetRelaFormTable"
            :index="index"
            :last="index === relaFormTableList.length-1"
            :rela-form-table="item"
            :data-list="item.dataList"
            :column-prop="item.columnProp"
            @relaFormTableDelete="relaFormTableDelete"
            @moveToPri="moveToPri"
            @moveToNext="moveToNext"
          />
        </el-carousel-item>
      </el-carousel>

    </el-card>
  </div>
</template>

<script>
import CurveSetRelaFormTable from '@/views/curve/set/curve-set-rela-form-table.vue'
import { queryCurvePrdOrderKtList } from '@/api/curve/curve-product-order.js'
import { getCurveProductIdOptions } from '@/api/curve/curve-product-list.js'
import { getOrderListOptions } from '@/api/curve/curve-product-order.js'
import { resolveProductGrade2Num, sortStandSlip, saveRelaTempMain } from '@/api/curve/curve-set-rela.js'

export default {
  name: 'CurveSetRelaForm',
  components: {
    CurveSetRelaFormTable
  },
  props: ['tempMainId', 'opType', 'businessId'],
  data() {
    return {
      disabled: '',
      curveSelectDisable: false,
      curveList: [],
      orderList: [],
      tmp_curveId: '', // 选择的主曲线ID
      tempMain: {},
      tmp_tempInfo: {}, // 曲线模板信息
      // tempList tempKdList tempPrdList
      tempList: [], // 曲线关系模板 日期类型+批次+(0-其他曲线)  1-自身曲线 最多两条，一条是自身，一条是自身倒挂
      tempKdList: [], // 曲线关系模板关键期限列表
      tempPrdList: [], // 曲线关系模板: 曲线列表
      selectedCurveId: '', // 选择曲线ID
      tmp_quXJList: [], // 曲线间
      tempSelfFormInfo: {}, // 自身曲线关系
      tmp_quZSList: [], // 曲线自身列表
      fieldTableList: [], // 字段列表
      tempFormSelfRules: {
        dayType: [{ required: true, message: '请选择', trigger: 'change' }],
        orderId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      relaFormTableList: [], // 表格列表
      initialIndex: 0, // 表格列表默认显示第一个
      curInitialIndex: 0, // 表格列表默认显示第一个
      bak: ''
    }
  },
  computed: {
    curveName() {
      return this.getCurveName(this.tmp_tempInfo.curveId)
    }
  },
  beforeMount() {
    console.info('===curve-set-rela-form.vue. beforeMount===')

    // 先加载列表
    this.curveList = getCurveProductIdOptions()

    if (this.tempMainId) {
      if (this.opType === 'VIEW') {
        this.disabled = true
        this.curveSelectDisable = true
      } else {
        this.disabled = false
      }
    } else if (this.businessId) {
      this.disabled = true
      this.curveSelectDisable = true
    } else {
      this.disabled = false
    }

    this.initPage()
  },
  methods: {
    initPage() {
      this.orderList = []
      getOrderListOptions(this.orderList)
    },
    // 自身关系列表，显示曲线名称
    showLabel(row) {
      console.info('showLabel:' + JSON.stringify(row))
      if (row.type === '0') { // 其他
        return this.$dft('CURVE_DAY_TYPE_SLF', row.dayType) + '-' + this.getOrderName(row.orderId)
      } else if (row.type === '1') { // 其他
        return this.getCurveName(row.curveId)
      }
      return '-'
    },
    getOrderName(id) {
      console.info('getOrderName..')
      var list = this.orderList
      var label = id
      for (const index in list) {
        const item = list[index]
        if (id === item.id) {
          return item.orderName
        }
      }
      return label
    },
    getCurveName(id) {
      return this.getCurveInfo(id).productName
    },
    getCurveInfo(id) {
      console.info('...getCurveInfo...')
      var list = this.curveList
      for (const index in list) {
        const item = list[index]
        if (id === item.curveId) {
          return item
        }
      }
      return {}
    },
    curveSelect(newValue) {
      console.info('newValue:' + newValue + ',oldValue:' + this.tmp_curveId)
      if (this.tempList && this.tempList.length > 0) {
        if (this.tmp_curveId && this.tmp_curveId !== newValue) {
          this.$confirm('修改曲线后当前页面编辑数据会清空,是否确认修改', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            this.tempList = []
            this.relaFormTableList = []
            this.tempKdList = []
            this.tempPrdList = []
            this.tmp_curveId = newValue
            this.$refs.curveIdSelect.blur()
          }).catch(() => {
            console.info('cancle')
            this.tempMain.curveId = this.tmp_curveId
            this.$refs.curveIdSelect.blur()
            return false
          })
        } else {
          this.tmp_curveId = newValue
          this.$refs.curveIdSelect.blur()
        }
      } else {
        this.tmp_curveId = newValue
        this.$refs.curveIdSelect.blur()
      }
    },
    sortCurveByReferFlag(a, b) {
      var a_referFlag = a.referFlag
      var b_referFlag = b.referFlag
      if (a_referFlag === 'Y') {
        a_referFlag = 2
      }
      if (b_referFlag === 'Y') {
        b_referFlag = 2
      }
      return Number(a_referFlag) - Number(b_referFlag)
    },
    // 添加至
    handleCommandAddToZone(command) {
      console.info('添加至:' + command)
      if (!this.selectedCurveId) {
        this.$message({
          message: '请选择一条曲线',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }

      // 校验曲线是否存在
      for (let i = 0; i < this.tmp_quXJList.length; i++) {
        const item = this.tmp_quXJList[i]
        if (item.curveId === this.selectedCurveId) {
          this.$message({
            message: '曲线已经存在',
            type: 'warning',
            showClose: true,
            duration: 2000
          })
          return false
        }
      }
      const curveInfo = this.getCurveInfo(this.selectedCurveId)
      if (!this.tmp_quXJList) {
        this.tmp_quXJList = []
      }
      this.tmp_quXJList.push({
        curveId: curveInfo.curveId,
        productGrade: curveInfo.productGrade,
        productName: curveInfo.productName,
        referFlag: command
      })
      // 根据区域排序，族系区放中间
      this.tmp_quXJList.sort(this.sortCurveByReferFlag)
    },
    quXJMove(index, opType) {
      if (opType === 'DEL') { // 删除
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.tmp_quXJList.splice(index, 1)
        }).catch(() => {
          console.info('cancle')
        })
      } else if (opType === 'UP') { // UP
        if (index === 0) {
          this.$message({
            message: '已经是第一条',
            type: 'warning',
            showClose: true
          })
          return false
        }
        const curent_item = this.tmp_quXJList[index]
        const last_item = this.tmp_quXJList[index - 1]

        // 区域变更时，最变更区域，同区域内，则位置移动
        if (curent_item.referFlag === last_item.referFlag) {
          // 验证风险等级
          if (resolveProductGrade2Num(curent_item.productGrade) < resolveProductGrade2Num(last_item.productGrade)) {
            var msg = `${this.getCurveName(curent_item.curveId)}曲线的评级为${curent_item.productGrade},低于${this.getCurveName(last_item.curveId)}曲线,在质检时会产生跨线异常,请问是否确认调整顺序`
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              // 在上一项插入该项
              this.tmp_quXJList.splice(index - 1, 0, (this.tmp_quXJList[index]))
              // 删除后一项
              this.tmp_quXJList.splice(index + 1, 1)
            }).catch(() => {
              console.info('cancle')
            })
          } else {
            // 区域变更时，最变更区域，同区域内，则位置移动
            if (curent_item.referFlag === last_item.referFlag) {
              // 在上一项插入该项
              this.tmp_quXJList.splice(index - 1, 0, (this.tmp_quXJList[index]))
              // 删除后一项
              this.tmp_quXJList.splice(index + 1, 1)
            }
          }
        } else {
          curent_item.referFlag = last_item.referFlag
        }
      } else if (opType === 'DOWN') {
        if (index === (this.tmp_quXJList.length - 1)) {
          this.$message({
            message: '已经是最后一条',
            type: 'warning',
            showClose: true
          })
          return false
        }
        const curent_item = this.tmp_quXJList[index]
        const last_item = this.tmp_quXJList[index + 1]
        // 区域变更时，最变更区域，同区域内，则位置移动
        if (curent_item.referFlag === last_item.referFlag) {
          // 验证风险等级
          if (resolveProductGrade2Num(curent_item.productGrade) > resolveProductGrade2Num(last_item.productGrade)) {
            var msg2 = `${this.getCurveName(curent_item.curveId)}曲线的评级为${curent_item.productGrade},高于${this.getCurveName(last_item.curveId)}曲线,在质检时会产生跨线异常,请问是否确认调整顺序`
            this.$confirm(msg2, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              // 在下一项插入该项
              this.tmp_quXJList.splice(index + 2, 0, (this.tmp_quXJList[index]))
              // 删除前一项
              this.tmp_quXJList.splice(index, 1)
            }).catch(() => {
              console.info('cancle')
            })
          } else {
            // 在下一项插入该项
            this.tmp_quXJList.splice(index + 2, 0, (this.tmp_quXJList[index]))
            // 删除前一项
            this.tmp_quXJList.splice(index, 1)
          }
        } else {
          curent_item.referFlag = last_item.referFlag
        }
      }
    },
    // 添加到自身列表
    addToSelf() {
      // tempSelfFormInfo dayType orderId
      this.$refs['tempSelfFormInfo'].validate((valid) => {
        if (valid) {
          // 验证列表中是否已经存在
          for (const item of this.tmp_quZSList) {
            if (item.type === '0' && item.dayType === this.tempSelfFormInfo.dayType && item.orderId === this.tempSelfFormInfo.orderId) {
              this.$message({
                message: '日期、批次已经存在',
                type: 'warning',
                showClose: true,
                duration: 2000
              })
              return false
            }
          }
          // tmp_quZSList 添加记录
          this.tmp_quZSList.push({
            curveId: '',
            orderId: this.tempSelfFormInfo.orderId,
            dayType: this.tempSelfFormInfo.dayType,
            type: '0' // 0-其他 1-自身
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 曲线自身操作
    quZSMove(index, opType) {
      if (opType === 'DEL') { // 删除
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.tmp_quZSList.splice(index, 1)
        }).catch(() => {
          console.info('cancle')
        })
      } else if (opType === 'UP') { // UP
        if (index === 0) {
          this.$message({
            message: '已经是第一条',
            type: 'warning',
            showClose: true
          })
          return false
        }
        // 在上一项插入该项
        this.tmp_quZSList.splice(index - 1, 0, (this.tmp_quZSList[index]))
        // 删除后一项
        this.tmp_quZSList.splice(index + 1, 1)
      } else if (opType === 'DOWN') { // DOWN
        if (index === (this.tmp_quZSList.length - 1)) {
          this.$message({
            message: '已经是最后一条',
            type: 'warning',
            showClose: true
          })
          return false
        }
        // 在下一项插入该项
        this.tmp_quZSList.splice(index + 2, 0, (this.tmp_quZSList[index]))
        // 删除前一项
        this.tmp_quZSList.splice(index, 1)
      }
    },
    // 生成曲线间关系
    async generatCurveRela() {
      var curveId = this.tempMain.curveId
      if (!curveId) {
        this.$message({
          message: '请选择一条曲线',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      // 判断 tempInfo
      if (!this.tmp_tempInfo.dayType) {
        this.$message({
          message: '选择批次日期类型不能为空',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      if (!this.tmp_tempInfo.orderId) {
        this.$message({
          message: '选择批次批次不能为空',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      if (this.tmp_tempInfo.spreadFlag === 'Y') {
        if (!this.tmp_tempInfo.spreadDatType) {
          this.$message({
            message: '请选择上一批次利差日期类型',
            type: 'warning',
            showClose: true,
            duration: 2000
          })
          return false
        }
        if (!this.tmp_tempInfo.spreadOrderId) {
          this.$message({
            message: '请选择上一批次利差批次',
            type: 'warning',
            showClose: true,
            duration: 2000
          })
          return false
        }
      }
      if (this.tmp_quXJList.length <= 0) {
        this.$message({
          message: '请添加曲线间关系',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }

      // 判断是否有族系区
      let haveZuXiQu = false
      for (let i = 0; i < this.tmp_quXJList.length; i++) {
        const referFlag = this.tmp_quXJList[i].referFlag
        if (referFlag === 'Y') {
          haveZuXiQu = true
          break
        }
      }
      if (!haveZuXiQu) {
        this.$message({
          message: '请添加族系区曲线',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }

      // 从缓存中获取最新数据, 缓存数据即为保存时，发送后台数据
      // tempInfo tmp_quXJList 均为临时编辑数据，点击生成曲线关系时，需要同步缓存数据
      // tempList: [], // 曲线关系模板 日期类型+批次+(0-其他曲线)  1-自身曲线 最多两条，一条是自身，一条是自身倒挂
      // tempKdList: [], // 曲线关系模板关键期限列表
      // tempPrdList: [], // 曲线关系模板: 曲线列表

      // 判断缓存是否存在相应记录
      var tempInfo = null
      for (var item of this.tempList) {
        if (item.type === '0' && item.dayType === this.tmp_tempInfo.dayType && item.orderId === this.tmp_tempInfo.orderId) {
          tempInfo = item
          tempInfo.spreadFlag = this.tmp_tempInfo.spreadFlag
          tempInfo.spreadDatType = this.tmp_tempInfo.spreadDatType
          tempInfo.spreadOrderId = this.tmp_tempInfo.spreadOrderId
        }
      }
      if (!tempInfo) {
        tempInfo = {
          id: 'TMP_' + new Date().getTime(),
          type: '0',
          dayType: this.tmp_tempInfo.dayType,
          orderId: this.tmp_tempInfo.orderId,
          spreadFlag: this.tmp_tempInfo.spreadFlag,
          spreadDatType: this.tmp_tempInfo.spreadDatType,
          spreadOrderId: this.tmp_tempInfo.spreadOrderId
        }
        // 新增记录，保存至缓存
        this.tempList.push(tempInfo)
      }

      // 获取所有曲线的关键期限
      var ids = [curveId]
      var columnProp = [{ key: 0, prop: 'standSlip', label: '曲线产品名称/关键期限' }] // { key: 'standSlip', label: '曲线产品名称' },
      var prdList = []
      let i = 0
      for (; i < this.tmp_quXJList.length; i++) {
        const curveId = this.tmp_quXJList[i].curveId
        ids.push(curveId)
        columnProp.push({
          key: (i + 1), prop: curveId, label: this.getCurveName(curveId)
        })
        prdList.push({ tempId: tempInfo.id, curveId: curveId, referFlag: this.tmp_quXJList[i].referFlag })
      }
      if (tempInfo.spreadFlag === 'Y') {
        for (let j = 0; j < this.tmp_quXJList.length; j++) {
          const curveId = this.tmp_quXJList[j].curveId
          ids.push(curveId)
          columnProp.push({
            key: (i + j + 1), prop: curveId, label: this.getCurveName(curveId) + '利差'
          })
        }
      }
      console.info('列名称:' + JSON.stringify(columnProp))

      var allCurveOrderKt = []
      var curentCurveOrderKt = []
      // 获取所有曲线间关键期限
      await queryCurvePrdOrderKtList({ curveIdsIn: ids.join(','), orderId: this.tmp_tempInfo.orderId }).then(response => {
        const list = response
        if (list && list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            if (allCurveOrderKt.indexOf(Number(item.standSlip)) < 0) {
              allCurveOrderKt.push(Number(item.standSlip))
            }
          }
        }
      })
      allCurveOrderKt.sort(sortStandSlip)

      // 获取当前曲线关键期限
      await queryCurvePrdOrderKtList({ curveId: curveId, orderId: this.tmp_tempInfo.orderId }).then(response => {
        const list = response
        if (list && list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            if (curentCurveOrderKt.indexOf(Number(item.standSlip)) < 0) {
              curentCurveOrderKt.push(Number(item.standSlip))
            }
          }
        }
      })
      curentCurveOrderKt.sort(sortStandSlip)
      console.info('所有关键期限:' + JSON.stringify(allCurveOrderKt))
      console.info('当前曲线关键期限:' + JSON.stringify(curentCurveOrderKt))

      var max_standSlip = 0
      if (curentCurveOrderKt.length > 0) {
        max_standSlip = curentCurveOrderKt[curentCurveOrderKt.length - 1]
      }
      console.info('max_standSlip:' + max_standSlip)
      for (const index in allCurveOrderKt) {
        // eslint-disable-next-line no-redeclare
        var item = allCurveOrderKt[index]
        if (item > max_standSlip) {
          allCurveOrderKt = allCurveOrderKt.splice(0, index)
          break
        }
      }
      const dataList = []
      for (const item of allCurveOrderKt) {
        dataList.push({ standSlip: item })
      }

      // 判断relaFormTableList是否已经存在记录，如果存在，则更新
      var exist = false
      var oldTempInfo = {}
      for (const item of this.relaFormTableList) {
        if (tempInfo.id === item.tempInfo.id) {
          exist = true
          oldTempInfo = item
          break
        }
      }
      if (exist) {
        oldTempInfo.tempInfo = tempInfo
        oldTempInfo.dataList = dataList
        oldTempInfo.columnProp = columnProp
        oldTempInfo.prdList = prdList
      } else {
        this.relaFormTableList.push({
          tempInfo: tempInfo,
          dataList: dataList,
          columnProp: columnProp,
          prdList: prdList
        })
      }
      // 更新
      // this.curInitialIndex
      var curInitialIndex = this.curInitialIndex
      var relaFormTableCarousel = this.$refs.relaFormTableCarousel
      this.$nextTick(() => {
        setTimeout(function() {
          // 显示后一项
          relaFormTableCarousel.setActiveItem(curInitialIndex)
        })
      })
    },
    // 卡片切换
    carouselChange(newValue, oldValue) {
      console.info('carouselChange...newValue:' + newValue + ',oldValue:' + oldValue)
      this.curInitialIndex = newValue
    },
    relaFormTableDelete(index) {
      console.info('curve-set-rela-form.vue...relaFormTableDelete...index:' + index)
      // 删除并返回数据
      const deletObj = this.relaFormTableList.splice(index, 1)[0]
      /*
       需要删除缓存数据 this.tempList
      */
      const _tmp_tempInfo = deletObj.tempInfo
      for (var i in this.tempList) {
        if (this.tempList[i].id === _tmp_tempInfo.id) {
          this.tempList.splice(i, 1)
          break
        }
      }
    },
    moveToPri(index) {
      console.info('curve-set-rela-form.vue...moveToPri...index:' + index)
      if (index === 0) {
        this.$message({
          message: '已经是第一条',
          type: 'warning',
          showClose: true
        })
        return false
      }
      // 在上一项插入该项
      this.relaFormTableList.splice(index - 1, 0, (this.relaFormTableList[index]))
      // 删除后一项
      this.relaFormTableList.splice(index + 1, 1)

      // this.initialIndex = index - 1
      var relaFormTableCarousel = this.$refs.relaFormTableCarousel
      this.$nextTick(() => {
        setTimeout(function() {
          // 显示后一项
          relaFormTableCarousel.prev()
        }, 100)
      })
    },
    moveToNext(index) {
      console.info('curve-set-rela-form.vue...moveToNext...index:' + index)
      if (index === this.relaFormTableList.length) {
        this.$message({
          message: '已经是最后一条',
          type: 'warning',
          showClose: true
        })
        return false
      }
      // 在下一项插入该项
      this.relaFormTableList.splice(index + 2, 0, (this.relaFormTableList[index]))
      // 删除前一项
      this.relaFormTableList.splice(index, 1)

      // this.initialIndex = index + 1
      var relaFormTableCarousel = this.$refs.relaFormTableCarousel
      this.$nextTick(() => {
        setTimeout(function() {
          // 显示后一项
          relaFormTableCarousel.next()
        }, 100)
      })
    },
    // 生成自身曲线关系、倒挂检验关系
    async generatCurveRelaZs(inversionFlag) {
      console.info('generatCurveRelaZs...inversionFlag(Y为倒挂):' + inversionFlag)
      var curveId = this.tempMain.curveId
      if (!curveId) {
        this.$message({
          message: '请选择一条曲线',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }

      // 判断
      if (!this.tempSelfFormInfo.dayType) {
        this.$message({
          message: '选择自身曲线关系日期类型不能为空',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      if (!this.tempSelfFormInfo.orderId) {
        this.$message({
          message: '选择自身曲线关系批次不能为空',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }
      //
      var tempInfo = null
      for (var item of this.tempList) {
        // type: 1-本身
        if (item.type === '1' && item.inversionFlag === inversionFlag) {
          tempInfo = item
        }
      }
      if (!tempInfo) {
        tempInfo = {
          id: 'TMP_' + new Date().getTime(),
          type: '1', // 模板类型 1-自身
          inversionFlag: inversionFlag
        }
        // 新增记录，保存至缓存
        this.tempList.push(tempInfo)
      }

      // 组装表头
      var columnProp = [{ key: 0, prop: 'standSlip', label: '曲线产品名称/关键期限' }] // { key: 'standSlip', label: '曲线产品名称' },
      var prdList = [] // 关系产品表
      for (let i = 0; i < this.tmp_quZSList.length; i++) {
        const item = this.tmp_quZSList[i]
        // 曲线
        columnProp.push({ key: (i + 1), prop: '' + (i + 1), label: this.showLabel(item), dayType: item.dayType, orderId: item.dayType })
        prdList.push({ tempId: tempInfo.id, dayType: item.dayType, orderId: item.dayType })
      }
      // 获取当前曲线关键期限
      var curentCurveOrderKt = []
      await queryCurvePrdOrderKtList({ curveId: curveId, orderId: this.tmp_tempInfo.orderId }).then(response => {
        const list = response
        if (list && list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            if (curentCurveOrderKt.indexOf(Number(item.standSlip)) < 0) {
              curentCurveOrderKt.push(Number(item.standSlip))
            }
          }
        }
      })
      curentCurveOrderKt.sort(sortStandSlip)
      console.info('当前曲线关键期限:' + JSON.stringify(curentCurveOrderKt))
      console.info('columnProp:' + JSON.stringify(columnProp))
      console.info('prdList:' + JSON.stringify(prdList))

      const dataList = []
      for (const item of curentCurveOrderKt) {
        dataList.push({ standSlip: item })
      }

      // 判断relaFormTableList是否已经存在记录，如果存在，则更新
      var exist = false
      var oldTempInfo = {}
      for (const item of this.relaFormTableList) {
        if (tempInfo.id === item.tempInfo.id) {
          exist = true
          oldTempInfo = item
          break
        }
      }
      if (exist) {
        oldTempInfo.tempInfo = tempInfo
        oldTempInfo.columnProp = columnProp
        oldTempInfo.dataList = dataList
        oldTempInfo.prdList = prdList
      } else {
        this.relaFormTableList.push({
          tempInfo: tempInfo,
          columnProp: columnProp,
          dataList: dataList,
          prdList: prdList
        })
      }

      // 更新
      // this.curInitialIndex
      var curInitialIndex = this.curInitialIndex
      var relaFormTableCarousel = this.$refs.relaFormTableCarousel
      this.$nextTick(() => {
        setTimeout(function() {
          // 显示后一项
          relaFormTableCarousel.setActiveItem(curInitialIndex)
        })
      })
    },
    // 保存
    saveAll() {
      console.info('generatCurveRelaZs...saveAll:')
      var curveId = this.tempMain.curveId
      if (!curveId) {
        this.$message({
          message: '请选择一条曲线',
          type: 'warning',
          showClose: true,
          duration: 2000
        })
        return false
      }

      var _tempList = []
      var _prdList = []
      var _kdList = []
      // 从  取关键期限
      const list = this.$refs.refCurveSetRelaFormTable
      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          const kdList = item.getSeletedKd() // 关键期限
          const relaFormTable = item.getRelaFormTable() // 包含tempInfo prdList
          const tempInfo = relaFormTable.tempInfo
          if (!tempInfo.name) {
            this.$message({
              message: '第[' + (i + 1) + ']个矩阵名称不能为空',
              type: 'warning',
              showClose: true,
              duration: 2000
            })
            return false
          }
          _tempList.push(tempInfo)
          _prdList = _prdList.concat(relaFormTable.prdList)
          _kdList = _kdList.concat(kdList)
        }
      }
      // 获取 kdlist prdList
      // this.relaFormTableList
      // 获取tempMainInfo
      var data = {
        tempMain: this.tempMain,
        curveRelaTempList: _tempList,
        curveRelaTempPrdList: _prdList,
        curveRelaTempKTList: _kdList
      }

      console.info(data)
      console.info(JSON.stringify(data))
      // 保存
      saveRelaTempMain(data).then(response => {
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
.operation{
  font-size: 20px;
  cursor: pointer;
}
.btn-zone{
  text-align: center;
  margin-top: 20px;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
