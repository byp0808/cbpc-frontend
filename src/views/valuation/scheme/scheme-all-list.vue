<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-row>
        <el-col :span="11">
          <el-button type="primary" @click="allotTask">任务分配</el-button>
          <el-button type="primary">任务认领</el-button>
          <el-button type="primary" @click="addBondsNonp">添加不估值</el-button>
          <el-button icon="el-icon-refresh" @click="refresh" />
        </el-col>
        <el-col :span="11" :offset="2" class="scroll-box">
          <el-input v-model="bondId" placeholder="输入资产根码后添加任务" style="width:200px" />
          <el-button type="primary">添加任务</el-button>
          <el-button type="primary" @click="batchAddTask">批量添加</el-button>
          <el-button type="primary" @click="uploadScheme">上传估值方案</el-button>
          <el-button type="primary">下载估值方案</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="assset">资产列表</div>
    <el-tabs v-model="activeElement" @tab-click="handleSelect">
      <!-- <el-tab-pane label="正常" name="normal" />
      <el-tab-pane label="违约" name="obey" />
      <el-tab-pane label="特殊" name="especical" />
      <el-tab-pane label="人工上传" name="upload" /> -->
      <el-tab-pane v-for="item in tabList" :key="item.scene" :label="tabName(item.scene)" :name="item.scene" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeElement === '01' || activeElement === '02' || activeElement === '03'" v-loading="tabLoading">
        <asset-list :all-list="allList" />
        <el-pagination
          style="margin-top:20px"
          align="center"
          :current-page="params.page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.page.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="activeElement === '04'" v-loading="tabLoading">
        <people-upload :all-list="uploadList" />
        <el-pagination
          align="center"
          :current-page="params.page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.page.totalRecord"
          style="margin-top:20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </transition>
    <el-dialog :visible.sync="allocationDialog" title="任务分配">
      <div>
        <el-form style="margin-left:50px">
          <el-form-item label="任务分配人">
            <el-select v-model="peopleName" filterable clearable placeholder="请选择任务分配人" @visible-change="nameChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="15">
            <div class="dialog-footer">
              <el-button @click="allocationDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveName">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="noValuationDialog" title="添加不估值">
      <div>
        <el-date-picker v-model="valuation.starTime" type="date" placeholder="请选择开始日期" />
        <el-date-picker v-model="valuation.endTime" type="date" placeholder="请结束开始日期" style="margin-left:20px" />
        <el-row style="margin-top:30px">
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="noValuationDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveName">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="volumeAddDialog" title="批量添加任务">
      <div>
        <el-form style="margin-left:50px">
          <el-form-item label="选择批次">
            <el-select v-model="volumeAdd.batch" filterable clearable placeholder="请选择批次" @change="batchChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              class="upload-demo"
              drag
              :on-exceed="handleExceed"
              :http-request="memSuccess"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="选择调整原因">
            <el-select v-model="volumeAdd.season" filterable clearable placeholder="请选择批次" @change="batchChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="volumeAddDialog = false">取 消</el-button>
              <el-button v-loading="fileLoading" type="primary" @click="saveBatch">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadMethodDialog" title="估值方案上传">
      <div>
        <el-form style="margin-left:50px">
          <el-form-item label="选择批次">
            <el-select v-model="upLoadValution.batch" filterable clearable placeholder="请选择批次" @change="batchChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              class="upload-demo"
              drag
              :on-exceed="handleExceed1"
              :http-request="memSuccess1"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="uploadMethodDialog = false">取 消</el-button>
              <el-button v-loading="methodUpload" type="primary" @click="saveValuation">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AssetList from '@/views/valuation/scheme/asset-list.vue'
import PeopleUpload from '@/views/valuation/scheme/people-upload.vue'
import { getAllTableList } from '@/api/valuation/task.js'
export default {
  name: 'SchemeAllList',
  components: {
    AssetList,
    PeopleUpload
  },
  data() {
    return {
      activeElement: '01',
      allocationDialog: false,
      noValuationDialog: false,
      volumeAddDialog: false,
      uploadMethodDialog: false,
      tabLoading: false,
      fileLoading: false,
      methodUpload: false,
      peopleName: '',
      allList: [],
      uploadList: [],
      tabList: [
        // {
        //   label: '正常',
        //   scene: '01'
        // }, {
        //   label: '违约',
        //   scene: '02'
        // }, {
        //   label: '特殊',
        //   scene: '03'
        // }, {
        //   label: '人工上传',
        //   scene: '04'
        // }
      ],
      valuation: {
        starTime: '',
        endTime: ''
      },
      volumeAdd: {
        season: '其他',
        batch: '',
        excelFile: ''
      },
      upLoadValution: {
        batch: '',
        excelFile1: ''
      },
      nameList: [
        {
          name: '美术课件',
          value: '1'
        }
      ],
      bondId: '',
      valuationAllTask: [],
      valuationMyTask: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        },
        tab: '01',
        scene: '01'
      }
    }
  },
  created() {
    this.loadTable_all()
    getAllTableList({ tab: '01' }).then(res => {
      this.tabList = res
    })
  },
  methods: {
    loadTable_all() {
      this.tabLoading = true
      getAllTableList(this.params).then(res => {
        this.tabLoading = false
        this.allList = res[0].datalist
        this.uploadList = res[0].manualList
        this.params.page = res[0].page
        console.log('res', res[0])
      }).catch(error => {
        console.log(error)
        this.tabLoading = false
      })
    },
    tabName(param) {
      switch (param) {
        case '01': return '正常'
        case '02': return '违约'
        case '03': return '特殊'
        case '04': return '人工上传'
      }
    },
    refresh() {
      this.loadTable_all()
    },
    handleSelect(e) {
      this.params.scene = e.name
      this.loadTable_all()
    },
    nameChange() {

    },
    batchChange(e) {
      console.log('er', e)
    },
    saveBatch() {

    },
    saveValuation() {

    },
    handleExceed() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    memSuccess(item) {
      console.log('item', item)
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.volumeAdd.excelFile = item.file
    },
    memSuccess1(item) {
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.upLoadValution.excelFile = item.file
    },
    handleExceed1() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    allotTask() {
      this.allocationDialog = true
    },
    saveName() {

    },
    claimTask: function() {

    },
    addBondsNonp() {
      this.valuation.starTime = new Date()
      this.noValuationDialog = true
    },
    addTask: function() {

    },
    batchAddTask() {
      this.volumeAddDialog = true
    },
    uploadScheme() {
      this.uploadMethodDialog = true
    },
    downloadScheme: function() {

    },
    schemeAdjust: function() {

    },
    batchAdjust: function() {

    },
    taskBack: function() {

    },
    taskCommit: function() {

    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.loadTable_all()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.loadTable_all()
    }
  }
}
</script>
<style lang="scss" scoped>
 .scroll-box {
     white-space: nowrap;
     overflow-x: scroll;
     height: 60px;
 }
 .assset {
     font-weight: 700;
     font-size: 16px;
 }
</style>
