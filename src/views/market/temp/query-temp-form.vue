<template>
  <div class="dashboard-container">
    <el-row :gutter="1" :style="{height: scrollerHeight}">
      <el-col :span="6">
        <el-card class="box-card margin-top calendar-job">
          <el-form ref="MarketTempForm" :model="marketTempInfo" :rules="tempInfoRules">
            <el-form-item label="行情展示模板名称" class="blackItem" prop="tempName">
              <el-input v-model="marketTempInfo.tempName" :disabled="disabled" size="mini" />
            </el-form-item>
            <el-form-item label="备注" class="blackItem" prop="remark">
              <el-input v-model="marketTempInfo.remark" :disabled="disabled" type="textarea" />
            </el-form-item>
            <el-form-item label="数据行情" class="blackItem" prop="dataMarket">
              <el-select
                v-model="marketTempInfo.dataMarket"
                value-key="value"
                style="width:160px"
                :disabled="disabled || tempInfodisabled"
                @change="getOneAllcols"
              >
                <el-option v-for="item in dataMarketOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="展示区域" class="blackItem" prop="showArea">
              <el-select
                v-model="marketTempInfo.showArea"
                value-key="value"
                style="width:160px"
                :disabled="disabled || marketTempInfo.dataMarket==='01'?true:false || tempInfodisabled || defaultDisabled"
                clearable
                @change="getTwoAllcols"
              >
                <el-option v-for="item in showAreaOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-input type="hidden" :style="{height: blankHeight}" size="mini" />
            <el-form-item label="最后操作人" class="blackItem">
              <el-input v-model="marketTempInfo.lastUpdBy" disabled style="width:165px" size="mini" />
            </el-form-item>
            <el-form-item label="最后操作时间" class="blackItem">
              <el-input v-model="marketTempInfo.lastUpdTs" disabled style="width:150px" size="mini" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="11">
        <el-row>
          <el-card class="box-card margin-top calendar-job">
            <el-table
              ref="marketTempTable"
              :data="colData"
              tooltip-effect="dark"
              style="width: 100%"
              :height="midTabHeight"
              :header-cell-style="tableHeaderColor"
            >
              <el-table-column
                prop="colChiName"
                sortable
                label="字段"
                show-overflow-tooltip
                width="150"
                :formatter="formatColname"
              />
              <el-table-column
                width="100"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="checkColType(scope.row.colCategory)"
                    :disabled="disabled"
                    type="text"
                    size="small"
                    @click.native.prevent="alterCol(scope.$index, scope.row)"
                  >
                    调整
                  </el-button>
                  <el-button
                    v-if="checkColType(scope.row.colCategory)"
                    :disabled="disabled"
                    type="text"
                    size="small"
                    @click.native.prevent="deleteCol(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="showOrhide"
                label="展示"
                sortable
                width="80"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.showOrhide"
                    v-bind="{'checked': scope.row.showOrhide? true : false}"
                    :disabled="disabled || scope.row.isPriMaryKey === 'Y'"
                    @change="checkedShow(scope.$index, scope.row.showOrhide)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="orderBy"
                show-overflow-tooltip
                label="顺序调整"
                width="160"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    :disabled="scope.$index===0 || disabled"
                    @click="moveUp(scope.$index,scope.row)"
                  ><i class="el-icon-arrow-up" />
                  </el-button>
                  <el-button
                    size="mini"
                    :disabled="scope.$index===(colData.length-1) || disabled"
                    @click="moveDown(scope.$index,scope.row)"
                  ><i class="el-icon-arrow-down" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="box-card margin-top calendar-job">
            <el-row>
              <el-col>
                <el-form ref="extendColForm" :model="extendColInfo" :rules="tempInfoRules" style="height: 200px">
                  <el-row>
                    <el-col :offset="5">
                      <el-form-item label="字段名称" class="blackItem">&emsp;&emsp;&emsp;
                        <el-input v-model="extendColInfo.colChiName" :disabled="disabled" size="mini" style="width:150px" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="3" :span="12">
                      <el-form-item label="数值类字段" class="blackItem">
                        <el-select
                          v-model="extendColInfo.relationCol"
                          size="mini"
                          value-key="code"
                          style="width:140px"
                          :disabled="disabled"
                          @change="selectColName"
                        >
                          <el-option
                            v-for="item in relationColsOptions"
                            :key="item.code"
                            :label="item.value"
                            :value="item.code"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="操作符" class="blackItem">
                        <el-select v-model="extendColInfo.operator" value-key="value" size="mini" style="width:100px" :disabled="disabled" @change="changeComputeExp">
                          <el-option v-for="item in operatorTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="5">
                      <el-form-item>
                        <el-input
                          id="textarea"
                          v-model="extendColInfo.computeExp"
                          type="textarea"
                          :disabled="disabled"
                          rows="3"
                          style="width:350px"
                        />
                      </el-form-item>
                      <el-form-item label="添加至" class="blackItem">&emsp;&emsp;
                        <el-select
                          v-model="extendColInfo.colCategory"
                          value-key="value"
                          size="mini"
                          style="width:160px"
                          :disabled="disabled"
                        >
                          <el-option label="扩展字段" value="02" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="7">
                <el-button type="primary" style="width:200px" @click="addtempcol">确认添加</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card margin-top calendar-job">
          <el-row style="width: 100%;text-align: center">
            <h4>效果预览</h4>
          </el-row>
          <el-row>
            <el-table
              ref="marketTempTable"
              :data="colDataResult"
              tooltip-effect="dark"
              border
              style="width: 100%"
              :height="rightTabHeight"
              :header-cell-style="tableHeaderColor"
            >
              <el-table-column
                prop="colChiName"
                label="字段"
                sortable
                show-overflow-tooltip
                width="300"
              />
            </el-table>
          </el-row>
          <br><br><br>
          <el-row>
            &emsp;&emsp;&emsp;<el-button type="primary" style="width: 100px" size="mini" @click="save()">保存模板</el-button>
            &emsp;&emsp;<el-button type="primary" style="width: 80px" size="mini" @click="dialogClose">取消</el-button>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { optioins } from '@/api/curve/code-type.js'
