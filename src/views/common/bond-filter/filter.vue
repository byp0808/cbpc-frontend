<template>
  <div class="margin-top">
    <el-card class="box-card">
      <!--{{filterId}}-->
      <el-select v-model="bondTempSelect.tempNo" placeholder="请选择">
        <el-option
          v-for="temp in bondTempSelect.bondTemps"
          :key="temp.tempNo"
          :label="temp.tempName"
          :value="temp.tempNo"
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
              />
              <el-table-column
                prop="ruleValue"
                label="规则值"
                width="100"
              />
              <el-table-column
                prop="address"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    @click.native.prevent="setRuleValue(scope.$index, ruleList)"
                  >
                    设置
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    @click.native.prevent="emptyRuleValue(scope.$index, ruleList)"
                  >
                    清空
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card margin-top">
            <div slot="header" class="clearfix card-head">
              <span>筛选结果</span>
              <el-input v-model="input5" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
            </div>
            <el-table
              :data="bondListResult"
              style="width: 100%"
              height="300"
            >
              <el-table-column
                prop="bondName"
                label="债券名称"
                width="280"
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
                    @click.native.prevent="mvToBlackList(scope.$index, bondListResult)"
                  >
                    移入黑名单
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
              <span>黑名单</span>
              <el-upload
                style="float: right;"
                :action="uploadUrl"
                :multiple="false"
                name="attach"
                :on-success="uploadBlackList"
                :show-file-list="false"
              >
                <el-button size="mini" type="primary" :disabled="disabled">批量添加</el-button>
              </el-upload>
              <el-input v-model="input5" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
            </div>
            <el-table
              :data="blackList"
              style="width: 100%"
              height="300"
              :row-class-name="tableWarningClass"
            >
              <el-table-column
                prop="bondName"
                label="债券名称"
                width="180"
              />
              <el-table-column
                prop="bondSource"
                label="来源"
                width="100"
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
                    @click.native.prevent="delRow(scope.$index, blackList)"
                  >
                    移出黑名单
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card margin-top">
            <div slot="header" class="clearfix card-head">
              <span>白名单</span>
              <el-upload
                style="float: right;"
                :action="uploadUrl"
                :multiple="false"
                name="attach"
                :on-success="uploadWhiteList"
                :show-file-list="false"
              >
                <el-button size="mini" type="primary" :disabled="disabled">批量添加</el-button>
              </el-upload>
              <el-input v-model="input5" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
            </div>
            <el-table
              :data="whiteList"
              style="width: 100%"
              height="300"
              :row-class-name="tableWarningClass"
            >
              <el-table-column
                prop="bondName"
                label="债券名称"
                width="280"
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
                    @click.native.prevent="delRow(scope.$index, whiteList)"
                  >
                    移出白名单
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
            <el-input v-model="input5" placeholder="请输入内容" prefix-icon="el-icon-search">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
            <el-table
              :data="bondListAll"
              style="width: 100%"
              height="745"
            >
              <el-table-column
                prop="bondName"
                label="债券名称"
                width="190"
              />
              <el-table-column
                prop="name"
                label="操作"
                width=""
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    @click.native.prevent="mvToWhiteList(scope.$index, bondListAll)"
                  >
                    移入白名单
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    :disabled="disabled"
                    @click.native.prevent="mvToBlackList(scope.$index, bondListAll)"
                  >
                    移入黑名单
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { basic_path } from '@/api/common/common.js'
import { queryTempList, queryTempInfo, queryBondsAll, queryBondsResult, queryFilterInfoById } from '@/api/common/bond-filter.js'
export default {
  name: 'BondFilter',
  props: ['filterId', 'disabled'],
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}${basic_path}/bond-filter/batch-in`,
      bondTempSelect: {
        bondTemps: [],
        tempNo: ''
      },
      blackList: [],
      whiteList: [],
      ruleList: [],
      bondListAll: [],
      bondListResult: [],
      input5: ''
    }
  },
  computed: {
    tableWarningClass() {
      return function({ rowIndex, row }) {
        return row.className
      }
    },
    test() {
      return function(row) {
        return false
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
    delRow(index, rows) {
      rows.splice(index, 1)
    },
    setRuleValue(index, rows) {
      this.$prompt('请输入指标值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: rows[index].ruleValue
      }).then(({ value }) => {
        rows[index].ruleValue = value
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    emptyRuleValue(index, rows) {
      this.$confirm('是否清空指标值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        rows[index].ruleValue = ''
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
      if (!this.bondTempSelect.tempNo) {
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
        queryTempInfo(this.bondTempSelect.tempNo).then(response => {
          const { black, white, rules } = response
          this.blackList = black
          this.whiteList = white
          this.ruleList = rules
          this.bondListResult = []
        })
        this.queryBondsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消应用'
        })
      })
    },
    screenBonds() {
      if (!this.ruleList.length || !this.$lodash.concat(this.whiteList, this.blackList).length) {
        this.$message({
          type: 'warning',
          message: '请选择具体的模板,并应用模板!'
        })
        return false
      }
      const data = {
        tempNo: this.bondTempSelect.tempNo,
        rules: this.ruleList,
        blwls: this.$lodash.concat(this.whiteList, this.blackList)
      }
      queryBondsResult(data).then(response => {
        const { datalist } = response
        this.bondListResult = datalist
      })
    },
    empty() {
      this.$confirm('是否要清除所有条件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.bondTempSelect.tempNo = ''
        this.blackList = []
        this.whiteList = []
        this.ruleList = []
        this.bondListAll = []
        this.bondListResult = []
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
        const { datalist } = response
        this.bondListAll = datalist
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
        bondName: row.bondName,
        bondNo: row.bondNo
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
        bondName: row.bondName,
        bondNo: row.bondNo
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
      if (response.data && response.data.datalist) {
        for (const index in response.data.datalist) {
          const bondInfoBlack = response.data.datalist[index]
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
      if (response.data && response.data.datalist) {
        for (const index in response.data.datalist) {
          const bondInfoWhite = response.data.datalist[index]
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
      return this.$lodash.findIndex(dataList, { bondNo: data.bondNo })
    },
    getData() {
      return {
        tempNo: this.bondTempSelect.tempNo,
        blwls: this.$lodash.concat(this.blackList, this.whiteList),
        rules: this.ruleList
      }
    },
    loading() {
      if (this.filterId) {
        queryFilterInfoById(this.filterId).then(response => {
          const { black, white, rules, tempNo } = response
          this.blackList = black
          this.whiteList = white
          this.ruleList = rules
          this.bondTempSelect.tempNo = tempNo

          this.screenBonds()
        })
        this.queryBondsList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-head{
  height: 28px;
  line: {
    height: 28px;
  };
}
.margin-top {
  margin:{
    top: 10px;
  };
}
.el-card.is-always-shadow {
  box-shadow: unset;
  -webkit-box-shadow: unset;
}
</style>
