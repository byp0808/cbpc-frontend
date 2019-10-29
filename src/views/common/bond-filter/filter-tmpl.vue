<template>
  <div class="margin-top">
    <el-card class="box-card">
      <el-select v-model="tempNo" placeholder="请选择">
        <el-option
          v-for="temp in bondTemps"
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
              <el-button type="primary" :disabled="disabled" @click="toRules">设置</el-button>
              <el-dialog v-if="ruleFilterVisible" width="50%" title="设置规则指标" :visible.sync="ruleFilterVisible" append-to-body>
                <el-card class="box-card margin-top">
                  <el-table
                    :data="othRuleList"
                    style="width: 100%"
                    height="300"
                  >
                    <el-table-column
                      prop="ruleValue"
                      label="指标列表"
                      width="200"
                    />
                    <el-table-column
                      label="操作"
                      width="180"
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="success"
                          icon="el-icon-plus"
                          circle
                          size="small"
                          @click.native.prevent="mvToTags(scope.$index)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
                <el-tag v-for="tag in ruleTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
                  {{ tag.ruleCode }}
                </el-tag>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="ruleFilterVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveRuleList">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <el-table
              :data="ruleList"
              style="width: 100%"
              height="300"
            >
              <el-table-column
                prop="ruleCode"
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
                prop="csin"
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
              <el-input v-model="inputB" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
            </div>
            <el-table
              :data="blackList.filter(data => !inputB || blackList.csin.toLowerCase().includes(inputB.toLowerCase()))"
              style="width: 100%"
              height="300"
              :row-class-name="tableWarningClass"
            >
              <el-table-column
                prop="csin"
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
                prop="csin"
                label="债券名称"
                width="180"
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
import { basic_api_market } from '@/api/base-api.js'
import { upload } from '../../../utils/file-request'
import { addTempList, queryTempList, queryTempInfo, queryBondsAll, queryBondsResult } from '@/api/common/bond-filter-tmpl.js'
export default {
  name: 'TmpBondFilter',
  props: ['filterId', 'disabled'],
  data() {
    return {
      ruleFilterVisible: false,
      // ruleTags: [{id:1,ruleValue:'标签一'}, {id:2,ruleValue:'标签二'},{id:3,ruleValue:'标签三'}],
      ruleTags: [],
      othRuleList: [{ ruleCode: '资产分类', ruleValue: '资产分类' }, { ruleCode: '计息方式', ruleValue: '计息方式' }, { ruleCode: '流通市场', ruleValue: '流通市场' }, { ruleCode: '资产信用评级', ruleValue: '资产信用评级' }, { ruleCode: '起息日', ruleValue: '起息日' }],
      allRuleList: [],
      uploadUrl: `${process.env.VUE_APP_BASE_API}${basic_api_market}/tmpl-filter/batch-in`,
      bondTemps: [],
      tempNo: '',
      blackList: [],
      whiteList: [],
      ruleList: [],
      bondListAll: [],
      bondListResult: [],
      inputB: '',
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
  beforeMount() {
    this.tempList()
    this.loading()
  },
  methods: {
    uploadFile(data) {
      const form = new FormData()
      form.append('attach', data.file)
      upload({
        url: this.uploadUrl,
        data: form
      }).then(response => {
        data.onSuccess(response)
      })
    },
    toRules() {
      // 获取全量规则指标，然后ruleLists中去除rulelist的rulecode部分，去除部分显示在tag里
      this.ruleFilterVisible = true
    },
    delRow(index, rows) {
      rows.splice(index, 1)
    },
    mvToTags(index) {
      this.ruleTags.push(this.othRuleList[index])
      this.othRuleList.splice(index, 1)
    },
    handleClose(tag) {
      this.othRuleList.push(tag)
      this.ruleTags.splice(this.ruleTags.indexOf(tag), 1)
    },
    saveRuleList() {
      this.ruleList = this.ruleTags
      this.ruleFilterVisible = false
    },
    setRuleValue(index, rows) {
      this.$prompt('请输入指标值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: rows[index].ruleValue
      }).then(({ value }) => {
        rows[index].ruleValue = value
        console.log(value)
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
        this.bondTemps = datalist
      })
    },
    applicationTemp() {
      this.$confirm('是否确定应用所选择的模板', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        queryTempInfo(this.tempNo.toString()).then(response => {
          const { tempId, black, white, rules } = response
          this.tempNo = tempId
          this.blackList = black
          this.whiteList = white
          this.ruleList = rules
          this.bondListResult = []
        })
        // this.queryBondsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消应用'
        })
      })
    },
    screenBonds() {
      const data = {
        tempNo: this.tempNo,
        rules: this.ruleList,
        blwls: this.whiteList.concat(this.blackList)
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
        this.tempNo = ''
        this.blackList = []
        this.whiteList = []
        this.ruleList = []
        this.bondListAll = []
        this.bondListResult = []
        this.$message({
          type: 'success',
          message: '清除成功!'
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          })
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
      if (response.data) {
        for (const index in response.data) {
          const bondInfoBlack = response.data[index]
          console.log(bondInfoBlack)
          if (this.bwListCheck(this.whiteList, bondInfoBlack) >= 0) {
            this.$message.error('该券已经添加到白名单中')
            bondInfoBlack.className = 'error-row'
            this.blackList.unshift(bondInfoBlack)
          } else {
            bondInfoBlack.bondSource = '其他'
            // 需要增加csin映射
            bondInfoBlack.csin = bondInfoBlack.bondName
            bondInfoBlack.catelog = 'B'
            this.blackList.push(bondInfoBlack)
          }
        }
      }
    },
    uploadWhiteList(response) {
      if (response.data) {
        for (const index in response.data) {
          const bondInfoWhite = response.data[index]
          if (this.bwListCheck(this.blackList, bondInfoWhite) >= 0) {
            this.$message.error('该券已经添加到黑名单中')
            bondInfoWhite.className = 'error-row'
            this.whiteList.unshift(bondInfoWhite)
          } else {
            // 需要增加csin映射
            bondInfoWhite.csin = bondInfoWhite.bondName
            bondInfoWhite.catelog = 'W'
            this.whiteList.push(bondInfoWhite)
          }
        }
      }
    },
    bwListCheck(dataList, data) {
      return this.$lodash.findIndex(dataList, { csin: data.csin })
    },
    getData(id, tempName) {
      return {
        id: id,
        filterName: tempName,
        blwls: this.$lodash.concat(this.blackList, this.whiteList),
        rules: this.ruleList
      }
    },
    loading() {
      if (this.filterId) {
        queryTempInfo(this.filterId.toString()).then(response => {
          const { tempId, rules, black, white } = response
          this.blackList = black
          this.whiteList = white
          this.ruleList = rules
          // this.bondTemps.tempName = tempName
          this.tempNo = tempId
          // this.screenBonds()
        })
        // this.queryBondsList()
      }
    },
    save(id, tempName) {
      addTempList(this.getData(id, tempName)).then(response => {
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
