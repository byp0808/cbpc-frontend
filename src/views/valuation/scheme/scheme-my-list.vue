<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-row>
        <el-col :span="11" class="scroll-box">
          <el-button type="primary">方案调整</el-button>
          <el-button type="primary">批量调整</el-button>
          <el-button type="primary">任务退回</el-button>
          <el-button type="primary">方案确认</el-button>
          <el-button icon="el-icon-refresh" @click="refrech" />
        </el-col>
        <el-col :span="11" :offset="2" class="scroll-box">
          <el-input v-model="bondId" placeholder="输入资产根码后添加任务" style="width:200px" />
          <el-button type="primary">添加任务</el-button>
          <el-button type="primary" @click="batchAddTask">批量添加</el-button>
          <el-button type="primary" @click="uploadScheme">批量上传人工估值</el-button>
          <!-- <el-button type="primary" @click="downloadScheme">盯市券点差调整</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="assset">资产列表</div>
    <!-- <el-menu :default-active="activeElement" class="el-menu-demo" mode="horizontal" @select="handleSelect" active-text-color="#5E8BD8" text-color="#333">
        <el-menu-item index="normal">正常</el-menu-item>
        <el-menu-item index="obey">违约</el-menu-item>
        <el-menu-item index="especical">特殊</el-menu-item>
        <el-menu-item index="upload">人工上传</el-menu-item>
      </el-menu> -->
    <el-tabs v-model="activeElement" @tab-click="handleSelect">
      <el-tab-pane v-for="item in tabList" :key="item.scene" :label="tabName(item.scene)" :name="item.scene" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeElement === '01' || activeElement === '02' || activeElement === '03'" v-loading="tableLoading">
        <asset-list :all-list="myList" />
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
      <div v-if="activeElement === '04'" v-loading="tableLoading">
        <people-upload :all-list="uploadList" />
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
    </transition>
    <el-dialog :visible.sync="volumeAddDialog" title="批量添加任务">
      <div>
        <el-form style="margin-left:50px">
          <el-form-item label="选择批次">
            <el-select v-model="volumeAdd.batch" filterable clearable placeholder="请选择批次" @visible-change="batchChange">
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
            <el-select v-model="volumeAdd.season" filterable clearable placeholder="请选择批次" @visible-change="batchChange">
              <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="volumeAddDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveBatch">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadMethodDialog" title="人工估值上传">
      <div>
        <el-form style="margin-left:50px">
          <el-form-item label="选择批次">
            <el-select v-model="upLoadValution.batch" filterable clearable placeholder="请选择批次" @visible-change="batchChange">
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
              <el-button type="primary" @click="saveValuation">确 定</el-button>
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
  name: 'SchemeMyList',
  components: {
    // BatchTaskForm,
    AssetList,
    PeopleUpload
  },
  data() {
    return {
      activeElement: '01',
      volumeAddDialog: false,
      uploadMethodDialog: false,
      tableLoading: false,
      myList: [],
      uploadList: [],
      volumeAdd: {
        season: '其他',
        batch: '',
        excelFile: ''
      },
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
        tab: '02',
        scene: '01'
      }
    }
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.tableLoading = true
      getAllTableList(this.params).then(res => {
        this.tableLoading = false
        this.myList = res[0].datalist
        this.uploadList = res[0].manualList
        this.params.page = res[0].page
        console.log('res', res[0].datalist)
      }).catch(error => {
        console.log(error)
        this.tableLoading = false
      })
      getAllTableList({ tab: '02' }).then(res => {
        this.tabList = res
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
    refrech() {
      this.loadTable()
    },
    handleSelect(e) {
      console.log('tab', e.name)
      this.params.scene = e.name
      this.loadTable()
    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.loadTable()
    },
    nameChange() {

    },
    batchChange() {

    },
    saveValuation() {

    },
    saveBatch() {

    },
    handleExceed() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    memSuccess(item) {
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
    saveName() {

    },
    claimTask: function() {

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
 .card {
     height: 100%;
 }
</style>
