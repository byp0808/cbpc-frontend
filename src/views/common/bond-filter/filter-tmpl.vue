<template>
  <div class="margin-top">
    <el-card class="box-card">
      <div>
        <span>模板名称</span>
        <el-input v-model="tempName" :disabled="disabled" placeholder="请输入模板名称" class="" style="width:150px;" @change="inputChange" />
        <el-button type="primary" :disabled="disabled" @click="screenBonds">债券筛选</el-button>
        <el-button type="danger" :disabled="disabled" @click="empty">清空所有条件</el-button>
      </div>
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
                    <el-table-column prop="paraValue" label="指标列表" idth="200" show-overflow-tooltip />
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
                <el-tag v-for="tag in ruleTags" :key="tag.paraName" closable :disable-transitions="false" @close="handleClose(tag)">
                  {{ tag.paraValue }}
                </el-tag>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="ruleFilterVisible = false">取 消</el-button>
                  <el-button @click="ruleFilterVisible = false">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <el-table
              :data="ruleList"
              style="width: 100%"
              height="300"
            >
              <el-table-column prop="ruleCode" label="规则指标" width="180">
                <template slot-scope="scope">
                  {{ getRuleName(scope.row.ruleCode) }}
                </template>
              </el-table-column>
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
                  <el-dialog v-if="ruleValueSetVisible" width="30%" title="设置规则值" :visible.sync="ruleValueSetVisible" append-to-body>
                    <div>{{ getRuleName(ruleCode) }}</div>
                    <el-select v-model="ruleValue" placeholder="请选择">
                      <el-option
                        v-for="temp in ruleValueList"
                        :key="temp.ruleCode"
                        :label="temp.ruleValue"
                        :value="temp.ruleValue"
                      />
                    </el-select>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="ruleValueSetVisible = false">取 消</el-button>
                      <el-button type="primary" @click="saveRuleValue(ruleCode,ruleValue)">确 定</el-button>
                    </div>
                  </el-dialog>
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
              <el-input v-model="input" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
            </div>
            <el-table
              :data="bondListResult.filter(data => !input || bondListResult.csin.toLowerCase().includes(input.toLowerCase()))"
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
              <el-input v-model="inputW" placeholder="请输入内容" size="mini" class="" style="width:200px;float: right;margin-right: 10px">
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
            </div>
            <el-table
              :data="whiteList.filter(data => !inputW || whiteList.csin.toLowerCase().includes(inputW.toLowerCase()))"
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
            <el-input v-model="inputBond" placeholder="请输入内容" prefix-icon="el-icon-search">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
            <el-table
              :data="bondListAll.filter(data => !inputBond || bondListAll.bondName.toLowerCase().includes(inputBond.toLowerCase()))"
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
import { getStandard } from '@/api/valuation/prod.js'
export default {
  name: 'TmpBondFilter',
  props: ['filterId', 'disabled'],
  data() {
    return {
      ruleFilterVisible: false,
      ruleValueSetVisible: false,
      ruleTags: [],
      othRuleList: [],
      ruleListAll: [],
      uploadUrl: `${process.env.VUE_APP_BASE_API}${basic_api_market}/tmpl-filter/batch-in`,
      bondTemps: [],
      tempName: '',
      ruleCode: '',
      ruleValue: '',
      blackList: [],
      whiteList: [],
      ruleList: [],
      bondListAll: [],
      bondListResult: [],
      ruleValueList: [{ ruleCode: '01', ruleValue: 'AAA' }, { ruleCode: '02', ruleValue: 'BBB' }, { ruleCode: '03', ruleValue: 'CCC' }],
      remark: '',
      inputB: '',
      inputW: '',
      inputBond: '',
      input: ''
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
    this.getAllParas()
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
    getAllParas() {
      getStandard({ paraType: 'BONND_FILTER_INDEX' }).then(response => {
        const { paraName } = response
        console.log('paraName' + paraName)
        this.ruleListAll = response
        this.othRuleList = JSON.parse(JSON.stringify(this.ruleListAll))
      })
    },
    toRules() {
      // 获取全量规则指标，然后ruleLists中去除rulelist的rulecode部分，去除部分显示在tag里
      this.ruleFilterVisible = true
      this.exclude()
    },
    exclude() {
      for (const key in this.ruleList) {
        const index = this.$lodash.findIndex(this.othRuleList, { paraName: this.ruleList[key].ruleCode })
        if (index >= 0) {
          console.log(this.othRuleList[index])
          this.ruleTags.push(this.othRuleList[index])
          console.log('index!!!!')
          this.othRuleList.splice(index, 1)
        }
        console.log('index-1')
      }
    },
    getRuleName(ruleCode) {
      const index = this.$lodash.findIndex(this.ruleListAll, { paraName: ruleCode })
      return this.ruleListAll[index].paraValue
    },
    delRow(index, rows) {
      rows.splice(index, 1)
    },
    mvToTags(index) {
      const index2 = this.$lodash.findIndex(this.ruleTags, { ruleCode: this.othRuleList[index].paraName })
      if (index2 > 0) {
        console.log('error')
      }
      this.ruleTags.push(this.othRuleList[index])
      const rule = { ruleCode: this.othRuleList[index].paraName, ruleType: this.othRuleList[index].paraValue1 }
      this.ruleList.push(rule)
      this.othRuleList.splice(index, 1)
    },
    handleClose(tag) {
      this.othRuleList.push(tag)
      this.ruleTags.splice(this.ruleTags.indexOf(tag), 1)
      const index = this.$lodash.findIndex(this.ruleList, { ruleCode: tag.paraName })
      if (index < 0) {
        console.log('handleClose:' + tag.paraName)
      } else {
        this.ruleList.splice(index, 1)
      }
    },
    saveRuleValue(key, value) {
      // this.ruleList = this.ruleTags
      this.ruleValueSetVisible = false
      const index = this.$lodash.findIndex(this.ruleList, { ruleCode: key })
      if (index < 0) {
        console.log('ERROR:saveRuleValue:' + key)
      } else {
        this.ruleList[index].ruleValue = value
      }
    },
    setRuleValue(index, rows) {
      console.log('setRuleValue:' + index)
      this.ruleValueSetVisible = true
      this.ruleCode = this.ruleList[index].ruleCode
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
    screenBonds() {
      const data = {
        tempName: this.tempName,
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
        // this.tempName = ''
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
          const { tempName, rules, black, white } = response
          this.blackList = black
          this.whiteList = white
          this.ruleList = rules
          // this.bondTemps.tempName = tempName
          this.tempName = tempName
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
    },
    inputChange() {
      this.$emit('childFn', this.tempName)
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
