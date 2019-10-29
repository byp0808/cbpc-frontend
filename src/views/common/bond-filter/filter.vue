<template>
  <div class="margin-top">
    <el-card class="box-card">
      <!--{{filterId}}-->
      <el-select v-model="bondTempSelect.tempId" placeholder="请选择" :disabled="disabled">
        <el-option
          v-for="temp in bondTempSelect.bondTemps"
          :key="temp.tempId"
          :label="temp.tempName"
          :value="temp.tempId"
        />
      </el-select>
      <el-button type="primary" :disabled="disabled" @click="applicationTemp">应用模板</el-button>
      <el-button type="primary" :disabled="disabled" @click="screenBonds">债券筛选</el-button>
      <el-button type="danger" :disabled="disabled" @click="empty">清空所有条件</el-button>
    </el-card>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-card class="box-card margin-top">
            <div slot="header" class="clearfix card-head">
              <span>规则指标</span>
            </div>
            <el-table
              :data="ruleList"
              style="width: 100%"
              height="300"
            >
              <el-table-column
                prop="ruleName"
                label="规则指标"
                width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="ruleValue"
                label="规则值"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-for="(value,key) in scope.row.ruleValue" :key="key">{{ interestList[value] + ";" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    title="设置"
                    @click.native.prevent="setRuleValue(scope.$index, ruleList)"
                  >
                    <svg-icon icon-class="set" />
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    title="清空"
                    @click.native.prevent="emptyRuleValue(scope.$index, ruleList)"
                  >
                    <svg-icon style="color:red;" icon-class="clear" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card margin-top">
            <div slot="header" class="clearfix card-head">
              <span>筛选结果<span class="text-smaller text-placeholder">共{{ bondListResult.length }}条</span></span>
              <el-input v-model="filterResult" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px" :disabled="disabled">
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
            </div>
            <el-table
              :data="bondListResult"
              style="width: 100%"
              fit
              height="300"
              :row-class-name="tableWarningClass"
            >
              <el-table-column
                prop="valAssetShortName"
                label="债券名称"
                show-overflow-tooltip
                width="250"
              />
              <el-table-column
                prop="name"
                label="操作"
                width="70"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    :disabled="disabled"
                    title="加入黑名单"
                    @click.native.prevent="mvToBlackList(scope.$index, bondListResult)"
                  >
                    <svg-icon style="color: red" icon-class="black" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card margin-top">
            <div slot="header" class="clearfix card-head">
              <div>黑名单</div>
              <div class="input-box">
                <el-input v-model="blacklist" placeholder="请输入内容" size="mini" :disabled="disabled">
                  <el-button slot="append" icon="el-icon-search" />
                </el-input>
              </div>
              <div>
                <el-upload
                  :multiple="false"
                  action=""
                  name="attach"
                  :on-success="uploadBlackList"
                  :show-file-list="false"
                  :http-request="upload"
                >
                  <el-button size="mini" type="primary" :disabled="disabled">批量添加</el-button>
                </el-upload>
              </div>
              <!-- <el-input v-model="input5" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input> -->
            </div>
            <el-table
              :data="blackList"
              style="width: 100%"
              height="300"
              fit
              :row-class-name="tableWarningClass"
            >
              <el-table-column
                prop="bondName"
                label="债券名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.bondName">{{ scope.row.bondName }}</span>
                  <span v-else>{{ scope.row.bondName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="bondSource"
                label="来源"
                show-overflow-tooltip
              >
                <template slot="header">
                  <span>来源</span>
                  <el-tooltip class="item" effect="dark" content="筛选结果300个,其他5000个" placement="right">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="操作"
                width="65"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    title="移出黑名单"
                    @click.native.prevent="delRow(scope.$index, blackList)"
                  >
                    <svg-icon style="color:red;" icon-class="remove" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card margin-top">
            <div slot="header" class="clearfix card-head">
              <div>白名单</div>
              <div class="input-box">
                <el-input v-model="whitelist" placeholder="请输入内容" size="mini" :disabled="disabled">
                  <el-button slot="append" icon="el-icon-search" />
                </el-input>
              </div>
              <div>
                <el-upload
                  action=""
                  :multiple="false"
                  name="attach"
                  :http-request="upload"
                  :on-success="uploadWhiteList"
                  :show-file-list="false"
                >
                  <el-button size="mini" type="primary" :disabled="disabled">批量添加</el-button>
                </el-upload>
              </div>
              <!-- <el-input v-model="input5" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input> -->
            </div>
            <el-table
              :data="whiteList"
              style="width: 100%"
              height="300"
              fit
              :row-class-name="tableWarningClass"
            >
              <el-table-column
                prop="bondName"
                show-overflow-tooltip
                label="债券名称"
              />
              <el-table-column
                prop="name"
                label="操作"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    title="移出白名单"
                    @click.native.prevent="delRow(scope.$index, whiteList)"
                  >
                    <svg-icon style="color:red;" icon-class="remove" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card margin-top">
            <el-input v-model="input5" placeholder="请输入内容" prefix-icon="el-icon-search" :disabled="disabled">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
            <el-table
              :data="bondListAll"
              style="width: 100%"
              height="745"
            >
              <el-table-column
                prop="valAssetShortName"
                label="债券名称"
                show-overflow-tooltip
                width="250"
              />
              <el-table-column
                prop="name"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    title="加入白名单"
                    @click.native.prevent="mvToWhiteList(scope.$index, bondListAll)"
                  >
                    <svg-icon icon-class="white" />
                  </el-button>
                  <el-button
                    type="text"
                    :disabled="disabled"
                    title="加入黑名单"
                    @click.native.prevent="mvToBlackList(scope.$index, bondListAll)"
                  >
                    <svg-icon style="color:red;" icon-class="black" />
                    <!--                    移入黑名单-->
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog append-to-body :visible.sync="setRuleDialog">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-input v-model="setRuleData" prefix-icon="el-icon-search" clearable @change="search" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <div class="checkBox-big">
            <el-checkbox-group v-model="interest" @change="haveSelect">
              <el-checkbox v-for="(value, index) in interestList" :key="index" :label="index">{{ value }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <div class="line" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-tag v-for="item in selectionList" :key="item" style="margin-right:10px">{{ interestList[item] }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="17">
          <div class="dialog-footer">
            <el-button @click="setRuleDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveRules">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { basic_api_market } from '@/api/base-api.js'
import { queryTempList, queryTempInfo, queryBondsAll, queryBondsResult, queryFilterInfoById, checkRepeat, queryFilterIndex } from '@/api/common/bond-filter.js'
import { upload } from '../../../utils/file-request'

export default {
  name: 'BondFilter',
  // props: ['filterId', 'disabled'],
  props: {
    filterId: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadUrl: `${basic_api_market}/bond-filter/batch-in`,
      bondTempSelect: {
        bondTemps: [],
        tempId: ''
      },
      blackList: [],
      whiteList: [],
      interest: [],
      setRuleData: '',
      // interestList: ['上海', '北京', '广州', '深圳'],
      interestList: {
        '1': '码值1',
        '2': '码值2',
        '3': '码值3',
        '4': '码值4'
      },
      selectionList: [],
      ruleList: [],
      bondListAll: [],
      bondListResult: [],
      setRuleDialog: false,
      editRuleIndex: '',
      filterResult: '', // 筛选结果
      blacklist: '', // 黑名单
      whitelist: '', // 白名单
      input5: ''
    }
  },
  computed: {
    tableWarningClass() {
      return function({ rowIndex, row }) {
        return row.className
      }
    }
  },
  watch: {
    filterId(o, n) {
      if (o) {
        this.loading()
      }
    }
  },
  beforeMount() {
    this.tempList()
    this.loading()
  },
  methods: {
    upload(data) {
      const form = new FormData()
      form.append('attach', data.file)
      upload({
        url: this.uploadUrl,
        data: form
      }).then(response => {
        data.onSuccess(response)
      })
    },
    haveSelect(e) {
      this.selectionList = e
    },
    search() {

    },
    saveRules() {
      let e = ''
      const that = this
      this.ruleList[this.editRuleIndex].ruleValue = this.selectionList
      this.$lodash(this.selectionList).forEach(function(value, key) {
        e += "'" + value + "' eq #x"
        if (key < that.selectionList.length - 1) {
          e += ' || '
        }
      })
      console.log(e)
      this.ruleList[this.editRuleIndex].ruleValueE = e
      this.setRuleDialog = false
    },
    delRow(index, rows) {
      rows.splice(index, 1)
    },
    setRuleValue(index, rows) {
      this.editRuleIndex = index
      this.setRuleDialog = true
    },
    emptyRuleValue(index, rows) {
      this.$confirm('是否清空指标值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        rows[index].ruleValue = ''
        rows[index].ruleValueE = ''
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '清空取消'
        })
      })
    },
    tempList() {
      queryTempList().then(response => {
        const { datalist } = response
        this.bondTempSelect.bondTemps = datalist
      })
    },
    applicationTemp() {
      if (!this.bondTempSelect.tempId) {
        this.$message({
          type: 'warning',
          message: '请选择具体的模板!'
        })
        return false
      }
      this.$confirm('是否确定应用所选择的模板', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.queryBondsList()
        queryFilterIndex({ paraType: 'BONND_FILTER_INDEX' }).then(response => {
          const ruleList = []
          this.$lodash(response).forEach(function(value, index) {
            ruleList.push({
              ruleCode: value.paraName,
              ruleName: value.paraValue,
              ruleValue: '',
              ruleValueE: ''
            })
          })
          this.ruleList = ruleList
        })
        queryTempInfo(this.bondTempSelect.tempId).then(response => {
          // const { black, white } = response
          // this.blackList = black
          // this.whiteList = white
          this.bondListResult = []
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消应用'
        })
      })
    },
    screenBonds() {
      const that = this
      if (!this.ruleList && this.ruleList.length === 0 && !this.$lodash.concat(this.whiteList, this.blackList).length) {
        this.$message({
          type: 'warning',
          message: '请选择具体的模板,并应用模板!'
        })
        return false
      }
      const rules = this.$lodash.clone(this.ruleList)
      this.$lodash(rules).forEach(function(rule, index) {
        if (rule.ruleValue && rule.ruleValue instanceof Array) {
          rule.ruleValue = that.$lodash.join(rule.ruleValue, [';'])
        }
      })
      const data = {
        tempId: this.bondTempSelect.tempId,
        rules: rules,
        blwls: this.$lodash.concat(this.whiteList, this.blackList)
      }
      queryBondsResult(data).then(response => {
        const { dataList } = response
        this.bondListResult = dataList
      })
    },
    empty() {
      this.$confirm('是否要清除所有条件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.bondTempSelect.tempId = ''
        this.blacklist = ''
        this.blackList = []
        this.whitelist = ''
        this.whiteList = []
        this.ruleList = []
        this.bondListAll = []
        this.bondListResult = []
        this.filterResult = ''
        this.input5 = ''
        this.$message({
          type: 'success',
          message: '清除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除'
        })
      })
    },
    queryBondsList() {
      queryBondsAll().then(response => {
        // const { dataList } = response
        this.bondListAll = response
      })
    },
    mvToBlackList(index, rows) {
      const row = rows[index]
      if (this.bwListCheck(this.blackList, row) >= 0) {
        this.$message({
          showClose: true,
          message: '该债券已经在黑名单中了,不要重复添加哦！！！',
          type: 'warning'
        })
        return false
      }
      const blackInfo = {
        bondSource: '其他',
        bondName: row.valAssetShortName,
        csin: row.csin,
        marketId: row.exchng,
        catelog: 'B'
      }
      if (this.bwListCheck(this.whiteList, row) >= 0) {
        this.$message({
          showClose: true,
          message: '该债券已经在白名单中了哦！！！请处理',
          type: 'error'
        })
        blackInfo.className = 'error-row'
        this.blackList.unshift(blackInfo)
      } else {
        this.blackList.push(blackInfo)
      }
    },
    mvToWhiteList(index, rows) {
      const row = rows[index]
      if (this.bwListCheck(this.whiteList, row) >= 0) {
        this.$message({
          showClose: true,
          message: '该债券已经在白名单中了,请不要重复添加哦！！！',
          type: 'warning'
        })
        return false
      }
      const whiteInfo = {
        bondSource: '其他',
        bondName: row.valAssetShortName,
        csin: row.csin,
        marketId: row.exchng,
        catelog: 'W'
      }
      if (this.bwListCheck(this.blackList, row) >= 0) {
        this.$message({
          showClose: true,
          message: '该债券已经在黑名单中了哦！！！',
          type: 'error'
        })
        whiteInfo.className = 'error-row'
        this.whiteList.unshift(whiteInfo)
      } else {
        this.whiteList.push(whiteInfo)
      }
    },
    uploadBlackList(response) {
      const that = this
      if (response) {
        for (const index in response) {
          const bondInfoBlack = response[index]
          if (this.bwListCheck(that.whiteList, bondInfoBlack) >= 0) {
            this.$message.error('该券已经添加到白名单中')
            bondInfoBlack.className = 'error-row'
            this.blackList.unshift(bondInfoBlack)
          } else {
            this.blackList.push(bondInfoBlack)
          }
        }
      }
    },
    uploadWhiteList(response) {
      const that = this
      if (response) {
        for (const index in response) {
          const bondInfoWhite = response[index]
          if (this.bwListCheck(that.blackList, bondInfoWhite) >= 0) {
            this.$message.error('该券已经添加到黑名单中')
            bondInfoWhite.className = 'error-row'
            this.whiteList.unshift(bondInfoWhite)
          } else {
            this.whiteList.push(bondInfoWhite)
          }
        }
      }
    },
    bwListCheck(dataList, data) {
      return this.$lodash.findIndex(dataList, { csin: data.csin, marketId: data.exchng })
    },
    getData(busiCode) {
      const that = this
      const rules = this.$lodash.clone(this.ruleList)
      this.$lodash(rules).forEach(function(rule, index) {
        if (rule.ruleValue instanceof Array) {
          rule.ruleValue = that.$lodash.join(rule.ruleValue, [';'])
        }
      })
      const data = {
        tempId: this.bondTempSelect.tempId,
        blwls: this.$lodash.concat(this.blackList, this.whiteList),
        rules: rules,
        filterApiScnCode: busiCode
      }
      if ((data.rules || data.rules.length === 0) && (!data.blwls || data.blwls.length === 0)) {
        this.$message.error('您还未选择任何筛选条件,请先选择筛选条件')
        return false
      }
      return new Promise((resolve, reject) => {
        if (!this.check()) {
          this.$message.error('您有债券同时存在于黑白名单列表中请检查')
          return false
        }
        checkRepeat(data).then(response => {
          if (response && response.length > 0) {
            this.$message.error('债券已经存在其他同业务筛选器范围中')
            this.$lodash(response).forEach(function(value, key) {
              const index = that.$lodash.findIndex(that.bondListResult, { csin: value.csin, marketId: value.marketId })
              if (index >= 0) {
                that.bondListResult[index].className = 'error-row'
              }
            })
            resolve(false)
          } else {
            resolve(data)
          }
        })
      })
    },
    loading() {
      if (this.filterId) {
        queryFilterInfoById(this.filterId).then(response => {
          const { black, white, rules, tempId } = response
          this.blackList = black
          this.whiteList = white
          this.ruleList = rules
          this.bondTempSelect.tempId = tempId

          this.screenBonds()
        })
        this.queryBondsList()
      }
    },
    check() {
      const that = this
      let flag = true
      this.$lodash(this.whiteList).forEach(function(value, key) {
        if (that.bwListCheck(that.blackList, value) >= 0) {
          flag = false
        }
      })
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
// .card-head{
//   height: 28px;
//   line: {
//     height: 28px;
//   }
// }
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .input-box {
    width: 170px;
  }
}
.el-card.is-always-shadow {
  box-shadow: unset;
  -webkit-box-shadow: unset;
}
.line {
  height: 2px;
  background: #ccc;
  margin: 40px 0 20px 0;
}
</style>
<style lang="scss">
.checkBox-big {
  margin-top:30px;
  border:1px solid #ccc;
  padding:20px;
.el-checkbox {
  width:100%;
  padding:10px 0;
}
.el-checkbox__label {
  padding-left:50%;
}
}
</style>