import { saveMarketTemp, getMarketTemp, getMarketColsInfo, checkTempName } from '@/api/market/market-temp.js'

export default {
  name: 'MarketTempForm',
  components: {},
  props: ['businessId', 'opType', 'isCopy', 'dataMarket', 'showArea'],
  data() {
    return {
      disabled: '',
      midTabHeight: (window.innerHeight - 474) + 'px',
      rightTabHeight: (window.innerHeight - 241) + 'px',
      tempInfodisabled: '',
      defaultDisabled: true,
      tempInfoRules: {
        tempName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 1, max: 128, message: '长度在 1 到 40 个汉字', trigger: 'blur' },
          { validator: this.checkTempName, trigger: 'blur' }
        ],
        remark: [
          { min: 1, max: 128, message: '长度在 1 到 150 个汉字', trigger: 'blur' }
        ],
        dataMarket: [
          { required: true, message: '请选择数据行情', trigger: 'blur' }
        ],
        showArea: [
          { validator: this.checkShowArea, message: '请选择展示区域', trigger: 'blur' }
        ]
      },
      marketTempFormVisible: false,
      extendColInfo: {
        baseColChiName: {},
        colCategory: '02',
        computeExp: '',
        operatorType: ''
      },
      colData: [],
      colDataResult: [],
      multipleSelection: [],
      relationColsOptions: []
    }
  },
  computed: {
    dataMarketOptions() {
      return optioins(this, 'DATA_MARKET')
    },
    showAreaOptions() {
      return optioins(this, 'SHOW_AREA')
    },
    operatorTypeOptions() {
      // console.log(optioins(this, 'OPER_TYPE'))
      return optioins(this, 'OPER_TYPE')
    },
    colCategoryOptions() {
      return optioins(this, 'COL_TYPE')
    },
    marketTempInfo: {
      get() {
        var marketTempInfo = this.$store.state.marketTemp.marketTempInfo
        if (this.isCopy) {
          marketTempInfo.tempName = ''
        }
        return marketTempInfo
      },
      set(marketTempInfo) {
        this.$store.commit('marketTemp/setMarketTempInfo', marketTempInfo)
      }
    },
    scrollerHeight: function() {
      return (window.innerHeight - 50) + 'px'
    },
    blankHeight: function() {
      return (window.innerHeight - 554) + 'px'
    }
  },
  beforeMount() {
    if (this.businessId) {
      this.tempInfodisabled = true
      getMarketTemp(this.businessId).then(response => {
        const { marketTempInfo, colData } = response
        this.$store.commit('marketTemp/setMarketTempInfo', marketTempInfo)
        this.colData = colData
        this.marketTempInfo = marketTempInfo
        // this.extendColInfo = {}
        this.setColDataResult()
      })
      var data = {}
      // data.dataMarket = this.marketTempInfo.dataMarket
      // data.showArea = this.marketTempInfo.showArea
      data.dataMarket = this.dataMarket
      data.showArea = this.showArea
      console.log(data)
      getMarketColsInfo(data).then(response => {
        const { numberCols } = response
        this.relationColsOptions = numberCols
      })
      if (this.opType === 'VIEW') {
        this.disabled = true
      } else {
        this.disabled = false
      }
      if (this.isCopy) {
        this.tempInfodisabled = false
      }
    } else {
      this.disabled = false
      this.tempInfodisabled = false
    }
  },
  mounted() {
  },
  methods: {
    dialogClose() {
      this.$emit('closeDialog')
    },
    save(formName) {
      if (this.isCopy) {
        // 复制新增-->删除Id
        this.marketTempInfo.id = ''
      }
      this.$refs.MarketTempForm.validate((valid) => {
        if (valid) {
          const data = {}
          data.marketTempInfo = this.marketTempInfo
          data.colData = this.colData
          saveMarketTemp(data).then(response => {
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
    // 更改表头样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'color: black;font-weight: 700;'
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    addtempcol() {
      // console.log(this.extendColInfo.computeExp)
      // console.log(this.extendColInfo.operatorType)
      // if (!this.extendColInfo.relationCol) {
      //   this.$message({
      //     message: '请选择通用字段',
      //     type: 'error'
      //   })
      //   return false
      // }
      if (!this.extendColInfo.colCategory) {
        this.$message({
          message: '请选择通用/扩展字段',
          type: 'error'
        })
        return false
      }
      if (this.extendColInfo.colCategory === '02') {
        if (!this.extendColInfo.computeExp || !this.extendColInfo.colChiName) {
          this.$message({
            message: '扩展字段名称、计算表达式不能为空',
            type: 'error'
          })
          return false
        }
      }
      // console.log(this.extendColInfo.operatorType, this.extendColInfo.computeExp)
      if (this.extendColInfo.index != null) {
        var index = this.extendColInfo.index
        var that = this
        that.colData[index].colCategory = this.extendColInfo.colCategory
        that.colData[index].relationCol = this.extendColInfo.relationCol
        if (this.extendColInfo.colCategory === '01') {
          that.colData[index].colChiName = this.extendColInfo.baseColChiName
        } else {
          that.colData[index].colChiName = this.extendColInfo.colChiName
        }
        that.colData[index].operatorType = this.getComputeExp(this.extendColInfo.computeExp)
        that.colData[index].computeExp = this.extendColInfo.computeExp
        // console.log(that.colData[index])
        this.extendColInfo.index = null
      } else {
        var colChiName = ''
        if (this.extendColInfo.colCategory === '01') {
          colChiName = this.extendColInfo.baseColChiName
        } else {
          colChiName = this.extendColInfo.colChiName
        }
        var tableName = this.colData[0].tableName
        this.colData.push({
          colChiName: colChiName,
          showOrhide: true,
          colCategory: this.extendColInfo.colCategory,
          relationCol: this.extendColInfo.relationCol,
          operatorType: this.getComputeExp(this.extendColInfo.computeExp),
          computeExp: this.extendColInfo.computeExp,
          tableName: tableName
        })
        this.colDataResult.push({
          colChiName: colChiName,
          showOrhide: true,
          colCategory: this.extendColInfo.colCategory,
          relationCol: this.extendColInfo.relationCol,
          operatorType: this.getComputeExp(this.extendColInfo.computeExp),
          computeExp: this.extendColInfo.computeExp,
          tableName: tableName
        })
      }
      // console.log(this.colData)
    },
    getComputeExp(val) {
      var resultComputeExp = ''
      var value = ''
      var operList = ['(', ')', '+', '-', '*', '/']
      for (let i = 0; i < val.length; i++) {
        // console.log(operList.indexOf(val[i]))
        if (operList.indexOf(val[i]) === -1) {
          value += val[i]
        } else {
          if (value) {
            let obj = {}
            obj = this.relationColsOptions.find((item) => {
              return item.value === value
            })
            if (!obj) {
              resultComputeExp += value
            } else {
              resultComputeExp += obj.code
            }
            value = ''
          }
          resultComputeExp += val[i]
        }
      }
      if (value) {
        let obj = {}
        obj = this.relationColsOptions.find((item) => {
          return item.value === value
        })
        if (!obj) {
          resultComputeExp += value
        } else {
          resultComputeExp += obj.code
        }
      }
      console.log(resultComputeExp)
      return resultComputeExp
    },
    moveUp(index, row) {
      var that = this
      if (index > 0) {
        const upData = that.colData[index - 1]
        that.colData.splice(index - 1, 1)
        that.colData.splice(index, 0, upData)
        // console.log(this.colData)
        // console.log(that.colData)
        this.setColDataResult()
      } else {
        alert('已经是第一条，不可上移')
      }
    },
    moveDown(index, row) {
      var that = this
      // console.log('下移', index, row)
      if ((index + 1) === that.colData.length) {
        alert('已经是最后一条，不可下移')
      } else {
        // console.log(index)
        const downData = that.colData[index + 1]
        that.colData.splice(index + 1, 1)
        that.colData.splice(index, 0, downData)
        this.setColDataResult()
      }
    },
    formatColname: function(row, column) {
      return row.colChiName
    },
    alterCol(index, row) {
      var that = this
      if (this.businessId) {
        this.extendColInfo = {
          colChiName: '',
          relationCol: '',
          operatorType: '',
          operator: '',
          computeExp: '',
          colCategory: '',
          index: ''
        }
        that.extendColInfo.colChiName = row.colChiName
        // that.extendColInfo.relationCol = row.relationCol
        that.extendColInfo.operatorType = row.operatorType
        that.extendColInfo.computeExp = row.computeExp
        that.extendColInfo.colCategory = row.colCategory
        that.extendColInfo.index = index
      } else {
        // that.extendColInfo = {}
        that.extendColInfo.colChiName = row.colChiName
        // that.extendColInfo.relationCol = row.relationCol
        that.extendColInfo.operatorType = row.operatorType
        that.extendColInfo.computeExp = row.computeExp
        that.extendColInfo.colCategory = row.colCategory
        that.extendColInfo.index = index
      }
    },
    deleteCol(index) {
      var that = this
      that.colData.splice(index, 1)
      this.setColDataResult()
    },
    checkColType(colCategory) {
      // console.log(colCategory)
      if (colCategory === '01' || !colCategory) {
        return false
      }
      return true
    },
    checkedShow: function(index, showOrhide) {
      // console.log(index, showOrhide)
      var that = this
      that.colDataResult = []
      if (!showOrhide) {
        // that.colDataResult.splice(index, 1)
        that.colData[index].showOrhide = false
      } else {
        // that.colDataResult.splice(index, 0, this.colData[index])
        that.colData[index].showOrhide = true
        // console.log(showOrhide)
      }
      var j = 0
      for (var i = 0; i < that.colData.length; i++) {
        if (that.colData[i].showOrhide) {
          // console.log(that.colData[i])
          that.colDataResult[j] = that.colData[i]
          j++
        }
      }
      // console.log(this.colData[index].showOrhide)
    },
    setColDataResult() {
      // 结果预览
      var that = this
      that.colDataResult = []
      var j = 0
      for (var i = 0; i < that.colData.length; i++) {
        if (that.colData[i].showOrhide) {
          // console.log(that.colData[i])
          that.colDataResult[j] = that.colData[i]
          j++
        }
      }
    },
    selectColName(val) {
      var that = this
      let obj = {}
      obj = this.relationColsOptions.find((item) => {
        return item.code === val
      })
      this.extendColInfo.baseColChiName = obj.value
      const myField = document.querySelector('#textarea')
      // console.log(myField)
      const cursurPosition = myField.selectionStart
      // console.log(cursurPosition)
      var firstPart = this.extendColInfo.computeExp.substring(0, cursurPosition)
      var lastPart = this.extendColInfo.computeExp.substring(cursurPosition, this.extendColInfo.computeExp.length)

      that.extendColInfo.computeExp = firstPart + obj.value + lastPart
      // console.log(that.extendColInfo.computeExp)
      // that.extendColInfo.operatorType += val
      // console.log(obj)
    },
    changeComputeExp(val) {
      var that = this
      const obj = this.operatorTypeOptions.find((item) => {
        return item.value === val
      })
      const myField = document.querySelector('#textarea')
      // console.log(myField)
      const cursurPosition = myField.selectionStart
      // console.log(cursurPosition)
      var firstPart = this.extendColInfo.computeExp.substring(0, cursurPosition)
      var lastPart = this.extendColInfo.computeExp.substring(cursurPosition, this.extendColInfo.computeExp.length)
      that.extendColInfo.computeExp = firstPart + obj.value + lastPart
      // that.extendColInfo.operatorType += val
      // console.log(obj)
    },
    getOneAllcols(val) {
      this.relationColsOptions = []
      if (val === '01') {
        // 查询初始字段信息、数字型字段列表
        this.queryColsInfo('1')
        // 清除展示区域内容
        this.marketTempInfo.showArea = ''
        this.defaultDisabled = true
      } else {
        if (val === '02') {
          this.defaultDisabled = false
          if (this.marketTempInfo.showArea !== '' && typeof this.marketTempInfo.showArea !== 'undefined') {
            // 先选展示区域，后选行情市场时，查询初始字段信息、数字型字段列表
            this.queryColsInfo('2')
          }
        } else {
          this.defaultDisabled = true
        }
      }
    },
    getTwoAllcols(val) {
      // 查询初始字段信息、数字型字段列表
      if (val !== '' && typeof val !== 'undefined') {
        // 非清空展示区域时查询
        this.queryColsInfo('2')
      }
    },
    queryColsInfo(marketLevel) {
      var data = {}
      data.dataMarket = this.marketTempInfo.dataMarket
      if (marketLevel === '2') {
        data.showArea = this.marketTempInfo.showArea
      }
      getMarketColsInfo(data).then(response => {
        const { numberCols, colData } = response
        this.colData = colData
        this.relationColsOptions = numberCols
        this.setColDataResult()
      })
    },
    checkTempName(rule, value, callback) {
      var data = {}
      if (value.replace(/\s*/g, '').length > 0) {
        data.tempName = value
        data.id = this.marketTempInfo.id
        checkTempName(data).then(response => {
          // console.log(response)
          if (response) {
            callback(new Error('模板名称重复'))
          } else {
            callback()
          }
        })
      } else {
        callback(new Error('请正确输入模板名称'))
      }
    },
    checkShowArea(rule, value, callback) {
      if (this.marketTempInfo.dataMarket === '02' && !this.marketTempInfo.showArea) {
        callback(new Error('展示区域不能为空'))
      }
      callback()
    }
  }
}
</script>

<style>
  .blackItem .el-form-item__label {
    font-weight: 700;
  }

  .el-table__header .el-table-column--selection .cell .el-checkbox:after {
    display: none;
    color: white;
    font-weight: 700;
  }
</style>
