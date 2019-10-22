<template>
  <div class="dashboard-container">
    <el-row :gutter="1" style="height: 1000px">
      <el-col :span="6">
        <el-card class="box-card margin-top calendar-job">
          <el-form ref="MarketTempForm" :model="marketTempInfo" :rules="tempInfoRules">
            <el-form-item label="行情展示模板名称" class="blackItem" prop="tempName">
              <el-input v-model="marketTempInfo.tempName" :disabled="disabled" size="mini" />
            </el-form-item>
            <el-form-item label="备注" class="blackItem">
              <el-input v-model="marketTempInfo.remark" :disabled="disabled" type="textarea" />
            </el-form-item>
            <el-form-item label="数据行情" class="blackItem" prop="dataMarket">
              <el-select v-model="marketTempInfo.dataMarket" value-key="value" style="width:160px" :disabled="disabled || tempInfodisabled" @change="getOneAllcols">
                <el-option v-for="item in dataMarketOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="展示区域" class="blackItem" prop="showArea" :required="marketTempInfo.dataMarket==='02'?true:false">
              <el-select
                v-model="marketTempInfo.showArea"
                value-key="value"
                style="width:160px"
                :disabled="disabled || marketTempInfo.dataMarket==='01'?true:false || tempInfodisabled"
                clearable
                @change="getTwoAllcols"
              >
                <el-option v-for="item in showAreaOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
            <el-form-item label="最后操作人" class="blackItem">
              <el-input v-model="marketTempInfo.lastUpdBy" disabled style="width:165px" size="mini" />
            </el-form-item>
            <el-form-item label="最后操作时间" class="blackItem">
              <el-input v-model="marketTempInfo.lastUpdTs" disabled style="width:150px" size="mini" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-row style="height: 600px">
          <el-card class="box-card margin-top calendar-job">
            <el-table
              ref="marketTempTable"
              :data="colData"
              tooltip-effect="dark"
              style="width: 100%"
              height="550"
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
                width="80"
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
                width="120"
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
              <el-col :offset="3">
                <el-form ref="extendColForm" :model="extendColInfo" :rules="tempInfoRules">
                  <el-form-item label="字段名称" class="blackItem">&emsp;&emsp;&emsp;
                    <el-input v-model="extendColInfo.colChiName" :disabled="disabled" size="mini" style="width:180px" />
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      v-model="extendColInfo.relationCol"
                      size="mini"
                      value-key="code"
                      style="width:150px"
                      :disabled="disabled"
                      @change="selectColName"
                    >
                      <el-option
                        v-for="item in relationColsOptions"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"
                      />
                    </el-select>&emsp;&emsp;&emsp;
                    <el-select v-model="extendColInfo.operatorType" value-key="value" size="mini" style="width:150px" :disabled="disabled">
                      <el-option v-for="item in operatorTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="extendColInfo.computeExp" type="textarea" :disabled="disabled" rows="3" style="width:350px" />
                  </el-form-item>
                  <el-form-item label="添加至" class="blackItem">&emsp;&emsp;
                    <el-select v-model="extendColInfo.colCategory" value-key="value" size="mini" style="width:160px" :disabled="disabled">
                      <el-option label="扩展字段" value="02" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<el-button type="primary" style="width:200px" @click="addtempcol">确认添加</el-button>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card margin-top calendar-job">
          <el-row>
            <el-button type="primary" style="width: 300px" size="mini">效果预览</el-button>
          </el-row>
          <el-row>
            <el-table
              ref="marketTempTable"
              :data="colDataResult"
              tooltip-effect="dark"
              style="width: 100%"
              height="800"
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
  props: ['businessId', 'opType', 'isCopy'],
  data() {
    return {
      disabled: '',
      tempInfodisabled: '',
      tempInfoRules: {
        tempName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' },
          { validator: this.checkTempName, trigger: 'blur' }
        ],
        dataMarket: [
          { required: true, message: '请选择数据行情', trigger: 'blur' }
        ],
        showArea: [
          { message: '请选择展示区域', trigger: 'blur' }
        ]
      },
      marketTempFormVisible: false,
      extendColInfo: {
        baseColChiName: {},
        colCategory: '02'
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
        return this.$store.state.marketTemp.marketTempInfo
      },
      set(marketTempInfo) {
        this.$store.commit('marketTemp/setMarketTempInfo', marketTempInfo)
      }
    }
  },
  beforeMount() {
    if (this.businessId) {
      this.tempInfodisabled = true
      getMarketTemp(this.businessId).then(reponse => {
        const { marketTempInfo, colData } = reponse
        this.$store.commit('marketTemp/setMarketTempInfo', marketTempInfo)
        this.colData = colData
        // this.extendColInfo = {}
        this.setColDataResult()
      })
      var data = {}
      data.dataMarket = this.marketTempInfo.dataMarket
      data.showArea = this.marketTempInfo.showArea
      getMarketColsInfo(data).then(reponse => {
        const { numberCols } = reponse
        this.relationColsOptions = numberCols
      })
      if (this.opType === 'VIEW') {
        this.disabled = true
      } else {
        this.disabled = false
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
      // console.log(this.extendColInfo.index)
      if (!this.extendColInfo.relationCol) {
        this.$message({
          message: '请选择通用字段',
          type: 'error'
        })
        return false
      }
      if (!this.extendColInfo.colCategory) {
        this.$message({
          message: '请选择通用/扩展字段',
          type: 'error'
        })
        return false
      }
      if (this.extendColInfo.colCategory === '02') {
        if (!this.extendColInfo.operatorType || !this.extendColInfo.computeExp || !this.extendColInfo.colChiName) {
          this.$message({
            message: '扩展字段字段名、运算符、计算方式不能为空',
            type: 'error'
          })
          return false
        }
      }
      // console.log(this.extendColInfo.operatorType, this.extendColInfo.computeExp)
      if (this.extendColInfo.operatorType === '4' && this.extendColInfo.computeExp === '0') {
        this.$message({
          message: '除数不能为0',
          type: 'error'
        })
        return false
      }
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
        that.colData[index].operatorType = this.extendColInfo.operatorType
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
          operatorType: this.extendColInfo.operatorType,
          computeExp: this.extendColInfo.computeExp,
          tableName: tableName
        })
        this.colDataResult.push({
          colChiName: colChiName,
          showOrhide: true,
          colCategory: this.extendColInfo.colCategory,
          relationCol: this.extendColInfo.relationCol,
          operatorType: this.extendColInfo.operatorType,
          computeExp: this.extendColInfo.computeExp,
          tableName: tableName
        })
      }
      // console.log(this.colData)
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
          computeExp: '',
          colCategory: '',
          index: ''
        }
        that.extendColInfo.colChiName = row.colChiName
        that.extendColInfo.relationCol = row.relationCol
        that.extendColInfo.operatorType = row.operatorType
        that.extendColInfo.computeExp = row.computeExp
        that.extendColInfo.colCategory = row.colCategory
        that.extendColInfo.index = index
      } else {
        // that.extendColInfo = {}
        that.extendColInfo.colChiName = row.colChiName
        that.extendColInfo.relationCol = row.relationCol
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
      if (!showOrhide) {
        that.colDataResult.splice(index, 1)
        that.colData[index].showOrhide = false
      } else {
        that.colDataResult.splice(index, 0, this.colData[index])
        that.colData[index].showOrhide = true
        // console.log(showOrhide)
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
      let obj = {}
      obj = this.relationColsOptions.find((item) => {
        return item.code === val
      })
      this.extendColInfo.baseColChiName = obj.value
      console.log(this.extendColInfo.baseColChiName)
    },
    getOneAllcols(val) {
      if (val === '01') {
        // 查询初始字段信息、数字型字段列表
        this.queryColsInfo('1')
      }
    },
    getTwoAllcols(val) {
      // 查询初始字段信息、数字型字段列表
      this.queryColsInfo('2')
    },
    queryColsInfo(marketLevel) {
      var data = {}
      data.dataMarket = this.marketTempInfo.dataMarket
      if (marketLevel === '2') {
        data.showArea = this.marketTempInfo.showArea
      }
      getMarketColsInfo(data).then(reponse => {
        const { numberCols, colData } = reponse
        this.colData = colData
        this.relationColsOptions = numberCols
        this.setColDataResult()
      })
    },
    checkTempName(rule, value, callback) {
      var data = {}
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
