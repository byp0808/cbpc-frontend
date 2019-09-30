<template>
  <div class="dashboard-container">
    <el-row :gutter="1" style="height: 1000px">
      <el-col :span="6">
        <el-card class="box-card margin-top calendar-job">
          <el-form ref="MarketTempForm" :model="marketTempInfo" :rules="tempInfoRules">
            <el-form-item label="行情展示模板名称" class="blackItem">
              <el-input v-model="marketTempInfo.tempName" :disabled="false" size="mini" />
            </el-form-item>
            <el-form-item label="备注" class="blackItem">
              <el-input v-model="marketTempInfo.remark" :disabled="false" type="textarea" />
            </el-form-item>
            <el-form-item label="数据行情" class="blackItem">
              <el-select v-model="marketTempInfo.dataMarket" value-key="value" style="width:160px">
                <el-option v-for="item in dataMarketOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="展示区域" class="blackItem">
              <el-select v-model="marketTempInfo.showArea" value-key="value" style="width:160px">
                <el-option v-for="item in showAreaOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
            <el-form-item label="最后操作人" class="blackItem">
              <el-input v-model="marketTempInfo.lastUpdBy" disabled style="width:145px" size="mini" />
            </el-form-item>
            <el-form-item label="最后操作时间" class="blackItem">
              <el-input v-model="marketTempInfo.lastUpdTs" disabled style="width:130px" size="mini" />
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
                    v-if="checkColType(scope.row.colType)"
                    type="text"
                    size="small"
                    @click.native.prevent="alterCol(scope.$index, scope.row)"
                  >
                    调整
                  </el-button>
                  <el-button
                    v-if="checkColType(scope.row.colType)"
                    type="text"
                    size="small"
                    @click.native.prevent="deleteCol(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="showFlag"
                label="展示"
                sortable
                width="80"
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.showFlag" v-bind="{'checked': scope.row.showFlag? true : false}" @change="checkedShow(scope.$index, scope.row.showFlag)" />
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
                    :disabled="scope.$index===0"
                    @click="moveUp(scope.$index,scope.row)"
                  ><i class="el-icon-arrow-up" />
                  </el-button>
                  <el-button
                    size="mini"
                    :disabled="scope.$index===(colData.length-1)"
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
                    <el-input v-model="extendColInfo.colChiName" :disabled="false" size="mini" style="width:180px" />
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="extendColInfo.baseCol" size="mini" value-key="code" style="width:150px">
                      <el-option v-for="item in baseColsOptions" :key="item.code" :label="item.value" :value="item.code" />
                    </el-select>&emsp;&emsp;&emsp;
                    <el-select v-model="extendColInfo.operType" value-key="value" size="mini" style="width:150px">
                      <el-option v-for="item in operTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="extendColInfo.computeExp" type="textarea" :disabled="false" rows="3" style="width:350px" />
                  </el-form-item>
                  <el-form-item label="添加至" class="blackItem">&emsp;&emsp;
                    <el-select v-model="extendColInfo.colType" value-key="value" size="mini" style="width:160px">
                      <el-option v-for="item in colTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<el-button type="primary" style="width:200px" @click="addtempcol">确认添加</el-button>
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
            >
              <el-table-column
                prop="colChiName"
                label="字段"
                show-overflow-tooltip
                width="300"
              />
            </el-table>
          </el-row>
          <br><br><br>
          <el-row>
            &emsp;&emsp;<el-button type="primary" style="width: 100px" size="mini">保存模板</el-button>
            &emsp;&emsp;<el-button type="primary" style="width: 80px" size="mini">取消</el-button>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { optioins } from '@/api/curve/code-type.js'

export default {
  name: 'MarketTempForm',
  components: {},
  props: ['businessId', 'disabled'],
  data() {
    return {
      tempInfoRules: {
      },
      extendColInfo: {},
      colData: [],
      colDataResult: [],
      multipleSelection: [],
      baseColsOptions: [
        {
          code: 'ZQDM',
          value: '债券代码'
        },
        {
          code: 'ZQJC',
          value: '债券简称'
        }
      ]
    }
  },
  computed: {
    dataMarketOptions() {
      return optioins(this, 'DATA_MARKET')
    },
    showAreaOptions() {
      return optioins(this, 'SHOW_AREA')
    },
    operTypeOptions() {
      // console.log(optioins(this, 'OPER_TYPE'))
      return optioins(this, 'OPER_TYPE')
    },
    colTypeOptions() {
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
      console.log('1111')
    }
  },
  mounted() {
  },
  methods: {
    save(formName) {
      this.$refs.MarketTempForm.validate((valid) => {
        if (valid) {
          console.log('1111')
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
      console.log(this.extendColInfo.index)
      if (this.extendColInfo.index != null) {
        var index = this.extendColInfo.index
        var that = this
        that.colData[index].colChiName = this.extendColInfo.colChiName
        that.colData[index].colType = this.extendColInfo.colType
        that.colData[index].baseCol = this.extendColInfo.baseCol
        that.colData[index].operType = this.extendColInfo.operType
        that.colData[index].computeExp = this.extendColInfo.computeExp
        console.log(that.colData[index])
        this.extendColInfo.index = null
      } else {
        this.colData.push({
          colChiName: this.extendColInfo.colChiName,
          showFlag: true,
          colType: this.extendColInfo.colType,
          baseCol: this.extendColInfo.baseCol,
          operType: this.extendColInfo.operType,
          computeExp: this.extendColInfo.computeExp
        })
        this.colDataResult.push({
          colChiName: this.extendColInfo.colChiName,
          showFlag: true,
          colType: this.extendColInfo.colType,
          baseCol: this.extendColInfo.baseCol,
          operType: this.extendColInfo.operType,
          computeExp: this.extendColInfo.computeExp
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
        console.log(this.colData)
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
      that.extendColInfo.colChiName = row.colChiName
      that.extendColInfo.baseCol = row.baseCol
      that.extendColInfo.operType = row.operType
      that.extendColInfo.computeExp = row.computeExp
      that.extendColInfo.colType = row.colType
      that.extendColInfo.index = index
      console.log(that.extendColInfo)
    },
    deleteCol(index) {
      console.log(index)
      var that = this
      that.colData.splice(index, 1)
      this.setColDataResult()
    },
    checkColType(colType) {
      // console.log(colType)
      if (colType === '01') {
        return false
      }
      return true
    },
    checkedShow: function(index, showFlag) {
      // console.log(index, showFlag)
      var that = this
      if (!showFlag) {
        that.colDataResult.splice(index, 1)
        that.colData[index].showFlag = false
      } else {
        that.colDataResult.splice(index, 0, this.colData[index])
        that.colData[index].showFlag = true
        // console.log(showFlag)
      }
      // console.log(this.colData[index].showFlag)
    },
    setColDataResult() {
      // 结果预览
      var that = this
      that.colDataResult = []
      var j = 0
      for (var i = 0; i < that.colData.length; i++) {
        if (that.colData[i].showFlag) {
          // console.log(that.colData[i])
          that.colDataResult[j] = that.colData[i]
          j++
        }
      }
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
